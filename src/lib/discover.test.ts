import { describe, expect, it } from 'vitest'
import { LISTINGS } from '../data/demo'
import { DEFAULT_FILTERS, discountPercent, drawerFilterCount, filterListings } from './discover'

const f = (patch: Partial<typeof DEFAULT_FILTERS>) => ({ ...DEFAULT_FILTERS, ...patch })

describe('filterListings', () => {
  it('searches title, merchant and neighbourhood case-insensitively', () => {
    expect(filterListings(LISTINGS, f({ query: 'BIRYANI' })).map((l) => l.id)).toEqual(['l1'])
    expect(filterListings(LISTINGS, f({ query: 'boat' }))).toHaveLength(0) // branch name is not searched
    expect(filterListings(LISTINGS, f({ query: 'clifton' })).map((l) => l.id)).toEqual(['l3'])
    expect(filterListings(LISTINGS, f({ query: 'demo bakers' })).map((l) => l.id)).toEqual(['l2'])
  })
  it('combines category and area', () => {
    expect(filterListings(LISTINGS, f({ category: 'bbq', area: 'Clifton' }))).toHaveLength(1)
    expect(filterListings(LISTINGS, f({ category: 'bbq', area: 'DHA' }))).toHaveLength(0)
  })
  it('puts sold-out items last, or hides them', () => {
    const all = filterListings(LISTINGS, DEFAULT_FILTERS)
    expect(all[all.length - 1].stock).toBe(0)
    expect(filterListings(LISTINGS, f({ inStockOnly: true })).every((l) => l.stock > 0)).toBe(true)
  })
  it('sorts by price', () => {
    const prices = filterListings(LISTINGS, f({ sort: 'price-asc', inStockOnly: true })).map((l) => l.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })
})

describe('helpers', () => {
  it('rounds the discount percentage', () => expect(discountPercent({ price: 320, originalPrice: 550 })).toBe(42))
  it('counts only drawer filters', () => expect(drawerFilterCount(f({ query: 'x', category: 'bbq', area: 'DHA', inStockOnly: true }))).toBe(2))
})
