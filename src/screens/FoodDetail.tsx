import { useState } from 'react'
import { FoodImage } from '../components/FoodImage'
import { Icon } from '../components/Icon'
import type { ImageSlug } from '../data/categories'
import { FOOD_IMAGES } from '../data/images'
import type { Fulfilment, Listing } from '../data/types'
import { t } from '../i18n'
import { loc } from '../i18n/loc'
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
  const L = loc.listing(listing)
  const slug = listing.category as ImageSlug
  const credit = FOOD_IMAGES[slug]
  return (
    <div className="detail" style={{ ['--tile' as string]: `var(--tint-${listing.category})` }}>
      <section className="detail-media">
        <FoodImage slug={slug} variant="hero" priority className="detail-img" />
        <div className="detail-top">
          <button className="icon-btn on-photo" onClick={onBack} aria-label={d.back}><Icon name="back" /></button>
          <button className="icon-btn on-photo" aria-pressed={favourite} onClick={onToggleFav} aria-label={favourite ? t.favs.remove(L.title) : t.favs.save(L.title)}><Icon name="heart" filled={favourite} /></button>
        </div>
        <span className="chip chip-lg">{t.home.off(discountPercent(listing))}</span>
      </section>
      <section className="detail-sheet">
        <div className="spread" style={{ alignItems: 'start' }}>
          <h1>{L.title}</h1>
          <div className="price-block"><strong>{formatPKR(listing.price)}</strong><span className="was">{formatPKR(listing.originalPrice)}</span></div>
        </div>
        <div className="pin-row"><Icon name="pin" size={18} /><span>{loc.merchant(branch.merchantName)}, {loc.branch(branch.branchName)} · {loc.area(branch.neighbourhood)}</span></div>
        <div>
          <h2>{listing.kind === 'surprise' ? d.whatVaries : d.description}</h2>
          <p>{L.contents}{listing.minimumValue ? ` ${d.minimumValue}: ${formatPKR(listing.minimumValue)}.` : ''}</p>
        </div>
        <div className="tiles">
          <div className="tile"><span>{d.portion}</span><strong>{L.portion}</strong></div>
          <div className="tile"><span>{d.pickupWindow}</span><strong>{formatWindow(branch.pickupStart, branch.pickupEnd)}</strong></div>
          <div className="tile"><span>{d.left}</span><strong>{soldOut ? d.soldOutCta : listing.stock}</strong></div>
          <div className="tile"><span>{d.youSave}</span><strong>{formatPKR(listing.originalPrice - listing.price)} {d.perPortion}</strong></div>
        </div>
        <p className="muted small"><strong>{d.allergens}:</strong> {L.allergens}</p>
        {soldOut ? (
          <div className="panel"><h2>{d.soldOutTitle}</h2><p className="muted">{d.soldOutBody}</p><button className="btn btn-ghost" onClick={onBack}>{d.browseOther}</button></div>
        ) : (<>
          <section className="panel spread" aria-label={d.quantity}>
            <div><h2>{d.quantity}</h2><span className="muted small">{d.available(listing.stock)}</span></div>
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
        <p className="muted small credit">{t.repImage} {t.credit(credit.author, credit.licence)}</p>
      </section>
      <div className="cta-bar">
        <button className="btn btn-primary" disabled={!quote} onClick={() => onCheckout(qty, fulfilment)}>
          {soldOut ? d.soldOutCta : quote ? `${d.review} · ${formatPKR(quote.total)}` : d.review}
        </button>
      </div>
    </div>
  )
}
