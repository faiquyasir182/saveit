import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { AppBar, type Tab, TabBar } from './components/AppBar'
import { Toast } from './components/Toast'
import { LISTINGS } from './data/demo'
import type { Fulfilment } from './data/types'
import { type Lang, getLang, initLang, setLang, t as s } from './i18n'
import { loc } from './i18n/loc'
import { Checkout, OrderPlaced } from './screens/Checkout'
import { Discover } from './screens/Discover'
import { FoodDetail } from './screens/FoodDetail'
import { Merchant } from './screens/Merchant'
import { RequestMeal } from './screens/RequestMeal'
import { Saved } from './screens/Saved'
import { Sponsor } from './screens/Sponsor'

type Route =
  | { name: 'discover' }
  | { name: 'detail'; id: string }
  | { name: 'checkout'; id: string; qty: number; fulfilment: Fulfilment }
  | { name: 'placed'; ref: string }

const FAV_KEY = 'saveit-favourites'
function loadFavourites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]')) } catch { return new Set() }
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(initLang)
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

  const toggleLang = () => { const next: Lang = getLang() === 'en' ? 'ur' : 'en'; setLang(next); setLangState(next) }
  const toggleFav = useCallback((id: string) => {
    const l = LISTINGS.find((x) => x.id === id)!
    const title = loc.listing(l).title
    const adding = !favourites.has(id)
    const next = new Set(favourites)
    if (adding) next.add(id); else next.delete(id)
    setFavourites(next)
    setToast(adding ? s.favs.saved(title) : s.favs.removed(title))
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...next])) } catch { /* private mode: keep in memory only */ }
  }, [favourites])

  const find = (id: string) => LISTINGS.find((l) => l.id === id)!
  const open = (id: string) => { setTab('discover'); setRoute({ name: 'detail', id }) }
  const goTab = (id: Tab) => { setTab(id); if (id === 'discover') setRoute({ name: 'discover' }) }
  const bar = (area?: string | null, onArea?: () => void, desktopOnly?: boolean) => (
    <AppBar tab={tab} onTab={goTab} lang={lang} onToggleLang={toggleLang} area={area} onArea={onArea} desktopOnly={desktopOnly} />
  )

  let screen: React.ReactNode
  let full = false // full-bleed screens render their own header
  if (tab === 'negotiate') screen = <RequestMeal />
  else if (tab === 'sponsor') screen = <Sponsor />
  else if (tab === 'saved') screen = <Saved favourites={favourites} onToggleFav={toggleFav} onOpen={open} onBrowse={() => goTab('discover')} />
  else if (tab === 'orders') screen = <div className="empty panel"><h2>{s.tabs.orders}</h2><p className="muted">{s.plannedFor('Phase 3')}</p></div>
  else if (route.name === 'detail') {
    full = true
    screen = <><div className="inner">{bar(undefined, undefined, true)}</div><FoodDetail key={route.id} listing={find(route.id)} favourite={favourites.has(route.id)} onToggleFav={() => toggleFav(route.id)} onBack={() => setRoute({ name: 'discover' })} onCheckout={(qty, fulfilment) => setRoute({ name: 'checkout', id: route.id, qty, fulfilment })} /></>
  } else if (route.name === 'checkout') {
    screen = <Checkout listing={find(route.id)} qty={route.qty} fulfilment={route.fulfilment} onBack={() => setRoute({ name: 'detail', id: route.id })} onPlaced={(ref) => setRoute({ name: 'placed', ref })} />
  } else if (route.name === 'placed') {
    screen = <OrderPlaced reference={route.ref} onDone={() => setRoute({ name: 'discover' })} />
  } else {
    full = true
    screen = <Discover favourites={favourites} onToggleFav={toggleFav} onOpen={open} renderBar={(area, onArea) => bar(area, onArea)} onNavigate={goTab} />
  }
  const showTabs = !merchant && (tab !== 'discover' || route.name === 'discover')

  return (
    <MotionConfig reducedMotion="user">
      <main className="app" data-tabs={showTabs}>
        <div className="strip" role="note">{s.demoBanner}<button className="role-switch" onClick={() => setMerchant((m) => !m)}>{merchant ? s.merchant.switchBack : s.merchant.switchTo}</button></div>
        {merchant ? <div className="page">{bar()}<Merchant /></div> : full ? screen : <div className="page">{bar()}{screen}</div>}
      </main>
      <Toast message={toast} />
      {showTabs && <TabBar tab={tab} onTab={goTab} />}
    </MotionConfig>
  )
}
