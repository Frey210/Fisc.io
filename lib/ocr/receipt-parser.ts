import { createWorker } from 'tesseract.js';

export interface ReceiptOCRResult {
  rawText: string;
  totalAmount: number | null;
  merchantName: string | null;
  confidence: number;
}

/**
 * Extracts total amount, merchant, and raw text from receipt image buffer or URL
 */
export async function parseReceiptImage(imageSource: string | Buffer): Promise<ReceiptOCRResult> {
  const worker = await createWorker('ind+eng');

  try {
    const { data } = await worker.recognize(imageSource);
    const rawText = data.text;
    const confidence = data.confidence ? data.confidence / 100 : 0.8;

    // 1. Extract merchant name (usually first non-empty lines)
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 2);

    let merchantName: string | null = null;
    if (lines.length > 0) {
      // Pick first prominent line that doesn't look like date/receipt header
      merchantName = lines.slice(0, 3).find(
        (line) => !/tanggal|date|struk|nota|receipt|kasir|cashier|no\.|trx/i.test(line)
      ) || lines[0];
    }

    // 2. Extract total amount
    // Typical Indonesian receipts have keywords: TOTAL, TAGIHAN, JUMLAH, GRAND TOTAL, CASH, BAYAR
    let totalAmount: number | null = null;

    const totalRegex = /(?:total|grand\s*total|tagihan|jumlah|netto|bayar)\s*[:=]?\s*(?:rp\.?)?\s*([\d.,]+)/i;
    const match = rawText.match(totalRegex);

    if (match && match[1]) {
      const sanitized = match[1].replace(/[.,]/g, '');
      const parsed = parseFloat(sanitized);
      if (!isNaN(parsed) && parsed > 0) {
        totalAmount = parsed;
      }
    }

    // Fallback: look for largest monetary amount in text
    if (!totalAmount) {
      const allNumbers = rawText.match(/(?:rp\.?\s*)?([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi);
      if (allNumbers) {
        let maxVal = 0;
        for (const numStr of allNumbers) {
          const clean = numStr.replace(/[^\d]/g, '');
          const val = parseFloat(clean);
          if (!isNaN(val) && val > 1000 && val < 50000000 && val > maxVal) {
            maxVal = val;
          }
        }
        if (maxVal > 0) totalAmount = maxVal;
      }
    }

    return {
      rawText,
      totalAmount,
      merchantName: merchantName ? merchantName.slice(0, 40) : null,
      confidence,
    };
  } finally {
    await worker.terminate();
  }
}
