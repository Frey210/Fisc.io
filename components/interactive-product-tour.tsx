'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LayoutDashboard, MessageSquareText, Smartphone, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface TourTab {
  id: string;
  badge: string;
  tabLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  imageSrc: string;
  features: string[];
  callouts: { label: string; desc: string }[];
}

const TABS: TourTab[] = [
  {
    id: 'dashboard',
    badge: 'Web App Next.js 14+',
    tabLabel: 'Web Analytics Dashboard',
    icon: LayoutDashboard,
    title: 'Visualisasi Arus Kas & Runway Finansial',
    description:
      'Lihat posisi kekayaan bersih (Net Worth), runway dana darurat, dan komposisi belanja bulanan Anda dalam satu dasbor analitik real-time.',
    imageSrc: '/screenshots/dashboard-preview.png',
    features: [
      'Multi-Wallet Sync (BCA, Mandiri, GoPay, Tunai)',
      'Perhitungan otomatis runway ketahanan dana hidup',
      'Grafik visual tren pemasukan vs pengeluaran',
      'Filter rentang tanggal kustom',
    ],
    callouts: [
      { label: 'Runway Calculator', desc: 'Estimasi bulan bertahan hidup' },
      { label: 'Category Pie Chart', desc: 'Breakdown pos anggaran F&B, tagihan, dll.' },
      { label: 'Recent Ledger', desc: 'Riwayat mutasi live terupdate' },
    ],
  },
  {
    id: 'telegram',
    badge: 'Telegram Bot + Tesseract OCR',
    tabLabel: 'Telegram Bot & Scanner OCR',
    icon: MessageSquareText,
    title: 'Pencatatan Semudah Mengetik Chat Teman',
    description:
      'Cukup ketik kalimat natural seperti "45k makan siang" atau foto struk belanjaan Indomaret/Alfamart. AI mengekstrak nominal dan pos kategori dalam hitungan detik.',
    imageSrc: '/screenshots/telegram-ocr-flow.png',
    features: [
      'Natural Language Parser berbahasa Indonesia',
      'OCR Scan struk struk kasir dan faktur digital',
      'Dukungan multi-akun (pilih dompet saat catat)',
      'Tanpa buka aplikasi berat saat di kasir',
    ],
    callouts: [
      { label: 'Instant Parsing', desc: 'Kenali "25k", "1.5jt", "gaji", dll.' },
      { label: 'Receipt Scanner', desc: 'Otomatis temukan total harga struk' },
      { label: 'Interactive Confirm', desc: 'Tombol inline konfirmasi akun' },
    ],
  },
  {
    id: 'mobile',
    badge: 'Progressive Web App (PWA)',
    tabLabel: 'Mobile PWA Experience',
    icon: Smartphone,
    title: 'Akses Kilat di Layar Utama Ponsel Anda',
    description:
      'Pasang langsung ke ponsel tanpa melalui Play Store atau App Store yang berat. Sangat ringan, hemat kuota, dan siap pakai setiap saat.',
    imageSrc: '/screenshots/mobile-pwa-analytics.png',
    features: [
      'Ukuran sangat ringan (< 1MB cache)',
      'Standalone fullscreen tanpa address bar browser',
      'Responsif 100% di iPhone & Android',
      'Notifikasi dan reload instan',
    ],
    callouts: [
      { label: 'Add to Home Screen', desc: 'Install 1-klik via browser' },
      { label: 'Responsive Touch', desc: 'Dioptimalkan untuk navigasi 1 tangan' },
      { label: 'OLED Dark Mode', desc: 'Irit baterai pada layar AMOLED' },
    ],
  },
];

export function InteractiveProductTour() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const current = TABS.find((t) => t.id === activeTab) || TABS[0];
  const Icon = current.icon;

  return (
    <section id="tour" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Product Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Dirancang Khusus untuk Alur Finansial Modern
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Kombinasi bot Telegram super cepat dan dasbor analitik web mendalam untuk kontrol penuh atas finansial pribadi Anda.
        </p>
      </div>

      {/* Modern Pill Tab Selector */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-1/4 -mt-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Highlight Features (5 cols) */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300 mb-4 self-start">
              <Icon className="h-3 w-3" />
              <span>{current.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {current.title}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {current.description}
            </p>

            {/* Checklist features */}
            <div className="mt-6 space-y-3">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{feat}</span>
                </div>
              ))}
            </div>

            {/* Callout metrics pills */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {current.callouts.map((co, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                  <div className="text-[11px] font-bold text-emerald-400 truncate">{co.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{co.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Showcase Mockup Screen (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-emerald-500/30 blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />

              {/* Browser/Window Shell */}
              <div className="relative rounded-2xl border border-white/15 bg-slate-950 overflow-hidden shadow-2xl">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-slate-950/80 px-3 py-1 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400">https://</span>
                    <span>fisc.io/{current.id}</span>
                  </div>
                  <div className="h-2 w-2" />
                </div>

                {/* Screenshot Display with Subtle Zoom on Hover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={current.imageSrc}
                    alt={current.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
