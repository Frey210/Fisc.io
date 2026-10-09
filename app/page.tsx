'use client';

import './landing.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { PwaInstallButton } from '@/components/pwa-install-button';
import { HeroInteractiveSetup } from '@/components/hero-interactive-setup';
import { AsymmetricBentoGrid } from '@/components/asymmetric-bento-grid';
import { StaggeredSteps } from '@/components/staggered-steps';
import { TechnicalTrustSection } from '@/components/technical-trust';

export default function LandingPage() {
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setHasSession(!!data.session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setHasSession(!!session));
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const destination = hasSession ? '/dashboard' : '/login';
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Fisc.io', operatingSystem: 'All', applicationCategory: 'FinanceApplication',
    description: 'Catat keuangan melalui pesan dan foto struk di Telegram, lalu pantau arus kas melalui dashboard web.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' }, author: { '@type': 'Person', name: 'Fariz Achmad Faizal' },
  };
  return (
    <div className="landing">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip-link" href="#main">Lewati ke konten</a>
      <header className="landing-header page-width">
        <Link href="/" className="wordmark" aria-label="Fisc.io beranda"><img src="/logo.svg" alt="" width={32} height={32} /><span>Fisc.io</span></Link>
        <nav aria-label="Navigasi utama"><a href="#fitur">Kenali Fisc.io</a><a href="#cara-kerja">Cara mulai</a></nav>
        <Link href={destination} className="header-action">{hasSession ? 'Dashboard' : 'Masuk'}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </header>
      <main id="main">
        <section className="landing-hero page-width" aria-labelledby="hero-title">
          <h1 id="hero-title">Catat pengeluaran.<br /><span>Lanjutkan harimu.</span></h1>
          <div className="hero-composition">
            <div className="hero-intro">
              <p className="intro-lead">Semudah kirim chat.<br />Serapi yang kamu inginkan.</p>
              <p>Tinggalkan form manual. Kirim pesan atau foto struk ke Telegram, lalu lihat ke mana uangmu pergi lewat dashboard Fisc.io.</p>
              <Link href={destination} className="landing-button">{hasSession ? 'Buka dashboard' : 'Mulai sekarang — gratis'}<ArrowRight size={18} aria-hidden="true" /></Link>
              <a href="https://t.me/FiscioBot" target="_blank" rel="noopener noreferrer" className="bot-link"><Send size={16} aria-hidden="true" />Lihat demo bot<ArrowUpRight size={15} aria-hidden="true" /></a>
              <div className="intro-footnote"><span>Teks atau foto struk.<br />Satu tempat untuk semua catatan.</span><span className="intro-mark" aria-hidden="true">f.</span></div>
            </div>
            <HeroInteractiveSetup />
          </div>
        </section>
        <AsymmetricBentoGrid />
        <StaggeredSteps />
        <TechnicalTrustSection />
        <section className="closing-section">
          <div className="page-width closing-content"><h2>Uangmu punya cerita.<br />Mulai dengan satu catatan.</h2><div><p>Satu chat hari ini, gambaran yang lebih jelas untuk besok.</p><Link href={destination} className="landing-button">{hasSession ? 'Buka dashboard' : 'Buat akun gratis'}<ArrowRight size={18} aria-hidden="true" /></Link></div></div>
        </section>
      </main>
      <footer className="landing-footer page-width"><Link href="/" className="wordmark">Fisc.io</Link><p>© {new Date().getFullYear()} Fisc.io</p><PwaInstallButton /></footer>
    </div>
  );
}
