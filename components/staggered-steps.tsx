'use client';

import React from 'react';
import { SpotlightCard } from '@/components/spotlight-card';
import { UserPlus, Send, Zap } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Buat Akun',
    desc: 'Daftar instan via Google OAuth.',
  },
  {
    step: '02',
    icon: Send,
    title: 'Tautkan Telegram',
    desc: 'Klik satu tombol penghubung di dashboard.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Mulai Mencatat',
    desc: 'Kirim pesan pengeluaran pertama Anda ke bot.',
  },
];

export function StaggeredSteps() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Mulai dalam 1 Menit.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx}>
              <SpotlightCard className="h-full min-h-[200px] rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between text-left relative overflow-hidden">
                {/* Massive low-opacity watermark number filling void */}
                <span className="pointer-events-none absolute -bottom-4 -right-2 select-none font-mono text-8xl sm:text-9xl font-black text-white/[0.04] leading-none z-0">
                  {item.step}
                </span>

                {/* Layered descriptive text & icon */}
                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </SpotlightCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
