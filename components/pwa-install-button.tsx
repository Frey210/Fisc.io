'use client';

import { useState, useEffect } from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (PWA installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Guide for iOS Safari or browsers without beforeinstallprompt
      alert(
        'Untuk install di ponsel / desktop:\n\n• Android/Chrome: Klik menu titik tiga (⋮) > "Install app" atau "Tambahkan ke Layar Utama".\n• iPhone/Safari: Klik tombol Bagikan (Share) > "Tambah ke Layar Utama" (Add to Home Screen).'
      );
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
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
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:border-emerald-500/40 hover:bg-slate-800 active:scale-95"
    >
      <Download className="h-4 w-4 text-emerald-400" />
      <span>Install Aplikasi (PWA)</span>
    </button>
  );
}
