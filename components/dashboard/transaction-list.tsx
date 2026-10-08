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
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDeleted: () => void;
}

export function TransactionList({ transactions, onEdit, onDeleted }: TransactionListProps) {
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
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <p className="text-base font-medium">Belum ada transaksi tercatat</p>
        <p className="mt-1 text-xs text-slate-600">
          Kirim pesan ke Telegram Bot atau klik tombol <strong>+ Tambah Transaksi</strong> di atas.
        </p>
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
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Sparkles className="h-3 w-3" />
                      <span>{(tx.confidence_score * 100).toFixed(0)}%</span>
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
