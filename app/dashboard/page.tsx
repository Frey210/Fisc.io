'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types/database';
import { MetricCard } from '@/components/dashboard/metric-card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { TelegramLinkCard } from '@/components/dashboard/telegram-link-card';
import { formatCurrency } from '@/lib/utils';
import { Wallet, LogOut, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [telegramLink, setTelegramLink] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      // 1. Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/login';
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // 2. Fetch User's Telegram link
      const { data: linkData } = await supabase
        .from('telegram_links')
        .select('telegram_chat_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      setTelegramLink(linkData);

      // 3. Fetch User's Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false })
        .limit(50);

      setTransactions((txData as Transaction[]) || []);
      setLoading(false);
    }

    loadData();

    // Subscribe to auth changes
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
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-emerald-400" />
          <p className="text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Compute Analytics
  let totalIncome = 0;
  let totalExpense = 0;
  let totalSavings = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount);
    if (tx.type === 'INCOME') totalIncome += amt;
    else if (tx.type === 'EXPENSE') totalExpense += amt;
    else if (tx.type === 'TRANSFER') totalSavings += amt;
  });

  const netCashFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : '0';
  const monthlyBurn = totalExpense > 0 ? totalExpense : 1;
  const runwayMonths = totalSavings > 0 ? (totalSavings / monthlyBurn).toFixed(1) : '0.0';

  // Group chart points by day
  const chartMap: Record<string, { income: number; expense: number }> = {};
  [...transactions].reverse().forEach((tx) => {
    const day = new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    if (!chartMap[day]) chartMap[day] = { income: 0, expense: 0 };
    if (tx.type === 'INCOME') chartMap[day].income += Number(tx.amount);
    if (tx.type === 'EXPENSE') chartMap[day].expense += Number(tx.amount);
  });

  const chartData = Object.entries(chartMap).map(([date, vals]) => ({
    date,
    income: vals.income,
    expense: vals.expense,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20">
              <Wallet className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Fisc<span className="text-emerald-400">.io</span>
              </span>
              <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                PROD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-slate-400 sm:inline-block">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Halo,{' '}
              <span className="text-emerald-400">
                {user?.user_metadata?.full_name ||
                  user?.user_metadata?.name ||
                  user?.email?.split('@')[0] ||
                  'User'}
              </span>{' '}
              👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Pantau cash flow, savings rate, dan runway keuangan Anda secara real-time.
            </p>
          </div>
        </div>

        {/* User Telegram Link Status Banner */}
        <TelegramLinkCard
          userId={user?.id || ''}
          isLinked={!!telegramLink}
          telegramChatId={telegramLink?.telegram_chat_id}
        />

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            subtext="Gross monthly captured income"
            type="income"
          />
        </div>

        {/* Visual Charts & Transaction Feeds */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cash Flow Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Net Cash Flow Trend</h2>
                <p className="text-xs text-slate-400">Income vs. Expenses across time</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-xs text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Expense
                </span>
              </div>
            </div>
            <CashFlowChart data={chartData} />
          </div>

          {/* Quick Stats / Guide */}
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <h2 className="text-base font-bold text-white">Omnichannel Bot Guide</h2>
              <p className="text-xs text-slate-400">Cara logging instan via Telegram</p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">⚡ Input Cepat Telegram:</span>
              <div className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                <p>• 45000 makan nasi</p>
                <p>• kopi padu rasa 25k</p>
                <p>• +8000000 gaji bulan ini</p>
                <p>• &gt; 1500000 reksadana bibit</p>
              </div>
            </div>

            <div className="mt-auto rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Sparkles className="h-4 w-4" />
                <span>Auto Classification</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                AI Regex otomatis mendeteksi F&amp;B, Transportasi, Server Hosting, Utilitas, dsb.
              </p>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Transaction Ledger</h2>
              <p className="text-xs text-slate-400">Daftar transaksi akun Anda</p>
            </div>
          </div>
          <TransactionList transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
