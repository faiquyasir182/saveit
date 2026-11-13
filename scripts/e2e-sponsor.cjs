const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(e.message));
  const out = process.argv[2];
  await p.goto(process.env.APP_URL || 'http://localhost:5173'); await p.waitForTimeout(600);
  await p.getByRole('button', { name: /Sponsor/ }).click();
  await p.fill('#amt', '20000'); console.log('over max:', await p.locator('.error').innerText());
  await p.fill('#amt', '3500');
  console.log('split:', (await p.locator('dl[aria-label="Where your money goes"]').innerText()).replace(/\n/g, ' | '));
  await p.screenshot({ path: out + '/7-sponsor.png', fullPage: true });
  await p.getByRole('button', { name: /Contribute/ }).click(); await p.waitForTimeout(900);
  console.log('after:', await p.locator('h1').innerText());
  await p.screenshot({ path: out + '/8-sponsor-receipt.png', fullPage: true });
  console.log('scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth), 'errors', errs);
  await b.close();
})();
