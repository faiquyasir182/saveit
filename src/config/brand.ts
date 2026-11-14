import type { CategoryId } from '../data/categories'

/**
 * Central brand config. Name, logo colours, action colour and category tints live here only;
 * applyBrandTokens() writes them to CSS custom properties at startup (and the owner editor can later).
 */
export const BRAND = {
  name: 'Saveit',
  colors: {
    action: '#cf4a0e', // the only action accent: buttons, links that act, focus ring
    actionPress: '#b03f0b',
    background: '#fbf8f4',
    ink: '#1f1a15',
  },
  /** Header tint per selected category. Pale, so ink text stays above 12:1. */
  categoryTints: {
    all: '#e6f0dc',
    biryani: '#f5e3b3',
    bakery: '#fbf1d3',
    bbq: '#f6dcc9',
    dessert: '#f8dde3',
    cafe: '#eadccb',
  } satisfies Record<CategoryId, string>,
} as const

export function applyBrandTokens(root: HTMLElement = document.documentElement) {
  const { colors, categoryTints } = BRAND
  root.style.setProperty('--action', colors.action)
  root.style.setProperty('--action-press', colors.actionPress)
  root.style.setProperty('--bg', colors.background)
  root.style.setProperty('--ink', colors.ink)
  for (const [id, hex] of Object.entries(categoryTints)) root.style.setProperty(`--tint-${id}`, hex)
  document.title = `${BRAND.name} (prototype)`
}
