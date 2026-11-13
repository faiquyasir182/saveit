import { useEffect, useState } from 'react'
import { LISTINGS } from './data/demo'
import type { Fulfilment } from './data/types'
import { Checkout, OrderPlaced } from './screens/Checkout'
import { Discover } from './screens/Discover'
import { FoodDetail } from './screens/FoodDetail'
import { RequestMeal } from './screens/RequestMeal'
import { Sponsor } from './screens/Sponsor'
import { Merchant } from './screens/Merchant'
import { t as s } from './i18n'

type Tab = 'discover' | 'negotiate' | 'sponsor' | 'orders'
type Route =
  | { name: 'discover' }
  | { name: 'detail'; id: string }
  | { name: 'checkout'; id: string; qty: number; fulfilment: Fulfilment }
  | { name: 'placed'; ref: string }

const TABS: { id: Tab; label: string; icon: string; phase?: string }[] = [
  { id: 'discover', label: s.tabs.discover, icon: '🍽️' },
  { id: 'negotiate', label: s.tabs.negotiate, icon: '🤝' },
  { id: 'sponsor', label: s.tabs.sponsor, icon: '💛' },
  { id: 'orders', label: s.tabs.orders, icon: '🧾', phase: 'Phase 3' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('discover')
  const [merchant, setMerchant] = useState(false)
  const [route, setRoute] = useState<Route>({ name: 'discover' })
  useEffect(() => { window.scrollTo(0, 0) }, [route, tab, merchant])
  const find = (id: string) => LISTINGS.find((l) => l.id === id)!

  let screen
  if (tab === 'negotiate') {
    screen = <RequestMeal />
  } else if (tab === 'sponsor') {
    screen = <Sponsor />
  } else if (tab !== 'discover') {
    const t = TABS.find((x) => x.id === tab)!
    screen = <div className="empty panel"><h2>{t.label}</h2><p className="muted">{s.plannedFor(t.phase!)}</p></div>
  } else if (route.name === 'detail') {
    screen = <FoodDetail listing={find(route.id)} onBack={() => setRoute({ name: 'discover' })} onCheckout={(qty, fulfilment) => setRoute({ name: 'checkout', id: route.id, qty, fulfilment })} />
  } else if (route.name === 'checkout') {
    screen = <Checkout listing={find(route.id)} qty={route.qty} fulfilment={route.fulfilment} onBack={() => setRoute({ name: 'detail', id: route.id })} onPlaced={(ref) => setRoute({ name: 'placed', ref })} />
  } else if (route.name === 'placed') {
    screen = <OrderPlaced reference={route.ref} onDone={() => setRoute({ name: 'discover' })} />
  } else {
    screen = <Discover onOpen={(id) => setRoute({ name: 'detail', id })} />
  }

  return (
    <>
      <main className="app">
        <div className="demo-banner" role="note">{s.demoBanner}</div>
        <button className="role-switch" onClick={() => setMerchant((m) => !m)}>{merchant ? s.merchant.switchBack : s.merchant.switchTo}</button>
        {merchant ? <Merchant /> : screen}
      </main>
      {!merchant && <nav className="dock" aria-label="Main">
        {TABS.map((t) => (
          <button key={t.id} aria-current={tab === t.id ? 'page' : undefined} onClick={() => { setTab(t.id); if (t.id === 'discover') setRoute({ name: 'discover' }) }}>
            <span aria-hidden>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>}
    </>
  )
}
