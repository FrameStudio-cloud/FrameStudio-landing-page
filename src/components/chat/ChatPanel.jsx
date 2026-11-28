import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowUp, Check, MessageCircle, X } from 'lucide-react'
import ChatMessage from './ChatMessage'

const scrollToBottom = (el) => {
  if (el) el.scrollTop = el.scrollHeight
}

/**
 * The panel itself. Presentational — the conversation lives in useChat and the
 * mascot's flight lives in ChatWidget.
 *
 * Non-modal on purpose: `role="dialog"` without `aria-modal`, no scrim, no focus
 * trap. The page stays usable behind it, which is what a chat bubble should do.
 * Escape closes, focus moves in on open and returns to the launcher on close.
 */
export default function ChatPanel({
  panelRef,
  slotRef,
  messages,
  suggestions,
  status,
  whatsapp,
  onSend,
  onRetry,
  onClose,
  onTyping,
}) {
  const [value, setValue] = useState('')
  const scrollRef = useRef(null)

  // Entrance is opacity only: the mascot is the thing that moves, and a
  // transform here would shift the header slot the mascot is flying to.
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    panel.focus({ preventScroll: true })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.26, ease: 'power2.out' })
  }, [panelRef])

  useEffect(() => {
    scrollToBottom(scrollRef.current)
  }, [messages, status])

  // The on-screen keyboard shrinks the *visual* viewport, not the layout one, so
  // a `bottom-0` sheet of a fixed height gets panned up whole — header, close
  // button and all — the moment the input takes focus. Pin the sheet to the
  // visual viewport instead: the keyboard eats the message list and the input
  // stays exactly where it was.
  useEffect(() => {
    const panel = panelRef.current
    const vv = typeof window === 'undefined' ? null : window.visualViewport
    if (!panel || !vv) return undefined

    const wide = window.matchMedia('(min-width: 640px)')
    let full = 0

    const apply = () => {
      if (wide.matches) {
        panel.style.top = ''
        panel.style.bottom = ''
        panel.style.height = ''
        return
      }
      // Remember the tallest viewport seen without a keyboard: 85% of that is
      // the normal sheet. With the keyboard open the visible height is smaller
      // than that, so the sheet simply takes the room it has left.
      full = Math.max(full, vv.height)
      panel.style.top = `${Math.round(vv.offsetTop)}px`
      panel.style.bottom = 'auto'
      panel.style.height = `${Math.round(Math.min(vv.height, full * 0.85))}px`
      requestAnimationFrame(() => scrollToBottom(scrollRef.current))
    }

    // A rotation can make the viewport taller, so the baseline has to be re-read
    // or the sheet would stay at the old, shorter height.
    const reset = () => {
      full = 0
      apply()
    }

    apply()
    vv.addEventListener('resize', apply)
    vv.addEventListener('scroll', apply)
    wide.addEventListener('change', apply)
    window.addEventListener('orientationchange', reset)
    return () => {
      vv.removeEventListener('resize', apply)
      vv.removeEventListener('scroll', apply)
      wide.removeEventListener('change', apply)
      window.removeEventListener('orientationchange', reset)
    }
  }, [panelRef])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    panel.addEventListener('keydown', onKeyDown)
    return () => panel.removeEventListener('keydown', onKeyDown)
  }, [onClose, panelRef])

  const submit = (event) => {
    event.preventDefault()
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
    onTyping(false)
  }

  const chips = status !== 'thinking' && Array.isArray(suggestions) && suggestions.length > 0

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Chat with FrameStudio"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-30 flex h-[85dvh] flex-col overflow-hidden rounded-t-[20px] border border-ink/10 bg-paper shadow-[0_24px_70px_rgba(11,11,11,0.28)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[min(560px,calc(100dvh-40px))] sm:w-[384px] sm:rounded-[20px]"
    >
      <header className="flex items-center gap-3 border-b border-ink/10 px-3 py-2.5">
        {/* Where the mascot lands. Empty on purpose — it is painted by a sibling
            so the same element can fly here instead of being re-created. */}
        <div ref={slotRef} className="h-[42px] w-[42px] shrink-0" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-ink">
            FrameStudio
          </p>
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
            {status === 'thinking' ? 'Thinking…' : 'Websites · Bots · Dashboards'}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X size={17} />
        </button>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} from={message.from} text={message.text} />
        ))}
      </div>

      <div className="border-t border-ink/10 p-3">
        {status === 'sent' && (
          <div className="mb-2.5 space-y-2">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              <Check size={13} className="text-accent" />
              Details passed to the team
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-deep"
            >
              <MessageCircle size={16} />
              Continue on WhatsApp
            </a>
          </div>
        )}

        {chips && (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {suggestions.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onSend(chip)}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-[12.5px] text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.03]"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {status === 'error' && (
          <button
            type="button"
            onClick={onRetry}
            className="mb-2 w-full rounded-full border border-accent/50 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-accent/10"
          >
            Try sending again
          </button>
        )}

        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="fs-chat-input" className="sr-only">
            Message
          </label>
          <input
            id="fs-chat-input"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              onTyping(event.target.value.trim().length > 0)
            }}
            placeholder="Type a message…"
            autoComplete="off"
            enterKeyHint="send"
            className="h-11 min-w-0 flex-1 rounded-full border border-ink/15 bg-white/60 px-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none sm:text-[13.5px]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!value.trim() || status === 'thinking'}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-ink transition-opacity disabled:opacity-40"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
