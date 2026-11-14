import { type Strings, en } from './en'
import { ur } from './ur'

export type Lang = 'en' | 'ur'
const DICT: Record<Lang, Strings> = { en, ur }
const KEY = 'saveit-lang'
let current: Lang = 'en'

function applyToDocument() {
  document.documentElement.lang = current
  document.documentElement.dir = current === 'ur' ? 'rtl' : 'ltr'
}

/** Reads the saved language (falls back to English) and applies lang/dir to <html>. */
export function initLang(): Lang {
  try { const saved = localStorage.getItem(KEY); if (saved === 'en' || saved === 'ur') current = saved } catch { /* storage unavailable */ }
  applyToDocument()
  return current
}

export function setLang(lang: Lang): void {
  current = lang
  try { localStorage.setItem(KEY, lang) } catch { /* storage unavailable */ }
  applyToDocument()
}

export const getLang = (): Lang => current

type Node = Record<string, unknown>
const lookup = (path: string[]): unknown => path.reduce<unknown>((o, k) => (o as Node)[k], DICT[current])

/** Builds an object shaped like `en` whose values are read from the active language at access time. */
function live(shape: Node, path: string[]): Node {
  const out: Node = {}
  for (const k of Object.keys(shape)) {
    const v = shape[k]
    const p = [...path, k]
    if (typeof v === 'function') out[k] = (...args: unknown[]) => (lookup(p) as (...a: unknown[]) => unknown)(...args)
    else if (v && typeof v === 'object') out[k] = live(v as Node, p)
    else Object.defineProperty(out, k, { enumerable: true, get: () => lookup(p) })
  }
  return out
}

/** Active-language strings. Components re-render on language change because App holds the language in state. */
export const t = live(en as unknown as Node, []) as unknown as Strings
