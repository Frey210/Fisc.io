'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Transaction, Account } from '@/types/database';
import { MetricCard } from '@/components/dashboard/metric-card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { TransactionModal } from '@/components/dashboard/transaction-modal';
import { AccountsOverview } from '@/components/dashboard/accounts-overview';
import { SpendingHeatmap } from '@/components/dashboard/spending-heatmap';
import { TelegramLinkCard } from '@/components/dashboard/telegram-link-card';
import { formatCurrency } from '@/lib/utils';
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  LogOut,
  Download,
  Sparkles,
  ShieldCheck,
  Send,
  User,
} from 'lucide-react';

type NavTab = 'home' | 'ledger' | 'wallet' | 'analytics' | 'settings';

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [telegramLink, setTelegramLink] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter state for ledger
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchAccounts = useCallback(async (userId: string) => {
    const { data: accData } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    setAccounts((accData as Account[]) || []);
  }, []);

  const fetchTransactions = useCallback(async (userId: string) => {
    const { data: txData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100);

    setTransactions((txData as Transaction[]) || []);
  }, []);

  useEffect(() => {
    async function loadData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/login';
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      const { data: linkData } = await supabase
        .from('telegram_links')
        .select('telegram_chat_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      setTelegramLink(linkData);

      await Promise.all([fetchAccounts(currentUser.id), fetchTransactions(currentUser.id)]);
      setLoading(false);
    }

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        window.location.href = '/login';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAccounts, fetchTransactions]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleOpenAdd = () => {
    setSelectedTx(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleDataRefresh = () => {
    if (user?.id) {
      fetchTransactions(user.id);
      fetchAccounts(user.id);
    }
  };

  const exportTransactionsCSV = () => {
    if (transactions.length === 0) {
      alert('Tidak ada transaksi untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Amount', 'Description', 'Source', 'Confidence'];
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.date).toISOString().split('T')[0],
      t.type,
      t.amount,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.source,
      t.confidence_score ?? '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fisc_io_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Memuat Dashboard Fisc.io...
          </p>
        </div>
      </div>
    );
  }

  // Financial Metrics Calculation
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalTransfer = transactions
    .filter((t) => t.type === 'TRANSFER')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netCashFlow = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0 ? Math.min(100, Math.round((totalTransfer / totalIncome) * 100)) : 0;

  const totalSavings = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);
  const monthlyBurn = totalExpense > 0 ? totalExpense : 1;
  const runwayMonths = (totalSavings / monthlyBurn).toFixed(1);

  // Filtered transactions for ledger
  const displayedTransactions = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  // Chart data aggregation
  const dailyDataMap = transactions.reduce((acc: any, curr) => {
    const day = new Date(curr.date).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
    });
    if (!acc[day]) acc[day] = { date: day, income: 0, expense: 0 };
    if (curr.type === 'INCOME') acc[day].income += Number(curr.amount);
    if (curr.type === 'EXPENSE') acc[day].expense += Number(curr.amount);
    return acc;
  }, {});

  const chartData = Object.values(dailyDataMap).reverse() as Array<{
    date: string;
    income: number;
    expense: number;
  }>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 md:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-emerald-500/20">
              <img src="/logo.svg" alt="Fisc.io Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white">
                Fisc<span className="text-emerald-400">.io</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-medium">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
            </button>
            <button
              onClick={handleSignOut}
              title="Keluar"
              className="rounded-xl border border-white/5 bg-slate-900/80 p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Views */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* TAB 1: HOME (DASHBOARD) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* User Greeting */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Halo,{' '}
                <span className="text-emerald-400">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.email?.split('@')[0] ||
                    'User'}
                </span>{' '}
                👋
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                Ringkasan performa finansial dan arus kas real-time Anda.
              </p>
            </div>

            {/* 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <MetricCard
                title="Net Cash Flow"
                value={formatCurrency(netCashFlow)}
                subtext="Total Monthly Net Position"
                type={netCashFlow >= 0 ? 'income' : 'expense'}
              />
              <MetricCard
                title="Savings Rate"
                value={`${savingsRate}%`}
                subtext="Income transferred to wealth"
                type="savings"
              />
              <MetricCard
                title="Financial Runway"
                value={`${runwayMonths} Bln`}
                subtext="Estimated survival on reserve"
                type="runway"
              />
              <MetricCard
                title="Total Inflow"
                value={formatCurrency(totalIncome)}
                subtext="Gross captured income"
                type="income"
              />
            </div>

            {/* Net Cash Flow Chart with Timeframes */}
            <CashFlowChart data={chartData} />

            {/* Day of Week Heatmap */}
            <SpendingHeatmap transactions={transactions} />

            {/* Recent Ledger Sneak Peek */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Transaksi Terbaru</h3>
                  <p className="text-[11px] text-slate-400">Mutasi pengeluaran & pemasukan terakhir</p>
                </div>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Lihat Semua →
                </button>
              </div>

              <TransactionList
                transactions={transactions.slice(0, 5)}
                onEdit={handleOpenEdit}
                onDeleted={handleDataRefresh}
                onAddNew={handleOpenAdd}
              />
            </div>
          </div>
        )}

        {/* TAB 2: LEDGER (TRANSACTIONS) */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Transaction Ledger</h2>
                  <p className="text-xs text-slate-400">
                    Histori lengkap seluruh transaksi ({displayedTransactions.length} item)
                  </p>
                </div>

                {/* Filter Tabs & Export */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
                    {(['ALL', 'EXPENSE', 'INCOME', 'TRANSFER'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilterType(tab)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          filterType === tab
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab === 'ALL'
                          ? 'Semua'
                          : tab === 'EXPENSE'
                          ? 'Keluar'
                          : tab === 'INCOME'
                          ? 'Masuk'
                          : 'Transfer'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={exportTransactionsCSV}
                    title="Unduh Laporan CSV"
                    className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <TransactionList
                transactions={displayedTransactions}
                onEdit={handleOpenEdit}
                onDeleted={handleDataRefresh}
                onAddNew={handleOpenAdd}
              />
            </div>
          </div>
        )}

        {/* TAB 3: WALLET (ACCOUNTS) */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <AccountsOverview
              accounts={accounts}
              userId={user?.id || ''}
              onAccountsUpdated={handleDataRefresh}
            />
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Financial Analytics</h2>
              <p className="text-xs text-slate-400">Visualisasi arus kas dan pola belanja komprehensif</p>
            </div>

            <CashFlowChart data={chartData} />
            <SpendingHeatmap transactions={transactions} />
          </div>
        )}

        {/* TAB 5: SETTINGS & GUIDES */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Pengaturan &amp; Integrasi</h2>
              <p className="text-xs text-slate-400">Koneksi Telegram Bot dan preferensi akun Anda</p>
            </div>

            {/* Telegram Link Card Relocated Here */}
            <TelegramLinkCard
              userId={user?.id || ''}
              isLinked={!!telegramLink}
              telegramChatId={telegramLink?.telegram_chat_id}
            />

            {/* Omnichannel Bot Guide Relocated Here */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Panduan Input Telegram Bot</h3>
                  <p className="text-xs text-slate-400">Sintaks instan untuk catat otomatis 3 detik</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5 font-mono text-[11px] text-slate-400">
                  <p className="text-emerald-400 font-sans font-bold text-xs mb-1">Pengeluaran &amp; Akun:</p>
                  <p>• <code>45000 nasi padang bca</code></p>
                  <p>• <code>kopi padu rasa 25k gopay</code></p>
                  <p>• Upload foto struk (OCR otomatis)</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5 font-mono text-[11px] text-slate-400">
                  <p className="text-cyan-400 font-sans font-bold text-xs mb-1">Pemasukan &amp; Transfer:</p>
                  <p>• <code>+8000000 gaji bca</code></p>
                  <p>• <code>&gt; 500k bca ke gopay</code></p>
                  <p>• <code>&gt; 2jt bca ke cash</code> (tarik tunai)</p>
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3.5 text-xs text-slate-400 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-sky-400 mb-0.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Auto-Categorization</span>
                </div>
                Bot otomatis membaca kata kunci (F&amp;B, Transport, Utilitas) dan menyinkronkan saldo dompet Anda tanpa perlu manual pilih kategori.
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white mb-2">Informasi Akun</h3>
              <p className="text-xs text-slate-400">Email: <span className="text-white font-medium">{user?.email}</span></p>
              <p className="text-xs text-slate-400 mt-1">User ID: <code className="text-emerald-400 font-mono text-[11px]">{user?.id}</code></p>

              <button
                onClick={handleSignOut}
                className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) for Instant Transaction Entry */}
      <button
        onClick={handleOpenAdd}
        title="Tambah Transaksi Baru"
        className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-2xl shadow-emerald-500/50 transition-transform active:scale-95 hover:scale-105"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
      </button>

      {/* Bottom Navigation Bar (Mobile First 5-Tabs) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'ledger' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ReceiptText className="h-5 w-5" />
            <span className="text-[10px]">Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'wallet' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-[10px]">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px]">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'settings' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>

      {/* Desktop Navigation Helper Tabs (Top/Center) */}
      <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeTab === 'home'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeTab === 'ledger'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ReceiptText className="h-4 w-4" />
          <span>Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeTab === 'wallet'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeTab === 'analytics'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleDataRefresh}
        userId={user?.id || ''}
        accounts={accounts}
        transactionToEdit={selectedTx}
      />
    </div>
  );
}
