import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

/**
 * A nav item that opens a panel of links.
 *
 * Two kinds of child: a real page (`to`) and one that is planned but not built
 * yet (`soon: true`). A planned one renders as text with a "Soon" chip instead
 * of a dead link, so the nav never sends anyone to a 404 — and the page it will
 * become does not have to be kept quiet until it ships.
 *
 * The trigger is a button, not a link: the child list starts with the parent
 * page itself, so there is still exactly one way in and no split control.
 * Opening is hover *and* click (touch has no hover), Escape closes and returns
 * focus to the trigger, and tabbing out of the panel closes it.
 */
export default function NavDropdown({ label, items, transparent }) {
  // The pathname the panel was opened on, rather than a boolean: navigating
  // anywhere changes `location.pathname`, so the panel closes itself on a route
  // change without an effect that sets state.
  const [openedOn, setOpenedOn] = useState(null)
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const firstLinkRef = useRef(null)
  const closeTimer = useRef(0)
  const id = useId()
  const location = useLocation()
  const open = openedOn === location.pathname

  const active = items.some(
    (item) => item.to && (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)),
  )

  const triggerTone = active
    ? transparent ? 'text-accent' : 'text-ink'
    : transparent ? 'text-paper/65 hover:text-accent' : 'text-ink/55 hover:text-ink'

  const openMenu = () => setOpenedOn(location.pathname)
  const closeMenu = () => setOpenedOn(null)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setOpenedOn(null)
      buttonRef.current?.focus()
    }
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpenedOn(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  // A short grace period on the way out: the pointer crosses the gap between
  // the trigger and the panel, and closing on that frame makes the menu flicker.
  const hoverIn = () => {
    window.clearTimeout(closeTimer.current)
    openMenu()
  }
  const hoverOut = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(closeMenu, 140)
  }

  const focusFirst = () => {
    openMenu()
    requestAnimationFrame(() => firstLinkRef.current?.focus())
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu()
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown') return
          event.preventDefault()
          focusFirst()
        }}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${triggerTone}`}
      >
        {label}
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`mt-px transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={id}
        className={`absolute left-1/2 top-full z-50 w-[320px] -translate-x-1/2 pt-3 transition-all duration-150 motion-reduce:transition-none ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <div className="rounded-2xl border border-ink/10 bg-paper/95 p-2 shadow-[0_24px_70px_-35px_rgba(11,11,11,0.45)] backdrop-blur">
          {items.map((item, index) =>
            item.soon ? (
              <div key={item.label} className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block font-display text-[14px] font-semibold tracking-[-0.01em] text-ink/45">
                    {item.label}
                  </span>
                  {item.desc ? (
                    <span className="mt-0.5 block text-[12px] leading-snug text-ink/30">{item.desc}</span>
                  ) : null}
                </span>
                <span className="ml-auto mt-0.5 shrink-0 rounded-full border border-ink/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                  Soon
                </span>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                ref={index === 0 ? firstLinkRef : undefined}
                className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/[0.045] focus:bg-ink/[0.045] focus:outline-none"
              >
                <span className="flex items-center gap-2 font-display text-[14px] font-semibold tracking-[-0.01em] text-ink">
                  {item.label}
                  {item.to === location.pathname ? (
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  ) : null}
                </span>
                {item.desc ? (
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink-faint">{item.desc}</span>
                ) : null}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
