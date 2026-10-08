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

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'ledger' as const, label: 'Ledger', icon: ReceiptText },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row pb-24 lg:pb-0">
      {/* 1. DESKTOP PERMANENT SIDEBAR (>= 1024px) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 border-r border-white/5 bg-slate-950/95 backdrop-blur-2xl p-6 justify-between">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-emerald-500/20">
              <img src="/logo.svg" alt="Fisc.io Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Fisc<span className="text-emerald-400">.io</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Wealth Operations
              </span>
            </div>
          </div>

          {/* Prominent Full-Width "+ Add Transaction" Button */}
          <button
            onClick={handleOpenAdd}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-3 text-sm font-black tracking-wide text-slate-950 shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] hover:from-emerald-300 hover:to-teal-300"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Tambah Transaksi</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout in Desktop Sidebar */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-white/5 text-emerald-400">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-white">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER (Shifted right on desktop, constrained max-w-7xl) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="sticky top-0 z-40 lg:hidden border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-emerald-500/20">
                <img src="/logo.svg" alt="Fisc.io Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Fisc<span className="text-emerald-400">.io</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300"
              >
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                title="Keluar"
                className="rounded-xl border border-white/5 bg-slate-900/80 p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Constrained Main Container for Desktop */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          {/* Desktop App Bar / Header with Greeting and User Info */}
          <div className="hidden lg:flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Halo,{' '}
                <span className="text-emerald-400">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.email?.split('@')[0] ||
                    'User'}
                </span>{' '}
                👋
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Ringkasan performa finansial dan arus kas real-time Anda.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-slate-900/80 px-3.5 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-300">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* TAB 1: HOME (DASHBOARD) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Mobile Greeting (Hidden on Desktop) */}
              <div className="lg:hidden">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Halo,{' '}
                  <span className="text-emerald-400">
                    {user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      user?.email?.split('@')[0] ||
                      'User'}
                  </span>{' '}
                  👋
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">
                  Ringkasan performa finansial dan arus kas real-time Anda.
                </p>
              </div>

              {/* 4 Metric Cards: 2x2 on Mobile, 4 Equal Columns on Desktop */}
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

              {/* Desktop Bento Grid: 8 Cols Chart + 4 Cols Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Net Cash Flow Chart (8 Columns on Desktop) */}
                <div className="lg:col-span-8">
                  <CashFlowChart data={chartData} />
                </div>

                {/* Recent Transactions (4 Columns on Desktop) */}
                <div className="lg:col-span-4 rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Transaksi Terbaru</h3>
                      <p className="text-[11px] text-slate-400">5 mutasi terakhir</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('ledger')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      Semua →
                    </button>
                  </div>

                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onEdit={handleOpenEdit}
                    onDeleted={handleDataRefresh}
                    onAddNew={handleOpenAdd}
                  />
                </div>

                {/* Spending Intensity Heatmap (Full 12 Columns below) */}
                <div className="lg:col-span-12">
                  <SpendingHeatmap transactions={transactions} />
                </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                  <CashFlowChart data={chartData} />
                </div>
                <div className="lg:col-span-12">
                  <SpendingHeatmap transactions={transactions} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & GUIDES */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-white">Pengaturan &amp; Integrasi</h2>
                <p className="text-xs text-slate-400">Koneksi Telegram Bot dan preferensi akun Anda</p>
              </div>

              {/* Telegram Link Card */}
              <TelegramLinkCard
                userId={user?.id || ''}
                isLinked={!!telegramLink}
                telegramChatId={telegramLink?.telegram_chat_id}
              />

              {/* Omnichannel Bot Guide */}
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
      </div>

      {/* 3. MOBILE FLOATING ACTION BUTTON (FAB) (Hidden on Desktop >= 1024px) */}
      <button
        onClick={handleOpenAdd}
        title="Tambah Transaksi Baru"
        className="lg:hidden fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-2xl shadow-emerald-500/50 transition-transform active:scale-95 hover:scale-105"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
      </button>

      {/* 4. MOBILE BOTTOM NAVIGATION BAR (Hidden on Desktop >= 1024px) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

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
