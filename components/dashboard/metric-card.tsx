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
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/80 p-4 sm:p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className={`rounded-xl border p-1.5 sm:p-2 ${badge.bg}`}>{badge.icon}</div>
      </div>
      <div className="mt-2.5 sm:mt-3">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">{value}</h3>
        {subtext && (
          <p className="mt-1 hidden sm:block text-[11px] text-slate-400">{subtext}</p>
        )}
      </div>
    </div>
  );
}
