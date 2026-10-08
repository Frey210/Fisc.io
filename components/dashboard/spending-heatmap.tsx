'use client';

import { Transaction } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface SpendingHeatmapProps {
  transactions: Transaction[];
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function SpendingHeatmap({ transactions }: SpendingHeatmapProps) {
  // Aggregate expenses by day of the week (0 = Sunday, 6 = Saturday)
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((tx) => {
    if (tx.type === 'EXPENSE') {
      const d = new Date(tx.date).getDay();
      dayTotals[d] += Number(tx.amount);
      dayCounts[d] += 1;
    }
  });

  const maxTotal = Math.max(...dayTotals, 1);

  const getIntensityClass = (amount: number) => {
    if (amount === 0) return 'bg-slate-900 border-slate-800 text-slate-500';
    const ratio = amount / maxTotal;
    if (ratio < 0.25) return 'bg-rose-950/40 border-rose-900/30 text-rose-300';
    if (ratio < 0.5) return 'bg-rose-900/50 border-rose-800/40 text-rose-200';
    if (ratio < 0.75) return 'bg-rose-800/70 border-rose-700/50 text-rose-100 font-semibold';
    return 'bg-rose-600/80 border-rose-500/70 text-white font-bold shadow-lg shadow-rose-600/20';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Spending Intensity Heatmap</h2>
            <p className="text-xs text-slate-400">Pola intensitas pengeluaran berdasarkan hari</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {DAYS.map((dayName, idx) => {
          const total = dayTotals[idx];
          const count = dayCounts[idx];
          return (
            <div
              key={dayName}
              className={`flex flex-col items-center justify-between rounded-xl border p-3 text-center transition hover:scale-105 ${getIntensityClass(
                total
              )}`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {dayName}
              </span>
              <div className="my-2 text-xs">
                {total > 0 ? formatCurrency(total) : '-'}
              </div>
              <span className="text-[10px] text-slate-500">
                {count > 0 ? `${count} trx` : '0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
