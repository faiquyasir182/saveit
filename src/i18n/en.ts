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
  request: {
    title: 'Name your price',
    intro: 'Tell nearby restaurants what you want and what you’d like to pay. You choose which offer to take.',
    category: 'What would you like?', portion: 'Portion size', single: 'Single', family: 'Family (serves 3)',
    quantity: 'How many', area: 'Your area', neededBy: 'Needed by', inMinutes: (m: number) => (m < 60 ? `${m} min` : `${m / 60} hr`),
    price: 'Your price per portion', priceHint: 'Food only. Any delivery charge is shown on each offer.',
    send: 'Send request', sending: 'Asking restaurants…',
    offersTitle: (n: number) => (n === 1 ? '1 offer' : `${n} offers`), offersIntro: 'Nothing is charged until you choose one.',
    accepted: 'Accepted your price', counter: 'Counteroffer', yourPrice: (p: string) => `You offered ${p}`,
    ready: 'Ready by', expiresIn: (t: string) => `Expires in ${t}`, expired: 'Expired',
    choose: 'Choose this offer', declined: (n: number) => `${n} declined`, noOffers: 'No restaurant can take this request',
    noOffersBody: 'Try a higher price, a later time or pickup instead of delivery.', edit: 'Edit request', newRequest: 'New request',
    perPortion: 'per portion',
  },
  sponsor: {
    title: 'Sponsor a meal', intro: 'Pool money with other donors to feed children at a verified home. You’ll see each batch prepared, sent and received.',
    meals: (n: number) => `${n} meals`, donors: (n: number) => (n === 1 ? '1 donor' : `${n} donors`), of: 'of',
    status: { funding: 'Raising funds', preparing: 'Being prepared', dispatched: 'On the way', delivered: 'Arrived', confirmed: 'Receipt confirmed' },
    amount: 'Your contribution', custom: 'Other amount', range: 'Rs 1 to Rs 10,000',
    where: 'Where your money goes', fee: 'Platform fee', feeTbc: 'Not set yet', unallocated: 'Held for the next batch',
    unallocatedNote: 'Unallocated money stays linked to you and this campaign. It is never platform revenue.',
    give: 'Contribute', giving: 'Processing…', thanks: 'Thank you', receipt: 'Demo receipt: no money was taken.',
    updates: 'You’ll get updates when your batches are prepared, sent and received.', trackNote: 'Receipt is confirmed by the home’s staff, not by GPS or the driver.',
    done: 'Back to campaign', track: 'Track delivery', privacy: 'Other donors’ names are never shown.',
  },
  placed: { title: 'Order placed', body: 'This is a demo order: no payment was taken and no restaurant was notified.', reference: 'Reference', done: 'Back to offers' },
}
export type Strings = typeof en
