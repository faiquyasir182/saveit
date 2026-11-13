import { describe, expect, it } from 'vitest'
import { RESPONDERS } from '../data/demo'
import { type MealRequest, OFFER_TTL_MS, RequestError, respond, selectOffer } from './negotiation'

const now = Date.UTC(2026, 10, 13, 14, 0) // 7 pm Karachi
const base: MealRequest = { category: 'biryani', portion: 'single', quantity: 2, neighbourhood: 'Clifton', fulfilment: 'pickup', neededBy: new Date(now + 3600_000).toISOString(), proposedUnit: 300 }

describe('respond', () => {
  it('only eligible merchants respond, with accept, counter and decline', () => {
    const offers = respond(base, RESPONDERS, now)
    expect(offers).toHaveLength(3)
    const byBranch = Object.fromEntries(offers.map((o) => [o.branch.id, o]))
    expect(byBranch.b1).toMatchObject({ kind: 'accept', unitPrice: 300, total: 600 })
    expect(byBranch.b3).toMatchObject({ kind: 'counter', unitPrice: 380, total: 760 })
    expect(byBranch.b5).toMatchObject({ kind: 'accept', unitPrice: 300 })
  })
  it('never counters below the merchant minimum and declines very low prices', () => {
    const offers = respond({ ...base, proposedUnit: 200 }, RESPONDERS, now)
    for (const o of offers.filter((x) => x.kind === 'counter')) expect(o.unitPrice).toBeGreaterThan(200)
    expect(offers.find((o) => o.branch.id === 'b3')?.declineReason).toBe('Price too low')
  })
  it('declines delivery from pickup-only branches and adds delivery charge once', () => {
    const offers = respond({ ...base, fulfilment: 'delivery' }, RESPONDERS, now)
    expect(offers.find((o) => o.branch.id === 'b3')?.declineReason).toBe('Pickup only')
    expect(offers.find((o) => o.branch.id === 'b1')?.total).toBe(600 + 150)
  })
  it('declines when food cannot be ready in time', () => {
    const offers = respond({ ...base, neededBy: new Date(now + 22 * 60_000).toISOString() }, RESPONDERS, now)
    expect(offers.find((o) => o.branch.id === 'b1')?.declineReason).toMatch(/in time/)
  })
  it('rejects invalid requests', () => {
    expect(() => respond({ ...base, quantity: 0 }, RESPONDERS, now)).toThrow(RequestError)
    expect(() => respond({ ...base, neededBy: new Date(now - 1).toISOString() }, RESPONDERS, now)).toThrow(RequestError)
  })
})

describe('selectOffer', () => {
  const offers = respond(base, RESPONDERS, now)
  const counter = offers.find((o) => o.kind === 'counter')!
  it('selects a live offer', () => expect(selectOffer(offers, counter.id, now).id).toBe(counter.id))
  it('refuses expired offers', () => expect(() => selectOffer(offers, counter.id, now + OFFER_TTL_MS.counter)).toThrow(/expired/))
  it('refuses declined offers', () => {
    const d = respond({ ...base, proposedUnit: 200 }, RESPONDERS, now).find((o) => o.kind === 'decline')!
    expect(() => selectOffer([d], d.id, now)).toThrow(/declined/)
  })
})
