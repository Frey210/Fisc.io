'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types/database';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Smartphone,
  Globe,
  Sparkles,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDeleted: () => void;
  onAddNew?: () => void;
}

export function TransactionList({ transactions, onEdit, onDeleted, onAddNew }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      onDeleted();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus transaksi.');
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/40 shadow-inner">
          <ArrowRightLeft className="h-8 w-8 text-slate-500" />
        </div>
        <h4 className="mt-4 text-sm font-bold text-white">Belum Ada Transaksi Tercatat</h4>
        <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
          Mulai catat pemasukan, pengeluaran, atau transfer untuk melihat pergerakan arus kas Anda.
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-400"
          >
            <span>+ Catat Transaksi Pertama</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80">
      {transactions.map((tx) => {
        const isIncome = tx.type === 'INCOME';
        const isTransfer = tx.type === 'TRANSFER';
        const isDeleting = deletingId === tx.id;

        return (
          <div
            key={tx.id}
            className="group flex items-center justify-between py-4 px-2 rounded-xl transition hover:bg-slate-900/40"
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
                        <Globe className="h-3 w-3 text-emerald-400" />
                        <span>Web</span>
                      </>
                    )}
                  </span>
                  {tx.confidence_score !== null && tx.confidence_score !== undefined && (
                    <span
                      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        tx.confidence_score < 0.85
                          ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {tx.confidence_score < 0.85 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 text-amber-400" />
                          <span>Perlu Ditinjau ({(tx.confidence_score * 100).toFixed(0)}%)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 text-emerald-400" />
                          <span>{(tx.confidence_score * 100).toFixed(0)}%</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
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

              {/* Action buttons (Edit & Delete) */}
              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(tx)}
                  title="Edit Transaksi"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  disabled={isDeleting}
                  title="Hapus Transaksi"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
