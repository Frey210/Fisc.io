// Run against npm run dev: playwright-cli run-code --filename=scripts/check-landing.cjs
async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000');
  await page.evaluate(() => document.fonts.ready);
  const canvas = page.locator('canvas');
  await canvas.waitFor();
  await page.getByRole('button', { name: 'Putar animasi', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Gaji masuk', exact: true }).click();
  assert(await page.getByRole('button', { name: 'Gaji masuk', exact: true }).getAttribute('aria-pressed') === 'true', 'Selected sample must be exposed to assistive technology');
  assert((await page.locator('.demo-result').innerText()).includes('Rp 8.500.000'), 'Income sample must update the amount');
  assert((await page.locator('.demo-result').innerText()).includes('Pemasukan'), 'Income sample must update transaction type');
  await page.getByRole('button', { name: 'Makan siang', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert((await page.locator('.demo-result').innerText()).includes('Rp 45.000'), 'Keyboard must select a sample');
  await page.getByRole('button', { name: 'Kopi sore', exact: true }).click();
  const pausedFrame = await canvas.screenshot();
  await page.waitForTimeout(350);
  assert(pausedFrame.equals(await canvas.screenshot()), 'Reduced motion must stop idle animation');
  await page.getByRole('button', { name: 'Pisahkan perangkat', exact: true }).click();
  assert(!pausedFrame.equals(await canvas.screenshot()), 'Explode control must visibly move devices');
  await page.getByRole('button', { name: 'Atur ulang sudut pandang', exact: true }).click();
  assert(await page.getByRole('button', { name: 'Pisahkan perangkat', exact: true }).getAttribute('aria-pressed') === 'false', 'Reset must reassemble devices');
  await page.getByRole('button', { name: 'Putar animasi', exact: true }).click();
  await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click();
  const stoppedFrame = await canvas.screenshot();
  await page.waitForTimeout(350);
  assert(stoppedFrame.equals(await canvas.screenshot()), 'Pause must stop idle animation');
  assert(await page.locator('.hero-intro .landing-button').getAttribute('href') === '/login', 'Account action must preserve login route');
  assert(!(await page.locator('meta[name="viewport"]').getAttribute('content')).includes('maximum-scale=1'), 'Page must allow pinch zoom');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page must not overflow at ${width}px`);
  }
  await page.getByRole('button', { name: 'Atur ulang sudut pandang', exact: true }).click();
  await page.screenshot({ path: '.impeccable/review/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/mobile.png', fullPage: true });
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`);
  const fallback = await page.context().newPage();
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return getContext.call(this, type, ...args);
    };
  });
  await fallback.goto('http://localhost:3000');
  await fallback.getByText('Pratinjau 3D tidak tersedia.', { exact: false }).waitFor();
  await fallback.getByRole('button', { name: 'Gaji masuk', exact: true }).click();
  assert((await fallback.locator('.demo-result').innerText()).includes('Rp 8.500.000'), 'Samples must work without WebGL');
  await fallback.close();
  return 'PASS: samples, keyboard, reduced motion, pause, explode/reset, account route, zoom, 4 widths, browser errors, WebGL fallback';
}
