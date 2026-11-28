import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Plus, Globe, Bot, BarChart3 } from 'lucide-react'
import { SERVICES } from '../../lib/services'
import { StatBubble } from './objects'

/**
 * The three services as a bento — the Postiz lesson applied.
 *
 * Each tile is a label, one headline, one line, and an object that shows the
 * thing working. Nothing is explained in a paragraph: the deliverables and the
 * exclusions are behind a "+ what's included" toggle so the default view stays
 * visual, while the detail remains in the DOM for anyone who opens it.
 *
 * The objects are DOM, not screenshots, for the same reason the demos are: they
 * cannot show a product we have not built.
 */

const ICONS = { Globe, Bot, BarChart3 }

function WebsitesObject() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_24px_44px_-34px_rgba(11,11,11,0.5)]">
      <div className="flex items-center gap-2 border-b border-ink/[0.07] px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
        </span>
        <span className="font-mono text-[8px] tracking-[0.04em] text-ink/40">yourbusiness.co.ke</span>
      </div>
      <div className="p-3">
        <p className="font-display text-[13px] font-semibold leading-tight text-ink">
          Beaded belts, made in Nairobi.
        </p>
        <p className="mt-1 text-[9px] leading-snug text-ink/50">
          Order before noon, delivered tomorrow.
        </p>
        <span className="mt-2 inline-block rounded-full bg-ink px-2.5 py-1 text-[8px] font-semibold text-paper">
          Order on WhatsApp
        </span>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5" aria-hidden="true">
          <span className="h-8 rounded bg-accent/15" />
          <span className="h-8 rounded bg-ink/[0.06]" />
          <span className="h-8 rounded bg-accent/10" />
        </div>
      </div>
    </div>
  )
}

function BotObject() {
  return (
    <div className="rounded-xl border border-paper/10 bg-[#141312] p-3">
      <div className="flex items-center gap-2 border-b border-paper/10 pb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Bot size={11} aria-hidden="true" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/45">
          ShopBot · online
        </span>
      </div>
      <div className="mt-2.5 space-y-1.5">
        <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-paper/10 px-2.5 py-1.5 text-[10px] leading-snug text-paper/80">
          Do you have size 42?
        </p>
        <p className="w-fit max-w-[85%] rounded-lg bg-paper/[0.06] px-2.5 py-1.5 text-[10px] leading-snug text-paper/70">
          Yes — four left. Reserve one?
        </p>
        <p className="ml-auto w-fit rounded-lg bg-accent px-2.5 py-1.5 text-[10px] font-semibold text-ink">
          Reserve it
        </p>
      </div>
    </div>
  )
}

function DashboardObject() {
  return (
    <div className="rounded-xl border border-ink/10 bg-ink p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/40">Keel · today</span>
        <span className="rounded-full bg-accent/20 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-accent">
          Live
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {[
          { label: 'Sales', value: '18,400' },
          { label: 'Orders', value: '7' },
          { label: 'Low stock', value: '2' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-paper/[0.05] p-2">
            <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-paper/35">{stat.label}</p>
            <p className="mt-0.5 font-display text-[13px] font-semibold text-paper">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex h-10 items-end gap-1" aria-hidden="true">
        {[38, 62, 48, 84, 56, 70, 44, 78].map((height, index) => (
          <span
            key={index}
            className={`flex-1 rounded-sm ${index === 3 ? 'bg-accent/80' : 'bg-paper/[0.14]'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

const OBJECTS = {
  websites: WebsitesObject,
  bots: BotObject,
  dashboards: DashboardObject,
}

/** Tile ownership: 7/5 on the first row, full width for the dashboard. */
const SPAN = { websites: 'lg:col-span-7', bots: 'lg:col-span-5', dashboards: 'lg:col-span-12' }
const THEME = {
  websites: {
    card: 'bg-cream',
    eyebrow: 'text-ink/45',
    head: 'text-ink',
    line: 'text-ink-soft',
    rule: 'border-ink/10 text-ink/70 hover:text-accent',
    detail: 'text-ink/60',
  },
  bots: {
    card: 'bg-ink',
    eyebrow: 'text-paper/40',
    head: 'text-paper',
    line: 'text-paper/50',
    rule: 'border-paper/20 text-paper/80 hover:text-accent',
    detail: 'text-paper/55',
  },
  dashboards: {
    card: 'bg-cream',
    eyebrow: 'text-ink/45',
    head: 'text-ink',
    line: 'text-ink-soft',
    rule: 'border-ink/10 text-ink/70 hover:text-accent',
    detail: 'text-ink/60',
  },
}

export default function ServiceBento() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {SERVICES.map((service) => {
        const Object = OBJECTS[service.id]
        const Icon = ICONS[service.icon]
        const theme = THEME[service.id]
        const wide = service.id === 'dashboards'

        return (
          <article
            key={service.id}
            id={service.id}
            className={`scroll-mt-24 rounded-[26px] border border-ink/10 p-6 md:p-8 ${SPAN[service.id]} ${theme.card} ${
              wide ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10' : 'flex flex-col'
            }`}
          >
            <div className={`flex items-start justify-between gap-4 ${wide ? 'lg:col-span-5' : ''}`}>
              <div className="min-w-0">
                <p className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] ${theme.eyebrow}`}>
                  <Icon size={12} aria-hidden="true" />
                  {service.name}
                </p>
                <h2 className={`mt-3 font-display text-2xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance md:text-[2rem] ${theme.head}`}>
                  {service.headline}
                </h2>
                <p className={`mt-2 max-w-[42ch] text-sm leading-relaxed ${theme.line}`}>
                  {service.who}
                </p>
              </div>
              <StatBubble
                value={service.stat.value}
                label={service.stat.label}
                className="hidden shrink-0 -rotate-3 sm:block"
              />
            </div>

            <div className={`relative mt-6 ${wide ? 'lg:col-span-7 lg:mt-0' : 'lg:mt-auto lg:pt-8'}`}>
              <Object />
            </div>

            <div className={`mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 ${wide ? 'lg:col-span-12' : ''}`}>
              {service.live ? (
                <a
                  href={service.live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-1.5 border-b pb-1 text-sm font-semibold transition-colors ${theme.rule}`}
                >
                  {service.cta}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={`/contact?plan=${service.plan}`}
                  className={`group inline-flex items-center gap-1.5 border-b pb-1 text-sm font-semibold transition-colors ${theme.rule}`}
                >
                  {service.cta}
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )}

              <details className="fs-details group/details">
                <summary className={`inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors ${theme.detail}`}>
                  <Plus
                    size={13}
                    className="fs-plus transition-transform duration-300 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  What&rsquo;s included
                </summary>
                <div className={`mt-4 grid gap-x-8 gap-y-3 border-t border-current/10 pt-4 sm:grid-cols-2 ${theme.detail}`}>
                  <ul className="space-y-1.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="text-[13px] leading-snug">
                        <span className="mr-1.5 text-accent">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-70">
                      Not included
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {service.excluded.map((item) => (
                        <li key={item} className="text-[12px] leading-snug opacity-80">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </article>
        )
      })}
    </div>
  )
}
