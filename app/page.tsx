'use client';

import './landing.css';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { PwaInstallButton } from '@/components/pwa-install-button';
import { HeroInteractiveSetup } from '@/components/hero-interactive-setup';
import { AsymmetricBentoGrid } from '@/components/asymmetric-bento-grid';
import { LiveNlpSandbox } from '@/components/live-nlp-sandbox';
import { InteractiveProductTour } from '@/components/interactive-product-tour';
import { ComparisonSection } from '@/components/comparison-section';
import { StaggeredSteps } from '@/components/staggered-steps';
import { TechnicalTrustSection } from '@/components/technical-trust';
import { FaqSection } from '@/components/faq-section';
import { FloatingBackgroundAssets } from '@/components/floating-background-assets';
import { ArrowRight, Send, Sparkles } from 'lucide-react';

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating 3D Background Assets with Parallax */}
      <FloatingBackgroundAssets />

      {/* Top Header Navigation */}
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

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#fitur" className="hover:text-emerald-400 transition">Fitur</a>
            <a href="#demo" className="hover:text-emerald-400 transition">Coba NLP</a>
            <a href="#tour" className="hover:text-emerald-400 transition">Tour Produk</a>
            <a href="#komparasi" className="hover:text-emerald-400 transition">Komparasi</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </nav>

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

      {/* 1. HERO SECTION (Split Layout: Left Text, Right Floating Devices) */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 sm:pt-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 text-left">
            {/* Copy - Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>✨ Fisc.io 1.0 — Smart Wealth Tracker</span>
            </div>

            {/* Copy - Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Catat Pengeluaran Semudah Chatting.
            </h1>

            {/* Copy - Subhead */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              Tinggalkan form manual yang membosankan. Cukup kirim pesan atau foto struk ke Telegram, dan pantau arus kas Anda di dashboard web secara real-time.
            </p>

            {/* Copy - Buttons (Clean Dual CTA, No Video Intro) */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
              >
                <span>Mulai Sekarang — Gratis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://t.me/FiscioBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:border-slate-700 hover:bg-slate-800 active:scale-95 shadow-lg"
              >
                <Send className="h-4 w-4 text-sky-400" />
                <span>Lihat Demo Bot</span>
              </a>
            </div>

            <div className="mt-4 sm:hidden flex justify-start">
              <PwaInstallButton />
            </div>
          </div>

          {/* Right Column: Floating Devices with Soft Radial Glow */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroInteractiveSetup />
          </div>

        </div>
      </section>

      {/* 2. BENTO GRID FEATURES SECTION */}
      <div id="fitur">
        <AsymmetricBentoGrid />
      </div>

      {/* 3. INTERACTIVE NLP PLAYGROUND */}
      <LiveNlpSandbox />

      {/* 4. PRODUCT TOUR & SCREENSHOT SHOWCASE */}
      <InteractiveProductTour />

      {/* 5. COMPARISON MATRIX */}
      <ComparisonSection />

      {/* 6. HOW IT WORKS (STAGGERED SCROLL REVEAL) */}
      <StaggeredSteps />

      {/* 7. TRUST & PERFORMANCE METRICS BANNER */}
      <TechnicalTrustSection />

      {/* 8. FAQ ACCORDION */}
      <FaqSection />

      {/* 9. FINAL HIGH CONVERTING CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-950/50 p-8 sm:p-14 text-center shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-44 w-44 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-5 backdrop-blur-md">
            <span>✨ 100% Bebas Biaya Langganan</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Kendalikan Penuh Arus Kas Anda Hari Ini.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Mulai pelacakan finansial tanpa beban. Cukup hubungkan Telegram Anda dan nikmati pencatatan secepat pesan obrolan.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/30 transition hover:from-emerald-300 hover:to-teal-300 active:scale-95"
            >
              <span>Buat Akun Gratis Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://t.me/FiscioBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Send className="h-4 w-4 text-sky-400" />
              <span>Buka @FiscioBot</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Fisc.io" className="h-5 w-5" />
            <span className="font-bold text-white">Fisc.io</span>
            <span>— Smart Wealth Tracker</span>
          </div>
          <p>© {new Date().getFullYear()} Fisc.io. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
