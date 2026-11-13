import { describe, expect, it } from 'vitest'
import { LISTINGS } from '../data/demo'
import { QuoteError, quoteOrder } from './pricing'

const biryani = LISTINGS[0] // Rs 320, delivery Rs 150, stock 6
const pickupOnly = LISTINGS[2]

describe('quoteOrder', () => {
  it('totals pickup orders without delivery', () => {
    expect(quoteOrder(biryani, 2, 'pickup')).toMatchObject({ foodSubtotal: 640, deliveryCharge: 0, total: 640, savings: 460 })
  })
  it('adds the branch delivery charge once', () => {
    expect(quoteOrder(biryani, 3, 'delivery').total).toBe(960 + 150)
  })
  it('rejects quantities above stock and below one', () => {
    expect(() => quoteOrder(biryani, 7, 'pickup')).toThrow(QuoteError)
    expect(() => quoteOrder(biryani, 0, 'pickup')).toThrow(QuoteError)
    expect(() => quoteOrder(biryani, 1.5, 'pickup')).toThrow(QuoteError)
  })
  it('rejects delivery from pickup-only branches', () => {
    expect(() => quoteOrder(pickupOnly, 1, 'delivery')).toThrow(/pickup only/)
  })
})
