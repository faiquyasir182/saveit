import { BRAND } from '../config/brand'

/** Original mark: a bowl with a leaf rising from it, on the action colour. Replace with a designed logo when one exists. */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" fill="var(--action)" />
      <path d="M7 17h18a9 9 0 0 1-18 0z" fill="#fff" />
      <path d="M16 14.2c-3.4-2.2-3.4-6.6 0-8.9 3.4 2.3 3.4 6.7 0 8.9z" fill="#fff" />
    </svg>
  )
}

export function Logo() {
  return <span className="logo"><LogoMark /><span className="wordmark">{BRAND.name.toLowerCase()}</span></span>
}
