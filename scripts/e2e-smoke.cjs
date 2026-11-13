// Journey: discover (search, category, filters, favourites) → details → checkout → order placed.
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const URL = process.env.APP_URL || 'http://localhost:5173'

;(async () => {
  const out = process.argv[2] || './screenshots'
  const b = await chromium.launch()
  const errs = []
  for (const [name, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 800 }]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 })
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    p.on('pageerror', (e) => errs.push(e.message))
    await p.goto(URL)
    await p.locator('.card').first().waitFor()
    await p.screenshot({ path: `${out}/${name}-1-home.png` })

    // search + category
    await p.getByRole('searchbox').fill('clifton')
    assert.equal(await p.locator('.card').count(), 1)
    await p.getByRole('searchbox').fill('')
    await p.getByRole('navigation', { name: 'Categories' }).getByRole('button', { name: 'Bakery' }).click()
    assert.equal(await p.locator('.card').count(), 1)
    await p.getByRole('button', { name: 'See all' }).click()
    assert.equal(await p.locator('.card').count(), 5)

    // drawer: area filter, focus handling, escape
    await p.getByRole('button', { name: /^Filters/ }).click()
    await p.getByRole('dialog').getByRole('button', { name: 'Clifton' }).click()
    await p.getByRole('button', { name: 'Show results' }).click()
    assert.equal(await p.locator('.card').count(), 1)
    assert.match(await p.getByRole('button', { name: /^Filters/ }).getAttribute('aria-label'), /\(1\)/)
    await p.getByRole('button', { name: /^Filters/ }).click()
    await p.keyboard.press('Escape')
    assert.equal(await p.getByRole('dialog').count(), 0)
    await p.getByRole('button', { name: 'See all' }).click()

    // favourites
    await p.getByRole('button', { name: /^Save Chicken biryani/ }).click()
    assert.equal(await p.getByRole('button', { name: /^Remove Chicken biryani/ }).getAttribute('aria-pressed'), 'true')
    await p.getByRole('button', { name: 'Saved', exact: true }).click()
    assert.equal(await p.locator('.card').count(), 1)
    await p.getByRole('button', { name: 'Home' }).click()

    // detail → checkout
    await p.getByRole('button', { name: /^Chicken biryani/ }).first().click()
    await p.getByLabel('Increase quantity').click()
    await p.getByRole('button', { name: /Restaurant delivery/ }).click()
    assert.match(await p.locator('.cta-bar .btn').innerText(), /Rs 790/)
    await p.screenshot({ path: `${out}/${name}-2-detail.png` })
    await p.locator('.cta-bar .btn').click()
    await p.getByRole('button', { name: /Place order/ }).click()
    assert.equal(await p.locator('.error').count(), 2)
    await p.fill('#phone', '0300 1234567'); await p.fill('#addr', 'House 12, Street 4, Block 13-D')
    await p.screenshot({ path: `${out}/${name}-3-checkout.png`, fullPage: true })
    await p.getByRole('button', { name: /Place order/ }).click()
    await p.getByRole('heading', { name: 'Order placed' }).waitFor()
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), vp.width, 'horizontal overflow')
    await p.close()
  }

  // sold-out detail and network-error state
  const p = await b.newPage({ viewport: { width: 390, height: 844 } })
  p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(URL); await p.locator('.card').first().waitFor()
  await p.getByRole('button', { name: /Dessert surprise box.*sold out/i }).click()
  assert.equal(await p.locator('.cta-bar .btn').isDisabled(), true)
  await p.goto(URL + '#simulate-error'); await p.reload()
  await p.getByRole('alert').waitFor()
  await p.getByRole('button', { name: 'Try again' }).click()
  await p.locator('.card').first().waitFor()
  assert.deepEqual(errs, [], 'console errors')
  console.log('smoke ok')
  await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
