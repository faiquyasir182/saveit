import type { Responder } from '../data/demo'
import type { Branch, Fulfilment } from '../data/types'

export interface MealRequest {
  category: string
  portion: 'single' | 'family'
  quantity: number
  neighbourhood: string
  fulfilment: Fulfilment
  /** ISO UTC time the customer needs the food by. */
  neededBy: string
  /** Proposed food price per portion in PKR (excludes delivery). */
  proposedUnit: number
}

export type OfferKind = 'accept' | 'counter' | 'decline'

export interface Offer {
  id: string
  kind: OfferKind
  branch: Branch
  dish: string
  unitPrice: number
  quantity: number
  deliveryCharge: number
  foodTotal: number
  total: number
  readyAt: string
  expiresAt: string
  declineReason?: string
}

/** Demo expiry windows. Real values are a Phase 4 decision. */
export const OFFER_TTL_MS = { accept: 10 * 60_000, counter: 2 * 60_000 } as const
/** A counteroffer is only made when the customer's price is within this share of the merchant minimum. */
export const COUNTER_FLOOR = 0.7

export class RequestError extends Error {}

export function validateRequest(r: MealRequest, now: number): void {
  if (!Number.isInteger(r.quantity) || r.quantity < 1 || r.quantity > 50) throw new RequestError('Choose between 1 and 50 portions.')
  if (!Number.isInteger(r.proposedUnit) || r.proposedUnit < 50) throw new RequestError('Offer at least Rs 50 per portion.')
  if (Date.parse(r.neededBy) <= now) throw new RequestError('Choose a time later than now.')
}

/** Simulates merchant responses. In Phase 4 merchants respond themselves and the server stores offers. */
export function respond(r: MealRequest, responders: Responder[], now: number): Offer[] {
  validateRequest(r, now)
  const portionFactor = r.portion === 'family' ? 3 : 1
  return responders
    .filter((x) => x.minUnit[r.category] !== undefined)
    .map((x, i): Offer => {
      const min = x.minUnit[r.category]! * portionFactor
      const deliveryCharge = r.fulfilment === 'delivery' ? (x.branch.deliveryCharge ?? 0) : 0
      const readyAt = new Date(now + x.prepMinutes * 60_000).toISOString()
      let kind: OfferKind
      let unitPrice = r.proposedUnit
      let declineReason: string | undefined
      if (r.fulfilment === 'delivery' && x.branch.deliveryCharge === null) {
        kind = 'decline'; declineReason = 'Pickup only'
      } else if (Date.parse(readyAt) > Date.parse(r.neededBy)) {
        kind = 'decline'; declineReason = 'Can’t be ready in time'
      } else if (r.proposedUnit >= min) {
        kind = 'accept'
      } else if (r.proposedUnit >= Math.ceil(min * COUNTER_FLOOR)) {
        kind = 'counter'; unitPrice = min
      } else {
        kind = 'decline'; declineReason = 'Price too low'
      }
      const foodTotal = unitPrice * r.quantity
      const ttl = kind === 'counter' ? OFFER_TTL_MS.counter : OFFER_TTL_MS.accept
      return {
        id: `${x.branch.id}-${i}`, kind, branch: x.branch, dish: x.dish[r.category] ?? r.category,
        unitPrice, quantity: r.quantity, deliveryCharge, foodTotal, total: foodTotal + deliveryCharge,
        readyAt, expiresAt: new Date(now + ttl).toISOString(), declineReason,
      }
    })
    .sort((a, b) => rank(a) - rank(b) || a.total - b.total)
}

const rank = (o: Offer) => (o.kind === 'decline' ? 2 : 0)

export const isExpired = (o: Offer, now: number) => Date.parse(o.expiresAt) <= now

/** The customer explicitly picks one live offer. Accepting does not charge anyone; only this does. */
export function selectOffer(offers: Offer[], id: string, now: number): Offer {
  const o = offers.find((x) => x.id === id)
  if (!o) throw new RequestError('That offer no longer exists.')
  if (o.kind === 'decline') throw new RequestError('This restaurant declined.')
  if (isExpired(o, now)) throw new RequestError('This offer has expired. Choose another or send a new request.')
  return o
}
