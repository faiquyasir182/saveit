import { useState } from 'react'
import type { Fulfilment, Listing } from '../data/types'
import { formatPKR, formatWindow } from '../lib/format'
import { t } from '../i18n'
import { quoteOrder } from '../lib/pricing'

interface Props { listing: Listing; qty: number; fulfilment: Fulfilment; onBack: () => void; onPlaced: (ref: string) => void }

const PK_MOBILE = /^03\d{9}$/

export function Checkout({ listing, qty, fulfilment, onBack, onPlaced }: Props) {
  const quote = quoteOrder(listing, qty, fulfilment)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [touched, setTouched] = useState({ phone: false, address: false })
  const [placing, setPlacing] = useState(false)
  const phoneOk = PK_MOBILE.test(phone.replace(/[\s-]/g, ''))
  const addressOk = fulfilment === 'pickup' || address.trim().length >= 10
  const payLabel = fulfilment === 'pickup' ? t.checkout.cashPickup : t.checkout.cashDelivery

  function place() {
    setTouched({ phone: true, address: true })
    if (!phoneOk || !addressOk || placing) return
    setPlacing(true) // guards double taps; Phase 3 adds a server idempotency key
    setTimeout(() => onPlaced(`DEMO-${Math.floor(1000 + Math.random() * 9000)}`), 600)
  }

  return (
    <div className="stack">
      <div className="row"><button className="icon-btn" onClick={onBack} aria-label={t.checkout.back}>←</button><h1 style={{ fontSize: 24 }}>{t.checkout.title}</h1></div>
      <section className="panel">
        <h2 style={{ fontSize: 18 }}>{listing.branch.merchantName}</h2>
        <span className="muted">{listing.branch.branchName}, {listing.branch.neighbourhood} · {fulfilment === 'pickup' ? `Pickup ${formatWindow(listing.branch.pickupStart, listing.branch.pickupEnd)}` : t.checkout.riderNote}</span>
        <dl className="lines">
          <div><dt>{qty} × {listing.title}</dt><dd>{formatPKR(quote.foodSubtotal)}</dd></div>
          <div><dt>{fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}</dt><dd>{quote.deliveryCharge ? formatPKR(quote.deliveryCharge) : 'Free'}</dd></div>
          <div className="total"><dt>{t.checkout.total}</dt><dd>{formatPKR(quote.total)}</dd></div>
        </dl>
        <span className="muted" style={{ fontSize: 13 }}>{t.checkout.savings(formatPKR(quote.savings))}</span>
      </section>
      <section className="panel">
        <label htmlFor="phone"><h2 style={{ fontSize: 18 }}>{t.checkout.phone}</h2></label>
        <input id="phone" inputMode="tel" autoComplete="tel" placeholder="03XX XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} aria-invalid={touched.phone && !phoneOk} aria-describedby="phone-err" className="field" />
        {touched.phone && !phoneOk && <p id="phone-err" className="error">{t.checkout.phoneError}</p>}
        {fulfilment === 'delivery' && (<>
          <label htmlFor="addr"><h2 style={{ fontSize: 18 }}>{t.checkout.address}</h2></label>
          <textarea id="addr" rows={2} autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, address: true }))} aria-invalid={touched.address && !addressOk} aria-describedby="addr-err" className="field" />
          {touched.address && !addressOk && <p id="addr-err" className="error">{t.checkout.addressError}</p>}
        </>)}
      </section>
      <section className="panel" aria-label={t.checkout.payment}>
        <h2 style={{ fontSize: 18 }}>{t.checkout.payment}</h2>
        <div className="seg">
          <button aria-pressed="true">{payLabel}</button>
          <button disabled>{t.checkout.payOnline}<br /><span className="muted" style={{ fontSize: 13 }}>{t.checkout.comingPhase3}</span></button>
        </div>
      </section>
      <button className="btn btn-primary" onClick={place} disabled={placing}>{placing ? t.checkout.placing : `${t.checkout.place} · ${formatPKR(quote.total)}`}</button>
    </div>
  )
}

export function OrderPlaced({ reference, onDone }: { reference: string; onDone: () => void }) {
  return (
    <div className="stack" style={{ textAlign: 'center', paddingTop: 40 }}>
      <div className="photo" data-tint="green" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto', fontSize: 56 }}><span aria-hidden>✅</span></div>
      <h1>{t.placed.title}</h1>
      <p className="muted">{t.placed.reference} <strong>{reference}</strong>. {t.placed.body}</p>
      <button className="btn btn-primary" onClick={onDone}>{t.placed.done}</button>
    </div>
  )
}
