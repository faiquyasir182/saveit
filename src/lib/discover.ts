import type { Listing } from '../data/types'

export type Sort = 'ending' | 'price-asc' | 'price-desc' | 'saving'

export interface Filters {
  query: string
  category: string
  area: string | null
  sort: Sort
  inStockOnly: boolean
}

export const DEFAULT_FILTERS: Filters = { query: '', category: 'all', area: null, sort: 'ending', inStockOnly: false }

export const discountPercent = (l: Pick<Listing, 'price' | 'originalPrice'>): number =>
  Math.round(((l.originalPrice - l.price) / l.originalPrice) * 100)

/** Filters that live in the drawer (search text and category sit on the page itself). */
export const drawerFilterCount = (f: Filters): number =>
  Number(f.area !== null) + Number(f.sort !== DEFAULT_FILTERS.sort) + Number(f.inStockOnly)

const SORTERS: Record<Sort, (a: Listing, b: Listing) => number> = {
  ending: (a, b) => Date.parse(a.branch.pickupEnd) - Date.parse(b.branch.pickupEnd),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  saving: (a, b) => discountPercent(b) - discountPercent(a),
}

export function filterListings(all: Listing[], f: Filters): Listing[] {
  const q = f.query.trim().toLowerCase()
  return all
    .filter((l) => (f.category === 'all' || l.category === f.category)
      && (!f.area || l.branch.neighbourhood === f.area)
      && (!f.inStockOnly || l.stock > 0)
      && (!q || [l.title, l.category, l.branch.merchantName, l.branch.neighbourhood].some((x) => x.toLowerCase().includes(q))))
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || SORTERS[f.sort](a, b))
}
