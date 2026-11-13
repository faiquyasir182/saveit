/**
 * English UI strings. Add ur.ts with the same shape for Urdu; layout already
 * uses logical CSS properties so dir="rtl" can be switched on later.
 */
export const en = {
  demoBanner: 'Prototype · demo merchants and prices only',
  tabs: { discover: 'Discover', negotiate: 'Request', sponsor: 'Sponsor', orders: 'Orders' },
  plannedFor: (phase: string) => `This flow is planned for ${phase}. It isn’t part of the first prototype.`,
  discover: {
    eyebrow: 'Karachi · tonight’s surplus',
    title: 'Good food, smaller price.',
    categories: 'Categories',
    neighbourhood: 'Neighbourhood',
    allAreas: 'All areas',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'No offers match this area and category tonight.',
    emptyCta: 'Show all offers',
  },
  listing: { surpriseBag: 'Surprise bag', exactItem: 'Exact item', soldOut: 'Sold out', left: (n: number) => `${n} left`, pickup: 'Pickup' },
  detail: {
    back: 'Back to offers', whatVaries: 'What may vary', whatsInside: 'What’s inside', portion: 'Portion', minimumValue: 'Minimum value',
    pickupWindow: 'Pickup window', allergens: 'Allergens', soldOutTitle: 'Sold out tonight',
    soldOutBody: 'This branch has no more of this item. Check back tomorrow or browse other offers.', browseOther: 'Browse other offers',
    quantity: 'Quantity', available: (n: number) => `${n} available`, decrease: 'Decrease quantity', increase: 'Increase quantity',
    fulfilment: 'Pickup or delivery', pickup: 'Pickup', free: 'Free', delivery: 'Restaurant delivery', notOffered: 'Not offered',
    review: 'Review order',
  },
  checkout: {
    title: 'Review order', back: 'Back to item', riderNote: 'Delivered by the restaurant’s own rider', total: 'Total',
    savings: (amount: string) => `You save ${amount} on the usual price.`, phone: 'Mobile number',
    phoneError: 'Enter an 11-digit mobile number starting with 03.', address: 'Delivery address',
    addressError: 'Add house, street and block so the rider can find you.', payment: 'Payment', cashPickup: 'Cash at pickup',
    cashDelivery: 'Cash on delivery', payOnline: 'Pay online', comingPhase3: 'Coming in Phase 3', placing: 'Placing order…', place: 'Place order',
  },
  placed: { title: 'Order placed', body: 'This is a demo order: no payment was taken and no restaurant was notified.', reference: 'Reference', done: 'Back to offers' },
}
export type Strings = typeof en
