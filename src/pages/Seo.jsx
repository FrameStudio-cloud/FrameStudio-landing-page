import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import Surfaces from '../components/seo/Surfaces'
import ReaderPanels from '../components/seo/ReaderPanels'
import VisibilityPanel from '../components/seo/VisibilityPanel'
import SalesPanel from '../components/seo/SalesPanel'
import EngagementPanel from '../components/seo/EngagementPanel'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP =
  'https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%27d%20like%20to%20talk%20about%20SEO.'

const seoSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Search engine optimisation',
  serviceType: 'SEO for small and medium businesses',
  description:
    'On-page SEO, structured data, Google Business Profile, sitemaps and Search Console, plus pages built to be read, summarised and cited by AI assistants.',
  areaServed: { '@type': 'Country', name: 'Kenya' },
  provider: {
    '@type': 'Organization',
    name: 'FrameStudio',
    url: 'https://www.framestudio.co.ke',
  },
}

export default function Seo() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

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
          { y: 28, opacity: 0 },
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
      <title>SEO — found on Google, named by AI | FrameStudio</title>
      <meta
        name="description"
        content="SEO for Kenyan businesses: titles, structured data, Google Business Profile and pages AI assistants can actually read. Audit first, then a fixed quote in writing."
      />
      <link rel="canonical" href="https://www.framestudio.co.ke/seo" />
      <script type="application/ld+json">{JSON.stringify(seoSchema)}</script>

      {/* Hero ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-ink pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute -top-10 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.10] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div ref={heroRef} className="lg:col-span-5">
              <h1 className="font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.03em] text-paper text-balance md:text-[3.4rem] lg:text-[3.5rem]">
                Found on Google.
                <br />
                <span className="accent-italic text-accent">Named</span> by ChatGPT.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/55">
                The same shop, appearing where people check before they call. We fix the page,
                the profile and the markup behind both.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-accent-deep"
                >
                  Ask for an audit
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/15 px-7 py-4 text-base font-semibold text-paper transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>

              <p className="mt-8 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-paper/35">
                Titles · schema · Google Business Profile · sitemaps · Search Console
              </p>
            </div>

            <div className="lg:col-span-7">
              <figure className="mx-auto w-full max-w-[720px] lg:ml-auto">
                <img
                  src="/seo/google-result.webp"
                  width={1200}
                  height={800}
                  alt="A Google search for framestudio, with the FrameStudio result highlighted and a callout reading: your website should be here."
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-auto w-full"
                />
                <figcaption className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.13em] text-paper/30 lg:text-right">
                  Illustration · not a live search result
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* The doors ------------------------------------------------------------- */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="lg:col-span-5">
              <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-balance md:text-4xl lg:text-[3.1rem]">
                They don&rsquo;t start on your <span className="accent-italic">homepage</span>.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                Google first, then Maps, then an assistant to double-check. Five doors into one
                business — and each one reads a different copy of your facts.
              </p>
            </div>

            <div data-reveal className="lg:col-span-7">
              <Surfaces />
            </div>
          </div>
        </div>
      </section>

      {/* Three readers --------------------------------------------------------- */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="lg:col-span-5">
              <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-balance md:text-4xl lg:text-[3.1rem]">
                Same page, three <span className="accent-italic">readers</span>.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                A crawler skims the markup. A map wants a record. An assistant quotes a sentence.
                All three read the same page — so one fix lands in all three.
              </p>
              <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/35">
                Sample data — nothing here queries Google or an assistant.
              </p>
            </div>

            <div data-reveal className="lg:col-span-7">
              <ReaderPanels />
            </div>
          </div>
        </div>
      </section>

      {/* The report ------------------------------------------------------------ */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-balance md:text-4xl lg:text-[3.25rem]">
              Tailored SEO to <span className="accent-italic">boost</span> your business.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Not a package off a shelf. We fix your pages, your profile and your map, then show
              you the month in numbers instead of adjectives — visibility, orders and engagement.
            </p>
          </div>

          <div data-reveal className="mx-auto mt-10 grid max-w-[1100px] gap-4 md:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:row-span-2">
              <VisibilityPanel />
            </div>
            <div className="lg:col-span-5">
              <SalesPanel />
            </div>
            <div className="lg:col-span-5">
              <EngagementPanel />
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/35">
            Sample data — this is the shape of the report, not a client result.
          </p>
        </div>
      </section>

      {/* Close ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div data-reveal className="max-w-xl">
              <h2 className="font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-paper text-balance md:text-4xl lg:text-[3.1rem]">
                Start with the <span className="accent-italic text-accent">audit</span>.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-paper/55">
                We read what Google and the assistants already see, then quote the fixes in
                writing. If the page is fine, we say so.
              </p>
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-accent-deep"
              >
                Ask for an audit
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/15 px-7 py-4 text-base font-semibold text-paper transition-colors hover:border-accent/60 hover:text-accent"
              >
                Project pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
