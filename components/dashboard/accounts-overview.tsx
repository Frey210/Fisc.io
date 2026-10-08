'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Account, AccountType } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import {
  Landmark,
  Smartphone,
  TrendingUp,
  Banknote,
  Plus,
  Trash2,
  X,
  Loader2,
  WalletCards,
} from 'lucide-react';

interface AccountsOverviewProps {
  accounts: Account[];
  userId: string;
  onAccountsUpdated: () => void;
}

export function AccountsOverview({ accounts, userId, onAccountsUpdated }: AccountsOverviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANK');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalBalance = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

  const getIcon = (accType: AccountType) => {
    switch (accType) {
      case 'BANK':
        return <Landmark className="h-4 w-4 text-sky-400" />;
      case 'E_WALLET':
        return <Smartphone className="h-4 w-4 text-emerald-400" />;
      case 'INVESTMENT':
        return <TrendingUp className="h-4 w-4 text-amber-400" />;
      case 'CASH':
        return <Banknote className="h-4 w-4 text-teal-400" />;
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('accounts').insert({
        user_id: userId,
        name: name.trim(),
        type,
        balance: parseFloat(balance) || 0,
      });

      if (error) throw error;

      setName('');
      setBalance('');
      setIsModalOpen(false);
      onAccountsUpdated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal membuat akun');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Hapus akun/rekening ini?')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
      onAccountsUpdated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus akun');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Dompet &amp; Rekening</h2>
            <p className="text-xs text-slate-400">
              Total Saldo Aktif: <span className="font-semibold text-emerald-400">{formatCurrency(totalBalance)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-400" />
          <span>Tambah Akun</span>
        </button>
      </div>

      {/* Account Grid / Cards */}
      {accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
          Belum ada rekening/dompet. Klik <strong>+ Tambah Akun</strong> untuk mencatat BCA, GoPay, Cash, dll.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition hover:border-slate-700 hover:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    {getIcon(acc.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{acc.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {acc.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAccount(acc.id)}
                  disabled={deletingId === acc.id}
                  className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                  title="Hapus Akun"
                >
                  {deletingId === acc.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="mt-4">
                <span className="text-xs text-slate-400">Saldo</span>
                <p className="text-sm font-bold text-emerald-400">
                  {formatCurrency(Number(acc.balance))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Tambah Rekening / Dompet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Nama Akun
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: BCA, GoPay, Bibit, Cash"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Kategori
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="BANK">Bank (BCA, Mandiri, BRI, dll)</option>
                  <option value="E_WALLET">E-Wallet (GoPay, OVO, ShopeePay)</option>
                  <option value="INVESTMENT">Investasi (Bibit, Stockbit, dll)</option>
                  <option value="CASH">Cash (Uang Tunai)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Saldo Awal (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Contoh: 1500000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
