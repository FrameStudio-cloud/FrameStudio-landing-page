import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* Illustrative numbers, not a client's. The panel says so in its header and the
   section says it again, because a growth chart is exactly the sort of thing a
   visitor will screenshot and believe. */
const SERIES = [22, 30, 27, 41, 52, 49, 63, 72, 68, 84, 95, 112, 104, 128]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const MAX = 150
const H = 150
const W = 360

const BARS = [
  { name: 'Google Search', logo: '/logos/search-google.svg', value: 62 },
  { name: 'Google Maps', logo: '/logos/maps.svg', value: 18 },
  { name: 'ChatGPT', logo: '/logos/chatgpt.svg', value: 12 },
  { name: 'Direct', value: 8 },
]

/** Value → y inside the plot box, with a little air at both ends. */
const yFor = (value) => 8 + (1 - value / MAX) * (H - 16)

const GRID = [
  { label: '150%', y: yFor(150) },
  { label: '100%', y: yFor(100) },
  { label: '50%', y: yFor(50) },
  { label: '0%', y: yFor(0) },
]

const points = SERIES.map((value, index) => [
  6 + (index / (SERIES.length - 1)) * (W - 12),
  yFor(value),
])

/** Quadratic through the midpoints: a rising line with kinks, not a ruler. */
function smoothPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i += 1) {
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`
  }
  const last = pts[pts.length - 1]
  d += ` L${last[0]},${last[1]}`
  return d
}

const LINE = smoothPath(points)
const AREA = `${LINE} L${W - 6},${H} L6,${H} Z`
const END = points[points.length - 1]

/**
 * The report a client actually gets, drawn.
 *
 * One panel, two readings: the line is the trend, the bars are where the visits
 * came from — which is why the bars carry the same marks as the "five doors"
 * section above. It is a picture of the report, so it is a figure with a
 * caption rather than decoration: a screen reader gets the sentence, everyone
 * else gets the chart.
 *
 * SVG, so it stays crisp at any width. The JSX is the finished state; the
 * timeline only runs when motion is welcome.
 */
export default function VisibilityPanel() {
  const rootRef = useRef(null)
  const clipRef = useRef(null)
  const dotRef = useRef(null)
  const barsRef = useRef([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (!clipRef.current) return undefined

    const ctx = gsap.context(() => {
      // Revealed by a clip that grows left to right, not by dash offsets: the
      // chart is stretched with `preserveAspectRatio="none"`, and a dash
      // pattern is measured in device space, so the stroke would stop short of
      // the end at some widths.
      gsap.set(clipRef.current, { attr: { width: 0 } })
      gsap.set(dotRef.current, { scale: 0, transformOrigin: 'center' })
      gsap.set(barsRef.current.filter(Boolean), { scaleX: 0, transformOrigin: 'left center' })

      const play = () => {
        gsap
          .timeline()
          .to(clipRef.current, { attr: { width: W }, duration: 1.5, ease: 'power2.inOut' })
          .to(dotRef.current, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, 1.35)
          .to(
            barsRef.current.filter(Boolean),
            { scaleX: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' },
            0.9
          )
      }

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 85%',
        once: true,
        onEnter: play,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <figure
      ref={rootRef}
      className="flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-paper shadow-[0_40px_80px_-55px_rgba(11,11,11,0.7)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
          Search visibility
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-ink/30">
          Sample · last 6 months
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-[2.9rem] font-semibold leading-none tracking-[-0.04em] text-ink">
              128%
            </p>
            <p className="mt-1.5 text-[12px] text-ink-soft">More visits from search</p>
          </div>

          <p className="flex w-fit items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.04em] text-ink">
            <ArrowUpRight size={12} className="text-accent-deep" aria-hidden="true" />
            28% vs last quarter
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="h-[150px] w-full"
              role="img"
              aria-label="Sample trend: visits from search rise from 22 to 128 over six months"
            >
              <defs>
                <linearGradient id="seo-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--fs-accent))" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="rgb(var(--fs-accent))" stopOpacity="0" />
                </linearGradient>
                <clipPath id="seo-reveal">
                  <rect ref={clipRef} x="0" y="0" width={W} height={H} />
                </clipPath>
              </defs>

              {GRID.map((line) => (
                <line
                  key={line.label}
                  x1="0"
                  x2={W}
                  y1={line.y}
                  y2={line.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  vectorEffect="non-scaling-stroke"
                  className="text-ink/10"
                />
              ))}

              <g clipPath="url(#seo-reveal)">
                <path d={AREA} fill="url(#seo-area)" />
                <path
                  d={LINE}
                  fill="none"
                  stroke="rgb(var(--fs-accent))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>

              <circle
                ref={dotRef}
                cx={END[0]}
                cy={END[1]}
                r="4"
                fill="rgb(var(--fs-accent))"
                stroke="#FBF8F0"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="mt-2 flex justify-between font-mono text-[8px] uppercase tracking-[0.1em] text-ink/35">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="relative h-[150px] w-9 shrink-0">
            {GRID.map((line) => (
              <span
                key={line.label}
                style={{ top: line.y }}
                className="absolute right-0 -translate-y-1/2 font-mono text-[8px] leading-none text-ink/30"
              >
                {line.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-ink/10 pt-4">
          <p className="mb-3 font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
            Where the visits came from
          </p>

          <ul className="space-y-2.5">
            {BARS.map((bar, index) => (
              <li
                key={bar.name}
                className="grid grid-cols-[14px_92px_minmax(0,1fr)_28px] items-center gap-2.5"
              >
                {bar.logo ? (
                  <img
                    src={bar.logo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-3.5 w-3.5 object-contain opacity-70"
                  />
                ) : (
                  <span
                    className="h-1.5 w-1.5 justify-self-center rounded-full bg-ink/25"
                    aria-hidden="true"
                  />
                )}

                <span className="truncate text-[11.5px] text-ink/70">{bar.name}</span>

                <span className="h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
                  <span
                    ref={(el) => {
                      barsRef.current[index] = el
                    }}
                    className="block h-full origin-left rounded-full bg-accent"
                    style={{ width: `${bar.value}%` }}
                  />
                </span>

                <span className="text-right font-mono text-[9px] text-ink/45">{bar.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className="sr-only">
        Sample chart. Visits from search grow 128% over six months, and 62% of them arrive
        through Google Search, 18% through Maps and 12% through ChatGPT. Illustrative data, not
        a client result.
      </figcaption>
    </figure>
  )
}
