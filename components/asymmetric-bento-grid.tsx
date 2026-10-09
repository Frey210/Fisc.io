import { ArrowUpRight, Check } from 'lucide-react';

export function AsymmetricBentoGrid() {
  return (
    <section id="fitur" className="features-section page-width" aria-labelledby="features-title">
      <div className="section-opening"><h2 id="features-title">Dari percakapan,<br />jadi pemahaman.</h2><p>Catatan kecil sehari-hari membentuk gambaran keuanganmu. Fisc.io membantu menyatukannya.</p></div>
      <div className="feature-spread">
        <div className="receipt-feature"><div><h3>Struk belanja?<br />Kirim fotonya saja.</h3><p>OCR membaca total belanja dari foto struk. Tak perlu mengetik ulang setiap nominal.</p><span className="feature-format">Foto struk → catatan transaksi<ArrowUpRight size={18} aria-hidden="true" /></span></div><div className="paper-receipt" aria-label="Contoh struk belanja"><p>KOPI SORE</p><span>Contoh struk</span><dl><div><dt>Kopi susu</dt><dd>25.000</dd></div><div><dt>Roti cokelat</dt><dd>14.000</dd></div></dl><div className="receipt-total"><span>Total</span><strong>Rp 39.000</strong></div><div className="receipt-confirm"><Check size={16} aria-hidden="true" />Siap dicatat</div></div></div>
        <div className="insight-feature"><h3>Bukan sekadar<br />daftar pengeluaran.</h3><p>Pantau arus kas, savings rate, dan runway keuangan. Kenali kebiasaan belanjamu dari catatan yang sudah terkumpul.</p><dl className="insight-list"><div><dt>Arus kas</dt><dd>Pemasukan & pengeluaran</dd></div><div><dt>Savings rate</dt><dd>Porsi yang kamu simpan</dd></div><div><dt>Runway</dt><dd>Perkiraan ketahanan dana</dd></div></dl><p className="feature-small">Rekening bank, e-wallet, dan investasi dalam satu dashboard.</p></div>
      </div>
    </section>
  );
}
