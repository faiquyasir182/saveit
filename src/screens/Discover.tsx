import { useMemo, useState } from 'react'
import { ListingCard } from '../components/ListingCard'
import { t } from '../i18n'
import { CATEGORIES, LISTINGS, NEIGHBOURHOODS } from '../data/demo'

export function Discover({ onOpen }: { onOpen: (id: string) => void }) {
  const [category, setCategory] = useState('all')
  const [area, setArea] = useState<string | null>(null)
  const results = useMemo(
    () => LISTINGS
      .filter((l) => (category === 'all' || l.category === category) && (!area || l.branch.neighbourhood === area))
      .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0)),
    [category, area],
  )
  return (
    <div className="stack">
      <header>
        <p className="muted" style={{ margin: 0 }}>{t.discover.eyebrow}</p>
        <h1 style={{ fontSize: 30 }}>{t.discover.title}</h1>
      </header>
      <nav className="cats" aria-label={t.discover.categories}>
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
            <span className="cat-circle" aria-hidden>{c.emoji}</span>{c.label}
          </button>
        ))}
      </nav>
      <div className="scroll-x" role="group" aria-label={t.discover.neighbourhood}>
        <button className="pill" aria-pressed={area === null} onClick={() => setArea(null)}>{t.discover.allAreas}</button>
        {NEIGHBOURHOODS.map((n) => (
          <button key={n} className="pill" aria-pressed={area === n} onClick={() => setArea(n)}>{n}</button>
        ))}
      </div>
      {results.length === 0 ? (
        <div className="empty panel">
          <h2>{t.discover.emptyTitle}</h2>
          <p className="muted">{t.discover.emptyBody}</p>
          <button className="btn btn-ghost" onClick={() => { setArea(null); setCategory('all') }}>{t.discover.emptyCta}</button>
        </div>
      ) : (
        results.map((l) => <ListingCard key={l.id} listing={l} onOpen={() => onOpen(l.id)} />)
      )}
    </div>
  )
}
