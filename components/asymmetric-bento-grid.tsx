'use client';

import React, { useEffect, useState } from 'react';
import { SpotlightCard } from '@/components/spotlight-card';
import { Send, CheckCircle2 } from 'lucide-react';

export function AsymmetricBentoGrid() {
  const [chatText, setChatText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const message = '45k makan siang';
    let idx = 0;
    setShowBubble(false);

    const interval = setInterval(() => {
      if (idx <= message.length) {
        setChatText(message.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowBubble(true), 300);
      }
    }, 90);

    const loopTimeout = setTimeout(() => {
      setChatText('');
      setShowBubble(false);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(loopTimeout);
    };
  }, [chatText === '']);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Otomatisasi Cerdas, Tanpa Ribet.
        </h2>
      </div>

      {/* Bento Grid Layout without random pills/badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: Hero Card (Spans 2 cols on Desktop) */}
        <SpotlightCard className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Natural Language Telegram</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Ketik &quot;45k makan siang&quot;, AI langsung mengenali nominal dan kategori.
            </p>
          </div>

          {/* Micro-interaction: Continuous typing animation with bubble */}
          <div className="mt-6 rounded-2xl border border-white/5 bg-slate-950/80 p-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400 font-bold">&gt;</span>
              <span className="text-xs font-semibold">{chatText}</span>
              <span className="inline-block h-3.5 w-1.5 bg-emerald-400 animate-pulse" />
            </div>

            {showBubble && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-[11px] text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tercatat: <strong>Rp 45.000</strong> (F&amp;B)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Instan</span>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* CARD 2: OCR Smart Scanner (Spans 1-2 col) */}
        <SpotlightCard className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-bold text-white">OCR Smart Scanner</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Kirim foto struk, total belanja otomatis tercatat.
            </p>
          </div>

          {/* Micro-interaction: Receipt with sweeping neon laser line */}
          <div className="relative mt-6 h-36 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-3 flex flex-col justify-between font-mono text-[10px] text-slate-400">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser" />

            <div className="flex justify-between border-b border-dashed border-slate-800 pb-1 text-slate-300">
              <span>STRUK KASIR</span>
              <span>12:43</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p>• 1x Makan Siang .... 35.000</p>
              <p>• 1x Es Teh .......... 5.000</p>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-emerald-400">
              <span>TOTAL</span>
              <span>Rp 40.000</span>
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 3: Financial Runway */}
        <SpotlightCard className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Financial Runway</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Prediksi akurat berapa lama dana Anda bertahan hidup.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/5 bg-slate-950 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Ketahanan Dana
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-black text-amber-400">7.2 Bulan</p>
              <span className="text-xs text-emerald-400 font-semibold">+1.4 Bln</span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-500 to-emerald-400" />
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 4: Multi-Wallet Sync */}
        <SpotlightCard className="md:col-span-2 lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Multi-Wallet Sync</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Pantau BCA, GoPay, dan Tunai dalam satu pintu.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Bank BCA', type: 'Bank', bal: 'Rp 24.500.000', color: 'text-sky-400' },
              { name: 'GoPay', type: 'E-Wallet', bal: 'Rp 850.000', color: 'text-emerald-400' },
              { name: 'Bibit Portofolio', type: 'Investasi', bal: 'Rp 15.000.000', color: 'text-amber-400' },
              { name: 'Tunai', type: 'Cash', bal: 'Rp 650.000', color: 'text-teal-400' },
            ].map((acc, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-950/70 p-3 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">{acc.type}</span>
                <p className="text-xs font-bold text-white mt-0.5">{acc.name}</p>
                <p className={`text-xs font-mono font-bold mt-1.5 ${acc.color}`}>{acc.bal}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
