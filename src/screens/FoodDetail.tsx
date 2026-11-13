import { useState } from 'react'
import type { Fulfilment, Listing } from '../data/types'
import { formatPKR, formatWindow } from '../lib/format'
import { t } from '../i18n'
import { QuoteError, quoteOrder } from '../lib/pricing'

interface Props { listing: Listing; onBack: () => void; onCheckout: (qty: number, f: Fulfilment) => void }

export function FoodDetail({ listing, onBack, onCheckout }: Props) {
  const soldOut = listing.stock === 0
  const canDeliver = listing.branch.deliveryCharge !== null
  const [qty, setQty] = useState(1)
  const [fulfilment, setFulfilment] = useState<Fulfilment>('pickup')
  let quote = null, error = null
  if (!soldOut) {
    try { quote = quoteOrder(listing, qty, fulfilment) } catch (e) { error = e instanceof QuoteError ? e.message : 'Something went wrong.' }
  }
  const { branch } = listing
  return (
    <div className="stack">
      <div className="spread"><button className="icon-btn" onClick={onBack} aria-label={t.detail.back}>←</button></div>
      <div className="photo" data-tint={listing.tint} style={{ height: 240, fontSize: 120, borderRadius: 'var(--radius-lg)' }}>
        <span aria-hidden>{listing.emoji}</span>
        <span className="badge">{listing.kind === 'surprise' ? t.listing.surpriseBag : t.listing.exactItem}</span>
      </div>
      <div>
        <h1 style={{ fontSize: 26 }}>{listing.title}</h1>
        <p className="muted" style={{ margin: '4px 0 0' }}>{branch.merchantName}, {branch.branchName} · {branch.neighbourhood}</p>
      </div>
      <section className="panel" aria-label={t.detail.whatsInside}>
        <h2 style={{ fontSize: 18 }}>{listing.kind === 'surprise' ? t.detail.whatVaries : t.detail.whatsInside}</h2>
        <p style={{ margin: 0 }}>{listing.contents}</p>
        <dl className="lines">
          <div><dt>{t.detail.portion}</dt><dd>{listing.portion}</dd></div>
          {listing.minimumValue && <div><dt>{t.detail.minimumValue}</dt><dd>{formatPKR(listing.minimumValue)}</dd></div>}
          <div><dt>{t.detail.pickupWindow}</dt><dd>{formatWindow(branch.pickupStart, branch.pickupEnd)}</dd></div>
          <div><dt>{t.detail.allergens}</dt><dd style={{ textAlign: 'right', maxWidth: '60%' }}>{listing.allergens}</dd></div>
        </dl>
      </section>
      {soldOut ? (
        <div className="panel"><h2 style={{ fontSize: 18 }}>{t.detail.soldOutTitle}</h2><p className="muted" style={{ margin: 0 }}>{t.detail.soldOutBody}</p><button className="btn btn-ghost" onClick={onBack}>{t.detail.browseOther}</button></div>
      ) : (
        <>
          <section className="panel spread" aria-label={t.detail.quantity}>
            <div><h2 style={{ fontSize: 18 }}>{t.detail.quantity}</h2><span className="muted">{t.detail.available(listing.stock)}</span></div>
            <div className="stepper">
              <button className="icon-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={t.detail.decrease}>−</button>
              <output aria-live="polite">{qty}</output>
              <button className="icon-btn" onClick={() => setQty((q) => Math.min(listing.stock, q + 1))} disabled={qty >= listing.stock} aria-label={t.detail.increase}>+</button>
            </div>
          </section>
          <div className="seg" role="group" aria-label={t.detail.fulfilment}>
            <button aria-pressed={fulfilment === 'pickup'} onClick={() => setFulfilment('pickup')}>{t.detail.pickup}<br /><span className="muted" style={{ fontSize: 13 }}>{t.detail.free}</span></button>
            <button aria-pressed={fulfilment === 'delivery'} disabled={!canDeliver} onClick={() => setFulfilment('delivery')}>
              {t.detail.delivery}<br /><span className="muted" style={{ fontSize: 13 }}>{canDeliver ? `+ ${formatPKR(branch.deliveryCharge!)}` : t.detail.notOffered}</span>
            </button>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-primary" disabled={!quote} onClick={() => onCheckout(qty, fulfilment)}>
            {quote ? `${t.detail.review} · ${formatPKR(quote.total)}` : t.detail.review}
          </button>
        </>
      )}
    </div>
  )
}
