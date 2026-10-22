'use client';

import React, { useState, useMemo } from 'react';
import { parseTransactionText, ParsedTransaction } from '@/lib/nlp/parser';
import { Sparkles, ArrowRight, CheckCircle2, TrendingDown, TrendingUp, RefreshCw, Send } from 'lucide-react';

const PRESET_EXAMPLES = [
  '45k makan padang bca',
  '+8.5jt gaji bulanan mandiri',
  '25rb kopi kenangan gopay',
  '> 1.5jt tabungan bibit',
  'beli bensin shell 50000',
  '- 120k belanja bulanan indomaret',
];

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function LiveNlpSandbox() {
  const [inputText, setInputText] = useState('45k makan padang bca');

  const parsed: ParsedTransaction | null = useMemo(() => {
    return parseTransactionText(inputText);
  }, [inputText]);

  return (
    <section id="demo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Playground</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Coba Mesin AI Fisc.io Secara Langsung
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Ketik kalimat pengeluaran dalam bahasa Indonesia sehari-hari. Algoritma NLP kami memproses nominal, kategori, dan jenis transaksi dalam 2 milidetik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Console (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <label htmlFor="nlp-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Input Sintaks Chat Telegram
            </label>
            <span className="text-[11px] font-mono text-emerald-400">Zero-Latency Client Parser</span>
          </div>

          <div className="mt-4 relative">
            <input
              id="nlp-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Contoh: "45k makan siang" atau "+5jt bonus"'
              className="w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3.5 pr-12 text-sm sm:text-base font-medium text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Send className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase text-slate-400 mb-2">Pilih contoh instan:</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXAMPLES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(preset)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                    inputText === preset
                      ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Telegram Simulation Preview */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/90 p-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Simulasi Respon Bot Telegram
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 font-bold text-xs">
                🤖
              </div>
              <div className="flex-1">
                {parsed ? (
                  <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-emerald-500/30 p-3 shadow-lg">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{parsed.type === 'INCOME' ? '🟢 Pemasukan Terdeteksi' : parsed.type === 'TRANSFER' ? '🔵 Transfer Terdeteksi' : '✅ Pengeluaran Tercatat'}</span>
                    </div>
                    <div className="mt-1 text-base font-black text-white font-mono">
                      {formatRupiah(parsed.amount)}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Deskripsi: <span className="font-semibold text-white">{parsed.description || 'Transaksi'}</span>
                    </p>
                    {parsed.categoryHint && (
                      <p className="text-[11px] text-emerald-400 mt-0.5">
                        Kategori: {parsed.categoryHint}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-white/10 p-3 text-xs text-slate-400">
                    Menunggu input teks keuangan...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Parsed Metadata Inspector (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                JSON Data Extraction
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold font-mono text-emerald-300">
                Score: {parsed ? Math.round(parsed.confidence * 100) : 0}%
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Type Badge */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-xs text-slate-400">Tipe Transaksi</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                    parsed?.type === 'INCOME'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : parsed?.type === 'TRANSFER'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {parsed?.type === 'INCOME' ? (
                    <>
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>PEMASUKAN</span>
                    </>
                  ) : parsed?.type === 'TRANSFER' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>TRANSFER</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>PENGELUARAN</span>
                    </>
                  )}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-xs text-slate-400">Nominal Bersih</span>
                <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                  {parsed ? formatRupiah(parsed.amount) : 'Rp 0'}
                </span>
              </div>

              {/* Category Hint */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-xs text-slate-400">Kategori AI</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono bg-white/10 px-2.5 py-1 rounded-lg">
                  {parsed?.categoryHint || 'LAINNYA'}
                </span>
              </div>

              {/* Clean Description */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Deskripsi Bersih</div>
                <div className="text-sm font-semibold text-white truncate">
                  {parsed?.description || '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Tanpa reload form</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              Ready for Supabase DB
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
