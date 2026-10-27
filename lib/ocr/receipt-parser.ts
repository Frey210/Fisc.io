import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Ensure Next.js file tracer includes these worker dependencies in serverless output
// @ts-ignore
import 'bmp-js';
// @ts-ignore
import 'zlibjs';
// @ts-ignore
import 'is-url';
// @ts-ignore
import 'wasm-feature-detect';

export interface ReceiptOCRResult {
  rawText: string;
  totalAmount: number | null;
  merchantName: string | null;
  categoryHint: string | null;
  confidence: number;
}

/**
 * Preprocesses receipt image to dramatically boost OCR contrast and character definition.
 * Includes EXIF auto-rotation and smart bounding to avoid Vercel Serverless OOM crashes.
 */
async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  try {
    // 1. Auto-orient based on EXIF tag so vertical smartphone photos aren't read sideways
    const pipeline = sharp(buffer).rotate();
    const meta = await pipeline.metadata();
    const origWidth = meta.width || 1000;

    // 2. Bound dimensions to prevent WASM Out-Of-Memory (OOM) on 12-48MP smartphone photos
    let targetWidth: number;
    if (origWidth > 1400) {
      targetWidth = 1400; // downscale huge photos to safe, crisp OCR width
    } else if (origWidth < 700) {
      targetWidth = 1000; // upscale small images for character clarity
    } else {
      targetWidth = origWidth;
    }

    return await pipeline
      .resize({ width: targetWidth, withoutEnlargement: false })
      .grayscale()
      .normalise() // dynamically stretch contrast without clipping darks
      .sharpen()
      .toBuffer();
  } catch (err) {
    console.warn('[OCR Preprocessing Warning]: Falling back to raw buffer', err);
    return buffer;
  }
}

/**
 * Parses numeric IDR string into float value
 */
function parseIdrAmount(raw: string): number | null {
  if (!raw) return null;
  // Clean Indonesian currency: "45.000,00" or "45.000" or "45,000" or "45000"
  let clean = raw.trim().replace(/^rp\.?\s*/i, '').replace(/,-$/, '');
  clean = clean.replace(/[.,](\d{2})$/, '.$1').replace(/[.,](?!\d{2}$)/g, '');
  const parsed = parseFloat(clean);
  if (!isNaN(parsed) && parsed >= 500 && parsed <= 500000000) {
    return parsed;
  }
  return null;
}

/**
 * Extracts total amount, merchant, category, and raw text from receipt image buffer or URL
 */
