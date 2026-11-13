import { useState } from 'react'
import { Icon } from '../components/Icon'
import type { Fulfilment, Listing } from '../data/types'
import { t } from '../i18n'
import { discountPercent } from '../lib/discover'
import { formatPKR, formatWindow } from '../lib/format'
import { QuoteError, quoteOrder } from '../lib/pricing'

interface Props { listing: Listing; favourite: boolean; onToggleFav: () => void; onBack: () => void; onCheckout: (qty: number, f: Fulfilment) => void }

export function FoodDetail({ listing, favourite, onToggleFav, onBack, onCheckout }: Props) {
  const soldOut = listing.stock === 0
  const canDeliver = listing.branch.deliveryCharge !== null
  const [qty, setQty] = useState(1)
  const [fulfilment, setFulfilment] = useState<Fulfilment>('pickup')
  let quote = null, error = null
  if (!soldOut) {
    try { quote = quoteOrder(listing, qty, fulfilment) } catch (e) { error = e instanceof QuoteError ? e.message : 'Something went wrong.' }
  }
  const { branch } = listing
  const d = t.detail
  return (
    <div className="detail" data-tint={listing.tint}>
      <section className="detail-hero">
        <div className="detail-top">
          <button className="circle-btn glass" onClick={onBack} aria-label={d.back}><Icon name="back" /></button>
          <h2>{d.title}</h2>
          <button className="circle-btn glass" aria-pressed={favourite} onClick={onToggleFav} aria-label={favourite ? t.favs.remove(listing.title) : t.favs.save(listing.title)} style={{ color: favourite ? 'var(--heart)' : undefined }}><Icon name="heart" filled={favourite} /></button>
        </div>
        <div className="detail-emoji" aria-hidden>{listing.emoji}</div>
        <span className="hero-chip a">{listing.kind === 'surprise' ? t.listing.surpriseBag : t.listing.exactItem}</span>
        <span className="hero-chip b">{t.home.off(discountPercent(listing))}</span>
        <span className="demo-tag">{t.home.demoImage}</span>
      </section>
      <section className="detail-sheet">
        <div className="spread" style={{ alignItems: 'start' }}>
          <h1>{listing.title}</h1>
          <div className="price-block"><span className="muted small">{d.price}</span><strong>{formatPKR(listing.price)}</strong><span className="was">{formatPKR(listing.originalPrice)}</span></div>
        </div>
        <div className="pin-row"><span className="pin-icon"><Icon name="pin" size={18} /></span><span>{branch.merchantName}, {branch.branchName} · {branch.neighbourhood}</span></div>
        <div>
          <h2 style={{ fontSize: 18 }}>{listing.kind === 'surprise' ? d.whatVaries : d.description}</h2>
          <p style={{ margin: '6px 0 0' }}>{listing.contents}{listing.minimumValue ? ` ${d.minimumValue}: ${formatPKR(listing.minimumValue)}.` : ''}</p>
        </div>
        <div className="tiles">
          <div className="tile" data-tint="yellow"><span>{d.portion}</span><strong>{listing.portion}</strong></div>
          <div className="tile" data-tint="peach"><span>{d.pickupWindow}</span><strong>{formatWindow(branch.pickupStart, branch.pickupEnd)}</strong></div>
          <div className="tile" data-tint="pink"><span>{d.left}</span><strong>{soldOut ? d.soldOutCta : listing.stock}</strong></div>
          <div className="tile" data-tint="green"><span>{d.youSave}</span><strong>{formatPKR(listing.originalPrice - listing.price)} {d.perPortion}</strong></div>
        </div>
        <p className="muted small" style={{ margin: 0 }}><strong>{d.allergens}:</strong> {listing.allergens}</p>
        {soldOut ? (
          <div className="panel"><h2 style={{ fontSize: 18 }}>{d.soldOutTitle}</h2><p className="muted" style={{ margin: 0 }}>{d.soldOutBody}</p><button className="btn btn-ghost" onClick={onBack}>{d.browseOther}</button></div>
        ) : (<>
          <section className="panel spread" aria-label={d.quantity}>
            <div><h2 style={{ fontSize: 18 }}>{d.quantity}</h2><span className="muted small">{d.available(listing.stock)}</span></div>
            <div className="stepper">
              <button className="icon-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={d.decrease}>−</button>
              <output aria-live="polite">{qty}</output>
              <button className="icon-btn" onClick={() => setQty((q) => Math.min(listing.stock, q + 1))} disabled={qty >= listing.stock} aria-label={d.increase}>+</button>
            </div>
          </section>
          <div className="seg" role="group" aria-label={d.fulfilment}>
            <button aria-pressed={fulfilment === 'pickup'} onClick={() => setFulfilment('pickup')}>{d.pickup}<br /><span className="muted small">{d.free}</span></button>
            <button aria-pressed={fulfilment === 'delivery'} disabled={!canDeliver} onClick={() => setFulfilment('delivery')}>{d.delivery}<br /><span className="muted small">{canDeliver ? `+ ${formatPKR(branch.deliveryCharge!)}` : d.notOffered}</span></button>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          {quote && (
            <dl className="lines" aria-label={d.summary}>
              <div><dt>{d.foodLine} ({qty} × {formatPKR(quote.unitPrice)})</dt><dd>{formatPKR(quote.foodSubtotal)}</dd></div>
              <div><dt>{fulfilment === 'pickup' ? d.pickup : d.delivery}</dt><dd>{quote.deliveryCharge ? formatPKR(quote.deliveryCharge) : d.free}</dd></div>
              <div className="total"><dt>{d.total}</dt><dd>{formatPKR(quote.total)}</dd></div>
            </dl>
          )}
        </>)}
      </section>
      <div className="cta-bar">
        <button className="btn btn-primary" disabled={!quote} onClick={() => onCheckout(qty, fulfilment)}>
          {soldOut ? d.soldOutCta : quote ? `${d.review} · ${formatPKR(quote.total)}` : d.review}
        </button>
      </div>
    </div>
  )
}
