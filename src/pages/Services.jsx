import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, MessageCircle, ExternalLink, FileCheck2, Sparkles } from 'lucide-react'
import { SERVICES, PROCESS, ALWAYS_INCLUDED, AI_WORK, CAPABILITY_SCHEMA } from '../lib/services'
import ServiceConsole from '../components/services/ServiceConsole'
import CapabilityIndex from '../components/services/CapabilityIndex'
import BrandWall from '../components/services/BrandWall'
import HeroDeck from '../components/services/HeroDeck'
import ServiceBento from '../components/services/ServiceBento'
import { DottedGrid, FloatChip } from '../components/services/objects'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP =
  'https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%27d%20like%20to%20talk%20about%20a%20project.'

/**
 * Service schema, deliberately without `offers`: no price is published yet.
 * The capability extras are included so the page's structured data matches what
 * it actually claims — SEO, payments and AI are real services, not bullet points.
 */
const SCHEMA_SERVICES = [
  ...SERVICES.map((service) => ({ name: service.schemaName, promise: service.promise })),
  ...CAPABILITY_SCHEMA,
]

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'FrameStudio services',
  itemListElement: SCHEMA_SERVICES.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.name,
      description: service.promise,
      serviceType: service.name,
      areaServed: { '@type': 'Country', name: 'Kenya' },
      provider: {
        '@type': 'Organization',
        name: 'FrameStudio',
        url: 'https://www.framestudio.co.ke',
      },
    },
  })),
}

