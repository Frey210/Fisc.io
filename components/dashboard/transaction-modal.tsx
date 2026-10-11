import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Transaction, TransactionType, Account } from '@/types/database';
import { Plus, X, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  accounts: Account[];
  transactionToEdit?: Transaction | null;
}

function toLocalDatetimeInput(dateInput?: string | Date | null): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSaved,
  userId,
  accounts,
  transactionToEdit,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [accountId, setAccountId] = useState<string>('');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(() => toLocalDatetimeInput());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form state whenever modal opens or transactionToEdit changes
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type || 'EXPENSE');
      setAccountId(transactionToEdit.account_id || '');
      setToAccountId(transactionToEdit.to_account_id || '');
      setAmount(transactionToEdit.amount ? String(transactionToEdit.amount) : '');
      setDescription(transactionToEdit.description || '');
      setDate(toLocalDatetimeInput(transactionToEdit.date));
    } else {
      setType('EXPENSE');
      setAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      setDate(toLocalDatetimeInput());
    }
    setError(null);
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const isLowConfidenceOCR =
    transactionToEdit?.confidence_score !== null &&
    transactionToEdit?.confidence_score !== undefined &&
    transactionToEdit.confidence_score < 0.85;

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
      const resolvedDate = date ? new Date(date).toISOString() : new Date().toISOString();

      if (transactionToEdit) {
        // Update existing transaction & mark verified (confidence 1.0)
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            type,
            amount: parsedAmount,
            description: description.trim() || null,
            account_id: accountId || null,
            to_account_id: type === 'TRANSFER' ? toAccountId || null : null,
            date: resolvedDate,
            confidence_score: 1.0,
          })
          .eq('id', transactionToEdit.id)
          .eq('user_id', userId);

        if (updateError) throw updateError;

        // Balance adjustment for updated transaction:
        // 1. Revert old balance if transaction previously had an account
        if (transactionToEdit.account_id) {
          const oldAcc = accounts.find((a) => a.id === transactionToEdit.account_id);
          if (oldAcc) {
            const revertDelta =
              transactionToEdit.type === 'INCOME'
                ? -Number(transactionToEdit.amount)
                : Number(transactionToEdit.amount);
            await supabase
              .from('accounts')
              .update({ balance: Number(oldAcc.balance) + revertDelta })
              .eq('id', oldAcc.id);
          }
        }

        // 2. Apply new balance to selected account
        if (accountId) {
          const newAcc = accounts.find((a) => a.id === accountId);
          if (newAcc) {
            const applyDelta = type === 'INCOME' ? parsedAmount : -parsedAmount;
            await supabase
              .from('accounts')
              .update({ balance: Number(newAcc.balance) + applyDelta })
              .eq('id', accountId);
          }
        }
      } else {
        // Insert new manual transaction
        const { error: insertError } = await supabase.from('transactions').insert({
          user_id: userId,
          type,
          amount: parsedAmount,
          description: description.trim() || null,
          account_id: accountId || null,
          to_account_id: type === 'TRANSFER' ? toAccountId || null : null,
          date: resolvedDate,
          source: 'web_manual',
          confidence_score: 1.0,
        });

        if (insertError) throw insertError;

        // Apply balance to account if chosen
        if (accountId) {
          const selectedAcc = accounts.find((a) => a.id === accountId);
          if (selectedAcc) {
            const delta = type === 'INCOME' ? parsedAmount : -parsedAmount;
            await supabase
              .from('accounts')
              .update({ balance: Number(selectedAcc.balance) + delta })
              .eq('id', accountId);
          }
        }

        if (type === 'TRANSFER' && toAccountId) {
          const destAcc = accounts.find((a) => a.id === toAccountId);
          if (destAcc) {
            await supabase
              .from('accounts')
              .update({ balance: Number(destAcc.balance) + parsedAmount })
              .eq('id', toAccountId);
          }
        }
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {isLowConfidenceOCR
              ? 'Tinjau Hasil Scan Struk'
              : transactionToEdit
              ? 'Edit Transaksi'
              : 'Tambah Transaksi Manual'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* OCR Review Warning Banner */}
        {isLowConfidenceOCR && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold">
                Konfirmasi Pembacaan OCR ({(transactionToEdit.confidence_score! * 100).toFixed(0)}%)
              </p>
              <p className="mt-0.5 text-slate-400 leading-relaxed text-[11px]">
                Data telah otomatis terisi dari struk. Silakan periksa kembali nominal dan pilih rekening untuk memotong saldo Anda.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
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

          {/* Account Source */}
          {accounts.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  {type === 'TRANSFER' ? 'Dari Akun' : 'Akun / Rekening'}
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Pilih Akun (Opsional) --</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              {type === 'TRANSFER' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Ke Akun
                  </label>
                  <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Akun Tujuan --</option>
                    {accounts
                      .filter((acc) => acc.id !== accountId)
                      .map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({acc.type})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}

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

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
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
                <span>
                  {isLowConfidenceOCR
                    ? 'Verifikasi & Simpan'
                    : transactionToEdit
                    ? 'Simpan Perubahan'
                    : 'Tambah Transaksi'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
