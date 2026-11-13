import { describe, expect, it } from 'vitest'
import { formatPKR, formatWindow } from './format'

describe('format', () => {
  it('formats PKR with grouping', () => expect(formatPKR(1100)).toBe('Rs 1,100'))
  it('shows am/pm once for a same-period window, in Karachi time', () => {
    // 16:00 and 18:00 UTC = 9:00 pm and 11:00 pm in Karachi (UTC+5)
    expect(formatWindow('2026-11-13T16:00:00Z', '2026-11-13T18:00:00Z')).toMatch(/^9:00 – 11:00 pm$/i)
  })
  it('keeps both markers when the window crosses noon or midnight', () => {
    expect(formatWindow('2026-11-13T18:00:00Z', '2026-11-13T20:00:00Z')).toMatch(/pm.*am/i)
  })
})
