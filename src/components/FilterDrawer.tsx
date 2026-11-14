import { useEffect, useRef, useState } from 'react'
import { NEIGHBOURHOODS } from '../data/demo'
import { t } from '../i18n'
import { loc } from '../i18n/loc'
import { DEFAULT_FILTERS, type Filters, type Sort } from '../lib/discover'
import { Icon } from './Icon'

interface Props { filters: Filters; onApply: (f: Filters) => void; onClose: () => void }
const SORTS: Sort[] = ['ending', 'price-asc', 'price-desc', 'saving']

/** Bottom-sheet dialog. Moves focus in, traps Tab, closes on Escape, restores focus on close. */
export function FilterDrawer({ filters, onApply, onClose }: Props) {
  const [draft, setDraft] = useState(filters)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    return () => opener?.focus()
  }, [])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab') return
    const items = ref.current!.querySelectorAll<HTMLElement>('button, input')
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true" aria-label={t.filters.title} ref={ref} onKeyDown={onKeyDown}>
        <div className="spread"><h2>{t.filters.title}</h2><button className="icon-btn" onClick={onClose} aria-label={t.filters.close}><Icon name="close" /></button></div>
        <section><h3>{t.filters.area}</h3>
          <div className="scroll-x" style={{ flexWrap: 'wrap' }} role="group" aria-label={t.filters.area}>
            <button className="pill" aria-pressed={draft.area === null} onClick={() => setDraft({ ...draft, area: null })}>{t.filters.allAreas}</button>
            {NEIGHBOURHOODS.map((n) => <button key={n} className="pill" aria-pressed={draft.area === n} onClick={() => setDraft({ ...draft, area: n })}>{loc.area(n)}</button>)}
          </div>
        </section>
        <section><h3>{t.filters.sort}</h3>
          <div className="scroll-x" style={{ flexWrap: 'wrap' }} role="group" aria-label={t.filters.sort}>
            {SORTS.map((s) => <button key={s} className="pill" aria-pressed={draft.sort === s} onClick={() => setDraft({ ...draft, sort: s })}>{t.filters.sorts[s]}</button>)}
          </div>
        </section>
        <label className="check"><input type="checkbox" checked={draft.inStockOnly} onChange={(e) => setDraft({ ...draft, inStockOnly: e.target.checked })} />{t.filters.inStock}</label>
        <div className="drawer-actions">
          <button className="btn btn-ghost" onClick={() => setDraft({ ...draft, area: DEFAULT_FILTERS.area, sort: DEFAULT_FILTERS.sort, inStockOnly: false })}>{t.filters.reset}</button>
          <button className="btn btn-primary" onClick={() => onApply(draft)}>{t.filters.apply}</button>
        </div>
      </div>
    </>
  )
}
