import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* Sample data, like every other number on this page. */
const BARS = [
  { month: 'Jan', orders: 14 },
  { month: 'Feb', orders: 19 },
  { month: 'Mar', orders: 17 },
  { month: 'Apr', orders: 28 },
  { month: 'May', orders: 36 },
  { month: 'Jun', orders: 48 },
]

const MAX = 52

/**
 * Orders, as bars.
 *
 * Deliberately the opposite reading from the visibility panel beside it: that
 * one is a trend, this one is six discrete months you can count. Drawn in DOM
 * (`div` heights), not SVG, because the bars need no arbitrary precision and
 * the accent fill has to sit on ink.
 *
 * The panel is dark on purpose — two light charts side by side would read as a
 * dashboard template. One dark card in the trio keeps the eye moving.
 */
export default function SalesPanel() {
  const rootRef = useRef(null)
  const barsRef = useRef([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      gsap.set(barsRef.current.filter(Boolean), { scaleY: 0, transformOrigin: 'bottom center' })
      gsap.set('[data-bar-value]', { opacity: 0 })

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap
            .timeline()
            .to(barsRef.current.filter(Boolean), {
              scaleY: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: 'power3.out',
            })
            .to('[data-bar-value]', { opacity: 1, duration: 0.4, stagger: 0.05 }, '-=0.35'),
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <figure
      ref={rootRef}
      className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-paper/10 bg-ink p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />

      <div className="relative flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">
          Booked from search
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-paper/25">Sample</span>
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-paper">
            KSh 412k
          </p>
          <p className="mt-1.5 text-[11.5px] text-paper/45">Orders traced to a search</p>
        </div>

        <p className="mb-1 flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 font-mono text-[8.5px] tracking-[0.04em] text-paper">
          <ArrowUpRight size={11} className="text-accent" aria-hidden="true" />
          61% orders
        </p>
      </div>

      <div className="relative mt-5 flex min-h-[150px] flex-1 items-end justify-between gap-2">
        {BARS.map((bar, index) => (
          <div key={bar.month} className="flex h-full w-full max-w-[54px] flex-1 flex-col">
            <span className="relative flex-1">
              <span
                data-bar-value
                style={{ bottom: `calc(${(bar.orders / MAX) * 100}% + 5px)` }}
                className="absolute inset-x-0 text-center font-mono text-[8px] leading-none text-paper/40"
              >
                {bar.orders}
              </span>

              <span
                ref={(el) => {
                  barsRef.current[index] = el
                }}
                className="absolute inset-x-0 bottom-0 rounded-t-[4px] bg-accent"
                style={{ height: `${(bar.orders / MAX) * 100}%` }}
              />
            </span>

            <span className="mt-1.5 text-center font-mono text-[8px] uppercase tracking-[0.06em] text-paper/30">
              {bar.month}
            </span>
          </div>
        ))}
      </div>

      <figcaption className="sr-only">
        Sample chart. Orders traced to a search over six months: 14, 19, 17, 28, 36 and 48, worth
        KSh 412,000. Illustrative data, not a client result.
      </figcaption>
    </figure>
  )
}
