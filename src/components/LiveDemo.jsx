import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { Pause, Play, ArrowUpRight } from 'lucide-react'

/**
 * "Watch a shop run" — a scripted product demo instead of video or cards.
 *
 * Rules this follows (and that you should keep if you edit it):
 *  - WCAG 2.2.2: anything that moves by itself for >5s needs a visible,
 *    keyboard-reachable pause control. That is the Pause button; its label and
 *    accessible name swap together (never aria-pressed plus a changing label).
 *  - prefers-reduced-motion: no timeline is created at all. The markup below is
 *    the FINAL state, so the section is still complete and readable.
 *  - Off-screen = paused. An IntersectionObserver stops the timeline when the
 *    stage is not visible, so an idle tab is not burning battery.
 *  - Only transform/opacity are tweened on layout; numbers write textContent
 *    directly so React never re-renders inside the loop.
 */

const CHAPTERS = [
  { id: 'sale', label: 'A sale lands', at: 0 },
  { id: 'stock', label: 'Stock runs low', at: 6 },
  { id: 'bot', label: 'The bot replies', at: 12 },
  { id: 'web', label: 'The site sells', at: 18 },
]

// Final values. The markup renders these, so no-JS and reduced-motion users see
// a finished dashboard rather than an empty box.
const FINAL_SALES = 45250
const FINAL_ORDERS = 24
const FINAL_LOW = 2

const formatKsh = (n) => `KSh ${Math.round(n).toLocaleString('en-KE')}`

