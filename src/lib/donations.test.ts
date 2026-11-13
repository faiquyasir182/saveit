import { describe, expect, it } from 'vitest'
import { type Batch, ContributionError, allocate, applyAllocations } from './donations'

const batch = (id: string, cost: number, funded: number, status: Batch['status'] = 'funding'): Batch =>
  ({ id, label: id, meals: 10, cost, funded, donorCount: 0, status, supplier: 'Demo' })

describe('allocate', () => {
  it('pools several donors into one batch (200 + 400 + 800 = 1,400 gross)', () => {
    let bs = [batch('a', 3000, 0)]
    let gross = 0
    for (const amt of [200, 400, 800]) { const r = allocate(amt, bs); gross += r.gross; bs = applyAllocations(bs, r.allocations) }
    expect(gross).toBe(1400)
    expect(bs[0]).toMatchObject({ funded: 1400, donorCount: 3, status: 'funding' })
  })
  it('splits one contribution across batches with exact amounts', () => {
    const r = allocate(1000, [batch('a', 3000, 2700), batch('b', 3000, 0)])
    expect(r.allocations).toEqual([{ batchId: 'a', amount: 300 }, { batchId: 'b', amount: 700 }])
    expect(r.unallocated).toBe(0)
  })
  it('keeps leftover funds unallocated and skips batches not raising funds', () => {
    const r = allocate(500, [batch('x', 1000, 0, 'preparing'), batch('a', 1000, 800)])
    expect(r.allocations).toEqual([{ batchId: 'a', amount: 200 }])
    expect(r.unallocated).toBe(300)
  })
  it('leaves the fee unset until confirmed, and deducts it when a rate is given', () => {
    expect(allocate(100, [batch('a', 1000, 0)]).fee).toBeNull()
    const r = allocate(1000, [batch('a', 5000, 0)], 0.025)
    expect(r.fee).toBe(25)
    expect(r.allocations[0].amount).toBe(975)
  })
  it('enforces Rs 1 to Rs 10,000 whole amounts', () => {
    for (const bad of [0, 10_001, 1.5]) expect(() => allocate(bad, [])).toThrow(ContributionError)
  })
  it('marks a batch fully funded as preparing', () => {
    const r = allocate(300, [batch('a', 1000, 700)])
    expect(applyAllocations([batch('a', 1000, 700)], r.allocations)[0].status).toBe('preparing')
  })
})
