import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fisc.farlabs.my.id'),
  title: {
    default: 'Fisc.io | Smart Omnichannel Cash Flow & Wealth Analytics',
    template: '%s | Fisc.io',
  },
  description:
    'Catat keuangan harian dalam 3 detik via Telegram Bot (teks & OCR struk belanja), pantau net cash flow, savings rate, dan runway finansial di Web Dashboard PWA modern.',
  keywords: [
    'personal finance tracker',
    'catat keuangan telegram bot',
    'ocr struk belanja',
    'cash flow analytics',
    'financial runway',
    'wealth management',
    'pwa finance app',
    'fisc.io',
  ],
  authors: [{ name: 'Fariz Achmad Faizal', url: 'https://github.com/Frey210' }],
  creator: 'Fariz Achmad Faizal',
  publisher: 'Farlabs',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fisc.io — Smart Omnichannel Cash Flow & Wealth Analytics',
    description:
      'Zero-friction financial logging via Telegram bot (NLP & OCR Struk) dengan visual analitik modern di Web Dashboard PWA.',
    url: 'https://fisc.farlabs.my.id',
    siteName: 'Fisc.io',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Fisc.io Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Fisc.io — Smart Omnichannel Cash Flow & Wealth Analytics',
    description:
      'Logging keuangan instan lewat Telegram Bot + Web Dashboard PWA. Zero friction data entry.',
    images: ['/logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fisc.io',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  verification: {
    google: 'RubSXWWXhLYcQ7E4ZRMsqHBRClgbRoqguWwqbDfuTig',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
