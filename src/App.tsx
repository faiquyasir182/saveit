import { useCallback, useEffect, useState } from 'react'
import { Icon, type IconName } from './components/Icon'
import { Toast } from './components/Toast'
import { LISTINGS } from './data/demo'
import type { Fulfilment } from './data/types'
import { t as s } from './i18n'
import { Checkout, OrderPlaced } from './screens/Checkout'
import { Discover } from './screens/Discover'
import { FoodDetail } from './screens/FoodDetail'
import { Merchant } from './screens/Merchant'
import { RequestMeal } from './screens/RequestMeal'
import { Saved } from './screens/Saved'
import { Sponsor } from './screens/Sponsor'

type Tab = 'discover' | 'negotiate' | 'sponsor' | 'saved' | 'orders'
type Route =
  | { name: 'discover' }
  | { name: 'detail'; id: string }
  | { name: 'checkout'; id: string; qty: number; fulfilment: Fulfilment }
  | { name: 'placed'; ref: string }

const NAV: { id: Tab; icon: IconName }[] = [
  { id: 'discover', icon: 'home' },
  { id: 'negotiate', icon: 'chat' },
  { id: 'saved', icon: 'bookmark' },
  { id: 'orders', icon: 'receipt' },
]
const FAV_KEY = 'kfa-favourites'

function loadFavourites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]')) } catch { return new Set() }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('discover')
  const [route, setRoute] = useState<Route>({ name: 'discover' })
  const [merchant, setMerchant] = useState(false)
  const [favourites, setFavourites] = useState<Set<string>>(loadFavourites)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [route, tab, merchant])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const toggleFav = useCallback((id: string) => {
    const l = LISTINGS.find((x) => x.id === id)!
    setFavourites((prev) => {
      const next = new Set(prev)
      const adding = !next.delete(id)
      if (adding) next.add(id)
      setToast(adding ? s.favs.saved(l.title) : s.favs.removed(l.title))
      try { localStorage.setItem(FAV_KEY, JSON.stringify([...next])) } catch { /* private mode: keep in memory only */ }
      return next
    })
  }, [])

  const find = (id: string) => LISTINGS.find((l) => l.id === id)!
  const open = (id: string) => { setTab('discover'); setRoute({ name: 'detail', id }) }
  const goTab = (id: Tab) => { setTab(id); if (id === 'discover') setRoute({ name: 'discover' }) }

  let screen: React.ReactNode
  let full = false // full-bleed screens manage their own width
  if (tab === 'negotiate') screen = <RequestMeal />
  else if (tab === 'sponsor') screen = <Sponsor />
  else if (tab === 'saved') screen = <Saved favourites={favourites} onToggleFav={toggleFav} onOpen={open} onBrowse={() => goTab('discover')} />
  else if (tab === 'orders') screen = <div className="empty panel"><h2>{s.tabs.orders}</h2><p className="muted" style={{ margin: 0 }}>{s.plannedFor('Phase 3')}</p></div>
  else if (route.name === 'detail') {
    full = true
    screen = <FoodDetail key={route.id} listing={find(route.id)} favourite={favourites.has(route.id)} onToggleFav={() => toggleFav(route.id)} onBack={() => setRoute({ name: 'discover' })} onCheckout={(qty, fulfilment) => setRoute({ name: 'checkout', id: route.id, qty, fulfilment })} />
  } else if (route.name === 'checkout') {
    screen = <Checkout listing={find(route.id)} qty={route.qty} fulfilment={route.fulfilment} onBack={() => setRoute({ name: 'detail', id: route.id })} onPlaced={(ref) => setRoute({ name: 'placed', ref })} />
  } else if (route.name === 'placed') {
    screen = <OrderPlaced reference={route.ref} onDone={() => setRoute({ name: 'discover' })} />
  } else {
    full = true
    screen = <Discover favourites={favourites} onToggleFav={toggleFav} onOpen={open} onNotify={setToast} />
  }
  const showDock = !merchant && (tab !== 'discover' || route.name === 'discover')

  return (
    <>
      <main className="app">
        <div className="strip" role="note">{s.demoBanner}<button className="role-switch" onClick={() => setMerchant((m) => !m)}>{merchant ? s.merchant.switchBack : s.merchant.switchTo}</button></div>
        {merchant ? <div className="page"><Merchant /></div> : full ? screen : <div className="page">{screen}</div>}
      </main>
      <Toast message={toast} />
      {showDock && (
        <nav className="dock" aria-label="Main">
          {NAV.slice(0, 2).map((n) => <button key={n.id} className="tab" aria-current={tab === n.id ? 'page' : undefined} onClick={() => goTab(n.id)}><Icon name={n.icon} />{s.tabs[n.id]}</button>)}
          <div className="fab-slot" data-active={tab === 'sponsor'}>
            <button className="fab" aria-label={s.sponsorFab} aria-current={tab === 'sponsor' ? 'page' : undefined} onClick={() => goTab('sponsor')}><Icon name="heart" size={26} filled /></button>
            {s.tabs.sponsor}
          </div>
          {NAV.slice(2).map((n) => <button key={n.id} className="tab" aria-current={tab === n.id ? 'page' : undefined} onClick={() => goTab(n.id)}><Icon name={n.icon} />{s.tabs[n.id]}</button>)}
        </nav>
      )}
    </>
  )
}
