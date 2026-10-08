'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ChartProps {
  data: Array<{
    date: string;
    income: number;
    expense: number;
  }>;
}

type Timeframe = '1W' | '1M' | '3M' | 'YTD' | 'ALL';

const GHOST_DATA = [
  { date: '01', income: 400000, expense: 200000 },
  { date: '05', income: 350000, expense: 280000 },
  { date: '10', income: 600000, expense: 320000 },
  { date: '15', income: 450000, expense: 410000 },
  { date: '20', income: 750000, expense: 300000 },
  { date: '25', income: 520000, expense: 390000 },
  { date: '30', income: 680000, expense: 290000 },
];

export function CashFlowChart({ data }: ChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  // Filter data based on selected timeframe
  const filteredData = (() => {
    if (!data || data.length === 0) return [];
    if (timeframe === '1W') return data.slice(-7);
    if (timeframe === '1M') return data.slice(-30);
    if (timeframe === '3M') return data.slice(-90);
    return data;
  })();

  const totalIncome = filteredData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = filteredData.reduce((acc, curr) => acc + curr.expense, 0);
  const netFlow = totalIncome - totalExpense;

  const hasData = filteredData.length > 0;
  const chartData = hasData ? filteredData : GHOST_DATA;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
      {/* Top Header: Summary on Left, Timeframe Pills on Right */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Net Cash Flow Trend
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <h3
              className={`text-2xl font-black tracking-tight ${
                netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {hasData ? formatCurrency(netFlow) : 'Rp 0'}
            </h3>
            <span className="text-xs text-slate-500">
              {hasData ? `(Inflow: ${formatCurrency(totalIncome)})` : 'Simulasi'}
            </span>
          </div>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 self-start sm:self-auto">
          {(['1W', '1M', '3M', 'YTD', 'ALL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                timeframe === t
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-64 w-full">
        {!hasData && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
            <p className="text-xs font-semibold text-slate-400">
              Belum ada data transaksi pada rentang ini
            </p>
            <span className="text-[10px] text-slate-500 mt-0.5">
              Grafik transparan di latar belakang adalah preview simulasi
            </span>
          </div>
        )}

        <div className={`h-full w-full ${!hasData ? 'opacity-15' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