export async function parseReceiptImage(imageSource: string | Buffer): Promise<ReceiptOCRResult> {
  // 1. Fetch image buffer if URL is provided
  let imageBuffer: Buffer;
  if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
    const res = await fetch(imageSource, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      throw new Error(`Gagal mengunduh gambar struk dari Telegram (${res.status} ${res.statusText})`);
    }
    const arrayBuffer = await res.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  } else if (Buffer.isBuffer(imageSource)) {
    imageBuffer = imageSource;
  } else {
    imageBuffer = Buffer.from(imageSource as any);
  }

  // Preprocess image with Sharp
  const cleanImageBuffer = await preprocessImage(imageBuffer);

  // 2. Initialize Tesseract Worker with local tessdata & writable /tmp cache (fixes Vercel EROFS read-only error)
  const localTessData = path.join(process.cwd(), 'lib', 'ocr', 'tessdata');
  const hasLocalTessData = fs.existsSync(path.join(localTessData, 'eng.traineddata'));

  const workerOptions: Record<string, any> = {
    cachePath: os.tmpdir(), // Writable directory on serverless (AWS Lambda / Vercel)
  };

  if (hasLocalTessData) {
    workerOptions.langPath = localTessData;
    workerOptions.gzip = false;
  }

  const worker = await createWorker('ind+eng', 1, workerOptions);

  try {
    // 3. Recognize with 35s safety timeout to prevent lambda freeze
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Waktu pemrosesan OCR melebihi batas (35s). Mohon potong gambar struk lebih dekat.')),
        35000
      )
    );

    const { data } = await Promise.race([
      worker.recognize(cleanImageBuffer),
      timeoutPromise,
    ]);

    const rawText = data.text || '';
    const confidence = data.confidence ? Math.max(0.1, data.confidence / 100) : 0.8;

    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // 4. Extract Merchant Name
    let merchantName: string | null = null;

    // Pattern A: Labeled merchant (e.g. Penerima: MOOKA KOPI, Merchant: Kopi Kenangan)
    const recipientMatch = rawText.match(
      /(?:penerima|merchant|kepada|bayar\s*ke|toko|outlet|nama\s*merchant|merchant\s*name)\s*[:\n\-]?\s*([^\n\r]+)/i
    );
    if (recipientMatch && recipientMatch[1]) {
      const candidate = recipientMatch[1].trim();
      if (candidate.length > 2 && !/^(rp|idr|\d+)/i.test(candidate)) {
        merchantName = candidate;
      }
    }

    // Pattern B: Physical receipt header lines (Indomaret, Alfamart, Cafes, etc.)
    if (!merchantName) {
      const ignoredPatterns = /tanggal|date|struk|nota|receipt|kasir|cashier|no\.|trx|ref|id|pembayaran|berhasil|sukses|qris|transfer|transaksi|jam|wib|wita|wit/i;
      for (let i = 0; i < Math.min(lines.length, 6); i++) {
        const line = lines[i];
        if (/^\d{1,2}[:.]\d{2}/.test(line) || /%\s*$/.test(line)) continue;
        if (line.length >= 3 && !ignoredPatterns.test(line) && !/^(rp|idr|\d+)/i.test(line)) {
          merchantName = line;
          break;
        }
      }
    }

    // 5. Extract Total Amount
    let totalAmount: number | null = null;

    // Pattern A: Multi-line and labeled total keywords
    const labeledRegex = /(?:total(?:\s*(?:belanja|bayar|pembayaran|transaksi|item|tagihan|akhir|keseluruhan|jual))?|grand\s*total|sub\s*total|tagihan|jumlah(?:\s*(?:bayar|pembayaran))?|netto|nominal(?:\s*transaksi)?|harga\s*total|qris(?:\s*cpm)?(?:\s*[a-z]+)?|tunai|cash|debit|kartu)\s*[:=]?\s*(?:rp\.?)?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|[\d]{4,9})/gi;
    const labeledMatches = [...rawText.matchAll(labeledRegex)];

    for (const m of labeledMatches) {
      const fullMatch = m[0].toLowerCase();
      if (fullMatch.includes('item') || fullMatch.includes('disc') || fullMatch.includes('diskon')) {
        continue;
      }
      const parsed = parseIdrAmount(m[1]);
      if (parsed) {
        totalAmount = parsed;
        break;
      }
    }

    // Pattern B: Line-by-line inspection (e.g. "TOTAL" on Line X, price on Line X or Line X+1)
    if (!totalAmount) {
      const totalKeywordRegex = /\b(?:total|grand\s*total|tagihan|jumlah\s*bayar|subtotal|tunai|bayar)\b/i;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (totalKeywordRegex.test(line) && !/diskon|disc|item/i.test(line)) {
          // Check same line for number
          const sameLineNum = line.match(/(?:rp\.?)?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|[\d]{4,9})/i);
          if (sameLineNum && sameLineNum[1]) {
            const parsed = parseIdrAmount(sameLineNum[1]);
            if (parsed) {
              totalAmount = parsed;
              break;
            }
          }
          // Check next line for number
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextLineNum = nextLine.match(/^(?:rp\.?)?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|[\d]{4,9})/i);
            if (nextLineNum && nextLineNum[1]) {
              const parsed = parseIdrAmount(nextLineNum[1]);
              if (parsed) {
                totalAmount = parsed;
                break;
              }
            }
          }
        }
      }
    }

    // Pattern C: QRIS "Pembayaran QRIS berhasil" followed closely by number
    if (!totalAmount) {
      const qrisBlock = rawText.match(
        /(?:pembayaran|transaksi)\s*(?:qris)?\s*(?:berhasil|sukses)[\s\S]{0,50}?([\d]{1,3}(?:[.,]\d{3})+)/i
      );
      if (qrisBlock && qrisBlock[1]) {
        totalAmount = parseIdrAmount(qrisBlock[1]);
      }
    }

    // Pattern D: Fallback to largest detected currency amount in the bottom 60% of the receipt
    if (!totalAmount) {
      const allAmounts: number[] = [];
      const startIdx = Math.floor(lines.length * 0.35); // Focus on lower section where total resides
      for (let i = startIdx; i < lines.length; i++) {
        const matches = lines[i].matchAll(/(?:rp\.?|idr)?\s*([\d]{1,3}(?:[.,]\d{3})+(?:[.,]\d{2})?)/gi);
        for (const m of matches) {
          const parsed = parseIdrAmount(m[1]);
          if (parsed && parsed >= 1000) {
            allAmounts.push(parsed);
          }
        }
      }
      if (allAmounts.length > 0) {
        totalAmount = Math.max(...allAmounts);
      }
    }

    // 6. Category Auto-Detection
    let categoryHint: string | null = null;
    const combinedText = `${merchantName || ''} ${rawText}`.toLowerCase();
    if (/kopi|cafe|coffee|resto|warung|makan|food|kitchen|bakso|mie|ayam|roti|cake|burger|pizza|tea|teh|kuliner|starbucks|mcdonald|kfc|hokben|gacoan|chatime|fore/i.test(combinedText)) {
      categoryHint = 'F&B';
    } else if (/alfamidi|alfamart|indomaret|supermarket|minimarket|mart|hypermart|sayur|buah|sembako/i.test(combinedText)) {
      categoryHint = 'Groceries';
    } else if (/spbu|pertamina|shell|bp|gojek|grab|maxim|parkir|toll|tol|ojek|transport/i.test(combinedText)) {
      categoryHint = 'Transport';
    } else if (/pln|listrik|pdam|air|wifi|indihome|telkom|pulsa|kuota|bpjs/i.test(combinedText)) {
      categoryHint = 'Bills';
    } else if (/apotek|kimia farma|k24|klinik|rs|rumah sakit|obat|dokter/i.test(combinedText)) {
      categoryHint = 'Health';
    } else if (/tokopedia|shopee|lazada|tiktok shop|zalora|fashion|baju|distro/i.test(combinedText)) {
      categoryHint = 'Shopping';
    }

    return {
      rawText,
      totalAmount,
      merchantName: merchantName ? merchantName.slice(0, 50) : 'Struk Belanja',
      categoryHint,
      confidence,
    };
  } finally {
    try {
      await worker.terminate();
    } catch {
      // Ignore worker termination errors
    }
  }
}
