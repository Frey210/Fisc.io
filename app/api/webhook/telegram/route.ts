import { NextResponse } from 'next/server';
import { parseTransactionText } from '@/lib/nlp/parser';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramMessage, getTelegramFileUrl } from '@/lib/telegram/client';
import { TelegramWebhookUpdate } from '@/types/database';

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
      // Telegram sends multiple sizes, last one is the highest resolution
      const highestResPhoto = message.photo[message.photo.length - 1];
      
      await sendTelegramMessage(chatId, `🔍 <i>Memproses struk belanja dengan OCR...</i>`);

      try {
        const fileUrl = await getTelegramFileUrl(highestResPhoto.file_id);
        const { parseReceiptImage } = await import('@/lib/ocr/receipt-parser');
        const ocrResult = await parseReceiptImage(fileUrl);

        if (!ocrResult.totalAmount) {
          await sendTelegramMessage(
            chatId,
            `⚠️ Tidak dapat membaca nominal total dari struk secara jelas.\nSilakan masukkan secara manual melalui teks (contoh: <code>45000 struk indomaret</code>).`
          );
          return NextResponse.json({ ok: true });
        }

        const merchant = ocrResult.merchantName || 'Struk Belanja';

        // Insert Transaction from OCR
        const { error: insertErr } = await supabaseAdmin.from('transactions').insert({
          user_id: userId,
          type: 'EXPENSE',
          amount: ocrResult.totalAmount,
          description: merchant,
          source: 'telegram_ocr',
          confidence_score: ocrResult.confidence,
          date: new Date().toISOString(),
        });

        if (insertErr) {
          await sendTelegramMessage(chatId, `❌ Gagal menyimpan transaksi OCR: ${insertErr.message}`);
          return NextResponse.json({ ok: true });
        }

        const formattedAmount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(ocrResult.totalAmount);

        await sendTelegramMessage(
          chatId,
          `🧾 <b>Struk Berhasil Diproses!</b>\n\n🔴 <b>PENGELUARAN</b>\n💰 <b>Total:</b> ${formattedAmount}\n🏪 <b>Merchant:</b> ${merchant}\n🎯 <b>Confidence:</b> ${(ocrResult.confidence * 100).toFixed(0)}%`
        );

        return NextResponse.json({ ok: true });
      } catch (ocrErr: unknown) {
        const errStr = ocrErr instanceof Error ? ocrErr.message : 'Gagal memproses gambar';
        await sendTelegramMessage(chatId, `❌ OCR Gagal: ${errStr}`);
        return NextResponse.json({ ok: true });
      }
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

      // 4b. Match user account if mentioned in description (e.g. 'bca', 'gopay', 'jago')
      const { data: userAccounts } = await supabaseAdmin
        .from('accounts')
        .select('id, name, balance')
        .eq('user_id', userId);

      let matchedAccount: { id: string; name: string; balance: number } | null = null;
      if (userAccounts && userAccounts.length > 0) {
        const descLower = parsed.description.toLowerCase();
        matchedAccount =
          userAccounts.find((acc) => descLower.includes(acc.name.toLowerCase())) || null;
      }

      // 4c. Insert Transaction
      const { error: insertErr } = await supabaseAdmin.from('transactions').insert({
        user_id: userId,
        type: parsed.type,
        amount: parsed.amount,
        description: parsed.description,
        category_id: categoryId,
        account_id: matchedAccount ? matchedAccount.id : null,
        source: 'telegram_text',
        confidence_score: parsed.confidence,
        date: new Date().toISOString(),
      });

      if (insertErr) {
        await sendTelegramMessage(chatId, `❌ Gagal menyimpan transaksi: ${insertErr.message}`);
        return NextResponse.json({ ok: true });
      }

      // 4d. Update Account Balance if matched
      if (matchedAccount) {
        const delta = parsed.type === 'INCOME' ? parsed.amount : -parsed.amount;
        await supabaseAdmin
          .from('accounts')
          .update({ balance: Number(matchedAccount.balance) + delta })
          .eq('id', matchedAccount.id);
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

      const accountBadge = matchedAccount ? `\n💳 <b>Akun:</b> ${matchedAccount.name}` : '';

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
