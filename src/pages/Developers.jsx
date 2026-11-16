import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react'
import ComponentLab from '../components/developers/ComponentLab'
import CopyButton from '../components/developers/CopyButton'
import { OPEN_SEATS, useTeam } from '../lib/team'

gsap.registerPlugin(ScrollTrigger)

const INSTALL = 'npm install cite-ui'
const DOCS = 'https://cite-ui.framestudio.co.ke'
// The address bar in the docs screenshot is rendered from this constant, so the
// image does not have to be retaken when the docs URL changes.
const DOCS_HOST = DOCS.replace(/^https?:\/\//, '')
const REPO = 'https://github.com/FrameStudio-cloud/cite-ui'
const NPM = 'https://www.npmjs.com/package/cite-ui'
const EMAIL = 'email.framestudio@gmail.com'

const STATS = [
  { value: '39', label: 'components' },
  { value: '0', label: 'runtime deps' },
  { value: '18 kB', label: 'gzip, ESM' },
  { value: 'MIT', label: 'license' },
]

const PRINCIPLES = [
  {
    number: '01',
    title: 'Zero runtime dependencies',
    desc: 'React and Tailwind are peers. Nothing else rides along in your bundle, so an update to cite-ui cannot break something you never imported.',
  },
  {
    number: '02',
    title: 'Behaviour before looks',
    desc: 'Escape closes the drawer. Focus returns to the trigger. Tab order is predictable. The boring parts are the product — styling is the easy half.',
  },
  {
    number: '03',
    title: 'Themed by tokens, not opinions',
    desc: 'Neutral defaults and complete class control. Your palette wins; ours never ships. The demos above are the same components in our colours.',
  },
  {
    number: '04',
    title: 'Documented like a product',
    desc: 'Every prop in a table, every example copyable. If a component is not written down, it is not finished — the readme is a deliverable.',
  },
]

const SOFTWARE_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'cite-ui',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description:
    'React component library with 39 components, zero runtime dependencies and Tailwind CSS styling.',
  url: DOCS,
  codeRepository: REPO,
  sameAs: [NPM, REPO],
  license: 'https://opensource.org/licenses/MIT',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
  author: { '@type': 'Organization', name: 'FrameStudio', url: 'https://www.framestudio.co.ke' },
}

