export type Fulfilment = 'pickup' | 'delivery'
export type ListingKind = 'exact' | 'surprise'

export interface Branch {
  id: string
  merchantName: string
  branchName: string
  neighbourhood: string
  /** null = pickup only. Restaurants deliver with their own riders. */
  deliveryCharge: number | null
  pickupStart: string // ISO UTC
  pickupEnd: string
}

export interface Listing {
  id: string
  kind: ListingKind
  title: string
  category: string
  /** Exact items: what is in it. Surprise bags: what may vary. */
  contents: string
  portion: string
  /** Surprise bags only: minimum promised value in PKR. */
  minimumValue?: number
  price: number
  originalPrice: number
  stock: number
  allergens: string
  branch: Branch
}
