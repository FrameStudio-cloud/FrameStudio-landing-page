import { useRef, useState } from 'react'
import DeviceFrame from './DeviceFrame'
import BotChatDemo from './BotChatDemo'
import DashboardPanel from './DashboardPanel'

/**
 * One window chrome, three tabs, mirrored from `components/developers/ComponentLab`
 * so keyboard behaviour on this site is the same wherever a tablist appears.
 *
 * The demos are the only thing behind a tab. All written copy — the promises,
 * the deliverables, the exclusions, the timelines — sits outside this component
 * in normal sections, because `prerender.js` captures the open tab and a crawler
 * would never see the other two.
 */

const TABS = [
  { id: 'website', label: 'Website', note: 'Sample data' },
  { id: 'bot', label: 'Bot', note: 'Sample data' },
  { id: 'dashboard', label: 'Dashboard', note: 'Live product' },
]

const PANELS = {
  website: DeviceFrame,
  bot: BotChatDemo,
  dashboard: DashboardPanel,
}

export default function ServiceConsole() {
  const [active, setActive] = useState('website')
  const tabRefs = useRef([])

  const tab = TABS.find((item) => item.id === active) || TABS[0]
  const Panel = PANELS[active]

  const focusTab = (index) => {
    const next = TABS[index]
    if (!next) return
    setActive(next.id)
    tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab((index + 1) % TABS.length)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab((index - 1 + TABS.length) % TABS.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(TABS.length - 1)
    }
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-ink/10 bg-paper shadow-[0_50px_90px_-60px_rgba(11,11,11,0.5)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 bg-cream/70 px-4 py-3 sm:px-5">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
          framestudio / live
        </p>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35">
          <span
            className={`h-1.5 w-1.5 rounded-full ${active === 'dashboard' ? 'bg-accent' : 'bg-ink/25'}`}
            aria-hidden="true"
          />
          {tab.note}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Try each service"
        className="flex gap-1 overflow-x-auto border-b border-ink/10 px-2 py-2 sm:px-3"
      >
        {TABS.map((item, index) => {
          const selected = item.id === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`svc-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`svc-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                selected ? 'bg-ink text-paper' : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`svc-panel-${active}`}
        aria-labelledby={`svc-tab-${active}`}
        key={active}
        className="min-h-[440px]"
      >
        <Panel />
      </div>
    </div>
  )
}