export default function Developers() {
  const pageRef = useRef(null)
  const terminalRef = useRef(null)
  const team = useTeam()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '[data-hero]',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }
      ).fromTo(
        terminalRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.55'
      )

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef}>
      <title>Developers — cite-ui, the component library behind FrameStudio</title>
      <meta
        name="description"
        content="cite-ui is FrameStudio's open-source React component library. 39 components, zero runtime dependencies, MIT licensed. Try the live demos, install it, or come build it with us."
      />
      <link rel="canonical" href="https://www.framestudio.co.ke/developers" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_LD) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-28 pb-24 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(115%_95%_at_15%_0%,#1a0e0a_0%,#0b0b0b_58%)]" />
        <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-accent/15 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/[0.07] blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 px-6 md:px-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-12 lg:px-16">
          <div>
            <p data-hero className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              cite-ui · open source
            </p>

            <h1
              data-hero
              className="text-balance font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.03em] text-paper md:text-6xl lg:text-[4.1rem]"
            >
              We build the parts everyone else{' '}
              <span className="accent-italic text-accent">rebuilds.</span>
            </h1>

            <p data-hero className="mt-7 max-w-xl text-lg leading-relaxed text-paper/55">
              cite-ui is our open-source React component library. 39 components, zero runtime
              dependencies, MIT licensed — built in Nairobi and published so the next developer does
              not start from an empty file.
            </p>

            <div data-hero className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3">
              <span className="font-mono text-xs text-paper/30">$</span>
              <code className="font-mono text-[13px] text-paper/85">{INSTALL}</code>
              <CopyButton value={INSTALL} label="Copy" />
            </div>

            <div data-hero className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={DOCS}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-accent-deep"
              >
                Read the docs
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/15 px-7 py-3.5 text-base font-semibold text-paper transition-colors hover:border-accent/60 hover:text-accent"
              >
                GitHub
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div data-hero className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-paper/10 pt-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-semibold text-paper">{stat.value}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div ref={terminalRef} className="relative mt-2 lg:mt-0">
            <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#0D0D0C] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2 border-b border-paper/10 px-4 py-3">
                <div aria-hidden="true" className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-paper/15" />
                  <span className="h-2 w-2 rounded-full bg-paper/15" />
                  <span className="h-2 w-2 rounded-full bg-paper/15" />
                </div>
                <p className="ml-1 font-mono text-[10px] tracking-[0.06em] text-paper/45">~/projects/your-app</p>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-paper/25">zsh</span>
              </div>

              <pre className="overflow-x-auto px-4 py-5 font-mono text-[12.5px] leading-[1.9] text-paper/60">
                <code>
                  <span className="block">
                    <span className="text-paper/30">$ </span>
                    <span className="text-paper/85">npm install cite-ui</span>
                  </span>
                  <span className="block text-accent">+ cite-ui@2.0.0</span>
                  <span className="block">added 1 package · 0 dependencies</span>
                  <span className="block">{' '}</span>
                  <span className="block">
                    <span className="text-paper/30">$ </span>
                    <span className="text-paper/85">npm run dev</span>
                  </span>
                  <span className="block text-paper/50">ready in 412 ms</span>
                </code>
              </pre>

              <div className="flex items-center justify-end gap-3 border-t border-paper/10 px-4 py-3">
                <a
                  href={NPM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55 transition-colors hover:text-accent"
                >
                  npm · MIT
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-7 left-5 hidden w-[250px] items-start gap-3 rounded-2xl border border-paper/10 bg-ink-2/95 p-3.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur sm:flex"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-ink">
                <Check size={13} />
              </span>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45">Success</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-paper/80">Inventory synced — 128 items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The lab */}
      <section id="lab" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <div className="pointer-events-none absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/[0.1] blur-[130px]" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl" data-reveal>
              <p className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                The lab
              </p>
              <h2 className="text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
                Poke it before you <span className="accent-italic">install it.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Three components running in this page, not screenshots. The API is the package&rsquo;s;
                the colours are ours.
              </p>
            </div>
            <p data-reveal className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-right">
              3 live demos
              <br />
              39 in the package
            </p>
          </div>

          <div data-reveal>
            <ComponentLab />
          </div>

          <div data-reveal className="mt-10 overflow-hidden rounded-[26px] border border-ink/10 bg-paper shadow-[0_40px_80px_-60px_rgba(11,11,11,0.45)]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">The rest of it</p>
                <h3 className="mt-3 text-balance font-display text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[1.7rem]">
                  You have seen three. The rest live in the <span className="accent-italic">docs.</span>
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                  Every component, hook and utility — rendered live, documented prop by prop, with
                  copyable code. The screenshot is the real site, not a mockup.
                </p>
                <a
                  href={DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-deep"
                >
                  Open the docs
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
                  {DOCS_HOST}
                  <span className="mt-1 block text-[9px] text-ink/35">
                    39 components · 4 hooks · 6 utilities
                  </span>
                </p>
              </div>

              <a
                href={DOCS}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the cite-ui documentation"
                className="group block border-t border-ink/10 lg:border-l lg:border-t-0"
              >
                <div className="flex items-center gap-2 border-b border-ink/10 bg-cream/70 px-3.5 py-2.5">
                  <span aria-hidden="true" className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-ink/15" />
                    <span className="h-2 w-2 rounded-full bg-ink/15" />
                    <span className="h-2 w-2 rounded-full bg-ink/15" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.06em] text-ink/50">{DOCS_HOST}</span>
                  <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                    Open ↗
                  </span>
                </div>
                <div className="overflow-hidden">
                  <img
                    src="/developers/cite-ui-docs.png"
                    alt="The cite-ui documentation showing the component sidebar, Toast examples with a light/dark surface toggle, and its prop table"
                    width="1440"
                    height="900"
                    loading="lazy"
                    className="block w-full transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why another library */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              The argument
            </p>
            <h2 className="text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
              Another component library? Here is the <span className="accent-italic">argument.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Most UI kits are a screenshot folder with a download button. We build ours inside real
              client work, so the parts that break in production get fixed first — and the fixes ship
              back to everyone.
            </p>

            <blockquote className="mt-8 border-l-2 border-accent pl-4">
              <p className="font-display text-lg leading-snug text-ink">
                Zero runtime dependencies. Everything is tree-shakeable.
              </p>
              <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                cite-ui readme
              </footer>
            </blockquote>
          </div>

          <div className="grid gap-x-12 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.number} data-reveal className="border-t border-ink/15 py-7">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-accent">{principle.number}</span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{principle.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(95%_90%_at_50%_0%,#1a0e0a_0%,#0b0b0b_62%)]" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-accent/[0.08] blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="mb-12 max-w-2xl" data-reveal>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              The team
            </p>
            <h2 className="text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-paper md:text-4xl">
              Small on purpose. <span className="accent-italic text-accent">Open by default.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-paper/55">
              One person maintains the library. Two seats are open for people who want to argue about
              focus rings and easing curves — those arguments make it better.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {team.map((person) => (
              <div key={person.id} data-reveal className="rounded-3xl border border-paper/10 bg-paper/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent font-display text-lg font-semibold text-ink">
                    {person.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold text-paper">{person.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">{person.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-paper/55">{person.focus}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {person.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45 transition-colors hover:text-accent"
                    >
                      {link.label}
                      <ArrowUpRight size={11} />
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {OPEN_SEATS.map((seat) => (
              <div
                key={seat.id}
                data-reveal
                className="flex flex-col rounded-3xl border border-dashed border-paper/15 p-6"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/15 text-accent">
                  <Plus size={15} />
                </span>
                <p className="mt-4 font-display text-lg font-semibold text-paper">{seat.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/50">{seat.desc}</p>
                <a
                  href={`mailto:${EMAIL}?subject=cite-ui%20%E2%80%94%20I%20want%20to%20build%20components`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent transition-colors hover:text-paper"
                >
                  Take the seat
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <p data-reveal className="mt-10 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-paper/45">
            Every component is reviewed twice — once for behaviour, once for how it feels.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <p className="mb-4 flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Take it apart
            </p>
            <h2 className="text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
              Break it. Tell us what is <span className="accent-italic">missing.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              Install it, read the source, open an issue. A component library is only as good as the
              last edge case someone bothered to report.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={DOCS}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                Read the docs
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-base font-semibold text-ink transition-colors hover:border-ink/50"
              >
                Open GitHub
                <ArrowUpRight size={18} />
              </a>
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              MIT · built in Nairobi
            </p>

            <p className="mt-6 text-sm text-ink-soft">
              Need a website, bot or dashboard built instead?{' '}
              <Link to="/services" className="font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-accent">
                That is the studio
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