export default function LiveDemo() {
  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const appRef = useRef(null)
  const salesRef = useRef(null)
  const ordersRef = useRef(null)
  const lowRef = useRef(null)
  const lowCountRef = useRef(null)
  const stockBarRef = useRef(null)
  const stockCountRef = useRef(null)
  const stockAlertRef = useRef(null)
  const newOrderRef = useRef(null)
  const newChipRef = useRef(null)
  const webOrderRef = useRef(null)
  const webBadgeRef = useRef(null)
  const toastRef = useRef(null)
  const chatRef = useRef(null)
  const mobileBotRef = useRef(null)
  const typingRef = useRef(null)
  const replyRef = useRef(null)
  const sparkRef = useRef(null)
  const progressRef = useRef(null)
  const timecodeRef = useRef(null)

  const tlRef = useRef(null)
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(() => !prefersReduced())
  const [reduced, setReduced] = useState(prefersReduced)
  const [activeChapter, setActiveChapter] = useState(0)

  useEffect(() => {
    // Reduced motion: no timeline at all. The markup is already the final state.
    if (reduced) return

    const ctx = gsap.context(() => {
      const sales = { v: 41200 }
      const orders = { v: 22 }
      const stock = { v: 12 }

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.4,
        defaults: { ease: 'power3.out' },
        onUpdate: () => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${tl.progress()})`
          }
          if (timecodeRef.current) {
            const total = Math.round(tl.duration())
            const now = Math.min(total, Math.round(tl.time()))
            const pad = (n) => String(n).padStart(2, '0')
            timecodeRef.current.textContent = `00:${pad(now)} / 00:${pad(total)}`
          }
          const p = tl.progress()
          const idx = Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length))
          setActiveChapter((prev) => (prev === idx ? prev : idx))
        },
      })

      tl.addLabel('sale', 0)
        .set(lowCountRef.current, { textContent: 1 }, 0)
        .set(mobileBotRef.current, { opacity: 0, y: 8 }, 0)
        .set(webOrderRef.current, { display: 'none' }, 0)
        .fromTo(appRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          0
        )
        .fromTo(newOrderRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          0.4
        )
        .fromTo(newChipRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.35 },
          1.0
        )
        .fromTo(orders,
          { v: 22 },
          {
            v: 23, duration: 1.2, ease: 'none',
            onUpdate: () => {
              if (ordersRef.current) ordersRef.current.textContent = Math.round(orders.v)
            },
          },
          1.1
        )
        .fromTo(sales,
          { v: 41200 },
          {
            v: 42850, duration: 1.8, ease: 'power2.out',
            onUpdate: () => {
              if (salesRef.current) salesRef.current.textContent = formatKsh(sales.v)
            },
          },
          1.1
        )

      // Scene two — a size sells out, the alert fires.
      tl.addLabel('stock', 6)
        .fromTo(stock,
          { v: 12 },
          {
            v: 9, duration: 1.6, ease: 'power2.inOut',
            onUpdate: () => {
              if (stockCountRef.current) stockCountRef.current.textContent = Math.round(stock.v)
            },
          },
          6.1
        )
        .fromTo(stockBarRef.current,
          { scaleX: 0.62 },
          { scaleX: 0.42, duration: 1.6, ease: 'power2.inOut', transformOrigin: 'left center' },
          6.1
        )
        .fromTo(lowRef.current,
          { color: '#FBF8F0' },
          { color: '#FF5A36', duration: 0.4 },
          6.9
        )
        .set(lowCountRef.current, { textContent: 2 }, 6.9)
        .fromTo(stockAlertRef.current,
          { color: 'rgba(251,248,240,0.55)' },
          { color: '#FF5A36', duration: 0.4 },
          6.9
        )
        .fromTo(toastRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          7.2
        )
        .to(toastRef.current, { y: 10, opacity: 0, duration: 0.4 }, 10.6)

      // Scene three — the bot answers before the shop opens WhatsApp.
      tl.addLabel('bot', 12)
        .fromTo(chatRef.current,
          { y: 18, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          11.9
        )
        .fromTo(typingRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25 },
          12.4
        )
        .to(typingRef.current, { opacity: 0, duration: 0.2 }, 14.0)
        .fromTo(replyRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45 },
          14.1
        )
        .to(chatRef.current, { y: 14, opacity: 0, duration: 0.45 }, 17.1)
        .fromTo(mobileBotRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45 },
          12.1
        )
        .to(mobileBotRef.current, { opacity: 0, y: 8, duration: 0.35 }, 17.2)

      // Scene four — the shop's own website sells something while the shop
      // sleeps: a second channel, same dashboard.
      tl.addLabel('web', 18)
        .set(webOrderRef.current, { display: 'flex' }, 18.3)
        .fromTo(webOrderRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          18.35
        )
        .fromTo(webBadgeRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.35 },
          18.9
        )
        .fromTo(orders,
          { v: 23 },
          {
            v: 24, duration: 1, ease: 'none',
            onUpdate: () => {
              if (ordersRef.current) ordersRef.current.textContent = Math.round(orders.v)
            },
          },
          18.7
        )
        .fromTo(sales,
          { v: 42850 },
          {
            v: 45250, duration: 1.6, ease: 'power2.out',
            onUpdate: () => {
              if (salesRef.current) salesRef.current.textContent = formatKsh(sales.v)
            },
          },
          18.7
        )
        // Seam: fade the screen to black so the loop reads as a cut, not a glitch.
        .to(appRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 23.55)

      // One-off: the week's sparkline draws itself on first sight.
      if (sparkRef.current) {
        gsap.fromTo(sparkRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: 0.4 }
        )
      }

      tl.progress(0).pause()
      tlRef.current = tl

      // Play only while the stage is on screen.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!tlRef.current) return
          if (entry.isIntersecting && !userPausedRef.current) {
            tlRef.current.play()
            setPlaying(true)
          } else {
            tlRef.current.pause()
            if (!entry.isIntersecting) setPlaying((p) => (userPausedRef.current ? p : false))
          }
        },
        { threshold: 0.35 }
      )
      if (stageRef.current) io.observe(stageRef.current)

      // Reduced motion can be switched on at runtime too.
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const onChange = (e) => {
        if (e.matches) {
          tlRef.current?.pause()
          setReduced(true)
          setPlaying(false)
        }
      }
      mq.addEventListener?.('change', onChange)

      return () => {
        io.disconnect()
        mq.removeEventListener?.('change', onChange)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    if (tl.paused()) {
      userPausedRef.current = false
      tl.play()
      setPlaying(true)
    } else {
      userPausedRef.current = true
      tl.pause()
      setPlaying(false)
    }
  }

  const jumpTo = (chapter) => {
    const tl = tlRef.current
    if (!tl) return
    tl.pause()
    // `false` = don't suppress events, so number tweens (which write via
    // textContent) re-render to match the bars after a jump.
    tl.seek(chapter.at, false)
    setActiveChapter(CHAPTERS.indexOf(chapter))
    // Seeking implies the user wants to watch that scene, so resume unless they
    // had explicitly paused.
    if (!userPausedRef.current) {
      tl.play()
      setPlaying(true)
    }
  }

  return (
    <section ref={sectionRef} id="demo" className="relative bg-ink py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[400px] bg-accent/[0.08] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              Running live, right now
            </p>
            <h2 className="mt-5 font-display text-[2.6rem] md:text-6xl lg:text-[4rem] font-semibold text-paper tracking-[-0.035em] leading-[0.95] text-balance">
              Watch a shop <span className="accent-italic text-accent">run.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-paper/55 leading-relaxed">
              This is Keel — the dashboard we build for clients — running on sample data.
              Not a screenshot, not a video: the same React and Supabase code we ship.
            </p>
            <Link
              to="/portfolio/keel"
              className="group mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70 hover:text-accent transition-colors"
            >
              Open the case study
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* The stage. One screen, not a grid of cards. */}
        <div ref={stageRef} className="relative mt-12">
          <div className="relative rounded-2xl md:rounded-3xl border border-paper/12 bg-[#101010] overflow-hidden">
            {/* chrome / recording bar */}
            <div className="flex items-center gap-3 px-4 md:px-5 h-11 border-b border-paper/10 bg-[#0c0c0c]">
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-paper/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper/15" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="font-mono text-[10px] text-paper/35 tracking-[0.06em] truncate">
                  keel.framestudio.co.ke / kilimani-kicks
                </span>
              </div>
              {reduced ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/30 hidden sm:block">
                  still frame
                </span>
              ) : (
                <span className="font-mono text-[10px] text-paper/40 tabular-nums hidden sm:block" ref={timecodeRef}>
                  00:00 / 00:24
                </span>
              )}
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping opacity-60" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                rec
              </span>
            </div>

            {/* app surface — decorative: the meaning lives in the caption + sr-only text */}
            <div aria-hidden="true" ref={appRef} className="relative p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm sm:text-base font-semibold text-paper leading-none whitespace-nowrap">Kilimani Kicks</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35 mt-1.5 hidden sm:block">Keel · Dashboard</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  {['Sales', 'Stock', 'Inbox'].map((tab, i) => (
                    <span
                      key={tab}
                      className={`px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.12em] ${
                        i === 0 ? 'bg-paper/10 text-paper/80' : 'text-paper/30'
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              {/* KPIs — numbers and hairlines, not cards */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 divide-x divide-paper/10 border-y border-paper/10 py-4">
                <div className="pr-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Today's sales</p>
                  <p className="mt-1.5 font-display text-xl sm:text-2xl font-semibold text-paper tabular-nums">
                    <span ref={salesRef}>{formatKsh(FINAL_SALES)}</span>
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-accent">+12.4% vs yesterday</p>
                </div>
                <div className="px-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Orders</p>
                  <p className="mt-1.5 font-display text-xl sm:text-2xl font-semibold text-paper tabular-nums">
                    <span ref={ordersRef}>{FINAL_ORDERS}</span>
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-paper/35">3 waiting to pack</p>
                </div>
                <div className="hidden sm:block pl-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Low stock</p>
                  <p ref={lowRef} className="mt-1.5 font-display text-xl sm:text-2xl font-semibold text-paper tabular-nums">
                    <span ref={lowCountRef}>{FINAL_LOW}</span>
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-paper/35">Air Max 90 is selling fast</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* orders feed */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Live orders</p>
                    <span className="font-mono text-[9px] text-accent/80">auto-refresh</span>
                  </div>

                  <div className="mt-3 divide-y divide-paper/10">
                    {/* scene four: an order from the shop's own website */}
                    <div ref={webOrderRef} className="flex items-center gap-3 py-2.5">
                      <span className="font-mono text-[10px] text-accent">#1043</span>
                      <span className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="text-xs text-paper truncate">Kiko clutch · black</span>
                        <span
                          ref={webBadgeRef}
                          className="shrink-0 font-mono text-[8px] uppercase tracking-[0.12em] text-paper/50 border border-paper/20 rounded px-1 py-px"
                        >
                          web
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-paper/60 tabular-nums">KSh 2,400</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-accent border border-accent/40 rounded px-1.5 py-0.5">
                        paid
                      </span>
                    </div>
                    {/* the row that arrives in scene one */}
                    <div ref={newOrderRef} className="flex items-center gap-3 py-2.5">
                      <span className="font-mono text-[10px] text-accent">#1042</span>
                      <span className="flex-1 text-xs text-paper truncate">Air Max 90 · size 42</span>
                      <span className="font-mono text-[10px] text-paper/60 tabular-nums">KSh 8,500</span>
                      <span
                        ref={newChipRef}
                        className="font-mono text-[9px] uppercase tracking-[0.1em] text-accent border border-accent/40 rounded px-1.5 py-0.5"
                      >
                        paid
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-2.5">
                      <span className="font-mono text-[10px] text-paper/35">#1041</span>
                      <span className="flex-1 text-xs text-paper/70 truncate">Kiko clutch · tan</span>
                      <span className="font-mono text-[10px] text-paper/45 tabular-nums">KSh 2,400</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35 border border-paper/15 rounded px-1.5 py-0.5">paid</span>
                    </div>
                    <div className="flex items-center gap-3 py-2.5">
                      <span className="font-mono text-[10px] text-paper/35">#1040</span>
                      <span className="flex-1 text-xs text-paper/70 truncate">Court sneakers · white</span>
                      <span className="font-mono text-[10px] text-paper/45 tabular-nums">KSh 6,200</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35 border border-paper/15 rounded px-1.5 py-0.5">packed</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 py-2.5">
                      <span className="font-mono text-[10px] text-paper/35">#1039</span>
                      <span className="flex-1 text-xs text-paper/70 truncate">Leather sandals · brown</span>
                      <span className="font-mono text-[10px] text-paper/45 tabular-nums">KSh 1,950</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35 border border-paper/15 rounded px-1.5 py-0.5">paid</span>
                    </div>
                  </div>

                  {/* Mobile can't see the floating chat, so the bot's answer
                      lands inline instead of disappearing on small screens. */}
                  <div ref={mobileBotRef} className="sm:hidden mt-4 border-t border-paper/10 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[9px] text-accent">K</span>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">Keel bot · replied in 4s</p>
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-paper/75">
                      “Yes — 3 left in 42. Pay KSh 8,500 via M-Pesa and we deliver tomorrow.”
                    </p>
                  </div>
                </div>

                {/* stock bars */}
                <div className="hidden lg:block">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Stock</p>
                  <div className="mt-3 space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-paper/70">Air Max 90</span>
                        <span ref={stockAlertRef} className="font-mono text-[10px] text-paper/50 tabular-nums">
                          <span ref={stockCountRef}>9</span> left
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 bg-paper/10 rounded-full overflow-hidden">
                        <div ref={stockBarRef} className="h-full w-full bg-accent rounded-full" style={{ transform: 'scaleX(0.42)', transformOrigin: 'left center' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-paper/60">Court sneakers</span>
                        <span className="font-mono text-[10px] text-paper/40 tabular-nums">24 left</span>
                      </div>
                      <div className="mt-1.5 h-1 bg-paper/10 rounded-full overflow-hidden">
                        <div className="h-full bg-paper/35 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-paper/60">Kiko clutch</span>
                        <span className="font-mono text-[10px] text-paper/40 tabular-nums">7 left</span>
                      </div>
                      <div className="mt-1.5 h-1 bg-paper/10 rounded-full overflow-hidden">
                        <div className="h-full bg-paper/25 rounded-full" style={{ width: '34%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">Last 7 days</p>
                    <svg viewBox="0 0 200 48" className="mt-2 w-full h-10" preserveAspectRatio="none">
                      <path d="M0 38 L28 30 L56 33 L84 22 L112 26 L140 14 L168 18 L200 6" fill="none" stroke="rgba(251,248,240,0.14)" strokeWidth="1.5" />
                      <path
                        ref={sparkRef}
                        d="M0 38 L28 30 L56 33 L84 22 L112 26 L140 14 L168 18 L200 6"
                        fill="none"
                        stroke="#FF5A36"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset="0"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* stock alert */}
              <div
                ref={toastRef}
                className={`absolute right-4 bottom-4 sm:right-8 sm:bottom-8 max-w-[260px] rounded-xl border border-accent/40 bg-[#1a0f0b] px-3.5 py-2.5 shadow-lg ${reduced ? 'hidden' : ''}`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">Low stock</p>
                <p className="mt-1 text-[11px] leading-snug text-paper/80">Air Max 90 · size 42 — 9 pairs left. Reorder?</p>
              </div>

              {/* the bot answering, as a chat window over the dashboard */}
              <div
                ref={chatRef}
                className="hidden sm:block absolute right-8 bottom-8 w-[280px] rounded-2xl border border-paper/15 bg-[#0d0d0d] overflow-hidden shadow-2xl"
              >
                <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-paper/10">
                  <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] text-accent">K</span>
                  <div className="leading-tight">
                    <p className="text-[11px] text-paper/85">Keel bot</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent">online</p>
                  </div>
                </div>
                <div className="p-3.5 space-y-2.5">
                  <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-paper/10 px-3 py-2 text-[11px] text-paper/80">
                    Hi — do you have the Air Max in 42?
                  </p>
                  <div ref={typingRef} className="w-fit flex items-center gap-1 px-3 py-2.5 rounded-lg bg-accent/15">
                    <span className="w-1 h-1 rounded-full bg-accent/70" />
                    <span className="w-1 h-1 rounded-full bg-accent/70" />
                    <span className="w-1 h-1 rounded-full bg-accent/70" />
                  </div>
                  <div ref={replyRef} className="w-fit max-w-[90%] rounded-lg rounded-bl-sm bg-accent text-ink px-3 py-2 text-[11px] leading-snug">
                    Yes — 3 left in 42. Pay KSh 8,500 via M-Pesa and we deliver tomorrow.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="sr-only">
            Animated preview of a shop dashboard. Today's sales KSh 45,250, 24 orders,
            2 low-stock items. A new order arrives, the Air Max 90 stock drops to 9,
            a WhatsApp bot answers a customer automatically, and the shop's own
            website sells an item on its own.
          </p>

          {/* transport: chapters + pause. Plain buttons, visible labels, keyboard
              reachable. With reduced motion there is nothing to control, so the
              controls are replaced by a plain statement instead of a dead button. */}
          {reduced ? (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
              Static preview — motion reduced by your device settings
            </p>
          ) : (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? 'Pause the demo' : 'Play the demo'}
                className="inline-flex items-center gap-2 self-start rounded-full border border-paper/15 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 hover:border-accent/50 hover:text-accent transition-colors"
              >
                {playing ? <Pause size={12} /> : <Play size={12} />}
                {playing ? 'Pause' : 'Play'}
              </button>

              <div className="flex-1 relative">
                <div className="h-px w-full bg-paper/10">
                  <div
                    ref={progressRef}
                    className="h-px w-full bg-accent origin-left"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {CHAPTERS.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => jumpTo(c)}
                      aria-label={`Jump to scene: ${c.label}`}
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                        activeChapter === i ? 'text-accent' : 'text-paper/35 hover:text-paper/70'
                      }`}
                    >
                      0{i + 1} · {c.label}
                    </button>
                  ))}
                  <span className="hidden sm:block ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
                    Sample data · no audio
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
