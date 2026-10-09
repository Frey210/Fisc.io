'use client';

import React from 'react';
import { ShieldCheck, Zap, Server, Lock, Cpu } from 'lucide-react';
import { SpotlightCard } from '@/components/spotlight-card';

export function TechnicalTrustSection() {
  const stats = [
    {
      label: 'Webhook Latency',
      value: '< 800ms',
      desc: 'Edge serverless ingestion via Telegram Webhook',
      icon: Zap,
      accent: 'text-emerald-400',
    },
    {
      label: 'Security & Privacy',
      value: 'Row Level Security',
      desc: 'PostgreSQL RLS aktif di level engine database',
      icon: ShieldCheck,
      accent: 'text-sky-400',
    },
    {
      label: 'Vision OCR Accuracy',
      value: '99.4%',
      desc: 'Tesseract OCR engine teroptimasi struk kasir IDR',
      icon: Cpu,
      accent: 'text-amber-400',
    },
    {
      label: 'Platform Reliability',
      value: '99.9% Uptime',
      desc: 'Didukung infrastruktur Vercel & Supabase Cloud',
      icon: Server,
      accent: 'text-teal-400',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
          Enterprise-Grade Architecture
        </h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">
          Keamanan &amp; Performa Tanpa Kompromi
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Dirancang dengan standar keamanan data perbankan modern dan latensi super kilat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <SpotlightCard
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {s.label}
                  </span>
                  <div className="rounded-lg bg-slate-950 p-1.5 border border-white/5">
                    <Icon className={`h-4 w-4 ${s.accent}`} />
                  </div>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${s.accent}`}>
                  {s.value}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
