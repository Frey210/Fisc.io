'use client';

import React, { useEffect, useState } from 'react';
import { SpotlightCard } from '@/components/spotlight-card';
import {
  Send,
  Camera,
  LineChart,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export function AsymmetricBentoGrid() {
  // Continuous simulated chat typing for "Natural Language" feature
  const [chatText, setChatText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const message = '/catat 45k makan siang padang bca';
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
    }, 70);

    const loopTimeout = setTimeout(() => {
      setChatText('');
      setShowBubble(false);
    }, 5500);

    return () => {
      clearInterval(interval);
      clearTimeout(loopTimeout);
    };
  }, [chatText === '']);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Arsitektur Dua Antarmuka</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Show, Don&apos;t Tell. Teknologi di Balik Fisc.io
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Dirancang bagi Anda yang membenci form manual yang lambat dan antarmuka rumit.
        </p>
      </div>

      {/* Apple-Style Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HERO CARD 1: Telegram Bot Integration (Large Span 8 Cols) */}
        <SpotlightCard className="lg:col-span-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 text-xs font-bold text-sky-400">
                <Send className="h-3.5 w-3.5" />
                <span>Primary Ingestion Engine</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                ● Webhook Latency &lt; 800ms
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Pencatatan Natural Language Telegram
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Cukup ketik kalimat sehari-hari di chat Telegram. Engine regex dan NLP internal Fisc.io
              secara instan memisahkan nominal, mendeteksi kategori (F&amp;B, Transport, Utilitas),
              serta memotong saldo akun secara otomatis.
            </p>
          </div>

          {/* Micro-Interaction: Live Simulated Typing & Success Bubble */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Telegram Live Input Simulator</span>
              </span>
              <span>Status: Listening</span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-slate-200">
              <span className="text-emerald-400">&gt;</span>
              <span className="text-xs font-semibold">{chatText}</span>
              <span className="inline-block h-4 w-1.5 bg-emerald-400 animate-pulse" />
            </div>

            {showBubble && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-[11px] text-emerald-300 transition-all animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Transaksiterverifikasi: <strong>Rp 45.000</strong> (F&amp;B) • Akun BCA dipotong</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-bold">0.4s</span>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* CARD 2: Vision OCR Scanner with Laser Scan Animation (Span 4 Cols) */}
        <SpotlightCard className="lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">OCR Vision Scanner</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Kirim foto struk belanjaan kasir. Laser vision mengekstrak total belanja dan merchant otomatis.
            </p>
          </div>

          {/* Micro-Interaction: Receipt Scan Laser Animation */}
          <div className="relative mt-5 h-36 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-3 flex flex-col justify-between font-mono text-[10px] text-slate-400">
            {/* Sweeping Laser Neon Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser" />

            <div className="flex justify-between border-b border-dashed border-slate-800 pb-1">
              <span>INDOMARET POINT</span>
              <span>12:43 PM</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p>• 1x Americano Ice ........... 22.000</p>
              <p>• 1x Roti Bakar ................ 18.000</p>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-emerald-400">
              <span>TOTAL (EXTRACTED)</span>
              <span>Rp 40.000</span>
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 3: Deep Wealth Analytics & Runway (Span 4 Cols) */}
        <SpotlightCard className="lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Financial Runway Tracker</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Berapa lama tabungan Anda dapat bertahan jika tanpa penghasilan? Dihitung otomatis dari burn-rate Anda.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Survival
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-black text-amber-400">7.2 Bulan</p>
              <span className="text-xs text-emerald-400 font-semibold">+1.4 Bln bulan ini</span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-500 to-emerald-400" />
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 4: Multi-Account Wallets & Auto-Reconciliation (Span 8 Cols) */}
        <SpotlightCard className="lg:col-span-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Multi-Wallet &amp; Mutasi Antar Akun Otomatis
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Hubungkan kantong Bank, E-Wallet, Tabungan Investasi, dan Cash. Transfer internal (misal: top-up GoPay dari BCA) tidak dianggap sebagai pengeluaran boncos.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Bank BCA', type: 'Bank', bal: 'Rp 24.500.000', color: 'text-sky-400' },
              { name: 'GoPay', type: 'E-Wallet', bal: 'Rp 850.000', color: 'text-emerald-400' },
              { name: 'Bibit Portofolio', type: 'Investasi', bal: 'Rp 15.000.000', color: 'text-amber-400' },
              { name: 'Dompet Cash', type: 'Fisik', bal: 'Rp 650.000', color: 'text-teal-400' },
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
