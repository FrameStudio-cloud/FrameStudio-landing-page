import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Mic, PenLine } from 'lucide-react'

const TABS = ['All', 'Images', 'Videos', 'Maps', 'News']
const DEFAULT_QUERY = 'office furniture nairobi'

/**
 * The one SEO block on the home page.
 *
 * Not a paragraph about SEO — the thing itself. The visitor types what they
 * sell into a search bar and their own name lands in the top result. That
 * single move explains the service faster than any copy, and it is the reason
 * this band exists instead of a card.
 *
 * A mock that looks like a search field is not obviously a control, so the
 * field types itself once when it scrolls into view — the cheapest way to say
 * "this is a field" without a sentence under it. Any focus or tap stops the
 * animation immediately and hands the field over; reduced-motion visitors get
 * the finished state with no typing at all.
 *
 * Nothing is submitted, nothing is queried: the field drives one line of text
 * in a mock. The footer says so, because a fake search is exactly what a
 * visitor will mistake for a real one.
 *
 * No `aria-live` on the result: announcing every keystroke would be worse than
 * announcing nothing. The typed text is the visitor's own, on screen, where
 * they are already looking.
 */
/**
 * A plausible domain from what they typed — whole words only, so a long query
 * never produces "officefurniturenairo.co.ke".
 */
function domainFrom(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
  let slug = ''

  for (const word of words) {
    if (!slug && word.length > 16) return `${word.slice(0, 16)}.co.ke`
    if (slug.length + word.length > 16) break
    slug += word
  }

  return `${slug || 'yourbusiness'}.co.ke`
}

export default function SeoBand() {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const panelRef = useRef(null)
  const touched = useRef(false)

  // Shows that the field is a field: type the example out once, on first view.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined

    let timers = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        if (touched.current) return

        setQuery('')

        timers = DEFAULT_QUERY.split('').map((_, index) =>
          setTimeout(() => {
            if (touched.current) return
            setQuery(DEFAULT_QUERY.slice(0, index + 1))
          }, 420 + index * 42)
        )
      },
      { threshold: 0.5 }
    )

    observer.observe(panel)

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  const handOver = (event) => {
    touched.current = true
    // If the demo is still mid-sentence, finish it before the caret lands so
    // the visitor never inherits half a word.
    setQuery((current) => (current.length < DEFAULT_QUERY.length ? DEFAULT_QUERY : current))
    event.target.select()
  }

  const typed = query.trim()
  const shown = typed || 'your business in nairobi'
  const title = shown.charAt(0).toUpperCase() + shown.slice(1)

  return (
    <section className="relative overflow-hidden bg-cream py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-balance md:text-4xl lg:text-[3.1rem]">
              They search before they <span className="accent-italic">call</span>.
            </h2>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Google, Maps, and now ChatGPT. One shop has to turn up in all three — and that is a
              different job from looking good.
            </p>

            <Link
              to="/seo"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent-deep"
            >
              How SEO works here
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div ref={panelRef} className="mx-auto w-full max-w-[620px] lg:ml-auto">
              <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-paper shadow-[0_44px_80px_-52px_rgba(11,11,11,0.6)]">
                {/* Search bar */}
                <div className="border-b border-ink/10 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-ink/40">
                      Type what you sell
                    </p>
                    <PenLine size={10} className="text-accent" aria-hidden="true" />
                  </div>

                  {/* The pill is the label, so a tap anywhere in it lands the
                      caret — no dead space on a phone. */}
                  <label
                    htmlFor="seo-try"
                    className="flex cursor-text items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-2 transition-colors hover:border-ink/25 focus-within:border-accent/60"
                  >
                    <span className="sr-only">Search preview — type what you sell</span>
                    <img
                      src="/logos/google.png"
                      alt=""
                      className="h-3.5 w-3.5 shrink-0 object-contain"
                    />
                    <input
                      id="seo-try"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onFocus={handOver}
                      placeholder="type what you sell…"
                      autoComplete="off"
                      enterKeyHint="search"
                      className="min-w-0 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink/35"
                    />
                    <Mic size={12} className="shrink-0 text-ink/25" aria-hidden="true" />
                    <Camera size={12} className="shrink-0 text-ink/25" aria-hidden="true" />
                  </label>

                  <div className="mt-2.5 flex items-end gap-4 overflow-hidden" aria-hidden="true">
                    {TABS.map((tab) => (
                      <span
                        key={tab}
                        className={`shrink-0 pb-2 text-[11px] ${
                          tab === 'All'
                            ? 'border-b-2 border-accent font-semibold text-ink'
                            : 'border-b-2 border-transparent text-ink/40'
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                    <span className="ml-auto shrink-0 pb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/25">
                      Tools
                    </span>
                  </div>
                </div>

                {/* The result the visitor types themselves into */}
                <div className="p-3">
                  <article className="rounded-xl border border-accent/50 bg-accent/[0.06] p-3">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[8px] font-bold text-accent"
                      >
                        Y
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[10.5px] font-medium leading-tight text-ink/80">
                          Your business
                        </p>
                        <p className="truncate font-mono text-[8px] leading-tight text-ink/40">
                          {domainFrom(typed)}
                        </p>
                      </div>
                      <span className="ml-auto shrink-0 rounded-full bg-ink px-1.5 py-px font-mono text-[7.5px] uppercase tracking-[0.12em] text-paper">
                        You
                      </span>
                    </div>

                    <p className="mt-2 truncate text-[13.5px] font-medium leading-snug text-ink underline decoration-accent decoration-2 underline-offset-[3px]">
                      {title}
                    </p>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-ink/55">
                      What you sell, where you are, and how to order — on one page a crawler can
                      read.
                    </p>
                  </article>

                  <div className="mt-3 space-y-3" aria-hidden="true">
                    {[0, 1].map((row) => (
                      <div key={row} className="flex gap-2.5">
                        <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-ink/[0.06]" />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <span className="block h-1.5 w-[34%] rounded-full bg-ink/[0.09]" />
                          <span className="block h-2 w-[70%] rounded-full bg-accent/[0.22]" />
                          <span className="block h-1.5 w-[92%] rounded-full bg-ink/[0.06]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-ink/35">
                    Preview · nothing is sent
                  </p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-ink/30">
                    Google · sample
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
