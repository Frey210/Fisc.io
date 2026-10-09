'use client';

import React, { useEffect, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export function HeroInteractiveSetup() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; sub?: string }>>([
    { sender: 'user', text: '45k makan siang' },
    { sender: 'bot', text: '✅ Tercatat: Rp 45.000', sub: 'F&B • BCA' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const demoPhrases = [
    { text: '25k kopi susu gopay', bot: '✅ Tercatat: Rp 25.000', sub: 'F&B • GoPay' },
    { text: '+8500000 gaji freelance', bot: '🟢 Pemasukan: Rp 8.500.000', sub: 'Salary • BCA' },
    { text: '> 1500000 tabungan bibit', bot: '🔵 Transfer: Rp 1.500.000', sub: 'BCA ➔ Bibit' },
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
          setMessages((prev) => [
            ...prev.slice(-2),
            { sender: 'user', text: targetPhrase },
            { sender: 'bot', text: demoPhrases[activeStep].bot, sub: demoPhrases[activeStep].sub },
          ]);
          setCurrentInput('');

          setTimeout(() => {
            setActiveStep((prev) => (prev + 1) % demoPhrases.length);
          }, 2600);
        }, 500);
      }
    }, 70);

    return () => clearInterval(typeInterval);
  }, [activeStep]);

  return (
    <div className="relative w-full">
      {/* Soft Emerald/Teal Radial Glow Behind Devices */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] sm:h-[420px] sm:w-[480px] rounded-full bg-emerald-500/15 blur-[120px] -z-10" />

      {/* Side-by-side floating devices */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
        
        {/* Left Device: Smartphone with Telegram Chat UI */}
        <div className="relative w-full max-w-[270px] sm:max-w-[250px] lg:max-w-[270px] shrink-0 rounded-[2.2rem] border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl animate-float-slow">
          {/* Dynamic Notch */}
          <div className="mx-auto mb-2.5 h-3.5 w-24 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          </div>

          {/* Chat Header */}
          <div className="flex items-center gap-2 pb-2 px-1 border-b border-white/5 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold">
              🤖
            </div>
            <div>
              <p className="text-[11px] font-bold text-white flex items-center gap-1 leading-tight">
                <span>Fisc.io Bot</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </p>
              <p className="text-[9px] text-slate-500">bot</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-2 py-3 px-1 min-h-[140px] flex flex-col justify-end text-left text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl p-2.5 ${
                  m.sender === 'user'
                    ? 'ml-auto bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold rounded-br-none shadow-sm'
                    : 'mr-auto bg-slate-900/90 border border-white/5 text-white rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-[11px] leading-tight">{m.text}</p>
                {m.sub && <p className="text-[9px] text-emerald-400 font-medium mt-0.5">{m.sub}</p>}
              </div>
            ))}
          </div>

          {/* Typing Input */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-2.5 py-1.5 text-xs">
            <span className="text-[10px] text-slate-300 font-mono flex-1 text-left truncate">
              {currentInput || <span className="text-slate-600">Ketik pesan...</span>}
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
              <Send className="h-2.5 w-2.5" />
            </span>
          </div>
        </div>

        {/* Sync Particle / Animated Line (Center Connection) */}
        <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="h-0.5 w-10 lg:w-14 border-t-2 border-dashed border-emerald-400/40" />
            <div className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-lg shadow-emerald-500/25 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Right Device: Web Dashboard Mockup */}
        <div className="relative w-full max-w-[340px] lg:max-w-[380px] shrink-0 rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 shadow-2xl backdrop-blur-xl animate-float-reverse text-left">
          {/* Browser Controls */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 text-[9px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-500/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-slate-400 truncate">fisc.farlabs.my.id/dashboard</span>
          </div>

          <div className="space-y-2.5 pt-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Net Cash Flow</span>
                <p className="mt-0.5 text-sm sm:text-base font-black text-emerald-400">+Rp 12.850.000</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Runway</span>
                <p className="mt-0.5 text-sm sm:text-base font-black text-amber-400">8.4 Bulan</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950/70 p-2.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1.5">
                <span className="font-bold text-white">Cash Flow Timeline</span>
                <span className="text-emerald-400 font-semibold">+34% vs Bln Lalu</span>
              </div>
              <div className="flex items-end gap-1.5 h-14 w-full pt-1">
                {[30, 55, 40, 75, 45, 90, 65, 80, 100, 70, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-t-sm ${
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
