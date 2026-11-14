// Saveit smoke test: run `npx vite --port 5173 --strictPort` first, then `node scripts/e2e-smoke.cjs`.
const { chromium } = require('playwright');
const assert = require('node:assert');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [name, w, h, rm] of [['phone', 390, 844, false], ['desktop', 1280, 800, false], ['phone-reduced', 390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: rm ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
    await p.goto('http://localhost:5173/');
    const nav = p.getByRole('navigation', { name: 'Categories' });
    const btns = nav.getByRole('button');
    const n = await btns.count();
    assert.strictEqual(n, 6);
    for (const i of [1, 3, 2, 4, 0, 5, 1]) await btns.nth(i).click();
    await p.waitForTimeout(800);
    assert.strictEqual(await nav.locator('[aria-pressed="true"]').count(), 1);
    assert.strictEqual(await p.locator('article.card').count(), 1); // Biryani has one demo listing
    await btns.nth(0).click();
    await p.waitForTimeout(600);
    assert.ok((await p.locator('article.card').count()) >= 5);
    await p.locator('article.card .card-open').first().click();
    await p.waitForTimeout(500);
    assert.ok(await p.getByText(/Rs\s?\d+/).first().isVisible());
    await ctx.close();
  }
  const c = await b.newPage();
  await c.goto('http://localhost:5173/');
  await c.locator('header button').filter({ hasText: 'اردو' }).first().click();
  assert.strictEqual(await c.evaluate(() => document.documentElement.dir), 'rtl');
  assert.deepStrictEqual(errs, []);
  await b.close();
  console.log('smoke ok');
})().catch((e) => { console.error(e); process.exit(1); });
