/**
 * The objects the /services page is assembled from.
 *
 * These mirror the reference board rather than its palette: floating chips, a
 * dot-matrix patch, and stat bubbles that sit on the edge of a screenshot.
 * Everything is DOM — no images of UI — so nothing here can drift from the copy
 * or go soft on a retina screen.
 *
 * Rules:
 * - Rotation is capped at ±6° and only ever on decoration. Text never tilts on
 *   touch, and `motion-reduce` removes the lift/straighten transitions.
 * - `DottedGrid` and the orbit are aria-hidden. Anything carrying meaning is
 *   written out in text beside it.
 */

/** A dot-matrix patch. Decoration only — always aria-hidden. */
export function DottedGrid({ className = '', cols = 6, rows = 4 }) {
  const dots = Array.from({ length: cols * rows }, (_, index) => index)

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${cols * 8} ${rows * 8}`}
      className={className}
      fill="currentColor"
    >
      {dots.map((dot) => {
        const x = (dot % cols) * 8 + 2
        const y = Math.floor(dot / cols) * 8 + 2
        return <circle key={dot} cx={x} cy={y} r="1.4" />
      })}
    </svg>
  )
}

/** A chip on a soft white tile — a logo, or a dot when the label carries it. */
export function FloatChip({ logo, name, className = '', rotate = 0 }) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`flex items-center gap-2 rounded-xl border border-ink/10 bg-paper px-2.5 py-2 shadow-[0_18px_30px_-22px_rgba(0,0,0,0.85)] ${className}`}
    >
      {logo ? (
        <img src={logo} alt="" loading="lazy" decoding="async" className="h-4 w-auto max-w-[52px] object-contain" />
      ) : (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      )}
      {name && (
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/50">{name}</span>
      )}
    </div>
  )
}

/**
 * A number that would otherwise be a sentence. Sits on the edge of a card or a
 * screenshot, the way the references float one over a chart.
 */
export function StatBubble({ value, label, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-ink/10 bg-paper px-3 py-2 shadow-[0_20px_36px_-26px_rgba(11,11,11,0.7)] ${className}`}
    >
      <p className="font-display text-lg font-semibold leading-none tracking-[-0.02em] text-ink">
        {value}
      </p>
      <p className="mt-1 font-mono text-[8px] uppercase leading-tight tracking-[0.12em] text-ink/45">
        {label}
      </p>
    </div>
  )
}
