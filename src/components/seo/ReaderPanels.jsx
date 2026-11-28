import { useRef, useState } from 'react'
import { Check, MapPin, Star } from 'lucide-react'

const TABS = [
  { id: 'search', label: 'Search result', logo: '/logos/search-google.svg' },
  { id: 'maps', label: 'Map pack', logo: '/logos/maps.svg' },
  { id: 'ai', label: 'Assistant answer', logo: '/logos/chatgpt.svg' },
]

/**
 * One page, three readers.
 *
 * This is the "what do you actually change?" answer, shown instead of listed:
 * the snippet a crawler indexes, the record a map reads, and the answer an
 * assistant assembles. Three different artefacts, one set of facts.
 *
 * The panels are demos, not live data — nothing here queries Google or an
 * assistant, and the section says so. Written copy lives outside the tabs so a
 * crawler sees it without opening anything.
 */
export default function ReaderPanels() {
  const [active, setActive] = useState('search')
  const tabRefs = useRef([])

  const onKeyDown = (event) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    let next

    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TABS.length - 1
    else return

    event.preventDefault()
    setActive(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Where your page is read"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-center gap-2 border-b border-ink/10 pb-3"
      >
        {TABS.map((tab, index) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`reader-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`reader-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                isActive
                  ? 'border-ink/15 bg-paper text-ink shadow-[0_1px_0_rgba(11,11,11,0.04)]'
                  : 'border-transparent text-ink/50 hover:bg-ink/[0.04] hover:text-ink/75'
              }`}
            >
              <img src={tab.logo} alt="" className="h-3.5 w-3.5 object-contain" />
              {tab.label}
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 min-h-[360px]">
        <div
          role="tabpanel"
          id="reader-panel-search"
          aria-labelledby="reader-tab-search"
          hidden={active !== 'search'}
        >
          <SearchPanel />
        </div>
        <div
          role="tabpanel"
          id="reader-panel-maps"
          aria-labelledby="reader-tab-maps"
          hidden={active !== 'maps'}
        >
          <MapsPanel />
        </div>
        <div
          role="tabpanel"
          id="reader-panel-ai"
          aria-labelledby="reader-tab-ai"
          hidden={active !== 'ai'}
        >
          <AssistantPanel />
        </div>
      </div>
    </div>
  )
}

const SHELL = 'overflow-hidden rounded-2xl border border-ink/10 bg-paper'

function SearchPanel() {
  const rows = [
    { field: 'title', value: 'Made-to-order furniture in Nairobi | Your Shop' },
    {
      field: 'description',
      value:
        'Beds, desks and shelving built in Industrial Area. Delivery in Nairobi, prices on every item.',
    },
    { field: 'schema', value: 'FurnitureStore · address · openingHours · priceRange' },
    { field: 'canonical', value: 'https://yourshop.co.ke/' },
  ]

  return (
    <div className={SHELL}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
          view-source · yourshop.co.ke
        </p>
        <span className="font-mono text-[9px] text-ink/25" aria-hidden="true">
          html
        </span>
      </div>

      <ul className="divide-y divide-ink/[0.07]">
        {rows.map((row) => (
          <li
            key={row.field}
            className="grid grid-cols-[72px_minmax(0,1fr)_14px] items-start gap-3 px-4 py-3"
          >
            <span className="pt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">
              {row.field}
            </span>
            <span className="break-words font-mono text-[10.5px] leading-relaxed text-ink/80">
              {row.value}
            </span>
            <Check size={13} strokeWidth={3} className="mt-0.5 text-accent" aria-hidden="true" />
          </li>
        ))}
      </ul>

      <p className="border-t border-ink/10 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
        What a crawler reads before it ranks anything
      </p>
    </div>
  )
}

function MapsPanel() {
  const record = [
    ['Hours', 'Mon–Sat · 8:00–18:00'],
    ['Category', 'Furniture store · Carpenter'],
    ['Photos', '12'],
    ['Service area', 'Nairobi · Kiambu'],
  ]

  return (
    <div className={SHELL}>
      <div
        className="relative h-24 overflow-hidden border-b border-ink/10 bg-cream"
        style={{
          // A dot matrix that tiles at any width. An SVG with `meet` would fit
          // its viewBox in the middle of the panel and leave the sides empty.
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,11,11,0.15) 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }}
      >
        <span className="absolute left-3 top-3 rounded-full border border-ink/10 bg-paper px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/45">
          Google Business Profile
        </span>
        <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-accent shadow-[0_10px_20px_-12px_rgba(11,11,11,0.9)]">
          <MapPin size={15} aria-hidden="true" />
        </span>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-ink">Your Shop</p>
          <p className="flex items-center gap-1.5 font-mono text-[10px] text-ink/45">
            <Star size={11} className="text-accent" aria-hidden="true" />
            4.9 · 86 reviews
            <span className="text-ink/20" aria-hidden="true">
              ·
            </span>
            <span className="text-ink/60">Open now</span>
          </p>
        </div>

        <dl className="mt-3 divide-y divide-ink/[0.07] border-t border-ink/[0.07]">
          {record.map(([term, value]) => (
            <div key={term} className="flex items-baseline justify-between gap-4 py-1.5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">{term}</dt>
              <dd className="text-right text-[11.5px] text-ink/75">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="border-t border-ink/10 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
        Same facts, kept in one record
      </p>
    </div>
  )
}

function AssistantPanel() {
  return (
    <div className={SHELL}>
      <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-2.5">
        <img src="/logos/chatgpt.svg" alt="" className="h-3.5 w-3.5 object-contain opacity-80" />
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
          ChatGPT · answer
        </p>
      </div>

      <div className="px-4 py-4">
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-[12px] leading-relaxed text-paper">
            best furniture workshop in nairobi?
          </p>
        </div>

        <div className="mt-3 flex justify-start">
          <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-[12px] leading-relaxed text-ink">
            Your Shop in Industrial Area builds made-to-order beds, desks and shelving. It lists
            prices on the site and delivers within Nairobi.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {['yourshop.co.ke', 'google business profile'].map((source) => (
            <span
              key={source}
              className="rounded-full border border-ink/10 px-2 py-0.5 font-mono text-[8.5px] text-ink/50"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      <p className="border-t border-ink/10 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
        Built from a page a crawler could read
      </p>
    </div>
  )
}
