import { useState } from 'react'
import { DEMO_CAMPAIGN } from '../data/demo'
import { t } from '../i18n'
import { formatPKR } from '../lib/format'
import { type Batch, type BatchStatus, type ContributionResult, ContributionError, allocate, applyAllocations } from '../lib/donations'

const s = t.sponsor
const PRESETS = [200, 400, 800, 1000]
const STEPS: BatchStatus[] = ['funding', 'preparing', 'dispatched', 'delivered', 'confirmed']

function BatchCard({ b, mine }: { b: Batch; mine?: number }) {
  const pct = Math.min(100, Math.round((b.funded / b.cost) * 100))
  const stepIdx = STEPS.indexOf(b.status)
  return (
    <article className="panel">
      <div className="spread"><h3>{b.label}</h3><span className={`tag ${b.status === 'funding' ? 'tag-counter' : 'tag-accept'}`}>{s.status[b.status]}</span></div>
      <span className="muted">{s.meals(b.meals)} · {b.supplier} · {s.donors(b.donorCount)}</span>
      <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${b.label} funded`}><span style={{ width: `${pct}%` }} /></div>
      <div className="spread" style={{ fontSize: 14 }}><strong>{formatPKR(b.funded)} {s.of} {formatPKR(b.cost)}</strong>{mine ? <span className="tag tag-accept">+{formatPKR(mine)} yours</span> : null}</div>
      {b.status !== 'funding' && (
        <ol className="timeline" aria-label={s.track}>
          {STEPS.slice(1).map((st, i) => <li key={st} data-done={i + 1 <= stepIdx}>{s.status[st]}</li>)}
        </ol>
      )}
    </article>
  )
}

export function Sponsor() {
  const [batches, setBatches] = useState<Batch[]>(DEMO_CAMPAIGN.batches)
  const [amount, setAmount] = useState('400')
  const [result, setResult] = useState<ContributionResult | null>(null)
  const [busy, setBusy] = useState(false)
  let preview: ContributionResult | null = null, error: string | null = null
  try { preview = allocate(Number(amount), batches) } catch (e) { error = e instanceof ContributionError ? e.message : 'Something went wrong.' }
  const label = (id: string) => batches.find((b) => b.id === id)?.label ?? id

  function give() {
    if (!preview || busy) return
    setBusy(true)
    const r = preview
    setTimeout(() => { setBatches((bs) => applyAllocations(bs, r.allocations)); setResult(r); setBusy(false) }, 700)
  }

  if (result) {
    return (
      <div className="stack">
        <div className="photo" data-tint="pink" style={{ width: 110, height: 110, borderRadius: '50%', margin: '20px auto 0', fontSize: 52 }}><span aria-hidden>💛</span></div>
        <h1 style={{ textAlign: 'center' }}>{s.thanks}</h1>
        <p className="muted" style={{ textAlign: 'center', margin: 0 }}>{s.receipt} {s.updates}</p>
        <section className="panel"><h2 style={{ fontSize: 18 }}>{s.where}</h2>
          <dl className="lines">
            {result.allocations.map((a) => <div key={a.batchId}><dt>{label(a.batchId)} ({a.batchId})</dt><dd>{formatPKR(a.amount)}</dd></div>)}
            {result.unallocated > 0 && <div><dt>{s.unallocated}</dt><dd>{formatPKR(result.unallocated)}</dd></div>}
            <div><dt>{s.fee}</dt><dd>{result.fee === null ? s.feeTbc : formatPKR(result.fee)}</dd></div>
            <div className="total"><dt>{t.checkout.total}</dt><dd>{formatPKR(result.gross)}</dd></div>
          </dl>
        </section>
        {batches.filter((b) => result.allocations.some((a) => a.batchId === b.id)).map((b) => <BatchCard key={b.id} b={b} mine={result.allocations.find((a) => a.batchId === b.id)?.amount} />)}
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>{s.trackNote}</p>
        <button className="btn btn-ghost" onClick={() => setResult(null)}>{s.done}</button>
      </div>
    )
  }

  return (
    <div className="stack">
      <header><h1 style={{ fontSize: 30 }}>{s.title}</h1><p className="muted" style={{ margin: '6px 0 0' }}>{s.intro}</p></header>
      <section className="panel" style={{ background: 'var(--green)' }}>
        <div className="row"><span style={{ fontSize: 32 }} aria-hidden>🏠</span><div><h2 style={{ fontSize: 18 }}>{DEMO_CAMPAIGN.partner}</h2><span className="muted" style={{ fontSize: 13 }}>{DEMO_CAMPAIGN.neighbourhood} · {DEMO_CAMPAIGN.verifiedNote}</span></div></div>
      </section>
      {batches.map((b) => <BatchCard key={b.id} b={b} />)}
      <section className="panel">
        <label htmlFor="amt"><h2 style={{ fontSize: 18 }}>{s.amount}</h2></label>
        <div className="scroll-x" role="group" aria-label={s.amount}>{PRESETS.map((p) => <button key={p} className="pill" aria-pressed={amount === String(p)} onClick={() => setAmount(String(p))}>{formatPKR(p)}</button>)}</div>
        <div className="price-input"><span aria-hidden>Rs</span><input id="amt" className="field" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} aria-describedby="amt-hint" aria-invalid={!!error} /></div>
        <span id="amt-hint" className="muted" style={{ fontSize: 13 }}>{s.range}. {s.privacy}</span>
        {error && <p className="error" role="alert">{error}</p>}
        {preview && (
          <dl className="lines" aria-label={s.where}>
            {preview.allocations.map((a) => <div key={a.batchId}><dt>{label(a.batchId)}</dt><dd>{formatPKR(a.amount)}</dd></div>)}
            {preview.unallocated > 0 && <div><dt>{s.unallocated}</dt><dd>{formatPKR(preview.unallocated)}</dd></div>}
            <div><dt>{s.fee}</dt><dd>{preview.fee === null ? s.feeTbc : formatPKR(preview.fee)}</dd></div>
          </dl>
        )}
        {preview && preview.unallocated > 0 && <span className="muted" style={{ fontSize: 13 }}>{s.unallocatedNote}</span>}
      </section>
      <button className="btn btn-primary" disabled={!preview || busy} onClick={give}>{busy ? s.giving : preview ? `${s.give} · ${formatPKR(preview.gross)}` : s.give}</button>
    </div>
  )
}
