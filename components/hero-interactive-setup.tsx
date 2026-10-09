'use client';

import React, { useEffect, useState } from 'react';
import { Send, CheckCircle2, ArrowRight, Laptop, Smartphone, Sparkles, TrendingUp } from 'lucide-react';

export function HeroInteractiveSetup() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; sub?: string }>>([
    { sender: 'user', text: '45000 nasi padang bca' },
    { sender: 'bot', text: '✅ Tercatat: Rp 45.000', sub: 'Kategori: F&B • Saldo BCA -45k' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const demoPhrases = [
    { text: '50000 kopi susu gopay', bot: '✅ Tercatat: Rp 50.000', sub: 'F&B • GoPay' },
    { text: '+8500000 gaji freelance bca', bot: '🟢 Pemasukan: Rp 8.500.000', sub: 'Salary • BCA' },
    { text: '> 1500000 bca ke bibit', bot: '🔵 Transfer: Rp 1.500.000', sub: 'BCA ➔ Bibit' },
  ];

  useEffect(() => {
    let charIndex = 0;
    const targetPhrase = demoPhrases[activeStep].text;

    const typeInterval = setInterval(() => {
      if (charIndex <= targetPhrase.length) {
        setCurrentInput(targetPhrase.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          // Send message
          setMessages((prev) => [
            ...prev.slice(-2),
            { sender: 'user', text: targetPhrase },
            { sender: 'bot', text: demoPhrases[activeStep].bot, sub: demoPhrases[activeStep].sub },
          ]);
          setCurrentInput('');

          // Move to next step
          setTimeout(() => {
            setActiveStep((prev) => (prev + 1) % demoPhrases.length);
          }, 3000);
        }, 600);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [activeStep]);

  return (
    <div className="relative mx-auto mt-14 max-w-5xl">
      {/* Background Central Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-96 rounded-full bg-emerald-500/15 blur-[100px] -z-10" />

      {/* Floating 3D Device Ecosystem Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Device 1: Left Floating Smartphone (Telegram Chat Interface) */}
        <div className="lg:col-span-5 relative mx-auto w-full max-w-[320px] rounded-[2.5rem] border-4 border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl transition hover:border-slate-700 animate-float-slow">
          {/* Dynamic Island / Speaker */}
          <div className="mx-auto mb-3 h-4 w-28 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
          </div>

          {/* Chat Header */}
          <div className="flex items-center gap-2.5 pb-2.5 px-2 border-b border-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs">
              🤖
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <span>Fisc.io Bot</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </p>
              <p className="text-[10px] text-slate-500">bot • instant webhook sync</p>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-2.5 py-3 px-1 min-h-[170px] flex flex-col justify-end text-left text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl p-2.5 ${
                  m.sender === 'user'
                    ? 'ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-br-none shadow-sm'
                    : 'mr-auto bg-slate-900 border border-white/5 text-white rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-[11px] leading-tight">{m.text}</p>
                {m.sub && <p className="text-[9px] text-emerald-400 mt-1">{m.sub}</p>}
              </div>
            ))}
          </div>

          {/* Simulated Input Bar */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs">
            <span className="text-[11px] text-slate-300 font-mono flex-1 text-left truncate">
              {currentInput || <span className="text-slate-600">Ketik pesan...</span>}
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <Send className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Sync Particle Line (Center Connection on Desktop) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center">
          <div className="relative w-full flex items-center justify-center">
            <div className="w-full border-t-2 border-dashed border-emerald-500/30" />
            <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-lg shadow-emerald-500/30 animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
            Realtime Sync &lt;1s
          </span>
        </div>

        {/* Device 2: Right Sleek Laptop / Dashboard Preview */}
        <div className="lg:col-span-5 relative w-full rounded-2xl border border-white/10 bg-slate-900/80 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl animate-float-reverse">
          {/* Browser Window Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-500/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-slate-400">fisc.farlabs.my.id/dashboard</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
              PROD
            </span>
          </div>

          {/* Dashboard Live Bento Preview */}
          <div className="space-y-3 pt-3 text-left">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Cash Flow</span>
                <p className="mt-0.5 text-base font-black text-emerald-400">+Rp 12.850.000</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Financial Runway</span>
                <p className="mt-0.5 text-base font-black text-amber-400">8.4 Bulan</p>
              </div>
            </div>

            {/* Simulated Live Cash Flow Wave Chart */}
            <div className="rounded-xl border border-white/5 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="font-bold text-white">Cash Flow Timeline</span>
                <span className="text-emerald-400">+34% vs Bln Lalu</span>
              </div>
              <div className="flex items-end gap-1.5 h-16 w-full pt-2">
                {[35, 60, 45, 80, 50, 95, 70, 85, 100, 75, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-sm transition-all duration-500 ${
                      i >= 8 ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
