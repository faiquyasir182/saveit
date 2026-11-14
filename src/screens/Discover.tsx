import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { type ReactNode, useMemo, useState } from 'react'
import { CategoryButton, EASE_OUT } from '../components/CategoryButton'
import { FilterDrawer } from '../components/FilterDrawer'
import { Icon } from '../components/Icon'
import { ListingCard } from '../components/ListingCard'
import { CATEGORY_IDS } from '../data/categories'
import { LISTINGS } from '../data/demo'
import { useOffersStatus } from '../hooks/useOffersStatus'
import { t } from '../i18n'
import { DEFAULT_FILTERS, type Filters, drawerFilterCount, filterListings } from '../lib/discover'

interface Props {
  favourites: Set<string>; onToggleFav: (id: string) => void; onOpen: (id: string) => void
  /** Renders the shared app bar with the area chip wired to this screen's filter drawer. */
  renderBar: (area: string | null, onArea: () => void) => ReactNode
  onNavigate: (tab: 'negotiate' | 'sponsor') => void
}

export function Discover({ favourites, onToggleFav, onOpen, renderBar, onNavigate }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [drawer, setDrawer] = useState(false)
  const { status, retry } = useOffersStatus()
  const results = useMemo(() => filterListings(LISTINGS, filters), [filters])
  const nDrawer = drawerFilterCount(filters)
  const reset = () => setFilters(DEFAULT_FILTERS)
  const copy = t.categoryCopy[filters.category as keyof typeof t.categoryCopy]

  return (
    <>
      <header className="home-head">
        <div className="tints" aria-hidden>
          {CATEGORY_IDS.map((id) => (
            <motion.div key={id} className="tint" style={{ background: `var(--tint-${id})` }} initial={false} animate={{ opacity: id === filters.category ? 1 : 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
          ))}
        </div>
        <div className="inner">
          {renderBar(filters.area, () => setDrawer(true))}
          <div className="search" role="search">
            <Icon name="search" size={20} />
            <input type="search" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder={t.home.search} aria-label={t.home.search} />
            <button className="icon-btn filter-btn" onClick={() => setDrawer(true)} aria-label={`${t.filters.open}${nDrawer ? ` (${nDrawer})` : ''}`}>
              <Icon name="sliders" size={20} />{nDrawer > 0 && <span className="count-dot" aria-hidden>{nDrawer}</span>}
            </button>
          </div>
          <LayoutGroup id="home-categories">
            <nav className="cats" aria-label={t.discover.categories}>
              {CATEGORY_IDS.map((id) => <CategoryButton key={id} id={id} animated active={filters.category === id} onSelect={() => setFilters((f) => ({ ...f, category: id }))} />)}
            </nav>
          </LayoutGroup>
        </div>
      </header>
      <section className="sheet" aria-labelledby="sheet-title">
        <div className="inner">
          <div className="sheet-head">
            <motion.div key={filters.category} className="sheet-copy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE_OUT }}>
              <h2 id="sheet-title">{copy.title}</h2>
              <p className="muted">{copy.blurb}</p>
            </motion.div>
            {status === 'ready' && <span className="muted small" aria-live="polite">{t.home.results(results.length)}</span>}
          </div>
          {status === 'loading' ? (
            <div className="grid" aria-busy="true" aria-label={t.home.loading}>{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 270 }} />)}</div>
          ) : status === 'error' ? (
            <div className="panel empty" role="alert"><h2>{t.home.loadError}</h2><p className="muted">{t.home.loadErrorBody}</p><button className="btn btn-ghost" onClick={retry}>{t.home.retry}</button></div>
          ) : results.length === 0 ? (
            <div className="panel empty"><h2>{t.discover.emptyTitle}</h2><p className="muted">{t.discover.emptyBody}</p><button className="btn btn-ghost" onClick={reset}>{t.discover.emptyCta}</button></div>
          ) : (
            <div className="grid">
              <AnimatePresence mode="popLayout">
                {results.map((l, i) => (
                  <motion.div key={l.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 0.3, ease: EASE_OUT, delay: Math.min(i, 5) * 0.03 }, layout: { duration: 0.3, ease: EASE_OUT } }}>
                    <ListingCard listing={l} favourite={favourites.has(l.id)} onToggleFav={() => onToggleFav(l.id)} onOpen={() => onOpen(l.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div className="home-links">
            <button onClick={() => onNavigate('negotiate')}><strong>{t.homeLinks.requestTitle}</strong><span className="muted">{t.homeLinks.requestBody}</span></button>
            <button onClick={() => onNavigate('sponsor')}><strong>{t.homeLinks.sponsorTitle}</strong><span className="muted">{t.homeLinks.sponsorBody}</span></button>
          </div>
        </div>
      </section>
      {drawer && <FilterDrawer filters={filters} onClose={() => setDrawer(false)} onApply={(f) => { setFilters(f); setDrawer(false) }} />}
    </>
  )
}
