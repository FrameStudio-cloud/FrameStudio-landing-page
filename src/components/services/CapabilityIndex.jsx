import { useRef, useState } from 'react'
import {
  Globe,
  Layers,
  ShoppingBag,
  Target,
  Gauge,
  Search,
  Smartphone,
  CreditCard,
  Receipt,
  MessageCircle,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { CAPABILITY_GROUPS } from '../../lib/services'

/**
 * The capability rail — the object from the reference board.
 *
 * A strip of icon tiles where the active one is filled, and a panel that shows
 * the mechanics instead of describing them: a real page card, a real M-Pesa
 * prompt, a real chat exchange. The fragments are DOM, not images, so they stay
 * crisp and cannot drift from the copy.
 */

const ICONS = {
  Globe,
  Layers,
  ShoppingBag,
  Target,
  Gauge,
  Search,
  Smartphone,
  CreditCard,
  Receipt,
  MessageCircle,
  BarChart3,
  Sparkles,
}

const GROUP_ICONS = { build: Layers, convert: Gauge, money: CreditCard, automate: Sparkles }

const Dots = () => (
  <span aria-hidden="true" className="flex items-center gap-1">
    <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
    <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
    <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
  </span>
)

/** The object each group shows. Sample content only — no client names. */
function Fragment({ group }) {
  if (group === 'build') {
    return (
      <div className="relative h-[240px]">
        <div className="absolute left-0 top-0 w-[86%] overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <div className="flex items-center gap-2 border-b border-ink/10 px-2.5 py-2">
            <Dots />
            <span className="font-mono text-[8px] tracking-[0.06em] text-ink/40">
              yourbusiness.co.ke
            </span>
          </div>
          <div className="p-3">
            <span className="block h-2 w-20 rounded bg-ink/20" />
            <span className="mt-1.5 block h-2 w-28 rounded bg-ink/10" />
            <span className="mt-3 block h-16 rounded-lg bg-cream" />
            <div className="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
              <span className="h-8 rounded bg-accent/15" />
              <span className="h-8 rounded bg-ink/[0.07]" />
              <span className="h-8 rounded bg-accent/10" />
            </div>
            <span className="mt-2.5 inline-block rounded-full bg-ink px-2.5 py-1 text-[8px] font-semibold text-paper">
              Shop now
            </span>
          </div>
        </div>
        <div className="absolute -bottom-2 right-0 w-[58%] -rotate-[3deg] rounded-xl border border-ink/10 bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Booking</p>
          <p className="mt-1.5 text-[11px] font-semibold leading-snug text-ink">
            Saturday, 10:00 — confirmed
          </p>
          <span className="mt-2 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[8px] font-semibold text-ink">
            Added to calendar
          </span>
        </div>
      </div>
    )
  }

  if (group === 'convert') {
    return (
      <div className="relative h-[240px]">
        <div className="absolute left-0 top-2 w-[52%] rounded-xl border border-ink/10 bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Speed</p>
          <p className="mt-1 font-display text-3xl font-semibold leading-none text-ink">98</p>
          <div className="mt-2 h-1 w-full rounded-full bg-ink/10">
            <span className="block h-1 w-[94%] rounded-full bg-accent" />
          </div>
          <p className="mt-2 text-[9px] leading-snug text-ink-soft">1.1s on a 3G phone</p>
        </div>
        <div className="absolute right-0 top-0 w-[62%] rotate-[2.5deg] rounded-xl border border-ink/10 bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <p className="font-mono text-[8px] tracking-[0.04em] text-ink/35">yourbusiness.co.ke</p>
          <p className="mt-1 text-[11px] font-semibold leading-snug text-ink">
            Beaded belts in Nairobi — free delivery
          </p>
          <p className="mt-1 text-[9px] leading-snug text-ink-soft">
            Handmade, in stock today. Order on WhatsApp.
          </p>
        </div>
        <div className="absolute bottom-2 right-2 w-[54%] -rotate-[2deg] rounded-xl border border-ink/10 bg-paper p-2.5 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">One action</p>
          <p className="mt-1 text-[10px] font-semibold text-ink">Get directions →</p>
        </div>
      </div>
    )
  }

  if (group === 'money') {
    return (
      <div className="relative h-[240px]">
        <div className="absolute left-0 top-0 w-[74%] rounded-xl border border-ink/10 bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold tracking-[0.08em] text-ink/70">M-PESA</span>
            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-ink/70">
              STK
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-snug text-ink">
            Pay <strong className="font-semibold">KSh 2,800</strong> to Sample Store
          </p>
          <div className="mt-2 flex items-center gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className="h-1.5 w-1.5 rounded-full bg-ink/25" />
            ))}
          </div>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/40">
            Enter PIN on your phone
          </p>
        </div>
        <div className="absolute bottom-1 right-0 w-[62%] -rotate-[2.5deg] rounded-xl bg-ink p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.8)]">
          <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-accent">
            <span aria-hidden="true">✓</span> Paid
          </p>
          <p className="mt-1.5 text-[10px] leading-snug text-paper/80">
            Order #FS-1042 · matched to the invoice
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[240px]">
      <div className="absolute left-0 top-2 w-[76%] rounded-xl bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
        <div className="ml-auto w-fit rounded-lg bg-ink px-2.5 py-1.5 text-[10px] text-paper">
          Do you have size 42?
        </div>
        <div className="mt-2 w-fit rounded-lg bg-cream px-2.5 py-1.5 text-[10px] text-ink">
          Yes — four left. Reserve one?
        </div>
        <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[8px] font-semibold text-ink">
          Answered in 2s
        </span>
      </div>
      <div className="absolute bottom-1 right-0 w-[58%] rotate-[2deg] rounded-xl border border-ink/10 bg-paper p-3 shadow-[0_24px_44px_-32px_rgba(11,11,11,0.55)]">
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">Low stock</p>
        <p className="mt-1 text-[10px] font-semibold leading-snug text-ink">
          Leather sandals · 3 left
        </p>
      </div>
    </div>
  )
}

