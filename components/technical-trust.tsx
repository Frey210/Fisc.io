import { LockKeyhole, Smartphone } from 'lucide-react';

export function TechnicalTrustSection() {
  return (
    <section className="trust-section page-width" aria-label="Akses dan penyimpanan">
      <div><LockKeyhole size={22} aria-hidden="true" /><p><strong>Catatan milikmu.</strong><span>Catatan keuangan ditampilkan hanya untuk akunmu.</span></p></div>
      <div><Smartphone size={22} aria-hidden="true" /><p><strong>Selalu mudah dijangkau.</strong><span>Buka di browser atau instal sebagai PWA di perangkatmu.</span></p></div>
    </section>
  );
}
