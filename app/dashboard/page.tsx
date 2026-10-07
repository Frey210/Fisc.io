export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">Cash Flow, Savings Rate &amp; Financial Runway Overview</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Net Cash Flow</p>
          <p className="mt-2 text-2xl font-bold text-white">--</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Savings Rate</p>
          <p className="mt-2 text-2xl font-bold text-white">--</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Financial Runway</p>
          <p className="mt-2 text-2xl font-bold text-white">--</p>
        </div>
      </div>
    </div>
  );
}
