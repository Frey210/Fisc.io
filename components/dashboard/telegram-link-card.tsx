'use client';

import { useState } from 'react';
import { Copy, Check, Smartphone, Key, ExternalLink } from 'lucide-react';

interface TelegramLinkCardProps {
  userId: string;
  isLinked: boolean;
  telegramChatId?: number | null;
}

export function TelegramLinkCard({ userId, isLinked, telegramChatId }: TelegramLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const linkCommand = `/link ${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Integrasi Telegram Bot</h3>
            <p className="text-xs text-slate-400">
              {isLinked ? 'Akun Anda sudah terhubung' : 'Hubungkan untuk logging via chat'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLinked ? (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              Terhubung (Chat ID: {telegramChatId})
            </span>
          ) : (
            <a
              href={`tg://resolve?domain=FiscioBot&start=${encodeURIComponent(userId)}`}
              onClick={(e) => {
                // If native protocol fails on desktop web, fallback to https link
                setTimeout(() => {
                  window.open(`https://t.me/FiscioBot?start=${encodeURIComponent(userId)}`, '_blank');
                }, 400);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition active:scale-95 hover:from-sky-300 hover:to-blue-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Hubungkan ke Telegram</span>
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
        <p className="text-xs text-slate-300">
          Atau salin perintah manual ini dan kirim ke bot <strong>@FiscioBot</strong>:
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-400">
          <span className="truncate">{linkCommand}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 transition hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
