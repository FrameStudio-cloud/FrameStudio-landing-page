import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Sample data. Three segments, because a donut with eight slices is a pie chart
   nobody reads. */
const SEGMENTS = [
  { label: 'Read a second page', value: 68, stroke: 'rgb(var(--fs-accent))' },
  { label: 'Left after one page', value: 22, stroke: 'rgba(11,11,11,0.38)' },
  { label: 'Bounced', value: 10, stroke: 'rgba(11,11,11,0.14)' },
]

const R = 44
const C = 2 * Math.PI * R
const GAP = 5

/**
 * Engagement, as a ring.
 *
 * The third shape on purpose: a line, a column of bars, and now a proportion —
 * three readings a client can tell apart at a glance instead of three copies of
 * the same chart. The ring is SVG with `stroke-dasharray`, so it stays sharp and
 * animates without a single layout pass.
 *
 * All three segments grow together from their own start angle, which reads as
 * the ring filling rather than three separate arcs queuing up.
 */
export default function EngagementPanel() {
  const rootRef = useRef(null)
  const arcsRef = useRef([])
  const numberRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const arcs = arcsRef.current.filter(Boolean)
    if (!arcs.length) return undefined

    const lengths = SEGMENTS.map((segment) => (C * segment.value) / 100 - GAP)
    const state = { progress: 0 }

    const paint = () => {
      arcs.forEach((arc, index) => {
        const visible = lengths[index] * state.progress
        arc.setAttribute('stroke-dasharray', `${visible} ${C - visible}`)
      })
      if (numberRef.current) {
        numberRef.current.textContent = `${Math.round(SEGMENTS[0].value * state.progress)}%`
      }
    }

    const ctx = gsap.context(() => {
      paint()

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(state, { progress: 1, duration: 1.1, ease: 'power2.out', onUpdate: paint }),
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <figure
      ref={rootRef}
      className="flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-paper p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
          Engagement
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-ink/30">Sample</span>
      </div>

      <div className="mt-3 flex flex-1 items-center gap-5">
        <div className="relative h-[118px] w-[118px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(11,11,11,0.06)" strokeWidth="11" />

            {SEGMENTS.map((segment, index) => {
              const start = SEGMENTS.slice(0, index).reduce((sum, item) => sum + item.value, 0)
              return (
                <circle
                  key={segment.label}
                  ref={(el) => {
                    arcsRef.current[index] = el
                  }}
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke={segment.stroke}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${(C * segment.value) / 100 - GAP} ${C}`}
                  strokeDashoffset={-(C * start) / 100}
                />
              )
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p
              ref={numberRef}
              className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-ink"
            >
              68%
            </p>
            <p className="mt-1 font-mono text-[7.5px] uppercase leading-tight tracking-[0.1em] text-ink/35">
              read on
            </p>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2.5">
          {SEGMENTS.map((segment) => (
            <li key={segment.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: segment.stroke }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink/65">
                {segment.label}
              </span>
              <span className="shrink-0 font-mono text-[9px] text-ink/45">{segment.value}%</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 border-t border-ink/10 pt-2.5 font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
        Sessions, not pageviews
      </p>

      <figcaption className="sr-only">
        Sample chart. Of the sessions that arrived from search, 68% read a second page, 22% left
        after one page and 10% bounced. Illustrative data, not a client result.
      </figcaption>
    </figure>
  )
}
