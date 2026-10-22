'use client';

import React from 'react';
import { Check, X, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  sub: string;
  traditional: string;
  hasTraditional: boolean;
  fiscio: string;
  hasFiscio: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Kecepatan Input Catatan',
    sub: 'Waktu yang dibutuhkan di kasir / restoran',
    traditional: 'Buka app > Form input > Pilih pos > Simpan (30-45 detik)',
    hasTraditional: false,
    fiscio: 'Ketik "45k makan" di Telegram atau kirim foto struk (2-3 detik)',
    hasFiscio: true,
  },
  {
    feature: 'OCR Smart Scanner Struk',
    sub: 'Ekstraksi otomatis struk belanja kertas',
    traditional: 'Berbayar / Dibatasi di paket langganan premium mahal',
    hasTraditional: false,
    fiscio: 'Bawaan gratis langsung via Telegram Bot',
    hasFiscio: true,
  },
  {
    feature: 'Financial Runway Tracker',
    sub: 'Prediksi ketahanan dana hidup masa depan',
    traditional: 'Tidak ada, hanya laporan pasif masa lalu',
    hasTraditional: false,
    fiscio: 'Prediksi akurat bulan bertahan hidup berbasis rata-rata burn-rate',
    hasFiscio: true,
  },
  {
    feature: 'Multi-Wallet & Aggregation',
    sub: 'Pantau bank, e-wallet, dan uang fisik',
    traditional: 'Terbatas atau kaku dalam pengelompokan',
    hasTraditional: false,
    fiscio: 'Agregasi fleksibel (BCA, GoPay, Tunai, Portofolio Investasi)',
    hasFiscio: true,
  },
  {
    feature: 'Beban Memori & Pemasangan',
    sub: 'Kebutuhan storage dan download toko aplikasi',
    traditional: 'File APK/IPA berat 80MB - 180MB, boros memori ponsel',
    hasTraditional: false,
    fiscio: 'PWA ringan (< 1MB) + Bot Telegram resmi',
    hasFiscio: true,
  },
  {
    feature: 'Keamanan & Isolasi Data',
    sub: 'Row Level Security & enkripsi database',
    traditional: 'Sering dimonetisasi untuk penawaran pinjaman / iklan',
    hasTraditional: false,
    fiscio: 'Supabase PostgreSQL RLS, data terisolasi untuk Anda sendiri',
    hasFiscio: true,
  },
];

export function ComparisonSection() {
  return (
    <section id="komparasi" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4 backdrop-blur-md">
          <Zap className="h-3.5 w-3.5" />
          <span>Mengapa Fisc.io Berbeda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Cara Konvensional vs Standar Fisc.io
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Dirancang dari nol untuk menghilangkan friksi mencatat yang membuat 90% orang berhenti melacak keuangan mereka.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/70">
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/3">
                  Fitur & Kapabilitas
                </th>
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/3">
                  Aplikasi Finansial Biasa
                </th>
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-emerald-400 w-1/3 bg-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Fisc.io Next-Gen</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition hover:bg-white/[0.02]"
                >
                  <td className="py-4 px-6 align-top">
                    <div className="font-bold text-white text-sm sm:text-base">{row.feature}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{row.sub}</div>
                  </td>

                  <td className="py-4 px-6 align-top text-slate-400">
                    <div className="flex items-start gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mt-0.5">
                        <X className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-relaxed">{row.traditional}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 align-top text-white font-medium bg-emerald-500/[0.04]">
                    <div className="flex items-start gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shadow-sm shadow-emerald-500/20">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-emerald-100 font-semibold leading-relaxed">
                        {row.fiscio}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
