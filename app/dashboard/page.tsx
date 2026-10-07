import { createAdminClient } from '@/lib/supabase/admin';
import { Transaction } from '@/types/database';
import { MetricCard } from '@/components/dashboard/metric-card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Bell, Link2, Sparkles, Filter } from 'lucide-react';

export const revalidate = 0; // Fresh analytics on each request

async function getDashboardData() {
  const supabase = createAdminClient();

  // Fetch recent transactions
  const { data: rawTransactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(50);

  const transactions = (rawTransactions as Transaction[]) || [];

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

  // Financial Runway: Total Savings / Monthly Burn Rate (assumed totalExpense as burn baseline)
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

  return {
    transactions,
    totalIncome,
    totalExpense,
    totalSavings,
    netCashFlow,
    savingsRate,
    runwayMonths,
    chartData,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

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

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800">
              <Link2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Telegram Linked</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Executive Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time cash flow, runway, and omnichannel ingestion monitoring.
          </p>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Net Cash Flow"
            value={formatCurrency(data.netCashFlow)}
            subtext="Total Monthly Net Position"
            type={data.netCashFlow >= 0 ? 'income' : 'expense'}
          />
          <MetricCard
            title="Savings Rate"
            value={`${data.savingsRate}%`}
            subtext="Income transferred to wealth"
            type="savings"
          />
          <MetricCard
            title="Financial Runway"
            value={`${data.runwayMonths} Bln`}
            subtext="Estimated survival on reserve"
            type="runway"
          />
          <MetricCard
            title="Total Inflow"
            value={formatCurrency(data.totalIncome)}
            subtext="Gross monthly captured income"
            type="income"
          />
        </div>

        {/* Visual Charts & Transaction Feeds */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
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
            <CashFlowChart data={data.chartData} />
          </div>

          {/* Quick Stats / Guide */}
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <h2 className="text-base font-bold text-white">Omnichannel Bot Guide</h2>
              <p className="text-xs text-slate-400">Cara logging instan via Telegram</p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">⚡ Input Cepat Telegram:</span>
              <div className="space-y-1.5 text-slate-400">
                <p>• <code>45000 makan</code> (Pengeluaran)</p>
                <p>• <code>kopi 25k</code> (Pengeluaran)</p>
                <p>• <code>+8000000 gaji</code> (Pemasukan)</p>
                <p>• <code>&gt; 1500000 reksadana</code> (Simpanan)</p>
              </div>
            </div>

            <div className="mt-auto rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Sparkles className="h-4 w-4" />
                <span>Auto Classification</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                AI Regex mengkategorikan otomatis transaksi Anda ke pos F&amp;B, Transport, Hosting, Utilities, dsb.
              </p>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Transaction Ledger</h2>
              <p className="text-xs text-slate-400">Daftar transaksi real-time dari bot &amp; web</p>
            </div>
          </div>
          <TransactionList transactions={data.transactions} />
        </div>
      </main>
    </div>
  );
}
