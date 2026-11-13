import type { Listing } from '../data/types'
import { t } from '../i18n'
import { discountPercent } from '../lib/discover'
import { formatPKR } from '../lib/format'
import { Icon } from './Icon'

interface Props { listing: Listing; favourite: boolean; onToggleFav: () => void; onOpen: () => void }

export function ListingCard({ listing, favourite, onToggleFav, onOpen }: Props) {
  const soldOut = listing.stock === 0
  return (
    <article className="card" data-tint={listing.tint} data-soldout={soldOut}>
      <button className="card-open" onClick={onOpen} aria-label={`${listing.title}, ${formatPKR(listing.price)}${soldOut ? `, ${t.listing.soldOut}` : ''}`}>
        <span className="card-photo">
          <span className="emoji" aria-hidden>{listing.emoji}</span>
          <span className="chip chip-off">{t.home.off(discountPercent(listing))}</span>
          {soldOut ? <span className="chip chip-out">{t.listing.soldOut}</span> : listing.stock <= 3 && <span className="chip chip-left">{t.listing.left(listing.stock)}</span>}
          {listing.kind === 'surprise' && <span className="chip chip-kind">{t.listing.surpriseBag}</span>}
        </span>
        <span className="card-text">
          <span className="card-title">{listing.title}</span>
          <span className="muted small">{listing.branch.merchantName} · {listing.branch.neighbourhood}</span>
        </span>
      </button>
      <span className="card-price"><span className="price">{formatPKR(listing.price)}</span><span className="was">{formatPKR(listing.originalPrice)}</span></span>
      <button className="fav" aria-pressed={favourite} aria-label={favourite ? t.favs.remove(listing.title) : t.favs.save(listing.title)} onClick={onToggleFav}><Icon name="heart" filled={favourite} /></button>
      <button className="bag-btn" tabIndex={-1} aria-hidden onClick={onOpen}><Icon name="bag" size={20} /></button>
    </article>
  )
}
