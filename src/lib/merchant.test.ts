import { describe, expect, it } from 'vitest'
import { validateCounter } from './negotiation'
import { canReject, nextStatus } from './orders'

describe('validateCounter', () => {
  it('accepts a counter above the customer price and at or above the minimum', () => expect(validateCounter(380, 300, 380)).toBeNull())
  it('rejects counters at or below the customer price', () => expect(validateCounter(300, 300, 250)).toMatch(/higher/))
  it('rejects counters below the minimum', () => expect(validateCounter(350, 300, 380)).toMatch(/minimum/))
})

describe('order status', () => {
  it('moves forward one step at a time and stops at completed', () => {
    expect(nextStatus('new')).toBe('accepted')
    expect(nextStatus('ready')).toBe('completed')
    expect(nextStatus('completed')).toBeNull()
    expect(nextStatus('rejected')).toBeNull()
  })
  it('only allows rejecting new orders', () => {
    expect(canReject('new')).toBe(true)
    expect(canReject('accepted')).toBe(false)
  })
})
