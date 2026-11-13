import { useMemo, useState } from 'react'
import { FilterDrawer } from '../components/FilterDrawer'
import { Icon } from '../components/Icon'
import { ListingCard } from '../components/ListingCard'
import { CATEGORIES, LISTINGS } from '../data/demo'
import { useOffersStatus } from '../hooks/useOffersStatus'
import { t } from '../i18n'
import { DEFAULT_FILTERS, type Filters, drawerFilterCount, filterListings } from '../lib/discover'

interface Props { favourites: Set<string>; onToggleFav: (id: string) => void; onOpen: (id: string) => void; onNotify: (msg: string) => void }

export function Discover({ favourites, onToggleFav, onOpen, onNotify }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [drawer, setDrawer] = useState(false)
  const { status, retry } = useOffersStatus()
  const results = useMemo(() => filterListings(LISTINGS, filters), [filters])
  const nDrawer = drawerFilterCount(filters)
  const reset = () => setFilters(DEFAULT_FILTERS)

  return (
    <>
      <header className="hero">
        <div className="inner">
          <div className="loc-row">
            <button className="circle-btn glass" onClick={() => setDrawer(true)} aria-label={t.home.changeArea}><Icon name="pin" /></button>
            <button className="loc-text" onClick={() => setDrawer(true)}><span>{t.home.location}</span><strong>{t.home.area(filters.area)}</strong></button>
            <button className="circle-btn glass" onClick={() => onNotify(t.home.notifications)} aria-label={t.home.notifButton}><Icon name="bell" /></button>
          </div>
          <div className="search" role="search">
            <Icon name="search" />
            <input type="search" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder={t.home.search} aria-label={t.home.search} />
            <button className="circle-btn filter-btn" onClick={() => setDrawer(true)} aria-label={`${t.filters.open}${nDrawer ? ` (${nDrawer})` : ''}`}>
              <Icon name="sliders" />{nDrawer > 0 && <span className="count-dot" aria-hidden>{nDrawer}</span>}
            </button>
          </div>
          <nav className="cats" aria-label={t.discover.categories}>
            {CATEGORIES.map((c, i) => (
              <button key={c.id} className="cat" aria-pressed={filters.category === c.id} onClick={() => setFilters({ ...filters, category: c.id })}>
                <span className="cat-circle" data-tint={(['green', 'yellow', 'pink', 'peach'] as const)[i % 4]} aria-hidden><span>{c.emoji}</span></span>{c.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <section className="sheet" aria-labelledby="popular">
        <div className="inner">
          <div className="sheet-head">
            <h2 id="popular">{t.home.popular}</h2>
            {status === 'ready' && <span className="muted small" aria-live="polite">{t.home.results(results.length)}</span>}
            <button className="link-btn" onClick={reset}>{t.home.seeAll}</button>
          </div>
          {status === 'loading' ? (
            <div className="grid" aria-busy="true" aria-label={t.home.loading}>{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 250 }} />)}</div>
          ) : status === 'error' ? (
            <div className="panel empty" role="alert"><h2>{t.home.loadError}</h2><p className="muted" style={{ margin: 0 }}>{t.home.loadErrorBody}</p><button className="btn btn-ghost" onClick={retry}>{t.home.retry}</button></div>
          ) : results.length === 0 ? (
            <div className="panel empty"><h2>{t.discover.emptyTitle}</h2><p className="muted" style={{ margin: 0 }}>{t.discover.emptyBody}</p><button className="btn btn-ghost" onClick={reset}>{t.discover.emptyCta}</button></div>
          ) : (
            <div className="grid">{results.map((l) => <ListingCard key={l.id} listing={l} favourite={favourites.has(l.id)} onToggleFav={() => onToggleFav(l.id)} onOpen={() => onOpen(l.id)} />)}</div>
          )}
        </div>
      </section>
      {drawer && <FilterDrawer filters={filters} onClose={() => setDrawer(false)} onApply={(f) => { setFilters(f); setDrawer(false) }} />}
    </>
  )
}
