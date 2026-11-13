import type { Listing } from '../data/types'
import { t } from '../i18n'
import { formatPKR, formatWindow } from '../lib/format'

export function ListingCard({ listing, onOpen }: { listing: Listing; onOpen: () => void }) {
  const soldOut = listing.stock === 0
  return (
    <button className="card" onClick={onOpen} aria-disabled={soldOut} aria-label={`${listing.title}, ${formatPKR(listing.price)}${soldOut ? `, ${t.listing.soldOut}` : ''}`}>
      <div className="photo" data-tint={listing.tint}>
        <span aria-hidden>{listing.emoji}</span>
        <span className="badge">{listing.kind === 'surprise' ? t.listing.surpriseBag : listing.portion}</span>
        {soldOut ? <span className="badge badge-right badge-out">{t.listing.soldOut}</span> : listing.stock <= 3 && <span className="badge badge-right">{t.listing.left(listing.stock)}</span>}
      </div>
      <div className="card-body">
        <div className="spread">
          <h3>{listing.title}</h3>
        </div>
        <span className="muted">{listing.branch.merchantName} · {listing.branch.neighbourhood}</span>
        <div className="spread">
          <span className="row"><span className="price">{formatPKR(listing.price)}</span><span className="was">{formatPKR(listing.originalPrice)}</span></span>
          <span className="muted" style={{ fontSize: 13 }}>{t.listing.pickup} {formatWindow(listing.branch.pickupStart, listing.branch.pickupEnd)}</span>
        </div>
      </div>
    </button>
  )
}
