import { ExternalLink } from 'lucide-react'
import { useProjects } from '../../lib/projects'

/**
 * The Dashboard tab shows the real product instead of a picture of one.
 *
 * Keel is live, so the strongest thing this tab can do is hand the visitor a
 * working dashboard and a link. The screenshot comes from `portfolio_projects`
 * (same row the portfolio page renders), which means it cannot drift from the
 * build — but it also cannot be relied on at build time, so there is a written
 * fallback for a cold cache or a failed fetch.
 */

const KEEL = 'https://keel.framestudio.co.ke'

export default function DashboardPanel() {
  const { projects } = useProjects()
  const keel =
    projects.find((project) => project.slug === 'keel') ||
    projects.find((project) => project.category === 'Dashboards') ||
    null
  const shot = keel?.screenshots?.[0]?.url

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="order-2 flex flex-col justify-center border-t border-ink/10 px-5 py-6 sm:px-8 lg:order-1 lg:border-t-0 lg:border-r">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">Dashboards</p>
        <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
          It already exists. You can open it.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Keel is the dashboard we built and run: stock, sales, expenses, invoices and
          M-Pesa reconciliation. Free to start — no call, no demo request, no salesperson.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Free tier covers day-to-day running
          </li>
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Pro adds your website, bots and reports
          </li>
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Your data stays yours, in your account
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={KEEL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink border-b border-ink/25 pb-1 transition-colors hover:border-accent"
          >
            Open the live dashboard
            <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35">
            Real product · keel.framestudio.co.ke
          </span>
        </div>
      </div>

      <div className="order-1 overflow-hidden bg-ink p-3 sm:p-5 lg:order-2">
        <div className="overflow-hidden rounded-xl border border-paper/10 bg-[#141312]">
          <div className="flex items-center gap-2 border-b border-paper/10 px-3 py-2">
            <span aria-hidden="true" className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-paper/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-paper/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-paper/20" />
            </span>
            <span className="ml-1 truncate rounded bg-paper/[0.06] px-2 py-0.5 font-mono text-[9px] tracking-[0.06em] text-paper/45">
              keel.framestudio.co.ke
            </span>
          </div>
          <div className="relative aspect-[16/10]">
            {shot ? (
              <img
                src={shot}
                alt="The Keel marketing site — open it to use the dashboard itself"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full flex-col justify-between p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">keel / dashboard</p>
                <div>
                  <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-paper">
                    Keel<span className="text-accent">.</span>
                  </p>
                  <p className="mt-2 max-w-[26ch] text-[11px] leading-relaxed text-paper/45">
                    Stock, sales and money on one screen. Open it to see the real thing.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2" aria-hidden="true">
                  {[68, 44, 82].map((height, index) => (
                    <div key={index} className="flex h-12 items-end rounded bg-paper/[0.04] p-1">
                      <div className="w-full rounded-sm bg-accent/60" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
