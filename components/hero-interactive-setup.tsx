'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Send, Sparkles, Box, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

const Canvas3DHeroScene = dynamic(
  () => import('./canvas-3d-hero-scene').then((mod) => mod.Canvas3DHeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full items-center justify-center rounded-3xl border border-white/5 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Memuat 3D WebGL Scene…</span>
        </div>
      </div>
    ),
  }
);

export const demoPresets = [
  {
    id: 0,
    label: 'Kopi Sore',
    input: '25k kopi susu gopay',
    message: '25k kopi susu gopay',
    botReply: '✅ Tercatat: Rp 25.000',
    sub: 'Kategori: F&B • GoPay (-Rp 25.000)',
    amount: 'Rp 25.000',
    type: 'PENGELUARAN',
    category: 'F&B',
    account: 'GoPay',
    bars: [0.35, 0.5, 0.4, 0.75, 0.45],
  },
  {
    id: 1,
    label: 'Gaji Masuk',
    input: '+8500000 gaji freelance bca',
    message: '+8500000 gaji freelance bca',
    botReply: '🟢 Pemasukan: Rp 8.500.000',
    sub: 'Kategori: Salary • BCA (+Rp 8.500.000)',
    amount: 'Rp 8.500.000',
    type: 'PEMASUKAN',
    category: 'Gaji',
    account: 'BCA',
    bars: [0.2, 0.4, 0.35, 0.5, 0.95],
  },
  {
    id: 2,
    label: 'Makan Siang',
    input: '45k makan padang bca',
    message: '45k makan padang bca',
    botReply: '✅ Tercatat: Rp 45.000',
    sub: 'Kategori: F&B • BCA (-Rp 45.000)',
    amount: 'Rp 45.000',
    type: 'PENGELUARAN',
    category: 'F&B',
    account: 'BCA',
    bars: [0.3, 0.6, 0.45, 0.65, 0.5],
  },
  {
    id: 3,
    label: 'Investasi',
    input: '> 1500000 bca ke bibit',
    message: '> 1500000 bca ke bibit',
    botReply: '🔵 Transfer: Rp 1.500.000',
    sub: 'BCA ➔ Bibit Portofolio',
    amount: 'Rp 1.500.000',
    type: 'TRANSFER',
    category: 'Investasi',
    account: 'Bibit',
    bars: [0.25, 0.35, 0.5, 0.4, 0.8],
  },
];

export const demoTransactions = demoPresets;

export function HeroInteractiveSetup() {
  const [viewMode, setViewMode] = useState<'interactive' | '3d'>('interactive');
  const [activePreset, setActivePreset] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showReply, setShowReply] = useState(true);

  // Auto-cycle through presets when idle
  useEffect(() => {
    let charIndex = 0;
    const current = demoPresets[activePreset];
    setShowReply(false);

    const typeInterval = setInterval(() => {
      if (charIndex <= current.input.length) {
        setTypedText(current.input.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setShowReply(true);
      }
    }, 55);

    const nextTimeout = setTimeout(() => {
      setActivePreset((prev) => (prev + 1) % demoPresets.length);
    }, 4200);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(nextTimeout);
    };
  }, [activePreset]);

  const active = demoPresets[activePreset];

  return (
    <div className="relative w-full">
      {/* Soft Emerald/Teal Glow Background */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-[420px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />

      {/* Mode Switcher Pill */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Realtime Sync Engine
          </span>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/80 p-1 text-[11px] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition ${
              viewMode === 'interactive'
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>Dual Device</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition ${
              viewMode === '3d'
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="h-3 w-3" />
            <span>3D WebGL</span>
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        /* 3D Canvas Scene */
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl sm:p-4">
          <div className="h-[380px] sm:h-[420px]">
            <Canvas3DHeroScene
              selected={activePreset % 3}
              expanded={false}
              paused={false}
              reset={0}
              onSelect={() => setActivePreset((prev) => (prev + 1) % demoPresets.length)}
            />
          </div>
          <p className="pt-2 text-center text-[11px] font-mono text-slate-400">
            ✦ Klik &amp; geser untuk memutar perangkat dalam ruang 3D interaktif.
          </p>
        </div>
      ) : (
        /* Dual Device Layered Showcase */
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-950/90 p-4 shadow-2xl backdrop-blur-2xl sm:p-6">
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12">
            
            {/* Left: Floating Smartphone Mockup (Telegram Bot) */}
            <div className="relative mx-auto w-full max-w-[280px] shrink-0 rounded-[2.5rem] border-[3px] border-slate-700/80 bg-slate-950 p-3 shadow-2xl shadow-emerald-950/40 lg:col-span-5">
              {/* Phone Dynamic Island */}
              <div className="mx-auto mb-2 flex h-3.5 w-24 items-center justify-center rounded-full bg-slate-900 border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              </div>

              {/* Telegram Bot App Bar */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500/20 to-teal-500/20 text-sm">
                  🤖
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Fisc.io Bot</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400">Telegram Verified • &lt;800ms</span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="space-y-2.5 py-3 text-left">
                {/* User Prompt Message */}
                <div className="ml-auto max-w-[90%] rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 text-xs font-bold text-slate-950 shadow-md">
                  <p>{typedText || '…'}</p>
                  <span className="mt-1 block text-right text-[9px] font-medium text-slate-900/70">
                    Baru saja ✓✓
                  </span>
                </div>

                {/* Bot Instant Response */}
                <div
                  className={`mr-auto max-w-[92%] rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-2.5 text-xs text-white shadow-lg transition-all duration-300 ${
                    showReply ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{active.botReply}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-300">{active.sub}</p>
                  <div className="mt-1.5 flex items-center justify-between border-t border-white/5 pt-1 text-[9px] text-slate-400">
                    <span>Otomatis sinkron ke Web</span>
                    <span className="font-mono text-emerald-400">0.3s</span>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="mt-1 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs">
                <span className="font-mono text-[10px] text-slate-400 truncate">
                  {typedText || 'Ketik transaksi Anda…'}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                  <Send className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>

            {/* Center Sync Line (Desktop) */}
            <div className="hidden lg:col-span-2 lg:flex flex-col items-center justify-center text-center">
              <div className="relative flex w-full items-center justify-center">
                <div className="w-full border-t border-dashed border-emerald-500/40" />
                <div className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/30 animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 text-[10px] font-mono uppercase text-emerald-400">
                Auto Sync
              </span>
            </div>

            {/* Right: Desktop Dashboard Window Preview */}
            <div className="w-full rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl lg:col-span-5 overflow-hidden">
              {/* macOS Window Title Bar */}
              <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/60 px-3 py-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-slate-300">fisc.farlabs.my.id/dashboard</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                  LIVE
                </span>
              </div>

              {/* Real Dashboard Screenshot Preview with Overlay KPI */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/screenshots/dashboard-preview.png"
                  alt="Fisc.io Dashboard Preview"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                
                {/* Floating Live KPI Pill */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl border border-white/15 bg-slate-950/90 p-2.5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-slate-400">Transaksi Terbaru</span>
                    <span className="font-bold text-emerald-400">{active.amount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-white">
                    <span className="truncate">{active.label} • {active.account}</span>
                    <span className="text-[10px] font-normal text-slate-400">Baru saja</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Preset Chips */}
          <div className="mt-5 border-t border-white/5 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                Coba skenario pencatatan:
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Klik tombol di bawah ↵
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demoPresets.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActivePreset(idx)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                    activePreset === idx
                      ? 'border border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'border border-white/10 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
