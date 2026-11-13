import { ListingCard } from '../components/ListingCard'
import { LISTINGS } from '../data/demo'
import { t } from '../i18n'

interface Props { favourites: Set<string>; onToggleFav: (id: string) => void; onOpen: (id: string) => void; onBrowse: () => void }

export function Saved({ favourites, onToggleFav, onOpen, onBrowse }: Props) {
  const saved = LISTINGS.filter((l) => favourites.has(l.id))
  return (
    <div className="stack">
      <h1 style={{ fontSize: 28 }}>{t.favs.title}</h1>
      {saved.length === 0 ? (
        <div className="panel empty"><h2>{t.favs.emptyTitle}</h2><p className="muted" style={{ margin: 0 }}>{t.favs.emptyBody}</p><button className="btn btn-ghost" onClick={onBrowse}>{t.favs.browse}</button></div>
      ) : (
        <div className="grid">{saved.map((l) => <ListingCard key={l.id} listing={l} favourite onToggleFav={() => onToggleFav(l.id)} onOpen={() => onOpen(l.id)} />)}</div>
      )}
    </div>
  )
}
