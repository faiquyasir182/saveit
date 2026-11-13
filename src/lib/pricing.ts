import type { Fulfilment, Listing } from '../data/types'

export interface OrderQuote {
  unitPrice: number
  quantity: number
  foodSubtotal: number
  deliveryCharge: number
  total: number
  savings: number
}

export class QuoteError extends Error {}

/**
 * Client-side PREVIEW of an order total. In Phase 3 the backend becomes the
 * authority for prices; this function must then only mirror its result.
 * Platform commission is merchant-side and never added to the customer total.
 */
export function quoteOrder(listing: Listing, quantity: number, fulfilment: Fulfilment): OrderQuote {
  if (!Number.isInteger(quantity) || quantity < 1) throw new QuoteError('Choose at least one.')
  if (quantity > listing.stock) throw new QuoteError(`Only ${listing.stock} left.`)
  if (fulfilment === 'delivery' && listing.branch.deliveryCharge === null)
    throw new QuoteError('This branch offers pickup only.')

  const foodSubtotal = listing.price * quantity
  const deliveryCharge = fulfilment === 'delivery' ? (listing.branch.deliveryCharge ?? 0) : 0
  return {
    unitPrice: listing.price,
    quantity,
    foodSubtotal,
    deliveryCharge,
    total: foodSubtotal + deliveryCharge,
    savings: (listing.originalPrice - listing.price) * quantity,
  }
}
