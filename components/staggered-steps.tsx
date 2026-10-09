const steps = [
  { title: 'Buat akun', description: 'Masuk dengan Google untuk menyiapkan dashboard keuanganmu.' },
  { title: 'Tautkan Telegram', description: 'Hubungkan akun Telegram melalui tombol di dashboard.' },
  { title: 'Kirim catatan pertama', description: 'Ketik pengeluaran atau kirim foto struk ke bot. Pantau hasilnya di dashboard.' },
];

export function StaggeredSteps() {
  return (
    <section id="cara-kerja" className="steps-section page-width" aria-labelledby="steps-title">
      <div className="section-opening"><h2 id="steps-title">Mulai dari kebiasaan<br />yang sudah kamu punya.</h2><p>Tidak perlu belajar cara baru untuk mencatat. Cukup buka Telegram.</p></div>
      <ol className="setup-steps">{steps.map((step, index) => <li key={step.title}><span className="step-index" aria-hidden="true">{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </section>
  );
}
