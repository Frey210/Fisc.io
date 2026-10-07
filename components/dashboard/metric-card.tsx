import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: string;
  type?: 'income' | 'expense' | 'savings' | 'runway';
}

export function MetricCard({ title, value, subtext, trend, type }: MetricCardProps) {
  const getBadge = () => {
    switch (type) {
      case 'income':
        return {
          icon: <ArrowDownLeft className="h-5 w-5 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        };
      case 'expense':
        return {
          icon: <ArrowUpRight className="h-5 w-5 text-rose-400" />,
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        };
      case 'savings':
        return {
          icon: <ArrowRightLeft className="h-5 w-5 text-cyan-400" />,
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        };
      case 'runway':
        return {
          icon: <ShieldAlert className="h-5 w-5 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        };
      default:
        return {
          icon: null,
          bg: 'bg-slate-800/40 border-slate-700/50 text-slate-300',
        };
    }
  };

  const badge = getBadge();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
        <div className={`rounded-xl border p-2 ${badge.bg}`}>{badge.icon}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</h3>
        {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
      </div>
    </div>
  );
}
