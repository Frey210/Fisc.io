'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowRight, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.push('/dashboard');
        } else {
          setMessage({
            type: 'success',
            text: 'Akun berhasil dibuat! Silakan cek inbox email Anda untuk verifikasi atau langsung login.',
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Terjadi kesalahan otentikasi.';
      setMessage({ type: 'error', text: errMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Gagal login via Google';
      setMessage({ type: 'error', text: errMessage });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20">
            <Wallet className="h-6 w-6 text-slate-950" />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Fisc<span className="text-emerald-400">.io</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {isSignUp ? 'Daftar akun baru Fisc.io' : 'Masuk ke dashboard keuangan Anda'}
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div
            className={`rounded-xl border p-4 text-sm ${
              message.type === 'error'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleAuth}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-slate-950 transition hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50"
          >
            <span>{loading ? 'Memproses...' : isSignUp ? 'Buat Akun' : 'Masuk'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900/90 px-3 text-slate-500">atau</span>
          </div>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800/80"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
            />
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        {/* Toggle sign in / sign up */}
        <div className="text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
