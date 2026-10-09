'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-slate-700">{item.step}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
