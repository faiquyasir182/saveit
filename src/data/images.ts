import manifest from '../../public/images/food/manifest.json'
import type { ImageSlug } from './categories'

export interface FoodImageInfo { thumb: string; card: string; hero: string; author: string; licence: string; page: string }
export const IMAGE_SIZES = { thumb: [200, 200], card: [640, 480], hero: [900, 675] } as const

const url = (p: string) => `${import.meta.env.BASE_URL}${p}`

/** Representative demonstration photos from Wikimedia Commons (see public/images/food/manifest.json). */
export const FOOD_IMAGES = Object.fromEntries(
  manifest.images.map((m) => [m.slug, { thumb: url(m.files.thumb), card: url(m.files.card), hero: url(m.files.hero), author: m.author, licence: m.licence, page: m.page }]),
) as Record<ImageSlug, FoodImageInfo>
