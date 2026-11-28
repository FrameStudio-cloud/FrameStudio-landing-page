import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Mascot } from 'framestudio-mascot/react'
import { MessageCircle } from 'lucide-react'
import ChatPanel from './ChatPanel'
import useChat from './useChat'

const LAUNCHER = 88
const EDGE = 20

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * One mascot, two homes.
 *
 * The same <Mascot> instance is painted by a single fixed wrapper. Closed, it
 * sits in the corner as the button. Open, that wrapper flies — transform and
 * scale only, no layout — onto the empty slot in the panel header. Because the
 * node is never re-created, the eyes keep tracking mid-flight and the face never
 * resets.
 *
 * The panel is mounted above the page (z-30, under the nav) and the mascot rides
 * at z-35 so it can cross the panel's edge while in transit.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [mood, setMood] = useState('idle')
  const [typing, setTyping] = useState(false)
  const [nudge, setNudge] = useState(false)

  const wrapRef = useRef(null)
  const slotRef = useRef(null)
  const panelRef = useRef(null)
  const launcherRef = useRef(null)

  const chat = useChat()

  const launcherXY = useCallback(
    () => ({
      x: window.innerWidth - EDGE - LAUNCHER,
      y: window.innerHeight - EDGE - LAUNCHER,
    }),
    []
  )

  // Place before paint so the launcher never flashes at the top-left corner.
  useLayoutEffect(() => {
    const { x, y } = launcherXY()
    gsap.set(wrapRef.current, { x, y })
  }, [launcherXY])

  // Open: fly onto the header slot once the panel has laid out.
  useLayoutEffect(() => {
    if (!open) return
    const wrap = wrapRef.current
    const slot = slotRef.current
    if (!wrap || !slot) return

    const rect = slot.getBoundingClientRect()
    const target = { x: rect.left, y: rect.top, scale: rect.width / LAUNCHER }

    if (prefersReduced()) gsap.set(wrap, target)
    else gsap.to(wrap, { ...target, duration: 0.55, ease: 'power3.inOut', overwrite: true })
  }, [open])

  // Keep it aligned if the viewport changes underneath it — and if the panel
  // itself resizes, which is what happens when the on-screen keyboard opens and
  // the sheet takes its height from the visual viewport.
  useEffect(() => {
    const onResize = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      if (open && slotRef.current) {
        const rect = slotRef.current.getBoundingClientRect()
        gsap.set(wrap, { x: rect.left, y: rect.top, scale: rect.width / LAUNCHER })
      } else {
        const { x, y } = launcherXY()
        gsap.set(wrap, { x, y, scale: 1 })
      }
    }

    // The observer fires once on attach, before the flight has started; ignore
    // that read or the mascot would snap into place instead of flying.
    let size = null
    const onPanelResize = (entries) => {
      const box = entries[entries.length - 1].contentRect
      const next = `${Math.round(box.width)}x${Math.round(box.height)}`
      if (size === null) {
        size = next
        return
      }
      if (next === size) return
      size = next
      onResize()
    }

    window.addEventListener('resize', onResize)
    const vv = window.visualViewport
    vv?.addEventListener('resize', onResize)
    vv?.addEventListener('scroll', onResize)

    let observer
    if (open && panelRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onPanelResize)
      observer.observe(panelRef.current)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      vv?.removeEventListener('resize', onResize)
      vv?.removeEventListener('scroll', onResize)
      observer?.disconnect()
    }
  }, [open, launcherXY])

  // Status → face. The timed decays are here, not in the package, because the
  // React prop is controlled and must not revert on its own.
  useEffect(() => {
    let timer
    if (chat.status === 'thinking') {
      setMood('thinking')
    } else if (chat.status === 'sent') {
      setMood('happy')
      timer = window.setTimeout(() => setMood('idle'), 2200)
    } else if (chat.status === 'error') {
      setMood('sorry')
      timer = window.setTimeout(() => setMood('idle'), 2600)
    } else if (typing) {
      setMood('listening')
    } else {
      setMood('idle')
    }
    return () => window.clearTimeout(timer)
  }, [chat.status, typing])

  // One gentle prompt per session, never on top of a page the visitor is reading.
  useEffect(() => {
    if (open) {
      setNudge(false)
      return undefined
    }
    if (sessionStorage.getItem('fs-chat-seen') === '1') return undefined
    const timer = window.setTimeout(() => setNudge(true), 6500)
    return () => window.clearTimeout(timer)
  }, [open])

  const openChat = useCallback(() => {
    setNudge(false)
    sessionStorage.setItem('fs-chat-seen', '1')
    setOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    const wrap = wrapRef.current
    const panel = panelRef.current
    const reduced = prefersReduced()
    const { x, y } = launcherXY()

    if (!reduced && panel) {
      gsap.to(panel, { opacity: 0, duration: 0.16, ease: 'power2.in' })
    }
    if (wrap) {
      if (reduced) gsap.set(wrap, { x, y, scale: 1 })
      else gsap.to(wrap, { x, y, scale: 1, duration: 0.45, ease: 'power3.inOut', overwrite: true })
    }

    window.setTimeout(
      () => {
        setOpen(false)
        // Focus must land on something that still exists; the launcher button
        // only renders once the panel is gone.
        requestAnimationFrame(() => launcherRef.current?.focus())
      },
      reduced ? 0 : 170
    )
  }, [launcherXY])

  const face = (
    <Mascot size="100%" variant="accent" mood={mood} idle={false} />
  )

  return (
    <>
      {open && (
        <ChatPanel
          panelRef={panelRef}
          slotRef={slotRef}
          messages={chat.messages}
          suggestions={chat.suggestions}
          status={chat.status}
          whatsapp={chat.whatsapp}
          onSend={chat.send}
          onRetry={chat.retry}
          onClose={closeChat}
          onTyping={setTyping}
        />
      )}

      {!open && nudge && (
        <div className="fixed right-5 bottom-[124px] z-30 flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper py-1.5 pl-3 pr-1.5 shadow-[0_8px_24px_rgba(11,11,11,0.14)]">
          <button
            type="button"
            onClick={openChat}
            className="flex items-center gap-2 text-[12.5px] text-ink"
          >
            <MessageCircle size={14} className="text-accent" />
            Questions? Ask me.
          </button>
          <button
            type="button"
            onClick={() => {
              setNudge(false)
              sessionStorage.setItem('fs-chat-seen', '1')
            }}
            aria-label="Dismiss"
            className="grid h-6 w-6 place-items-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            ×
          </button>
        </div>
      )}

      <div
        ref={wrapRef}
        className={`fixed left-0 top-0 z-[35] ${open ? 'pointer-events-none' : ''}`}
        style={{
          width: LAUNCHER,
          transformOrigin: 'top left',
          // Static fallback so the prerendered HTML puts it in the corner, and
          // so it never paints at 0,0 before the layout effect runs.
          transform: `translate3d(calc(100vw - ${EDGE + LAUNCHER}px), calc(100dvh - ${EDGE + LAUNCHER}px), 0)`,
        }}
      >
        {open ? (
          face
        ) : (
          <button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-label="Chat with FrameStudio"
            className="block w-full rounded-full transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            style={{ filter: 'drop-shadow(0 12px 26px rgba(11,11,11,0.3))' }}
          >
            {face}
          </button>
        )}
      </div>
    </>
  )
}
