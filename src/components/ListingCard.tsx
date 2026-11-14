import type { ImageSlug } from '../data/categories'
import type { Listing } from '../data/types'
import { t } from '../i18n'
import { loc } from '../i18n/loc'
import { discountPercent } from '../lib/discover'
import { formatPKR, formatWindow } from '../lib/format'
import { FoodImage } from './FoodImage'
import { Icon } from './Icon'

interface Props { listing: Listing; favourite: boolean; onToggleFav: () => void; onOpen: () => void }

/** One tap opens the details page; reserving happens there. The heart is the only other action. */
export function ListingCard({ listing, favourite, onToggleFav, onOpen }: Props) {
  const soldOut = listing.stock === 0
  const L = loc.listing(listing)
  const { branch } = listing
  return (
    <article className="card" data-soldout={soldOut}>
      <button className="card-open" onClick={onOpen} aria-label={`${L.title}, ${formatPKR(listing.price)}${soldOut ? `, ${t.listing.soldOut}` : ''}`}>
        <span className="card-media">
          <FoodImage slug={listing.category as ImageSlug} variant="card" />
          <span className="chip">{t.home.off(discountPercent(listing))}</span>
          {soldOut && <span className="chip chip-out">{t.listing.soldOut}</span>}
        </span>
        <span className="card-body">
          <span className="card-title">{L.title}</span>
          <span className="card-sub">{loc.merchant(branch.merchantName)} · {loc.area(branch.neighbourhood)}</span>
          <span className="card-kind">{listing.kind === 'surprise' ? t.listing.surpriseBag : L.portion}</span>
          <span className="card-price"><span className="price">{formatPKR(listing.price)}</span><span className="was">{formatPKR(listing.originalPrice)}</span></span>
          <span className="card-sub">{t.listing.pickup} {formatWindow(branch.pickupStart, branch.pickupEnd)}{!soldOut && listing.stock <= 3 ? ` · ${t.listing.left(listing.stock)}` : ''}</span>
        </span>
      </button>
      <button className="fav" aria-pressed={favourite} aria-label={favourite ? t.favs.remove(L.title) : t.favs.save(L.title)} onClick={onToggleFav}><Icon name="heart" size={20} filled={favourite} /></button>
    </article>
  )
}
