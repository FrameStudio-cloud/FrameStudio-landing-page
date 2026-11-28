import { useEffect, useRef, useState } from 'react'
import { Bot, RotateCcw } from 'lucide-react'

/**
 * The one interactive piece on /services: a WhatsApp-style conversation the
 * visitor drives by tapping, not one that plays at them.
 *
 * No timers, no typing indicator, no autoplay — so there is nothing to pause and
 * nothing that WCAG 2.2.2 asks us to give a stop button for. Each reply is
 * appended and announced through `role="log"`, and the script below is sample
 * data: it must never contain a real client, price list, phone number or order.
 */

const SCRIPT = {
  start: {
    bubbles: [
      'Hi 👋 This is ShopBot, the shop’s WhatsApp assistant. Ask me anything.',
    ],
    replies: [
      { label: 'Do you have the leather sandals in size 42?', next: 'stock' },
      { label: 'Do you deliver to Thika?', next: 'delivery' },
    ],
  },
  stock: {
    bubbles: [
      'Yes — four pairs left in size 42. They are KSh 2,800.',
      'Would you like me to reserve a pair for you today?',
    ],
    replies: [
      { label: 'Yes, reserve the black pair', next: 'order' },
      { label: 'What colours do you have?', next: 'colours' },
    ],
  },
  colours: {
    bubbles: ['Black, tan and brown. Size 42 is in stock in black and tan.'],
    replies: [
      { label: 'Reserve the black pair', next: 'order' },
      { label: 'Can I collect tomorrow?', next: 'collect' },
    ],
  },
  collect: {
    bubbles: [
      'Yes. We are open 8am–6pm, Monday to Saturday. Bring the order number.',
      'Shall I reserve the black pair until tomorrow at 6pm?',
    ],
    replies: [{ label: 'Yes, reserve it', next: 'order' }],
  },
  delivery: {
    bubbles: [
      'Yes — Thika is KSh 250, delivered the next working day.',
      'You can pay on delivery, or by M-Pesa now.',
    ],
    replies: [
      { label: 'Great, I’ll take the sandals', next: 'order' },
      { label: 'And to Nanyuki?', next: 'upcountry' },
    ],
  },
  upcountry: {
    bubbles: ['Nanyuki is KSh 400, two working days. Same payment options.'],
    replies: [{ label: 'OK, take the order', next: 'order' }],
  },
  order: {
    bubbles: [
      'Done. Order #1042 — one pair, black, size 42. Reserved until 6pm today.',
      'I have sent the M-Pesa prompt to your phone. Send the screenshot here once it clears.',
    ],
    replies: [],
  },
}

function seedThread() {
  return SCRIPT.start.bubbles.map((text, index) => ({
    id: `start-${index}`,
    from: 'shop',
    text,
  }))
}

export default function BotChatDemo() {
  const [node, setNode] = useState('start')
  const [thread, setThread] = useState(seedThread)
  const counter = useRef(0)
  const listRef = useRef(null)

  const current = SCRIPT[node]

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    // `auto`, never smooth: a scrolling chat that glides is motion the reader did
    // not ask for, and it fights anyone who set reduced motion.
    list.scrollTop = list.scrollHeight
  }, [thread])

  const nextId = () => {
    counter.current += 1
    return `m-${counter.current}`
  }

  const choose = (reply) => {
    const target = SCRIPT[reply.next]
    setThread((previous) => [
      ...previous,
      { id: nextId(), from: 'you', text: reply.label },
      ...target.bubbles.map((text) => ({ id: nextId(), from: 'shop', text })),
    ])
    setNode(reply.next)
  }

  const reset = () => {
    setNode('start')
    setThread(seedThread())
  }

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col justify-center border-b border-ink/10 px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          Bots &amp; automation
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
          Tap a question. This is the same flow we write for you.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Most Kenyan customers will not fill in a form or install an app. They already
          have WhatsApp. The bot answers, takes the order, and hands the conversation to
          you the moment it does not know the answer.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Replies in seconds, at any hour
          </li>
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            You edit the answers yourself
          </li>
          <li className="flex gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Handover to a person, never a dead end
          </li>
        </ul>
      </div>

      <div className="flex items-start justify-center bg-ink/[0.03] px-3 py-5 sm:px-6">
        <div className="w-full max-w-[380px] overflow-hidden rounded-[22px] border border-ink/10 bg-white">
          <div className="flex items-center gap-2.5 border-b border-ink/10 bg-cream/60 px-3 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-accent">
              <Bot size={15} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold leading-tight text-ink">
                ShopBot
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">
                sample conversation
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45 transition-colors hover:text-ink"
            >
              <RotateCcw size={10} aria-hidden="true" />
              Restart
            </button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Sample WhatsApp conversation"
            className="h-[268px] space-y-2 overflow-y-auto bg-[#EFEBE1] px-3 py-3"
          >
            <p className="text-center font-mono text-[8px] uppercase tracking-[0.18em] text-ink/35">
              Today
            </p>
            {thread.map((message) => (
              <div
                key={message.id}
                className={`max-w-[86%] rounded-xl px-2.5 py-1.5 text-[11.5px] leading-snug ${
                  message.from === 'you'
                    ? 'ml-auto bg-ink text-paper'
                    : 'bg-white text-ink shadow-[0_1px_2px_rgba(11,11,11,0.06)]'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-ink/10 bg-white px-2.5 py-2.5">
            {current.replies.length > 0 ? (
              <>
                <p className="mb-1.5 px-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-ink/35">
                  Tap to reply
                </p>
                <div className="flex flex-col gap-1.5">
                  {current.replies.map((reply) => (
                    <button
                      key={reply.label}
                      type="button"
                      onClick={() => choose(reply)}
                      className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-left text-[11.5px] leading-snug text-ink transition-colors hover:border-accent hover:bg-accent/10"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[11.5px] font-semibold text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                <RotateCcw size={11} aria-hidden="true" />
                Start the conversation again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
