import { createWorker } from 'tesseract.js';

export interface ReceiptOCRResult {
  rawText: string;
  totalAmount: number | null;
  merchantName: string | null;
  categoryHint: string | null;
  confidence: number;
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

  // 2. Initialize Tesseract Worker
  const worker = await createWorker('ind+eng');

  try {
    // 3. Recognize with 35s safety timeout to prevent lambda freeze
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Waktu pemrosesan OCR melebihi batas (35s). Mohon crop/potong gambar struk lebih fokus.')),
        35000
      )
    );

    const { data } = await Promise.race([
      worker.recognize(imageBuffer),
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

    // Pattern A: Labeled merchant (e.g. Penerima: MOOKA KOPI GOA RIA, Merchant: Kopi Kenangan)
    const recipientMatch = rawText.match(
      /(?:penerima|merchant|kepada|bayar\s*ke|toko|outlet|nama\s*merchant|merchant\s*name)\s*[:\n\-]?\s*([^\n\r]+)/i
    );
    if (recipientMatch && recipientMatch[1]) {
      const candidate = recipientMatch[1].trim();
      if (candidate.length > 2 && !/^(rp|idr|\d+)/i.test(candidate)) {
        merchantName = candidate;
      }
    }

    // Pattern B: Physical receipt header lines (Indomaret, Alfamart, Cafes)
    if (!merchantName) {
      const ignoredPatterns = /tanggal|date|struk|nota|receipt|kasir|cashier|no\.|trx|ref|id|pembayaran|berhasil|sukses|qris|transfer|transaksi|jam|wib|wita|wit/i;
      for (let i = 0; i < Math.min(lines.length, 6); i++) {
        const line = lines[i];
        // Skip status bar noise like "8:09", "5G", "99%"
        if (/^\d{1,2}[:.]\d{2}/.test(line) || /%\s*$/.test(line)) continue;
        if (line.length >= 3 && !ignoredPatterns.test(line) && !/^(rp|idr|\d+)/i.test(line)) {
          merchantName = line;
          break;
        }
      }
    }

    // 5. Extract Total Amount
    let totalAmount: number | null = null;

    // Pattern A: Labeled total keywords (TOTAL, TAGIHAN, JUMLAH, GRAND TOTAL, TOTAL BAYAR, NOMINAL)
    const labeledRegex = /(?:total|grand\s*total|tagihan|jumlah|netto|total\s*bayar|nominal(?:\s*transaksi)?)\s*[:=]?\s*(?:rp\.?)?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/i;
    const labeledMatch = rawText.match(labeledRegex);
    if (labeledMatch && labeledMatch[1]) {
      const sanitized = labeledMatch[1].replace(/[.,](\d{2})$/, '.$1').replace(/[.,](?!\d{2}$)/g, '');
      const parsed = parseFloat(sanitized);
      if (!isNaN(parsed) && parsed > 0) {
        totalAmount = parsed;
      }
    }

    // Pattern B: Prominent "Rp..." or "IDR..." amount (typical in QRIS mobile banking screenshots)
    if (!totalAmount) {
      const rpRegex = /(?:rp\.?|idr)\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi;
      const rpMatches = [...rawText.matchAll(rpRegex)];
      for (const m of rpMatches) {
        const clean = m[1].replace(/[.,](\d{2})$/, '.$1').replace(/[.,](?!\d{2}$)/g, '');
        const val = parseFloat(clean);
        // Valid transaction range between Rp 1.000 and Rp 500.000.000
        if (!isNaN(val) && val >= 1000 && val <= 500000000) {
          totalAmount = val;
          break;
        }
      }
    }

    // Pattern C: QRIS "Pembayaran QRIS berhasil" followed closely by number
    if (!totalAmount) {
      const qrisBlock = rawText.match(
        /(?:pembayaran|transaksi)\s*(?:qris)?\s*(?:berhasil|sukses)[\s\S]{0,50}?([\d]{1,3}(?:[.,]\d{3})+)/i
      );
      if (qrisBlock && qrisBlock[1]) {
        const val = parseFloat(qrisBlock[1].replace(/[.,]/g, ''));
        if (!isNaN(val) && val >= 1000) {
          totalAmount = val;
        }
      }
    }

    // 6. Category Auto-Detection
    let categoryHint: string | null = null;
    const combinedText = `${merchantName || ''} ${rawText}`.toLowerCase();
    if (/kopi|cafe|coffee|resto|warung|makan|food|kitchen|bakso|mie|ayam|roti|cake|burger|pizza|tea|teh|kuliner/i.test(combinedText)) {
      categoryHint = 'F&B';
    } else if (/indomaret|alfamart|supermarket|minimarket|mart|hypermart|sayur|buah|sembako/i.test(combinedText)) {
      categoryHint = 'Groceries';
    } else if (/spbu|pertamina|shell|gojek|grab|maxim|parkir|toll|tol|ojek|transport/i.test(combinedText)) {
      categoryHint = 'Transport';
    } else if (/pln|listrik|pdam|air|wifi|indihome|telkom|pulsa|kuota|bpjs/i.test(combinedText)) {
      categoryHint = 'Bills';
    } else if (/apotek|kimia farma|k24|klinik|rs|rumah sakit|obat|dokter/i.test(combinedText)) {
      categoryHint = 'Health';
    } else if (/tokopedia|shopee|lazada|tiktok shop|zalora|fashion|baju/i.test(combinedText)) {
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
