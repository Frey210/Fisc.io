'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Apakah data keuangan saya aman di Fisc.io?',
    a: 'Sangat aman. Seluruh data transaksi diisolasi menggunakan PostgreSQL Row Level Security (RLS) di Supabase. Kami tidak pernah menjual data belanja Anda kepada pihak ketiga atau platform periklanan pinjaman online.',
  },
  {
    q: 'Bagaimana cara menghubungkan Telegram bot ke akun saya?',
    a: 'Setelah masuk ke dashboard web Fisc.io, buka tab Integrasi Telegram. Klik tombol tautkan untuk mendapatkan kode unik satu kali, lalu kirimkan ke @FiscioBot. Akun Anda akan tersinkronisasi seketika.',
  },
  {
    q: 'Bagaimana jika saya mengirim foto struk belanjaan?',
    a: 'Cukup kirim foto struk kasir melalui Telegram bot. Mesin OCR Tesseract kami akan memindai teks struk, mencari baris total pembayaran secara cerdas, lalu menanyakan akun dompet mana yang ingin Anda potong.',
  },
  {
    q: 'Apakah Fisc.io tersedia untuk pengguna iPhone dan Android?',
    a: 'Ya! Fisc.io dibangun sebagai Progressive Web App (PWA). Cukup buka situs Fisc.io di Safari (iPhone) atau Chrome (Android), lalu pilih "Tambahkan ke Layar Utama". Anda mendapatkan pengalaman aplikasi native yang sangat ringan (< 1MB).',
  },
  {
    q: 'Apakah Fisc.io sepenuhnya gratis digunakan?',
    a: 'Ya, seluruh kapabilitas utama: Telegram Bot NLP, pemindai OCR struk, multi-wallet sync, dan dashboard web analitik runway dapat digunakan gratis.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4 backdrop-blur-md">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Pertanyaan Umum</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Kerap Ditanyakan (FAQ)
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Semua yang perlu Anda ketahui tentang kemudahan ekosistem Fisc.io.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-emerald-500/40 bg-slate-900/80 shadow-lg shadow-emerald-500/10'
                  : 'border-white/10 bg-slate-900/40 hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white transition focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal border-t border-white/5">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