export default function CapabilityIndex() {
  const [active, setActive] = useState(CAPABILITY_GROUPS[0].key)
  const tabRefs = useRef([])
  const group = CAPABILITY_GROUPS.find((item) => item.key === active) || CAPABILITY_GROUPS[0]

  const focusTab = (index) => {
    const next = CAPABILITY_GROUPS[index]
    if (!next) return
    setActive(next.key)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab((index + 1) % CAPABILITY_GROUPS.length)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab((index - 1 + CAPABILITY_GROUPS.length) % CAPABILITY_GROUPS.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(CAPABILITY_GROUPS.length - 1)
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="What we can do"
        className="flex gap-2 overflow-x-auto rounded-2xl border border-ink/10 bg-paper p-2"
      >
        {CAPABILITY_GROUPS.map((item, index) => {
          const selected = item.key === active
          const Icon = GROUP_ICONS[item.key] || Layers
          return (
            <button
              key={item.key}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`cap-tab-${item.key}`}
              aria-selected={selected}
              aria-controls={`cap-panel-${item.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`flex min-w-[46%] flex-1 items-center gap-2.5 rounded-xl px-3.5 py-3 text-left transition-colors sm:min-w-0 ${
                selected ? 'bg-accent text-ink' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              <Icon size={17} aria-hidden="true" className="shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold leading-tight">
                  {item.label}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`cap-panel-${group.key}`}
        aria-labelledby={`cap-tab-${group.key}`}
        key={group.key}
        className="mt-8 grid grid-cols-1 gap-10 rounded-3xl border border-ink/10 bg-paper p-6 md:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14"
      >
        <div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">
            {group.label}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{group.note}</p>

          <ul className="mt-6 space-y-4">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon] || Globe
              return (
                <li key={item.name}>
                  <a href={item.href} className="group flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">
                        {item.line}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:pl-4">
          <Fragment group={group.key} />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35">
            Sample data · the real thing is built around your business
          </p>
        </div>
      </div>
    </div>
  )
}
