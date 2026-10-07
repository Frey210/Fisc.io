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
      <div className="flex items-center justify-between">
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

        {isLinked ? (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            Terhubung (Chat ID: {telegramChatId})
          </span>
        ) : (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
            Belum Terhubung
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
        <p className="text-xs text-slate-300">
          Kirim perintah ini ke bot Telegram Anda untuk menghubungkan akun:
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