export default function Services() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    // The JSX below is written as the final state (`opacity: 1`, no transform),
    // so reduced-motion and no-JS visitors get the whole page. Only ask for the
    // motion if the visitor has not opted out of it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
        )
      }

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <title>Services — Websites, WhatsApp Bots &amp; Dashboards | FrameStudio</title>
      <meta
        name="description"
        content="Websites, WhatsApp bots, dashboards, M-Pesa and Paystack payments, SEO and AI for Kenyan SMEs. Fixed quote in writing, handed over in your name."
      />
      <link rel="canonical" href="https://www.framestudio.co.ke/services" />
      <script type="application/ld+json">{JSON.stringify(servicesSchema)}</script>

      {/* Hero ------------------------------------------------------------------ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-accent/[0.12] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div ref={heroRef} className="lg:col-span-7">
              <h1 className="font-display text-[2.6rem] md:text-6xl lg:text-[4.2rem] font-semibold text-paper tracking-[-0.03em] leading-[0.98] text-balance">
                Pick the problem.
                <br />
                We&rsquo;ll build the <span className="accent-italic text-accent">fix</span>.
              </h1>
              <p className="text-paper/55 text-lg max-w-xl mt-6 leading-relaxed">
                Websites, WhatsApp bots, dashboards, payments, search and AI — one studio for
                the whole build, not just the homepage. Start with the problem that is costing
                you money today.
              </p>
            </div>

            <div className="lg:col-span-5">
              <HeroDeck />
            </div>
          </div>
        </div>
      </section>

      {/* Try it ----------------------------------------------------------------- */}
      <section className="py-16 md:py-20 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div
            data-reveal
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8 md:mb-10"
          >
            <div className="max-w-2xl">
              <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
                The same three, <span className="accent-italic">working</span>.
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/40 md:max-w-[220px] md:text-right">
              No video, no screenshots.
              <br />
              Sample data — nothing here charges anyone.
            </p>
          </div>

          <div data-reveal>
            <ServiceConsole />
          </div>
        </div>
      </section>

      {/* What we can actually do ------------------------------------------------- */}
      <section id="capabilities" className="scroll-mt-24 py-20 md:py-28 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div data-reveal className="max-w-3xl">
            <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
              What we can <span className="accent-italic">actually</span> do.
            </h2>
            <p className="text-ink-soft text-lg mt-5 leading-relaxed">
              Most clients arrive asking for a website and leave with payments, search and
              something that runs at 11pm. Four groups, one studio.
            </p>
          </div>

          <div data-reveal className="mt-12 md:mt-16">
            <CapabilityIndex />
          </div>
        </div>
      </section>

      {/* The three, in writing --------------------------------------------------- */}
      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <ServiceBento />

          <div
            data-reveal
            className="mt-16 rounded-3xl border border-ink/10 bg-ink p-7 md:p-9"
          >
            <div className="flex items-center gap-3">
              <FileCheck2 size={20} className="shrink-0 text-accent" aria-hidden="true" />
              <p className="font-display text-lg font-semibold text-paper">
                {ALWAYS_INCLUDED.lead}
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ALWAYS_INCLUDED.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-paper/70">
                  <Check
                    size={15}
                    strokeWidth={3}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Brands ---------------------------------------------------------------- */}
      <section id="integrations" className="relative py-14 md:py-16 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[420px] bg-accent/[0.06] rounded-full blur-[150px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div data-reveal>
            <BrandWall />
          </div>
        </div>
      </section>

      {/* AI ---------------------------------------------------------------------- */}
      <section id="ai" className="scroll-mt-24 py-20 md:py-28 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div data-reveal className="max-w-3xl">
            <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
              AI that knows your <span className="accent-italic">shop</span>.
            </h2>
            <p className="text-ink-soft text-lg mt-5 leading-relaxed">
              Not a chatbot bolted onto a homepage. These three are already running inside
              products we built: ask them something and they answer from your own stock,
              prices and sales — and hand the conversation to you when they are unsure.
            </p>
          </div>

          <div data-reveal className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {AI_WORK.map((item) => (
              <div
                key={item.name}
                className="flex flex-col rounded-3xl border border-ink/10 bg-paper p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-accent">
                    <Sparkles size={16} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
                    Live · {item.where}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.line}</p>

                <div className="mt-5 rounded-xl border border-ink/10 bg-cream p-3">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                    {item.name === 'Product copy & captions' ? 'Draft' : 'Ask'}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium leading-snug text-ink/70">
                    {item.sample.q}
                  </p>
                  <div className="mt-2 rounded-lg bg-paper px-2.5 py-2">
                    <p className="text-[11px] font-semibold leading-snug text-ink">{item.sample.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-10 border-t border-ink/10 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
              Also live — check the work
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <a
                href="https://keel.framestudio.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4 transition-colors hover:border-ink/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-[13px] font-semibold text-accent">
                  K
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                    Keel
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                    Live product
                  </span>
                </span>
                <ExternalLink
                  size={13}
                  className="ml-auto shrink-0 text-ink/25 transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </a>

              <a
                href="https://www.npmjs.com/package/cite-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4 transition-colors hover:border-ink/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-[11px] font-bold text-accent">
                  ci
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                    cite-ui
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                    npm package
                  </span>
                </span>
                <ExternalLink
                  size={13}
                  className="ml-auto shrink-0 text-ink/25 transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </a>

              <Link
                to="/developers"
                className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4 transition-colors hover:border-ink/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-[10px] font-bold text-accent">
                  FS
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                    This site
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                    Same stack
                  </span>
                </span>
                <ArrowRight
                  size={13}
                  className="ml-auto shrink-0 text-ink/25 transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process ---------------------------------------------------------------- */}
      <section className="relative py-20 md:py-28 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_120%,#1a0e0a_0%,#0b0b0b_65%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div data-reveal className="max-w-2xl">
            <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-paper tracking-[-0.03em] leading-[1.02] text-balance">
              Five steps. Nothing <span className="accent-italic text-accent">invisible</span>.
            </h2>
            <p className="text-paper/55 text-lg mt-5 leading-relaxed">
              Each step hands you something you can hold: a scope, a look, a link, the keys.
            </p>
          </div>

          <ol data-reveal className="relative mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2 right-2 top-[5px] hidden border-t border-dashed border-paper/20 lg:block"
            />
            {PROCESS.map((step) => (
              <li key={step.step} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-2.5 w-2.5 rounded-full border border-accent bg-ink lg:block"
                />
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-5 transition-colors hover:border-paper/20 lg:mt-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{step.step}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-paper">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/50">{step.desc}</p>
                  <span className="mt-4 inline-block rounded-full border border-paper/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/45">
                    You get{' '}
                    <span className="normal-case tracking-normal text-paper/80">{step.gets}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Close ------------------------------------------------------------------ */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <DottedGrid className="pointer-events-none absolute right-10 top-2 hidden w-20 text-ink/15 lg:block" />
          <FloatChip
            name="Fixed quote in writing"
            rotate={-4}
            className="pointer-events-none absolute right-8 top-16 hidden lg:flex"
          />
          <FloatChip
            name="50% deposit · balance on delivery"
            rotate={3}
            className="pointer-events-none absolute bottom-16 right-24 hidden lg:flex"
          />

          <div data-reveal className="max-w-3xl">
            <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
              Bring the problem. We&rsquo;ll <span className="accent-italic">quote</span> it.
            </h2>
            <p className="text-ink-soft text-lg mt-5 leading-relaxed">
              Tell us what is costing you money — the missed calls, the guessing, the site
              nobody can find. You get a written scope and a fixed price, or an honest
              recommendation to do something cheaper.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                Start your project
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-4 text-base font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
              Replies within one working day · M-Pesa accepted
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
