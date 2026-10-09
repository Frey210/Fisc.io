'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/spotlight-card';
import { UserPlus, Send, Zap } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Buat Akun Instan',
    desc: 'Daftar menggunakan Google OAuth atau Email dalam hitungan detik tanpa ribet.',
  },
  {
    step: '02',
    icon: Send,
    title: 'Koneksikan Telegram Bot',
    desc: 'Satu klik di tab Pengaturan untuk menautkan Telegram Anda dengan aman.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Catat Kapan Saja',
    desc: 'Ketik pesan singkat atau potret struk belanja. Analitik langsung tersinkron di dashboard.',
  },
];

export function StaggeredSteps() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-white">Cara Memulai dalam 1 Menit</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">Zero setup, tanpa download aplikasi besar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-slate-700">{item.step}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
