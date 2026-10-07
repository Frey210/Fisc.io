import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types/database';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Smartphone, Globe, Sparkles } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <p className="text-base font-medium">Belum ada transaksi tercatat</p>
        <p className="mt-1 text-xs text-slate-600">
          Kirim pesan ke Telegram Bot Anda (contoh: <code>50000 makan</code>) untuk mencatat.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80">
      {transactions.map((tx) => {
        const isIncome = tx.type === 'INCOME';
        const isTransfer = tx.type === 'TRANSFER';

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between py-4 transition hover:bg-slate-900/30"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  isIncome
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : isTransfer
                    ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                }`}
              >
                {isIncome ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : isTransfer ? (
                  <ArrowRightLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{tx.description || 'Tanpa Keterangan'}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatDate(tx.date)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {tx.source.startsWith('telegram') ? (
                      <>
                        <Smartphone className="h-3 w-3 text-sky-400" />
                        <span>Telegram</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span>Web</span>
                      </>
                    )}
                  </span>
                  {tx.confidence_score !== null && tx.confidence_score !== undefined && (
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Sparkles className="h-3 w-3" />
                      <span>{(tx.confidence_score * 100).toFixed(0)}%</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  isIncome
                    ? 'text-emerald-400'
                    : isTransfer
                    ? 'text-cyan-400'
                    : 'text-rose-400'
                }`}
              >
                {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}
                {formatCurrency(Number(tx.amount))}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
