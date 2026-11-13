/**
 * Central brand config. "Karachi Food App" is a temporary working name.
 * Replace name, logo and colours here only; CSS tokens read the colours at startup.
 */
export const BRAND = {
  name: 'Karachi Food App',
  shortName: 'KFA',
  logoEmoji: '🍲', // placeholder until a real logo asset exists
  colors: {
    primary: '#f26b1d',
    primaryPress: '#d85a10',
    background: '#fbf6ec',
    accentGreen: '#dcefd6',
    accentPink: '#fbe0e3',
    accentYellow: '#fdf0c4',
  },
} as const

export function applyBrandTokens(root: HTMLElement = document.documentElement) {
  const c = BRAND.colors
  const set = (k: string, v: string) => root.style.setProperty(k, v)
  set('--primary', c.primary); set('--primary-press', c.primaryPress); set('--bg', c.background)
  set('--green', c.accentGreen); set('--pink', c.accentPink); set('--yellow', c.accentYellow)
  document.title = `${BRAND.name} (prototype)`
}
