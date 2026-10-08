'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Transaction, TransactionType } from '@/types/database';
import { Plus, X, Loader2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSaved,
  userId,
  transactionToEdit,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(transactionToEdit?.type || 'EXPENSE');
  const [amount, setAmount] = useState<string>(
    transactionToEdit ? String(transactionToEdit.amount) : ''
  );
  const [description, setDescription] = useState<string>(transactionToEdit?.description || '');
  const [date, setDate] = useState<string>(
    transactionToEdit?.date
      ? new Date(transactionToEdit.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Jumlah nominal harus lebih dari 0.');
      return;
    }

    setLoading(true);

    try {
      if (transactionToEdit) {
        // Update existing transaction
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            type,
            amount: parsedAmount,
            description: description.trim() || null,
            date: new Date(date).toISOString(),
          })
          .eq('id', transactionToEdit.id)
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Insert new transaction
        const { error: insertError } = await supabase.from('transactions').insert({
          user_id: userId,
          type,
          amount: parsedAmount,
          description: description.trim() || null,
          date: new Date(date).toISOString(),
          source: 'web_manual',
          confidence_score: 1.0,
        });

        if (insertError) throw insertError;
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan transaksi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {transactionToEdit ? 'Edit Transaksi' : 'Tambah Transaksi Manual'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Transaction Type Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                  type === 'EXPENSE'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                  type === 'INCOME'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType('TRANSFER')}
                className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                  type === 'TRANSFER'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Nominal (IDR)
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 50000"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Deskripsi / Keterangan
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang Padang, Gaji freelance"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{transactionToEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
