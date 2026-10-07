import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
        Fisc<span className="text-emerald-400">.io</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-400">
        Smart Omnichannel Cash Flow &amp; Wealth Analytics. Log via Telegram in seconds, track and analyze on web.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
