import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, SlidersHorizontal, X } from 'lucide-react'

/**
 * The Drawer: slides in, dims what's behind it, closes on Escape or backdrop,
 * and returns focus to whatever opened it. Those three behaviours are the whole
 * point of the component — a panel that only looks like a drawer is a div.
 */

const SETTINGS = [
  { id: 'realtime', label: 'Real-time stock alerts', desc: 'Ping me when an item drops below 10.' },
  { id: 'mpesa', label: 'M-Pesa confirmations', desc: 'Match payments to orders automatically.' },
  { id: 'digest', label: 'Weekly digest', desc: 'One email, Monday morning. Nothing else.' },
]

export default function DrawerDemo() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState({ realtime: true, mpesa: true, digest: false })
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const savedTimer = useRef(null)

  const closeDrawer = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKeyDown)
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 120)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      clearTimeout(focusTimer)
    }
  }, [open, closeDrawer])

  useEffect(() => () => clearTimeout(savedTimer.current), [])

  const save = () => {
    setSaved(true)
    closeDrawer()
    clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 2600)
  }

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
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Keel · settings</p>
              <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] text-ink">Notifications</p>
            </div>
            <span className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
              Preview
            </span>
          </div>

          <div className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
            {SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{setting.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{setting.desc}</p>
                </div>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
                  {prefs[setting.id] ? 'On' : 'Off'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex h-5 items-center">
            {saved && (
              <p role="status" className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                <Check size={12} className="text-accent" />
                Preferences saved
              </p>
            )}
          </div>
        </div>

        <div className={`absolute inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
          <div
            aria-hidden="true"
            onClick={closeDrawer}
            className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            role="dialog"
            aria-label="Order settings"
            aria-hidden={!open}
            inert={open ? undefined : true}
            className={`absolute inset-y-0 right-0 flex w-[86%] max-w-[320px] flex-col bg-paper shadow-[-30px_0_60px_-30px_rgba(11,11,11,0.5)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-4 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Drawer</p>
                <p className="mt-1 font-display text-base font-semibold text-ink">Order settings</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close settings"
                className="-mr-1 rounded-full p-1.5 text-ink/55 transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {SETTINGS.map((setting) => (
                  <div key={setting.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{setting.label}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{setting.desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[setting.id]}
                      aria-label={setting.label}
                      onClick={() => setPrefs((prev) => ({ ...prev, [setting.id]: !prev[setting.id] }))}
                      className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors ${
                        prefs[setting.id] ? 'bg-accent' : 'bg-ink/15'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition-transform duration-200 motion-reduce:transition-none ${
                          prefs[setting.id] ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-ink/10 px-4 py-4">
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full border border-ink/15 px-4 py-2 text-[12px] font-semibold text-ink/60 transition-colors hover:border-ink/35 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="border-t border-ink/10 bg-cream/60 p-5 lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Trigger</p>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:border-ink/35"
        >
          Open settings
          <SlidersHorizontal size={14} className="text-ink/55" />
        </button>

        <ul className="mt-6 space-y-2.5 text-[11px] leading-relaxed text-ink-soft">
          <li>Escape closes it.</li>
          <li>So does the backdrop.</li>
          <li>Focus lands on the close button, then returns here.</li>
        </ul>

        <p className="mt-4 border-t border-ink/10 pt-4 text-[11px] leading-relaxed text-ink/55">
          Toggle a setting and save — the summary updates behind the panel.
        </p>
      </aside>
    </div>
  )
}
