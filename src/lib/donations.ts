/**
 * Pooled meal sponsorship (prototype). Fee rate, allocation priority and
 * refund policy are UNCONFIRMED business decisions (Phase 7). Until then the
 * fee is null and the demo allocates oldest batch first.
 */
export type BatchStatus = 'funding' | 'preparing' | 'dispatched' | 'delivered' | 'confirmed'

export interface Batch {
  id: string
  label: string
  meals: number
  /** Cost of the whole batch in PKR (food + delivery). Demo value. */
  cost: number
  funded: number
  donorCount: number
  status: BatchStatus
  supplier: string
}

export interface Allocation { batchId: string; amount: number }

export interface ContributionResult {
  gross: number
  fee: number | null
  allocations: Allocation[]
  /** Stays attributable to this donor and campaign. Never platform revenue. */
  unallocated: number
}

export const MIN_CONTRIBUTION = 1
export const MAX_CONTRIBUTION = 10_000
/** null = not yet confirmed by the owner. */
export const DONATION_FEE_RATE: number | null = null

export class ContributionError extends Error {}

export function allocate(amount: number, batches: Batch[], feeRate: number | null = DONATION_FEE_RATE): ContributionResult {
  if (!Number.isInteger(amount) || amount < MIN_CONTRIBUTION || amount > MAX_CONTRIBUTION)
    throw new ContributionError(`Enter a whole amount from Rs ${MIN_CONTRIBUTION} to Rs ${MAX_CONTRIBUTION.toLocaleString('en-PK')}.`)
  const fee = feeRate === null ? null : Math.round(amount * feeRate)
  let left = amount - (fee ?? 0)
  const allocations: Allocation[] = []
  for (const b of batches) {
    if (b.status !== 'funding' || left <= 0) continue
    const need = b.cost - b.funded
    if (need <= 0) continue
    const take = Math.min(need, left)
    allocations.push({ batchId: b.id, amount: take })
    left -= take
  }
  return { gross: amount, fee, allocations, unallocated: left }
}

/** Applies allocations immutably; a batch that reaches its cost moves to preparing. */
export function applyAllocations(batches: Batch[], allocations: Allocation[]): Batch[] {
  return batches.map((b) => {
    const a = allocations.find((x) => x.batchId === b.id)
    if (!a) return b
    const funded = b.funded + a.amount
    return { ...b, funded, donorCount: b.donorCount + 1, status: funded >= b.cost ? 'preparing' : b.status }
  })
}
