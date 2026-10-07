import { TransactionType } from '@/types/database';

export interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  description: string;
  categoryHint?: string;
  confidence: number;
}

/**
 * Normalizes input text and parses financial transaction syntax:
 * - Income: starts with '+' (e.g., "+8000000 gaji bulan ini")
 * - Transfer: starts with '>' (e.g., "> 1000000 dana darurat")
 * - Expense: default numeric or plain text (e.g., "50000 makan di Golqi Chicken", "kopi 25k")
 */
export function parseTransactionText(rawText: string): ParsedTransaction | null {
  const text = rawText.trim();
  if (!text) return null;

  // 1. Check for explicit Income prefix '+'
  if (text.startsWith('+')) {
    const content = text.slice(1).trim();
    const parsed = extractAmountAndDescription(content);
    if (parsed) {
      return {
        type: 'INCOME',
        amount: parsed.amount,
        description: parsed.description,
        categoryHint: inferCategory('INCOME', parsed.description),
        confidence: 1.0,
      };
    }
  }

  // 2. Check for explicit Transfer/Savings prefix '>'
  if (text.startsWith('>')) {
    const content = text.slice(1).trim();
    const parsed = extractAmountAndDescription(content);
    if (parsed) {
      return {
        type: 'TRANSFER',
        amount: parsed.amount,
        description: parsed.description,
        categoryHint: inferCategory('TRANSFER', parsed.description),
        confidence: 1.0,
      };
    }
  }

  // 3. Default: EXPENSE
  const parsed = extractAmountAndDescription(text);
  if (parsed) {
    return {
      type: 'EXPENSE',
      amount: parsed.amount,
      description: parsed.description,
      categoryHint: inferCategory('EXPENSE', parsed.description),
      confidence: 0.95,
    };
  }

  return null;
}

/**
 * Extracts numeric amount and remaining description string.
 * Supports shorthand like: '50k', '1.5jt', '15000', '15.000', '15,000'
 */
function extractAmountAndDescription(text: string): { amount: number; description: string } | null {
  // Pattern 1: Amount at the beginning: e.g. "50000 makan nasi", "50k kopi", "1.5jt sewa"
  const startPattern = /^(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)?\b\s*(.*)$/i;
  const startMatch = text.match(startPattern);

  if (startMatch) {
    const rawVal = parseFloat(startMatch[1].replace(',', '.'));
    const unit = (startMatch[2] || '').toLowerCase();
    const desc = startMatch[3]?.trim() || '';

    let multiplier = 1;
    if (unit === 'k' || unit === 'rb' || unit === 'ribu') {
      multiplier = 1000;
    } else if (unit === 'jt' || unit === 'juta') {
      multiplier = 1000000;
    }

    const finalAmount = Math.round(rawVal * multiplier);
    if (!isNaN(finalAmount) && finalAmount > 0) {
      return {
        amount: finalAmount,
        description: desc || 'Tanpa keterangan',
      };
    }
  }

  // Pattern 2: Description first, amount at the end: e.g. "makan nasi 50000", "kopi 25k"
  const endPattern = /^(.*?)\s+(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)?$/i;
  const endMatch = text.match(endPattern);

  if (endMatch) {
    const desc = endMatch[1]?.trim() || '';
    const rawVal = parseFloat(endMatch[2].replace(',', '.'));
    const unit = (endMatch[3] || '').toLowerCase();

    let multiplier = 1;
    if (unit === 'k' || unit === 'rb' || unit === 'ribu') {
      multiplier = 1000;
    } else if (unit === 'jt' || unit === 'juta') {
      multiplier = 1000000;
    }

    const finalAmount = Math.round(rawVal * multiplier);
    if (!isNaN(finalAmount) && finalAmount > 0 && desc.length > 0) {
      return {
        amount: finalAmount,
        description: desc,
      };
    }
  }

  return null;
}

/**
 * Intelligent categorization based on merchant / keywords
 */
function inferCategory(type: TransactionType, desc: string): string {
  const d = desc.toLowerCase();

  if (type === 'INCOME') {
    if (d.includes('gaji') || d.includes('salary') || d.includes('payroll')) return 'Salary';
    if (d.includes('bonus') || d.includes('thr')) return 'Bonus';
    if (d.includes('project') || d.includes('freelance') || d.includes('klien')) return 'Freelance';
    if (d.includes('dividen') || d.includes('bunga') || d.includes('invest')) return 'Investment Yield';
    return 'Other Income';
  }

  if (type === 'TRANSFER') {
    if (d.includes('darurat') || d.includes('emergency')) return 'Emergency Fund';
    if (d.includes('invest') || d.includes('saham') || d.includes('reksadana') || d.includes('bibit')) return 'Investments';
    if (d.includes('tabungan') || d.includes('saving')) return 'Savings';
    return 'General Transfer';
  }

  // EXPENSE Keywords
  if (
    d.includes('makan') ||
    d.includes('kopi') ||
    d.includes('coffee') ||
    d.includes('cafe') ||
    d.includes('esteh') ||
    d.includes('padu rasa') ||
    d.includes('resto') ||
    d.includes('warung') ||
    d.includes('chicken') ||
    d.includes('bakso') ||
    d.includes('mie')
  ) {
    return 'F&B';
  }

  if (
    d.includes('bensin') ||
    d.includes('pertalite') ||
    d.includes('pertamax') ||
    d.includes('gojek') ||
    d.includes('grab') ||
    d.includes('parkir') ||
    d.includes('tol') ||
    d.includes('kereta') ||
    d.includes('mrt')
  ) {
    return 'Transportation';
  }

  if (
    d.includes('listrik') ||
    d.includes('pln') ||
    d.includes('wifi') ||
    d.includes('indihome') ||
    d.includes('biznet') ||
    d.includes('pulsa') ||
    d.includes('paket data') ||
    d.includes('air') ||
    d.includes('iuran')
  ) {
    return 'Bills & Utilities';
  }

  if (
    d.includes('server') ||
    d.includes('hosting') ||
    d.includes('domain') ||
    d.includes('cloud') ||
    d.includes('vps') ||
    d.includes('openai') ||
    d.includes('github')
  ) {
    return 'Hosting & Tech';
  }

  if (
    d.includes('shopee') ||
    d.includes('tokopedia') ||
    d.includes('lazada') ||
    d.includes('baju') ||
    d.includes('belanja')
  ) {
    return 'Shopping';
  }

  return 'General Expense';
}
