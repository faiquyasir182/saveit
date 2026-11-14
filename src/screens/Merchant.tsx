import { useState } from 'react'
import { DEMO_INCOMING_REQUESTS, DEMO_MERCHANT_ORDERS, LISTINGS, RESPONDERS } from '../data/demo'
import { t } from '../i18n'
import { loc } from '../i18n/loc'
import type { CategoryId } from '../data/categories'
import { formatPKR } from '../lib/format'
import { validateCounter } from '../lib/negotiation'
import { type OrderStatus, canReject, nextStatus } from '../lib/orders'

const s = t.merchant
type Tab = keyof typeof s.tabs
const responder = RESPONDERS[0] // Demo Biryani House
const catLabel = (c: string) => t.categories[c as CategoryId] ?? c

function Listings() {
  const [rows, setRows] = useState(LISTINGS.filter((l) => l.branch.id === responder.branch.id).map((l) => ({ ...l, live: true })))
  const update = (id: string, patch: Partial<(typeof rows)[number]>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  return <>{rows.map((l) => (
    <article key={l.id} className="panel">
      <div className="spread"><h3>{loc.listing(l).title}</h3><span className={`tag ${l.live ? 'tag-accept' : 'tag-counter'}`}>{l.live ? s.live : s.paused}</span></div>
      <span className="muted">{formatPKR(l.price)} · {loc.listing(l).portion}</span>
      <div className="spread">
        <span><strong>{s.stock}</strong></span>
        <div className="stepper">
          <button className="icon-btn" aria-label={`${t.detail.decrease}: ${l.title}`} disabled={l.stock <= 0} onClick={() => update(l.id, { stock: l.stock - 1 })}>−</button>
          <output aria-live="polite">{l.stock}</output>
          <button className="icon-btn" aria-label={`${t.detail.increase}: ${l.title}`} onClick={() => update(l.id, { stock: l.stock + 1 })}>+</button>
        </div>
      </div>
      <button className="btn btn-ghost" onClick={() => update(l.id, { live: !l.live })}>{l.live ? s.pause : s.publish}</button>
    </article>))}</>
}

function Requests() {
  const [state, setState] = useState<Record<string, { result?: 'accept' | 'counter' | 'decline'; countering?: boolean; price?: string; error?: string | null }>>({})
  const open = DEMO_INCOMING_REQUESTS.filter((r) => responder.minUnit[r.category] !== undefined)
  if (!open.length) return <div className="empty panel"><h2>{s.noRequests}</h2><p className="muted">{s.noRequestsBody}</p></div>
  return <>{open.map((r) => {
    const min = responder.minUnit[r.category]! * (r.portion === 'family' ? 3 : 1)
    const st = state[r.id] ?? {}
    const set = (patch: typeof st) => setState((x) => ({ ...x, [r.id]: { ...st, ...patch } }))
    return (
      <article key={r.id} className="panel" aria-label={`Request ${r.id}`}>
        <div className="spread"><h3>{s.request(r.quantity, catLabel(r.category))}{r.portion === 'family' ? `, ${s.familySize}` : ''}</h3><span className="muted" style={{ fontSize: 13 }}>{r.id}</span></div>
        <span className="muted">{loc.area(r.neighbourhood)} · {r.fulfilment === 'pickup' ? t.detail.pickup : t.detail.delivery} · {t.request.inMinutes(r.neededInMin)}</span>
        <div className="spread"><strong>{s.offered(formatPKR(r.proposedUnit))}</strong><span className="muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{s.yourMin(formatPKR(min))}</span></div>
        {st.result ? <p className="tag tag-accept" style={{ margin: 0, justifySelf: 'start' }} role="status">{s.sent[st.result]}</p>
        : st.countering ? (<>
          <label htmlFor={`c-${r.id}`} className="muted">{s.counterPrice}</label>
          <div className="price-input"><span aria-hidden>Rs</span><input id={`c-${r.id}`} className="field" inputMode="numeric" value={st.price ?? String(min)} onChange={(e) => set({ price: e.target.value.replace(/\D/g, ''), error: null })} aria-invalid={!!st.error} /></div>
          {st.error && <p className="error" role="alert">{st.error}</p>}
          <button className="btn btn-primary" onClick={() => { const err = validateCounter(Number(st.price ?? min), r.proposedUnit, min); err ? set({ error: err }) : set({ result: 'counter' }) }}>{s.sendCounter}</button>
        </>) : (
          <div className="actions">
            <button className="btn btn-primary" disabled={r.proposedUnit < min} onClick={() => set({ result: 'accept' })}>{s.accept}</button>
            <button className="btn btn-ghost" onClick={() => set({ countering: true })}>{s.counter}</button>
            <button className="btn btn-ghost" onClick={() => set({ result: 'decline' })}>{s.decline}</button>
          </div>
        )}
      </article>)
  })}</>
}

function Orders() {
  const [orders, setOrders] = useState<{ id: string; item: string; quantity: number; total: number; fulfilment: 'pickup' | 'delivery'; status: OrderStatus }[]>(DEMO_MERCHANT_ORDERS)
  const setStatus = (id: string, status: OrderStatus) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)))
  return <>{orders.map((o) => {
    const next = nextStatus(o.status)
    return (
      <article key={o.id} className="panel">
        <div className="spread"><h3>{o.id}</h3><span className={`tag ${o.status === 'rejected' ? 'tag-counter' : 'tag-accept'}`}>{s.orderStatus[o.status]}</span></div>
        <span className="muted">{o.quantity} × {o.item} · {o.fulfilment === 'pickup' ? t.detail.pickup : t.detail.delivery}</span>
        <div className="spread"><strong>{formatPKR(o.total)}</strong><span className="muted" style={{ fontSize: 13 }}>{s.cashNote}</span></div>
        {(next || canReject(o.status)) && <div className="actions">
          {next && <button className="btn btn-primary" onClick={() => setStatus(o.id, next)}>{s.advance[o.status as keyof typeof s.advance]}</button>}
          {canReject(o.status) && <button className="btn btn-ghost" onClick={() => setStatus(o.id, 'rejected')}>{s.reject}</button>}
        </div>}
      </article>)
  })}</>
}

export function Merchant() {
  const [tab, setTab] = useState<Tab>('requests')
  return (
    <div className="stack">
      <header><p className="muted" style={{ margin: 0 }}>{loc.merchant(responder.branch.merchantName)} · {loc.branch(responder.branch.branchName)}</p><h1 style={{ fontSize: 28 }}>{s.title}</h1></header>
      <div className="seg seg-3" role="tablist">
        {(Object.keys(s.tabs) as Tab[]).map((k) => <button key={k} role="tab" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{s.tabs[k]}</button>)}
      </div>
      {tab === 'listings' ? <Listings /> : tab === 'requests' ? <Requests /> : <Orders />}
    </div>
  )
}
