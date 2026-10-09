'use client';

import { useState, useEffect } from 'react';
import { Download, CheckCircle2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 1. Check if app is already running in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // 2. Capture Chrome/Edge beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // If browser supports native beforeinstallprompt, trigger it directly!
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
      return;
    }

    // If deferredPrompt is not yet triggered (or iOS Safari), show modern tailored dialog instead of ugly window.alert
    setShowModal(true);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>Aplikasi Terinstall (PWA)</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:border-emerald-500/40 hover:bg-slate-800 active:scale-95"
      >
        <Download className="h-4 w-4 text-emerald-400" />
        <span>Install Aplikasi (PWA)</span>
      </button>

      {/* Modern In-App Guided Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Install Fisc.io</h3>
                <p className="text-xs text-slate-400">Jadikan aplikasi native di ponsel</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="rounded-2xl border border-white/5 bg-slate-950 p-3.5">
                <p className="font-bold text-emerald-400 mb-1">Di Google Chrome / Android:</p>
                <p className="text-slate-400 leading-relaxed">
                  Klik menu titik tiga <strong>(⋮)</strong> di pojok kanan atas browser, lalu pilih{' '}
                  <strong className="text-white">&quot;Install app&quot;</strong> atau{' '}
                  <strong className="text-white">&quot;Tambahkan ke Layar Utama&quot;</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-950 p-3.5">
                <p className="font-bold text-sky-400 mb-1">Di Safari / iPhone (iOS):</p>
                <p className="text-slate-400 leading-relaxed">
                  Klik tombol <strong>Bagikan (Share)</strong> di bilah bawah browser, lalu pilih{' '}
                  <strong className="text-white">&quot;Tambah ke Layar Utama&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:from-emerald-300 hover:to-teal-300"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
