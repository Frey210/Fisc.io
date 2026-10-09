'use client';

import React, { useEffect, useState } from 'react';
import { SpotlightCard } from '@/components/spotlight-card';
import { Send, CheckCircle2 } from 'lucide-react';

export function AsymmetricBentoGrid() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fullText = '45k makan siang';
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 90);
      } else {
        setShowSuccess(true);
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2200);
      }
    } else {
      setShowSuccess(false);
      timeout = setTimeout(() => {
        setDisplayText('');
        setIsTyping(true);
      }, 700);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Otomatisasi Cerdas, Tanpa Ribet.
        </h2>
      </div>

      {/* Strict 3-column Bento Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ROW 1 - CARD 1: Natural Language Telegram (md:col-span-2) */}
        <SpotlightCard className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between text-left relative overflow-hidden min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full h-full">
            
            {/* Left Column: Clean Copy & Explanations (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Natural Language Telegram
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed font-normal">
                Ketik &quot;45k makan siang&quot;, AI langsung mengenali nominal dan kategori.
              </p>
            </div>

            {/* Right Column: Clean, Stable Telegram Chat Window with Fixed Heights (7 cols) */}
            <div className="md:col-span-7 w-full rounded-2xl border border-white/15 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-2xl text-left">
              {/* Telegram App Bar */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/10">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs">
                  🤖
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                    <span>Fisc.io Bot</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">bot • online</p>
                </div>
              </div>

              {/* Chat Thread Container with Fixed Height to Prevent Size Glitches */}
              <div className="h-[180px] py-2 flex flex-col justify-end space-y-2 text-xs overflow-hidden">
                {/* Message 1 (Bot History) */}
                <div className="mr-auto max-w-[85%] rounded-2xl bg-slate-900 border border-white/10 text-white p-2.5 rounded-bl-none shadow-sm">
                  <p className="text-xs">✅ Tercatat: Rp 25.000</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Kategori: F&amp;B • GoPay</p>
                </div>

                {/* Message 2 (User Typing Target Bubble with Fixed Container) */}
                <div className="ml-auto max-w-[85%] min-h-[36px] flex items-center">
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold px-3 py-2 rounded-br-none shadow-sm flex items-center gap-1">
                    <span className="text-xs">{displayText || '\u00A0'}</span>
                    <span className="inline-block h-3.5 w-1 bg-slate-950 animate-pulse" />
                  </div>
                </div>

                {/* Message 3 (Bot Confirmation Bubble with Reserved Height) */}
                <div className="h-[44px] flex items-center">
                  <div
                    className={`mr-auto max-w-[88%] rounded-2xl bg-slate-900 border border-emerald-500/40 text-white px-3 py-1.5 rounded-bl-none shadow-sm transition-all duration-300 ${
                      showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>✅ Tercatat: Rp 45.000</span>
                    </div>
                    <p className="text-[10px] text-slate-400">F&amp;B • Akun BCA dipotong</p>
                  </div>
                </div>
              </div>

              {/* Input Composer */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-400 font-mono mt-1">
                <span className="text-slate-300 truncate text-[11px]">
                  {displayText || 'Ketik pesan pengeluaran...'}
                </span>
                <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 shrink-0 ml-2">
                  <Send className="h-2.5 w-2.5" />
                </div>
              </div>
            </div>

          </div>
        </SpotlightCard>

        {/* ROW 1 - CARD 2: OCR Smart Scanner (md:col-span-1) */}
        <SpotlightCard className="md:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between text-left relative overflow-hidden min-h-[400px]">
          <div className="z-10 relative">
            <h3 className="text-xl sm:text-2xl font-black text-white">OCR Smart Scanner</h3>
            <p className="mt-2 text-sm text-white/70 leading-relaxed font-normal">
              Kirim foto struk, total belanja otomatis tercatat.
            </p>
          </div>

          {/* Tall glowing receipt stretching to the bottom edge */}
          <div className="relative mt-6 -mb-8 mx-auto w-full max-w-[260px] rounded-t-2xl border-x border-t border-white/15 bg-slate-950/95 p-4 sm:p-5 shadow-2xl text-left font-mono text-xs flex flex-col justify-between min-h-[240px] pb-10">
            {/* Sweeping Neon Green Laser Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-laser z-20 pointer-events-none" />

            <div className="space-y-2.5 z-10">
              <div className="flex items-center justify-between border-b border-dashed border-slate-800 pb-2">
                <span className="font-bold text-white text-xs tracking-wider">INDOMARET POINT</span>
                <span className="text-[10px] text-slate-500">12:43 WIB</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>1x Americano Cold</span>
                  <span>22.000</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Roti Cokelat</span>
                  <span>14.000</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Air Mineral</span>
                  <span>4.000</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-800 pt-2.5 flex justify-between items-baseline font-bold z-10">
              <span className="text-[11px] text-slate-400 uppercase">TOTAL DIBAYAR</span>
              <span className="text-lg font-black text-emerald-400">Rp 40.000</span>
            </div>
          </div>
        </SpotlightCard>

        {/* ROW 2 - CARD 3: Financial Runway (md:col-span-1, centered) */}
        <SpotlightCard className="md:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px]">
          <div className="max-w-xs">
            <h3 className="text-xl sm:text-2xl font-black text-white">Financial Runway</h3>
            <p className="mt-2 text-sm text-white/70 leading-relaxed font-normal">
              Prediksi akurat berapa lama dana Anda bertahan hidup.
            </p>
          </div>

          <div className="mt-6 w-full max-w-xs flex flex-col items-center">
            {/* Massive Glowing Number */}
            <div className="text-5xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              7.2 Bulan
            </div>

            {/* Glowing progress bar filling the horizontal width */}
            <div className="mt-4 h-3 w-full rounded-full bg-slate-900 border border-white/10 p-0.5 overflow-hidden shadow-inner">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-300 shadow-[0_0_15px_#10b981]" />
            </div>

            <div className="mt-2 flex w-full justify-between text-[11px] text-slate-400 font-mono">
              <span>0 Bln</span>
              <span className="text-emerald-400 font-bold">Safe Zone (&gt; 6 Bln)</span>
              <span>12 Bln</span>
            </div>
          </div>
        </SpotlightCard>

        {/* ROW 2 - CARD 4: Multi-Wallet Sync (md:col-span-2) */}
        <SpotlightCard className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between text-left relative overflow-hidden min-h-[300px]">
          <div>
            <h3 className="text-2xl font-black text-white">Multi-Wallet Sync</h3>
            <p className="mt-2 text-sm text-white/70 leading-relaxed font-normal">
              Pantau BCA, GoPay, dan Tunai dalam satu pintu.
            </p>
          </div>

          {/* Internal Grid: 2x2 on Mobile, 4-Cols on Desktop to prevent massive height */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {[
              {
                name: 'Bank BCA',
                type: 'Rekening',
                bal: 'Rp 24,5 Jt',
                color: 'text-sky-400',
                sparkPath: 'M0 24 Q 25 15, 50 18 T 100 8 T 150 14 T 200 4',
                sparkStroke: '#38bdf8',
              },
              {
                name: 'GoPay',
                type: 'E-Wallet',
                bal: 'Rp 850 Rb',
                color: 'text-emerald-400',
                sparkPath: 'M0 20 Q 25 24, 50 10 T 100 16 T 150 6 T 200 2',
                sparkStroke: '#34d399',
              },
              {
                name: 'Bibit',
                type: 'Investasi',
                bal: 'Rp 15,0 Jt',
                color: 'text-amber-400',
                sparkPath: 'M0 22 Q 25 18, 50 20 T 100 12 T 150 8 T 200 2',
                sparkStroke: '#fbbf24',
              },
              {
                name: 'Tunai',
                type: 'Fisik',
                bal: 'Rp 650 Rb',
                color: 'text-teal-400',
                sparkPath: 'M0 14 Q 25 16, 50 14 T 100 18 T 150 12 T 200 14',
                sparkStroke: '#2dd4bf',
              },
            ].map((w, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                    <span className="truncate">{w.name}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{w.type}</span>
                  </div>
                  <div className={`mt-1.5 text-base sm:text-lg font-black font-mono tracking-tight ${w.color}`}>
                    {w.bal}
                  </div>
                </div>

                {/* Mini Soft-Opacity SVG Sparkline Chart */}
                <div className="mt-3 h-7 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 28" fill="none">
                    <path
                      d={w.sparkPath}
                      stroke={w.sparkStroke}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-70"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
