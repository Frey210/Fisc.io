'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { PwaInstallButton } from '@/components/pwa-install-button';
import {
  ArrowRight,
  Send,
  Camera,
  LineChart,
  ShieldCheck,
  Zap,
  Wallet,
  Sparkles,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Receipt,
  Layers,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }
    }
    checkAuth();
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fisc.io',
    operatingSystem: 'All',
    applicationCategory: 'FinanceApplication',
    description:
      'Omnichannel personal financial operations platform combining Telegram bot ingestion (NLP & OCR) with a modern Next.js PWA web analytics dashboard.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    author: {
      '@type': 'Person',
      name: 'Fariz Achmad Faizal',
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 to-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[600px] -left-40 -z-10 h-[500px] w-[600px] rounded-full bg-gradient-to-tr from-teal-500/10 to-indigo-500/5 blur-[120px]" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-emerald-500/20">
              <img src="/logo.svg" alt="Fisc.io Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Fisc<span className="text-emerald-400">.io</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <PwaInstallButton />
            </div>

            {hasSession ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
              >
                <span>Masuk / Daftar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-28">
        {/* Release Tag Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Fisc.io 1.0 — Omnichannel Wealth Operations</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
          Kelola Arus Kas &amp; Kekayaan Tanpa{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Rasa Malas.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed font-normal">
          Pencatatan pengeluaran konvensional itu melelahkan. Dengan Fisc.io, cukup kirim pesan
          singkat atau foto struk di <strong>Telegram</strong> dalam 3 detik. Pantau <em>net cash flow</em>,{' '}
          <em>runway</em>, dan <em>savings rate</em> di <strong>Web PWA</strong> kapan saja.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
          >
            <span>Mulai Sekarang — Gratis</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://t.me/FiscioBot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:border-slate-700 hover:bg-slate-800"
          >
            <Send className="h-4 w-4 text-sky-400" />
            <span>Coba Bot Telegram</span>
          </a>
        </div>

        {/* Mobile PWA Install CTA */}
        <div className="mt-4 sm:hidden flex justify-center">
          <PwaInstallButton />
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-14 relative rounded-2xl border border-white/10 bg-slate-900/60 p-2 sm:p-4 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 text-[11px] text-slate-500 font-mono">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400">fisc.farlabs.my.id/dashboard</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 sm:p-5 text-left">
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Cash Flow</span>
              <p className="mt-1 text-base sm:text-xl font-black text-emerald-400">+Rp 8.450.000</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Savings Rate</span>
              <p className="mt-1 text-base sm:text-xl font-black text-cyan-400">38.5%</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Financial Runway</span>
              <p className="mt-1 text-base sm:text-xl font-black text-amber-400">7.2 Bulan</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Balance</span>
              <p className="mt-1 text-base sm:text-xl font-black text-white">Rp 45.200.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES (BENTO GRID) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Arsitektur Dua Antarmuka
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            Solusi Mengapa Tracker Keuangan Lain Gagal
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Aplikasi lain mengharuskan Anda membuka aplikasi, menunggu loading, dan mengisi 6 field formulir. Fisc.io memangkasnya menjadi 1 pesan chat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Telegram NLP Ingestion */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 mb-5">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Input Natural Language Telegram</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ketik sealami mungkin: <code>45000 nasi padang bca</code> atau <code>kopi 25k</code>. AI Regex mengenali nominal, jenis mutasi, dan memotong saldo rekening otomatis.
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-emerald-400">
              💬 &quot;50k sate kambing bca&quot; ➔ Terpotong di Saldo BCA
            </div>
          </div>

          {/* Card 2: Vision OCR Receipt Scanner */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-5">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">OCR Scanner Struk Belanja</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Makan di restoran atau belanja bulanan di minimarket? Cukup potret struk kasir ke bot. OCR engine mengekstrak total bayar dan nama merchant seketika.
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-cyan-400">
              🧾 Foto Struk ➔ Total Rp 87.500 (Indomaret Point)
            </div>
          </div>

          {/* Card 3: Deep Wealth Analytics */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-5">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Visualisasi &amp; Runway Finansial</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Bukan sekadar tabel angka. Ketahui berapa bulan Anda bisa bertahan hidup tanpa pendapatan (Runway), rasio tabungan, dan intensitas hari boros dalam sepekan.
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-amber-400">
              📊 Financial Runway: 7.2 Bulan Bertahan
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white">Cara Memulai dalam 1 Menit</h2>
          <p className="mt-1 text-xs text-slate-400">Setup instan tanpa verifikasi rumit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-400 mb-4">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Buat Akun Web</h4>
            <p className="mt-1 text-xs text-slate-400">
              Daftar menggunakan Google OAuth atau Email dalam hitungan detik.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-400 mb-4">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Tautkan Telegram Bot</h4>
            <p className="mt-1 text-xs text-slate-400">
              Klik 1 tombol di Settings untuk menghubungkan Telegram ke ID akun Anda.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-400 mb-4">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Kirim Pesan Kapan Saja</h4>
            <p className="mt-1 text-xs text-slate-400">
              Catat pengeluaran di mana saja via Telegram, pantau analitik di dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-950/40 p-8 sm:p-12 text-center shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Siap Mengambil Kendali Penuh atas Finansial Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-400">
            Gratis, tanpa biaya berlangganan. Data Anda dilindungi dengan Row Level Security Supabase.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
            >
              <span>Mulai Sekarang Gratis</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Fisc.io by Fariz Achmad Faizal. Seluruh hak cipta dilindungi.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Built with Next.js 16, Supabase, Telegram Bot API, &amp; Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
