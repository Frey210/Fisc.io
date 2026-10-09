import { NextResponse, after } from 'next/server';
import { parseTransactionText } from '@/lib/nlp/parser';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramMessage, getTelegramFileUrl } from '@/lib/telegram/client';
import { TelegramWebhookUpdate } from '@/types/database';

// Allow serverless function to run up to 60s for background OCR tasks
export const maxDuration = 60;

// In-memory cache for recent update_ids to prevent Telegram retry spam
const processedUpdates = new Set<number>();
const MAX_PROCESSED_UPDATES = 500;

export async function POST(request: Request) {
  // 1. Verify Telegram secret token header if configured
  const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (configuredSecret && secretHeader !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
  }

  let update: TelegramWebhookUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Deduplicate updates if Telegram resends the same payload
  if (update.update_id) {
    if (processedUpdates.has(update.update_id)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    processedUpdates.add(update.update_id);
    if (processedUpdates.size > MAX_PROCESSED_UPDATES) {
      const oldest = processedUpdates.values().next().value;
      if (oldest !== undefined) processedUpdates.delete(oldest);
    }
  }

  const message = update.message;
  if (!message || !message.chat) {
    // Return 200 OK so Telegram stops resending non-message updates
    return NextResponse.json({ ok: true, ignored: true });
  }

  const chatId = message.chat.id;
  const rawText = message.text?.trim() || message.caption?.trim() || '';

  try {
    const supabaseAdmin = createAdminClient();

    // 2. Handle /start or linking command
    // Syntax: /start or /link <user_uuid>
    if (rawText.startsWith('/start') || rawText.startsWith('/link')) {
      const parts = rawText.split(/\s+/);
      const linkingCode = parts[1];

      if (!linkingCode) {
        // Check if already linked
        const { data: existingLink } = await supabaseAdmin
          .from('telegram_links')
          .select('user_id')
          .eq('telegram_chat_id', chatId)
          .single();

        if (existingLink) {
          await sendTelegramMessage(
            chatId,
            `✅ Akun Fisc.io sudah terhubung!\n\nFormat input cepat:\n• <code>50000 makan</code> (Pengeluaran)\n• <code>+8000000 gaji</code> (Pemasukan)\n• <code>> 1000000 tabungan</code> (Transfer/Simpan)`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `👋 Selamat datang di <b>Fisc.io Bot</b>!\n\nAkun Anda belum terhubung. Buka web dashboard Fisc.io Anda di bagian Settings untuk mendapatkan kode link, lalu kirim perintah:\n<code>/link [USER_ID]</code>`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Link user ID with telegram chat ID
      const { error: linkErr } = await supabaseAdmin
        .from('telegram_links')
        .upsert(
          {
            user_id: linkingCode,
            telegram_chat_id: chatId,
            linked_at: new Date().toISOString(),
          },
          { onConflict: 'telegram_chat_id' }
        );

      if (linkErr) {
        await sendTelegramMessage(
          chatId,
          `❌ Gagal menghubungkan akun: pastikan User ID valid (${linkErr.message}).`
        );
      } else {
        await sendTelegramMessage(
          chatId,
          `🎉 Berhasil terhubung dengan Fisc.io!\n\nSekarang Anda dapat mencatat pengeluaran kapan saja:\n• <code>25k es kopi susu</code>\n• <code>+5jt project fee</code>\n• <code>> 500k reksadana</code>`
        );
      }
      return NextResponse.json({ ok: true });
    }

    // 3. Verify user link
    const { data: userLink, error: userLinkErr } = await supabaseAdmin
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_chat_id', chatId)
      .single();

    if (userLinkErr || !userLink) {
      await sendTelegramMessage(
        chatId,
        `⚠️ Telegram Anda belum terhubung ke akun Fisc.io.\nKetik <code>/link [USER_ID]</code> dengan ID profil akun Anda.`
      );
      return NextResponse.json({ ok: true });
    }

    const userId = userLink.user_id;

    // 4. Handle Photo (Receipt OCR) Ingestion
    if (message.photo && message.photo.length > 0) {
      // Pick optimal resolution: around 700-1280px wide for rapid, accurate OCR
      const optimalPhoto =
        message.photo.find((p) => p.width >= 700 && p.width <= 1280) ||
        (message.photo.length >= 2
          ? message.photo[message.photo.length - (message.photo.length > 3 ? 2 : 1)]
          : message.photo[message.photo.length - 1]);

      // Step A: Immediately send status notification to Telegram user
      await sendTelegramMessage(chatId, `🔍 <i>Memproses struk belanja dengan OCR...</i>`);

      // Step B: Dispatch heavy OCR processing asynchronously via Next.js after()
      // This immediately frees the HTTP response, returning 200 OK to Telegram in milliseconds.
      // Telegram acknowledges the webhook instantly and will NEVER retry or cause infinite loops!
      after(async () => {
        try {
          const fileUrl = await getTelegramFileUrl(optimalPhoto.file_id);
          const { parseReceiptImage } = await import('@/lib/ocr/receipt-parser');
          const ocrResult = await parseReceiptImage(fileUrl);

          if (!ocrResult.totalAmount) {
            await sendTelegramMessage(
              chatId,
              `⚠️ Tidak dapat membaca nominal total dari struk secara jelas.\nSilakan masukkan secara manual melalui teks (contoh: <code>45000 struk indomaret</code>).`
            );
            return;
          }

          const merchant = ocrResult.merchantName || 'Struk Belanja';

          // Auto-match or create Category if categoryHint found
          let categoryId: string | null = null;
          if (ocrResult.categoryHint) {
            const { data: existingCat } = await supabaseAdmin
              .from('categories')
              .select('id')
              .eq('user_id', userId)
              .eq('name', ocrResult.categoryHint)
              .maybeSingle();

            if (existingCat) {
              categoryId = existingCat.id;
            } else {
              const { data: newCat } = await supabaseAdmin
                .from('categories')
                .insert({
                  user_id: userId,
                  name: ocrResult.categoryHint,
                  type: 'EXPENSE',
                })
                .select('id')
                .single();

              if (newCat) categoryId = newCat.id;
            }
          }

          // Insert Transaction from OCR
          const { error: insertErr } = await supabaseAdmin.from('transactions').insert({
            user_id: userId,
            type: 'EXPENSE',
            amount: ocrResult.totalAmount,
            description: merchant,
            category_id: categoryId,
            source: 'telegram_ocr',
            confidence_score: ocrResult.confidence,
            date: new Date().toISOString(),
          });

          if (insertErr) {
            await sendTelegramMessage(chatId, `❌ Gagal menyimpan transaksi OCR: ${insertErr.message}`);
            return;
          }

          const formattedAmount = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(ocrResult.totalAmount);

          const categoryTag = ocrResult.categoryHint ? `\n🏷️ <b>Kategori:</b> ${ocrResult.categoryHint}` : '';

          await sendTelegramMessage(
            chatId,
            `🧾 <b>Struk Berhasil Diproses!</b>\n\n🔴 <b>PENGELUARAN</b>\n💰 <b>Total:</b> ${formattedAmount}\n🏪 <b>Merchant:</b> ${merchant}${categoryTag}\n🎯 <b>Confidence:</b> ${(ocrResult.confidence * 100).toFixed(0)}%`
          );
        } catch (ocrErr: unknown) {
          console.error('[OCR Error]:', ocrErr);
          const errStr = ocrErr instanceof Error ? ocrErr.message : 'Gagal memproses gambar';
          await sendTelegramMessage(chatId, `❌ OCR Gagal: ${errStr}`);
        }
      });

      // Step C: Acknowledge Telegram webhook IMMEDIATELY
      return NextResponse.json({ ok: true, queued: true });
    }

    // 5. Handle Text Ingestion
    if (rawText) {
      const parsed = parseTransactionText(rawText);

      if (!parsed) {
        await sendTelegramMessage(
          chatId,
          `❓ Format tidak dikenali.\n\nContoh yang didukung:\n• <code>45000 nasi padang</code>\n• <code>kopi 25k</code>\n• <code>+10jt gaji</code>\n• <code>> 2jt tabungan</code>`
        );
        return NextResponse.json({ ok: true });
      }

      // 4a. Find or create matching Category
      let categoryId: string | null = null;
      if (parsed.categoryHint) {
        const { data: existingCat } = await supabaseAdmin
          .from('categories')
          .select('id')
          .eq('user_id', userId)
          .eq('name', parsed.categoryHint)
          .maybeSingle();

        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          const { data: newCat } = await supabaseAdmin
            .from('categories')
            .insert({
              user_id: userId,
              name: parsed.categoryHint,
              type: parsed.type,
            })
            .select('id')
            .single();

          if (newCat) categoryId = newCat.id;
        }
      }

      // 4b. Match user account(s) if mentioned in description (e.g. 'bca ke gopay', 'bca', 'cash')
      const { data: userAccounts } = await supabaseAdmin
        .from('accounts')
        .select('id, name, balance')
        .eq('user_id', userId);

      let sourceAccount: { id: string; name: string; balance: number } | null = null;
      let targetAccount: { id: string; name: string; balance: number } | null = null;

      if (userAccounts && userAccounts.length > 0) {
        const descLower = parsed.description.toLowerCase();

        if (parsed.type === 'TRANSFER' && (descLower.includes(' ke ') || descLower.includes(' to '))) {
          // Syntax e.g. "bca ke gopay" or "bank ke cash"
          const splitParts = descLower.split(/\s+(?:ke|to)\s+/i);
          if (splitParts.length === 2) {
            sourceAccount =
              userAccounts.find((acc) => splitParts[0].includes(acc.name.toLowerCase())) || null;
            targetAccount =
              userAccounts.find((acc) => splitParts[1].includes(acc.name.toLowerCase())) || null;
          }
        }

        // Fallback single account match
        if (!sourceAccount) {
          sourceAccount =
            userAccounts.find((acc) => descLower.includes(acc.name.toLowerCase())) || null;
        }
      }

      // 4c. Insert Transaction
      const { error: insertErr } = await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: parsed.type,
        amount: parsed.amount,
        description: parsed.description,
        category_id: categoryId,
        account_id: sourceAccount ? sourceAccount.id : null,
        to_account_id: targetAccount ? targetAccount.id : null,
        source: 'telegram_text',
        confidence_score: parsed.confidence,
        date: new Date().toISOString(),
      });

      if (insertErr) {
        await sendTelegramMessage(chatId, `❌ Gagal menyimpan transaksi: ${insertErr.message}`);
        return NextResponse.json({ ok: true });
      }

      // 4d. Update Account Balances
      if (parsed.type === 'TRANSFER') {
        if (sourceAccount) {
          await supabaseAdmin
            .from('accounts')
            .update({ balance: Number(sourceAccount.balance) - parsed.amount })
            .eq('id', sourceAccount.id);
        }
        if (targetAccount) {
          await supabaseAdmin
            .from('accounts')
            .update({ balance: Number(targetAccount.balance) + parsed.amount })
            .eq('id', targetAccount.id);
        }
      } else if (sourceAccount) {
        const delta = parsed.type === 'INCOME' ? parsed.amount : -parsed.amount;
        await supabaseAdmin
          .from('accounts')
          .update({ balance: Number(sourceAccount.balance) + delta })
          .eq('id', sourceAccount.id);
      }

      const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(parsed.amount);

      const typeBadge =
        parsed.type === 'INCOME'
          ? '🟢 <b>PEMASUKAN</b>'
          : parsed.type === 'TRANSFER'
          ? '🔵 <b>TRANSFER/TABUNGAN</b>'
          : '🔴 <b>PENGELUARAN</b>';

      const accountBadge =
        parsed.type === 'TRANSFER' && sourceAccount && targetAccount
          ? `\n💳 <b>Rute:</b> ${sourceAccount.name} ➔ ${targetAccount.name}`
          : sourceAccount
          ? `\n💳 <b>Akun:</b> ${sourceAccount.name}`
          : '';

      await sendTelegramMessage(
        chatId,
        `✅ Transaksi Tercatat!\n\n${typeBadge}\n💰 <b>Jumlah:</b> ${formattedAmount}\n📝 <b>Keterangan:</b> ${parsed.description}\n🏷️ <b>Kategori:</b> ${parsed.categoryHint || '-'}${accountBadge}`
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    console.error('[Telegram Webhook Error]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Fisc.io Telegram Webhook Endpoint',
    timestamp: new Date().toISOString(),
  });
}
