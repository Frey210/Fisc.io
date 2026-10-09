'use client';

import React from 'react';
import { Zap, ShieldCheck, Server, Globe } from 'lucide-react';

export function TechnicalTrustSection() {
  const metrics = [
    {
      value: '< 800ms',
      label: 'Latency',
      icon: Zap,
    },
    {
      value: 'Supabase RLS',
      label: 'Security',
      icon: ShieldCheck,
    },
    {
      value: '99.9%',
      label: 'Uptime',
      icon: Server,
    },
    {
      value: 'Cloudflare',
      label: 'Edge Network',
      icon: Globe,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="flex flex-col items-center justify-center p-4 text-center">
              <Icon className="h-5 w-5 text-emerald-400 mb-2 opacity-80" />
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {m.value}
              </div>
              <div className="text-xs font-medium text-slate-400 mt-0.5">
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
