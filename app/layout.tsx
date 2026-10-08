import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fisc.io | Smart Omnichannel Cash Flow & Wealth Analytics',
  description: 'Dual-interface financial operations platform',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
