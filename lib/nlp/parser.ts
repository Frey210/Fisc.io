import { TransactionType } from '@/types/database';

export interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  description: string;
  categoryHint?: string;
  confidence: number;
}

/**
 * Normalizes input text and parses financial transaction syntax naturally:
 * - Multiline entries (e.g. "Alfamart\nCoca cola zero + QTela = 25300")
 * - Amount with equations/symbols (e.g. "= 25300", ": 50000", "total 25k")
 * - Shorthand suffixes (e.g. "25k", "25rb", "25ribu", "1.5jt", "1,5jt")
 * - Shorthand prefixes (e.g. "+8jt gaji", "- 25k kopi", "> 1jt tabungan")
 * - Natural Indonesian sentences (e.g. "beli bensin 50k pake bca", "makan siang 35.000", "dapat fee 1.5jt")
 */
export function parseTransactionText(rawText: string): ParsedTransaction | null {
  if (!rawText || !rawText.trim()) return null;

  // 1. Normalize line breaks and whitespace
  let text = rawText.trim();
  if (text.includes('\n')) {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    text = lines.join(' - ');
  }

  // 2. Detect Transaction Type
  let type: TransactionType = 'EXPENSE';
  let isExplicit = false;

  // Prefix check
  if (text.startsWith('+')) {
    type = 'INCOME';
    isExplicit = true;
    text = text.slice(1).trim();
  } else if (text.startsWith('>') || text.startsWith('->') || text.startsWith('=>')) {
    type = 'TRANSFER';
    isExplicit = true;
    text = text.replace(/^(?:->|=>|>)/, '').trim();
  } else if (text.startsWith('-')) {
    type = 'EXPENSE';
    isExplicit = true;
    text = text.slice(1).trim();
  }

  // Conversational keywords check if not explicit symbol
  if (!isExplicit) {
    const lower = text.toLowerCase();
    if (
      /\b(?:gaji|salary|payroll|bonus|thr|terima|dapat|cair|pemasukan|income|dividen|profit|dikasih|angpao|fee|proyek)\b/i.test(
        lower
      )
    ) {
      type = 'INCOME';
    } else if (
      /\b(?:transfer|tf|topup|top\s*up|tabung|simpan|tarik\s*tunai|pindah|reksadana|investasi)\b/i.test(
        lower
      ) ||
      /\s+(?:ke|to)\s+/i.test(lower)
    ) {
      type = 'TRANSFER';
    }
  }

  // 3. Extract Amount from anywhere in the string
  // Supports: "25300", "25.300", "25,300", "25k", "25rb", "1.5jt", "Rp 25.000", "= 25300", ": 25000"
  const amountPattern =
    /(?:=\s*|:\s*|total\s*|habis\s*|rp\.?\s*|idr\s*)?(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)?\b/gi;

  const matches = [...text.matchAll(amountPattern)];
  let finalAmount: number | null = null;
  let matchStart = -1;
  let matchEnd = -1;

  for (const match of matches) {
    const rawNum = match[1];
    const unit = (match[2] || '').toLowerCase();

    // Skip standalone 4-digit years (e.g. 2026) without units or explicit currency indicators
    if (
      !unit &&
      /^(?:19|20)\d{2}$/.test(rawNum) &&
      !match[0].includes('rp') &&
      !match[0].includes('=')
    ) {
      continue;
    }

    const hasUnit = Boolean(unit);
    let numVal = 0;

    if (hasUnit) {
      // In "1.5jt" or "2,5k", dot or comma is a decimal
      const clean = rawNum.replace(',', '.');
      numVal = parseFloat(clean);
    } else {
      // In "25.300" or "25,000", dot/comma is a thousands separator
      const clean = rawNum.replace(/[.,]/g, '');
      numVal = parseFloat(clean);
    }

    if (isNaN(numVal) || numVal <= 0) continue;

    let multiplier = 1;
    if (unit === 'k' || unit === 'rb' || unit === 'ribu') {
      multiplier = 1000;
    } else if (unit === 'jt' || unit === 'juta') {
      multiplier = 1000000;
    }

    const computed = Math.round(numVal * multiplier);
    if (computed > 0) {
      finalAmount = computed;
      matchStart = match.index;
      matchEnd = match.index + match[0].length;
      break;
    }
  }

  if (!finalAmount || matchStart === -1) {
    return null;
  }

  // 4. Extract Description by stripping out the amount token
  const before = text.slice(0, matchStart);
  const after = text.slice(matchEnd);
  let desc = `${before} ${after}`
    .replace(/[=:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip leading/trailing symbols (- , .)
  desc = desc.replace(/^[-–—,\s]+|[-–—,\s]+$/g, '').trim();

  if (!desc) {
    desc = type === 'INCOME' ? 'Pemasukan' : type === 'TRANSFER' ? 'Transfer' : 'Pengeluaran';
  }

  return {
    type,
    amount: finalAmount,
    description: desc,
    categoryHint: inferCategory(type, desc),
    confidence: isExplicit ? 1.0 : 0.95,
  };
}

/**
 * Intelligent categorization based on merchant / keywords
 */
function inferCategory(type: TransactionType, desc: string): string {
  const d = desc.toLowerCase();

  if (type === 'INCOME') {
    if (d.includes('gaji') || d.includes('salary') || d.includes('payroll')) return 'Salary';
    if (d.includes('bonus') || d.includes('thr')) return 'Bonus';
    if (d.includes('project') || d.includes('freelance') || d.includes('klien') || d.includes('fee'))
      return 'Freelance';
    if (d.includes('dividen') || d.includes('bunga') || d.includes('invest')) return 'Investment Yield';
    return 'Other Income';
  }

  if (type === 'TRANSFER') {
    if (d.includes('darurat') || d.includes('emergency')) return 'Emergency Fund';
    if (d.includes('invest') || d.includes('saham') || d.includes('reksadana') || d.includes('bibit'))
      return 'Investments';
    if (d.includes('tabungan') || d.includes('saving')) return 'Savings';
    return 'General Transfer';
  }

  // EXPENSE Keywords
  if (/alfamart|indomaret|supermarket|minimarket|mart|hypermart|superindo|sayur|buah|sembako/i.test(d)) {
    return 'Groceries';
  }

  if (
    /kopi|coffee|cafe|kafe|esteh|makan|resto|warung|chicken|bakso|mie|ayam|roti|burger|snack|cola|minum|pizza|tea|teh/i.test(
      d
    )
  ) {
    return 'F&B';
  }

  if (
    /bensin|pertalite|pertamax|spbu|shell|gojek|grab|maxim|parkir|tol|toll|kereta|mrt|ojek|transport/i.test(
      d
    )
  ) {
    return 'Transportation';
  }

  if (
    /listrik|pln|wifi|indihome|biznet|pulsa|paket data|air|pdam|bpjs|iuran/i.test(
      d
    )
  ) {
    return 'Bills & Utilities';
  }

  if (
    /server|hosting|domain|cloud|vps|openai|github|aws|vercel/i.test(
      d
    )
  ) {
    return 'Hosting & Tech';
  }

  if (
    /shopee|tokopedia|lazada|tiktok|baju|celana|sepatu|fashion|mall|belanja/i.test(
      d
    )
  ) {
    return 'Shopping';
  }

  if (
    /apotek|obat|klinik|dokter|rs|rumah sakit|kimia farma|k24/i.test(
      d
    )
  ) {
    return 'Health';
  }

  return 'General Expense';
}
