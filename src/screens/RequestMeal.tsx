import { useEffect, useState } from 'react'
import { CategoryButton } from '../components/CategoryButton'
import { CATEGORY_IDS } from '../data/categories'
import { NEIGHBOURHOODS, RESPONDERS } from '../data/demo'
import type { Fulfilment } from '../data/types'
import { t } from '../i18n'
import { loc } from '../i18n/loc'
import { formatKarachiTime, formatPKR } from '../lib/format'
import { type MealRequest, type Offer, RequestError, isExpired, respond, selectOffer } from '../lib/negotiation'
import { OrderPlaced } from './Checkout'

const s = t.request
const TIMES = [30, 45, 60, 120]
const fmtLeft = (ms: number) => { const sec = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` }

export function RequestMeal() {
  const [form, setForm] = useState({ category: 'biryani', portion: 'single' as MealRequest['portion'], quantity: 2, neighbourhood: 'Clifton', fulfilment: 'pickup' as Fulfilment, minutes: 60, price: '300' })
  const [step, setStep] = useState<'form' | 'sending' | 'offers' | 'placed'>('form')
  const [offers, setOffers] = useState<Offer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  const [ref, setRef] = useState('')
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (step !== 'offers') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [step])

  function send() {
    const at = Date.now()
    const req: MealRequest = { category: form.category, portion: form.portion, quantity: form.quantity, neighbourhood: form.neighbourhood, fulfilment: form.fulfilment, neededBy: new Date(at + form.minutes * 60_000).toISOString(), proposedUnit: Number(form.price) }
    try {
      const result = respond(req, RESPONDERS, at)
      setError(null); setStep('sending')
      setTimeout(() => { setOffers(result); setNow(Date.now()); setStep('offers') }, 1200)
    } catch (e) { setError(e instanceof RequestError ? e.message : 'Something went wrong.') }
  }

  function choose(id: string) {
    try { selectOffer(offers, id, Date.now()); setRef(`DEMO-R${Math.floor(1000 + Math.random() * 9000)}`); setStep('placed') }
    catch (e) { setError(e instanceof RequestError ? e.message : 'Something went wrong.'); setNow(Date.now()) }
  }

  if (step === 'placed') return <OrderPlaced reference={ref} onDone={() => { setStep('form'); setOffers([]) }} />

  if (step === 'offers' || step === 'sending') {
    const live = offers.filter((o) => o.kind !== 'decline')
    const declined = offers.length - live.length
    return (
      <div className="stack">
        <div className="row"><button className="icon-btn" onClick={() => setStep('form')} aria-label={s.edit}>←</button><h1 style={{ fontSize: 24 }}>{step === 'sending' ? s.sending : s.offersTitle(live.length)}</h1></div>
        {step === 'sending' ? (
          <div className="stack" aria-busy="true">{[0, 1].map((i) => <div key={i} className="panel skeleton" style={{ height: 150 }} />)}</div>
        ) : live.length === 0 ? (
          <div className="empty panel"><h2>{s.noOffers}</h2><p className="muted">{s.noOffersBody}</p><button className="btn btn-ghost" onClick={() => setStep('form')}>{s.edit}</button></div>
        ) : (<>
          <p className="muted" style={{ margin: 0 }}>{s.offersIntro} {s.yourPrice(formatPKR(Number(form.price)))} {s.perPortion}.</p>
          {error && <p className="error" role="alert">{error}</p>}
          {live.map((o) => {
            const expired = isExpired(o, now)
            return (
              <article key={o.id} className="panel offer" data-kind={o.kind} aria-disabled={expired}>
                <div className="spread">
                  <span className={`tag tag-${o.kind}`}>{o.kind === 'accept' ? s.accepted : s.counter}</span>
                  <span className={`muted ${expired ? 'error' : ''}`} style={{ fontSize: 13 }} aria-live="off">{expired ? s.expired : s.expiresIn(fmtLeft(Date.parse(o.expiresAt) - now))}</span>
                </div>
                <div><h3>{o.dish}</h3><span className="muted">{loc.merchant(o.branch.merchantName)} · {loc.area(o.branch.neighbourhood)}</span></div>
                <dl className="lines">
                  <div><dt>{o.quantity} × {formatPKR(o.unitPrice)} {form.portion === 'family' ? `(${t.request.family})` : ''}</dt><dd>{formatPKR(o.foodTotal)}</dd></div>
                  {form.fulfilment === 'delivery' && <div><dt>{t.detail.delivery}</dt><dd>{formatPKR(o.deliveryCharge)}</dd></div>}
                  <div><dt>{s.ready}</dt><dd>{formatKarachiTime(o.readyAt)}</dd></div>
                  <div className="total"><dt>{t.checkout.total}</dt><dd>{formatPKR(o.total)}</dd></div>
                </dl>
                <button className="btn btn-primary" disabled={expired} onClick={() => choose(o.id)}>{expired ? s.expired : `${s.choose} · ${formatPKR(o.total)}`}</button>
              </article>
            )
          })}
          {declined > 0 && <details className="muted"><summary>{s.declined(declined)}</summary>{offers.filter((o) => o.kind === 'decline').map((o) => <p key={o.id} style={{ margin: '6px 0' }}>{loc.merchant(o.branch.merchantName)}: {o.declineReason}</p>)}</details>}
          <button className="btn btn-ghost" onClick={() => setStep('form')}>{s.newRequest}</button>
        </>)}
      </div>
    )
  }

  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); send() }}>
      <header><h1 style={{ fontSize: 30 }}>{s.title}</h1><p className="muted" style={{ margin: '6px 0 0' }}>{s.intro}</p></header>
      <fieldset className="panel"><legend className="sr-only">{s.category}</legend><h2 style={{ fontSize: 18 }} aria-hidden>{s.category}</h2>
        <div className="cats">{CATEGORY_IDS.filter((id) => id !== 'all').map((id) => <CategoryButton key={id} id={id} active={form.category === id} onSelect={() => set('category', id)} />)}</div>
      </fieldset>
      <section className="panel">
        <h2 style={{ fontSize: 18 }}>{s.portion}</h2>
        <div className="seg" role="group" aria-label={s.portion}>
          {(['single', 'family'] as const).map((p) => <button type="button" key={p} aria-pressed={form.portion === p} onClick={() => set('portion', p)}>{s[p]}</button>)}
        </div>
        <div className="spread"><h2 style={{ fontSize: 18 }}>{s.quantity}</h2>
          <div className="stepper">
            <button type="button" className="icon-btn" onClick={() => set('quantity', Math.max(1, form.quantity - 1))} disabled={form.quantity <= 1} aria-label={t.detail.decrease}>−</button>
            <output aria-live="polite">{form.quantity}</output>
            <button type="button" className="icon-btn" onClick={() => set('quantity', Math.min(50, form.quantity + 1))} aria-label={t.detail.increase}>+</button>
          </div>
        </div>
      </section>
      <section className="panel">
        <h2 style={{ fontSize: 18 }}>{s.area}</h2>
        <div className="scroll-x" role="group" aria-label={s.area}>{NEIGHBOURHOODS.map((n) => <button type="button" key={n} className="pill" aria-pressed={form.neighbourhood === n} onClick={() => set('neighbourhood', n)}>{loc.area(n)}</button>)}</div>
        <div className="seg" role="group" aria-label={t.detail.fulfilment}>
          <button type="button" aria-pressed={form.fulfilment === 'pickup'} onClick={() => set('fulfilment', 'pickup')}>{t.detail.pickup}</button>
          <button type="button" aria-pressed={form.fulfilment === 'delivery'} onClick={() => set('fulfilment', 'delivery')}>{t.detail.delivery}</button>
        </div>
        <h2 style={{ fontSize: 18 }}>{s.neededBy}</h2>
        <div className="scroll-x" role="group" aria-label={s.neededBy}>{TIMES.map((m) => <button type="button" key={m} className="pill" aria-pressed={form.minutes === m} onClick={() => set('minutes', m)}>{s.inMinutes(m)}</button>)}</div>
      </section>
      <section className="panel">
        <label htmlFor="price"><h2 style={{ fontSize: 18 }}>{s.price}</h2></label>
        <div className="price-input"><span aria-hidden>Rs</span><input id="price" className="field" inputMode="numeric" value={form.price} onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} aria-describedby="price-hint" /></div>
        <span id="price-hint" className="muted" style={{ fontSize: 13 }}>{s.priceHint}</span>
      </section>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit">{s.send}</button>
    </form>
  )
}
