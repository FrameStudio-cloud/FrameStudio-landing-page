import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Info, Loader2, X } from 'lucide-react'

/**
 * A real toast stack, not a screenshot.
 *
 * Mirrors the contract of cite-ui's `useToast()`: typed toasts, per-type
 * durations, `Infinity` for work in progress, and a stack that caps rather than
 * growing forever. The colours come from this site's tokens (the invoice's
 * status tones, specifically) instead of the package's neutral defaults.
 */

const TONES = {
  success: { icon: Check, label: 'Success', iconClass: 'text-emerald-300' },
  error: { icon: X, label: 'Error', iconClass: 'text-rose-300' },
  warning: { icon: AlertTriangle, label: 'Warning', iconClass: 'text-amber-300' },
  info: { icon: Info, label: 'Info', iconClass: 'text-sky-300' },
  loading: { icon: Loader2, label: 'Working', iconClass: 'text-paper/60' },
}

const MAX_STACK = 3

const STOCK = [
  { item: 'Sugar 2kg', sku: 'SGR-2K', qty: '42', state: 'Healthy', dot: 'bg-emerald-500' },
  { item: 'Cooking oil 1L', sku: 'OIL-1L', qty: '8', state: 'Low', dot: 'bg-amber-500' },
  { item: 'Maize flour 2kg', sku: 'MAZ-2K', qty: '0', state: 'Out', dot: 'bg-rose-500' },
]

const SNAPSHOT = [
  { label: 'Orders', value: '24' },
  { label: 'Revenue', value: 'KES 18.4k' },
  { label: 'Low stock', value: '3' },
]

let sequence = 0

export default function ToastDemo() {
  const [toasts, setToasts] = useState([])
  const [position, setPosition] = useState('top-right')
  const timers = useRef(new Map())
  const removals = useRef(new Map())
  const stagger = useRef([])

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    const removal = setTimeout(() => {
      removals.current.delete(id)
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 220)
    removals.current.set(id, removal)
  }, [])

  const push = useCallback((type, message, duration = 4000) => {
    const id = ++sequence
    setToasts((prev) => [...prev, { id, type, message, duration, leaving: false }].slice(-MAX_STACK))
    if (duration !== Infinity) {
      timers.current.set(id, setTimeout(() => dismiss(id), duration))
    }
    return id
  }, [dismiss])

  useEffect(() => {
    const pending = timers.current
    const leaving = removals.current
    const staggered = stagger.current
    return () => {
      pending.forEach(clearTimeout)
      leaving.forEach(clearTimeout)
      staggered.forEach(clearTimeout)
    }
  }, [])

  const promiseToast = () => {
    const id = push('loading', 'Publishing to production…', Infinity)
    const timer = setTimeout(() => {
      timers.current.delete(id)
      dismiss(id)
      push('success', 'Published — build finished in 1.8s', 4000)
    }, 1800)
    timers.current.set(id, timer)
  }

  const stackThree = () => {
    push('success', 'Inventory synced — 128 items', 4000)
    stagger.current.push(setTimeout(() => push('info', '3 low-stock items flagged', 4000), 200))
    stagger.current.push(setTimeout(() => push('warning', 'Maize flour is out of stock', 5200), 400))
  }

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    removals.current.forEach(clearTimeout)
    removals.current.clear()
    setToasts([])
  }

  const top = position === 'top-right'

  return (
    <div className="grid lg:grid-cols-[1fr_290px]">
      <div className="relative min-h-[420px] overflow-hidden bg-paper p-4 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,11,11,0.14)_1px,transparent_0)] [background-size:18px_18px]"
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Keel · inventory</p>
              <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] text-ink">Today&rsquo;s stock</p>
            </div>
            <span className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
              Sample
            </span>
          </div>

          <ul className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
            {STOCK.map((row) => (
              <li key={row.sku} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{row.item}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{row.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-ink/50">{row.qty} left</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-ink/60">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                    {row.state}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {SNAPSHOT.map((tile) => (
              <div key={tile.label} className="rounded-xl border border-ink/10 bg-cream/40 px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase leading-tight tracking-[0.12em] text-ink/50">
                  {tile.label}
                </p>
                <p className="mt-1 font-display text-[13px] font-semibold text-ink sm:text-[15px]">{tile.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
            Sample data, not a client&rsquo;s inventory.
          </p>
        </div>

        <div
          aria-live="polite"
          aria-atomic="false"
          className={`pointer-events-none absolute inset-x-3 z-20 flex flex-col gap-2 sm:inset-x-4 ${
            top ? 'top-3 items-end sm:top-4' : 'bottom-3 items-center sm:bottom-4'
          }`}
        >
          {toasts.map((toast) => {
            const tone = TONES[toast.type] || TONES.info
            const Icon = tone.icon
            return (
              <div
                key={toast.id}
                className={`lab-toast-in pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-paper/10 bg-ink/[0.97] px-3.5 py-3 text-paper shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur transition-all duration-200 sm:max-w-[300px] ${
                  toast.leaving ? 'translate-y-1.5 scale-[0.98] opacity-0' : ''
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 shrink-0 ${tone.iconClass}`}>
                    <Icon size={15} className={toast.type === 'loading' ? 'animate-spin' : ''} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45">{tone.label}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-paper/85">{toast.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    aria-label="Dismiss notification"
                    className="-mr-1 -mt-1 shrink-0 rounded-full p-1.5 text-paper/50 transition-colors hover:text-paper"
                  >
                    <X size={13} />
                  </button>
                </div>
                {toast.duration !== Infinity && (
                  <span
                    aria-hidden="true"
                    className="lab-toast-life absolute inset-x-0 bottom-0 h-0.5 bg-accent/60"
                    style={{ animationDuration: `${toast.duration}ms` }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <aside className="border-t border-ink/10 bg-cream/60 p-5 lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Trigger</p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => push('success', 'Inventory synced — 128 items updated', 4000)}
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:border-ink/35 hover:bg-paper"
          >
            Success
            <span className="font-mono text-[10px] text-ink/45">4s</span>
          </button>
          <button
            type="button"
            onClick={() => push('error', 'Payment could not be verified', 6000)}
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:border-ink/35 hover:bg-paper"
          >
            Error
            <span className="font-mono text-[10px] text-ink/45">6s</span>
          </button>
          <button
            type="button"
            onClick={promiseToast}
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:border-ink/35 hover:bg-paper"
          >
            Promise
            <span className="font-mono text-[10px] text-ink/45">1.8s</span>
          </button>
          <button
            type="button"
            onClick={stackThree}
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:border-ink/35 hover:bg-paper"
          >
            Stack three
            <span className="font-mono text-[10px] text-ink/45">max 3</span>
          </button>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Position</p>
          <div role="group" aria-label="Toast position" className="mt-2 grid grid-cols-2 gap-1 rounded-full border border-ink/10 bg-paper p-1">
            {[
              { id: 'top-right', label: 'Top right' },
              { id: 'bottom-center', label: 'Snackbar' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPosition(option.id)}
                aria-pressed={position === option.id}
                className={`rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors ${
                  position === option.id ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
            Bottom&nbsp;centre is the snackbar position — same component, different <code className="font-mono text-[10px]">position</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Clear all
        </button>
      </aside>
    </div>
  )
}
