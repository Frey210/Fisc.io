import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}jt`;
  }
  if (amount >= 100_000) {
    return `${Math.round(amount / 1_000)}k`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}
