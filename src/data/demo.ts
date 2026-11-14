/**
 * DEMONSTRATION DATA ONLY. Merchants, prices and stock are synthetic and
 * exist to exercise the Phase 1 prototype. Nothing here is a real offer.
 */
import type { Branch, Listing } from './types'

export const NEIGHBOURHOODS = ['DHA', 'Clifton', 'Gulistan-e-Johar', 'Gulshan-e-Iqbal', 'Nazimabad'] as const

/** Karachi is UTC+5 with no DST: build today's local hour as a UTC ISO string. */
function karachiToday(hour: number, minute = 0): string {
  const now = new Date(Date.now() + 5 * 3600_000)
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour - 5, minute))
  return d.toISOString()
}

const branch = (b: Omit<Branch, 'pickupStart' | 'pickupEnd'>, from: number, to: number): Branch => ({
  ...b,
  pickupStart: karachiToday(from),
  pickupEnd: karachiToday(to),
})

const b1 = branch({ id: 'b1', merchantName: 'Demo Biryani House', branchName: 'Tariq Road', neighbourhood: 'Gulshan-e-Iqbal', deliveryCharge: 150 }, 21, 23)
const b2 = branch({ id: 'b2', merchantName: 'Demo Bakers', branchName: 'Khayaban-e-Ittehad', neighbourhood: 'DHA', deliveryCharge: 200 }, 20, 22)
const b3 = branch({ id: 'b3', merchantName: 'Demo Seekh Corner', branchName: 'Boat Basin', neighbourhood: 'Clifton', deliveryCharge: null }, 22, 24)
const b4 = branch({ id: 'b4', merchantName: 'Demo Sweet Studio', branchName: 'Block 13', neighbourhood: 'Gulistan-e-Johar', deliveryCharge: 120 }, 19, 21)
const b5 = branch({ id: 'b5', merchantName: 'Demo Chai Café', branchName: 'Block H', neighbourhood: 'Nazimabad', deliveryCharge: 100 }, 18, 20)

export const LISTINGS: Listing[] = [
  { id: 'l1', kind: 'exact', title: 'Chicken biryani, full plate', category: 'biryani', contents: 'Chicken biryani with raita and salad.', portion: '1 plate, about 450 g, serves 1', price: 320, originalPrice: 550, stock: 6, allergens: 'Dairy (raita). Ask the restaurant about other allergens.', branch: b1 },
  { id: 'l2', kind: 'surprise', title: 'Bakery surprise bag', category: 'bakery', contents: 'A mix of today’s unsold breads, buns and pastries. Items vary by day.', portion: 'At least 5 items', minimumValue: 900, price: 400, originalPrice: 900, stock: 3, allergens: 'Wheat, eggs, dairy, may contain nuts.', branch: b2 },
  { id: 'l3', kind: 'exact', title: 'Seekh kebab platter', category: 'bbq', contents: '6 beef seekh kebabs, 2 naan, chutney.', portion: 'Serves 2', price: 650, originalPrice: 1100, stock: 2, allergens: 'Wheat (naan).', branch: b3 },
  { id: 'l4', kind: 'surprise', title: 'Dessert surprise box', category: 'dessert', contents: 'Slices of today’s cakes and pastries. Flavours vary.', portion: 'At least 3 slices', minimumValue: 1200, price: 500, originalPrice: 1200, stock: 0, allergens: 'Wheat, eggs, dairy, nuts.', branch: b4 },
  { id: 'l5', kind: 'exact', title: 'Bun kebab and chai', category: 'cafe', contents: '2 bun kebabs and 1 doodh patti.', portion: 'Serves 1', price: 260, originalPrice: 420, stock: 8, allergens: 'Wheat, eggs, dairy.', branch: b5 },
]

/**
 * DEMO negotiation responders. Real eligibility uses the confirmed
 * category-and-quantity rules (Phase 4); these minimums are synthetic.
 */
export interface Responder {
  branch: Branch
  /** Minimum food price per portion, by category. Absent category = not eligible. */
  minUnit: Partial<Record<string, number>>
  dish: Partial<Record<string, string>>
  prepMinutes: number
}

export const RESPONDERS: Responder[] = [
  { branch: b1, minUnit: { biryani: 300, bbq: 450 }, dish: { biryani: 'Chicken biryani with raita', bbq: 'Chicken tikka with naan' }, prepMinutes: 35 },
  { branch: b3, minUnit: { bbq: 400, biryani: 380 }, dish: { bbq: 'Beef seekh kebab with naan', biryani: 'Beef biryani' }, prepMinutes: 25 },
  { branch: b5, minUnit: { cafe: 180, biryani: 260, bakery: 150 }, dish: { cafe: 'Bun kebab and doodh patti', biryani: 'Chicken biryani, half plate extra rice', bakery: 'Chicken patties' }, prepMinutes: 20 },
  { branch: b2, minUnit: { bakery: 120, dessert: 250 }, dish: { bakery: 'Fresh bakery box', dessert: 'Chocolate fudge slice' }, prepMinutes: 15 },
  { branch: b4, minUnit: { dessert: 220, cafe: 200 }, dish: { dessert: 'Kheer and gulab jamun', cafe: 'Club sandwich and chai' }, prepMinutes: 30 },
]

/** DEMO campaign. The partner, costs and batches are synthetic, not a real orphanage. */
import type { Batch } from '../lib/donations'
export const DEMO_CAMPAIGN = {
  partner: 'Demo Children’s Home',
  neighbourhood: 'Gulshan-e-Iqbal',
  verifiedNote: 'Verification shown for demo only',
  batches: [
    { id: 'B-104', label: 'Friday lunch', meals: 40, cost: 12000, funded: 12000, donorCount: 21, status: 'dispatched', supplier: 'Demo Biryani House' },
    { id: 'B-105', label: 'Saturday dinner', meals: 40, cost: 12000, funded: 9100, donorCount: 17, status: 'funding', supplier: 'Demo Biryani House' },
    { id: 'B-106', label: 'Sunday lunch', meals: 30, cost: 9000, funded: 1200, donorCount: 3, status: 'funding', supplier: 'Demo Chai Café' },
  ] satisfies Batch[],
}

/** DEMO merchant inbox for Demo Biryani House (branch b1). */
export const DEMO_INCOMING_REQUESTS = [
  { id: 'R-31', category: 'biryani', quantity: 4, portion: 'single' as const, proposedUnit: 260, neighbourhood: 'Gulshan-e-Iqbal', fulfilment: 'delivery' as const, neededInMin: 60 },
  { id: 'R-32', category: 'biryani', quantity: 2, portion: 'single' as const, proposedUnit: 320, neighbourhood: 'Gulistan-e-Johar', fulfilment: 'pickup' as const, neededInMin: 45 },
  { id: 'R-33', category: 'bbq', quantity: 1, portion: 'family' as const, proposedUnit: 1100, neighbourhood: 'DHA', fulfilment: 'pickup' as const, neededInMin: 90 },
]

export const DEMO_MERCHANT_ORDERS = [
  { id: 'DEMO-2041', item: 'Chicken biryani, full plate', quantity: 2, total: 640, fulfilment: 'pickup' as const, status: 'new' as const },
  { id: 'DEMO-2039', item: 'Chicken biryani, full plate', quantity: 1, total: 470, fulfilment: 'delivery' as const, status: 'accepted' as const },
  { id: 'DEMO-2033', item: 'Chicken biryani, full plate', quantity: 3, total: 960, fulfilment: 'pickup' as const, status: 'ready' as const },
]
