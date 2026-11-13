export type OrderStatus = 'new' | 'accepted' | 'ready' | 'completed' | 'rejected'

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { new: 'accepted', accepted: 'ready', ready: 'completed' }

/** Allowed forward step for a merchant. Phase 3 enforces this on the server. */
export function nextStatus(s: OrderStatus): OrderStatus | null {
  return NEXT[s] ?? null
}

export function canReject(s: OrderStatus): boolean {
  return s === 'new'
}
