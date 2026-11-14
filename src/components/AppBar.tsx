import { type Lang, t } from '../i18n'
import { loc } from '../i18n/loc'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'

export type Tab = 'discover' | 'negotiate' | 'sponsor' | 'saved' | 'orders'
export const NAV: { id: Tab; icon: IconName }[] = [
  { id: 'discover', icon: 'home' }, { id: 'negotiate', icon: 'chat' }, { id: 'sponsor', icon: 'heart' }, { id: 'saved', icon: 'bookmark' }, { id: 'orders', icon: 'receipt' },
]

interface Props {
  tab: Tab; onTab: (t: Tab) => void; lang: Lang; onToggleLang: () => void
  /** Shows the area chip (Home only). */
  area?: string | null; onArea?: () => void
  /** Hide on phones (used by the details screen, which has its own back bar). */
  desktopOnly?: boolean
}

export function AppBar({ tab, onTab, lang, onToggleLang, area, onArea, desktopOnly }: Props) {
  const areaName = area ? loc.area(area) : t.filters.allAreas
  return (
    <div className={`appbar${desktopOnly ? ' appbar--desktop' : ''}`}>
      <button className="logo-btn" onClick={() => onTab('discover')} aria-label="Saveit"><Logo /></button>
      <nav className="topnav" aria-label={t.appNav}>
        {NAV.map((n) => <button key={n.id} aria-current={tab === n.id ? 'page' : undefined} onClick={() => onTab(n.id)}>{t.tabs[n.id]}</button>)}
      </nav>
      <div className="appbar-actions">
        {onArea && <button className="loc-chip" onClick={onArea} aria-label={t.home.areaAria(areaName)}><Icon name="pin" size={18} /><span>{areaName}</span></button>}
        <button className="lang-btn" onClick={onToggleLang} aria-label={t.lang.switchAria} lang={lang === 'en' ? 'ur' : 'en'}>{t.lang.switchLabel}</button>
      </div>
    </div>
  )
}

export function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label={t.appNav}>
      {NAV.map((n) => <button key={n.id} aria-current={tab === n.id ? 'page' : undefined} onClick={() => onTab(n.id)}><Icon name={n.icon} size={22} /><span>{t.tabs[n.id]}</span></button>)}
    </nav>
  )
}
