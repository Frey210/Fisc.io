'use client';

import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, Expand, Pause, Play, RotateCcw } from 'lucide-react';

export const demoTransactions = [
  { label: 'Kopi sore', message: '25k kopi susu gopay', amount: 'Rp 25.000', category: 'Makanan & minuman', account: 'GoPay', type: 'Pengeluaran', bars: [0.4, 0.65, 0.5, 0.85, 0.6] },
  { label: 'Gaji masuk', message: '+8500000 gaji freelance', amount: 'Rp 8.500.000', category: 'Gaji', account: 'BCA', type: 'Pemasukan', bars: [0.4, 0.65, 0.5, 0.85, 1.2] },
  { label: 'Makan siang', message: '45k makan siang bca', amount: 'Rp 45.000', category: 'Makanan & minuman', account: 'BCA', type: 'Pengeluaran', bars: [0.4, 0.65, 0.5, 0.85, 0.8] },
] as const;

const Scene = dynamic(() => import('./canvas-3d-hero-scene').then(mod => mod.Canvas3DHeroScene), {
  ssr: false,
  loading: () => <div className="scene-placeholder" role="status">Menyiapkan meja keuangan Anda…</div>,
});

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div className="scene-placeholder">Pratinjau 3D tidak tersedia. Anda tetap dapat mencoba contoh transaksi di bawah.</div>
      : this.props.children;
  }
}

export function HeroInteractiveSetup() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [reset, setReset] = useState(0);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const transaction = demoTransactions[selected];

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    let intersecting = true;
    const updateVisibility = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; updateVisibility(); });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      preference.removeEventListener('change', update);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <div className="finance-desk" ref={stage}>
      <div className="desk-heading"><span>Chat kecil. Gambaran besar.</span><ArrowUpRight size={20} aria-hidden="true" /></div>
      <div className="desk-scene" aria-label="Model 3D ponsel Telegram dan dashboard keuangan. Geser untuk memutar, atau gunakan kontrol di bawah.">
        <SceneBoundary>
          <Scene selected={selected} expanded={expanded} paused={paused || reducedMotion || !visible} reset={reset} onSelect={() => setSelected(value => (value + 1) % demoTransactions.length)} />
        </SceneBoundary>
      </div>
      <div className="desk-tools">
        <span>Geser untuk menjelajah</span>
        <div>
          <button type="button" aria-label={expanded ? 'Satukan perangkat' : 'Pisahkan perangkat'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}><Expand size={17} /></button>
          <button type="button" aria-label="Atur ulang sudut pandang" onClick={() => { setReset(reset + 1); setExpanded(false); }}><RotateCcw size={17} /></button>
          <button type="button" aria-label={paused || reducedMotion ? 'Putar animasi' : 'Jeda animasi'} aria-pressed={paused || reducedMotion} onClick={() => { setReducedMotion(false); setPaused(!(paused || reducedMotion)); }}>{paused || reducedMotion ? <Play size={17} /> : <Pause size={17} />}</button>
        </div>
      </div>
      <div className="demo-console">
        <div className="demo-options" aria-label="Pilih contoh transaksi">
          {demoTransactions.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}
        </div>
        <div className="demo-result" aria-live="polite" aria-atomic="true">
          <div><p className="demo-message">“{transaction.message}”</p><p>{transaction.category} <span aria-hidden="true">/</span> {transaction.account}</p></div>
          <div className="demo-amount"><span>{transaction.type}</span><strong>{transaction.amount}</strong></div>
        </div>
        <p className="demo-note">Simulasi dengan data contoh. Tidak mencatat transaksi sungguhan.</p>
      </div>
    </div>
  );
}
