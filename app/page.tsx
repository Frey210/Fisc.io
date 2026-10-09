'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { PwaInstallButton } from '@/components/pwa-install-button';
import { HeroInteractiveSetup } from '@/components/hero-interactive-setup';
import { AsymmetricBentoGrid } from '@/components/asymmetric-bento-grid';
import { StaggeredSteps } from '@/components/staggered-steps';
import { TechnicalTrustSection } from '@/components/technical-trust';
import { FloatingBackgroundAssets } from '@/components/floating-background-assets';
import {
  ArrowRight,
  Send,
  Sparkles,
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

      {/* Parallax Floating 3D Background Assets */}
      <FloatingBackgroundAssets />

      {/* Spatial Radial Background Blurs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute top-[700px] -left-40 -z-10 h-[500px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-indigo-500/5 blur-[120px]" />

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

      {/* INTERACTIVE HERO SECTION */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8 sm:pt-24 sm:pb-28">
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
          Pencatatan konvensional membuang waktu. Kirim pesan instan atau foto struk di <strong>Telegram</strong> dalam 3 detik.
          Pantau <em>net cash flow</em>, <em>runway</em>, dan <em>savings rate</em> di <strong>Web PWA</strong> real-time.
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

        {/* Mobile PWA Install Button */}
        <div className="mt-4 sm:hidden flex justify-center">
          <PwaInstallButton />
        </div>

        {/* Interactive 3D Device Ecosystem Mockup */}
        <HeroInteractiveSetup />
      </section>

      {/* APPLE-STYLE ASYMMETRIC BENTO GRID */}
      <AsymmetricBentoGrid />

      {/* STAGGERED SCROLL-REVEAL STEPS */}
      <StaggeredSteps />

      {/* TECHNICAL TRUST SECTION */}
      <TechnicalTrustSection />

      {/* FINAL BOTTOM CTA */}
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
