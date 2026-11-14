export type CategoryId = 'all' | 'biryani' | 'bakery' | 'bbq' | 'dessert' | 'cafe'
export type ImageSlug = Exclude<CategoryId, 'all'>

export const CATEGORY_IDS: readonly CategoryId[] = ['all', 'biryani', 'bakery', 'bbq', 'dessert', 'cafe']
/** Image slugs that have a photo. "all" is shown as a 2×2 mosaic of these. */
export const MOSAIC: readonly ImageSlug[] = ['biryani', 'bakery', 'bbq', 'dessert']
