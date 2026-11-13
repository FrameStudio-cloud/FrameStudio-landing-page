import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const approachSteps = [
  {
    number: '01',
    title: 'Understand first',
    desc: 'We start with your business, your customers and the problem you need to solve.',
  },
  {
    number: '02',
    title: 'Build with intention',
    desc: 'Every page, feature and integration should serve a purpose. We focus on what you need rather than adding complexity for its own sake.',
  },
  {
    number: '03',
    title: 'Keep things clear',
    desc: 'You should understand what you are paying for, what we are building and what happens next.',
  },
]

const principles = [
  {
    title: 'Designed for our market',
    desc: 'We consider local business needs, mobile users and practical payment workflows.',
  },
  {
    title: 'Accessible by design',
    desc: 'Solutions and pricing that make sense for the size and needs of the business.',
  },
  {
    title: 'Purpose over complexity',
    desc: 'The right features matter more than having the most features.',
  },
  {
    title: 'Clear communication',
    desc: 'Defined deliverables, honest expectations and a clear process from start to finish.',
  },
]

export default function About() {
  const sectionRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <title>About — Frame Studio | Building Digital Tools for Kenyan Businesses</title>
      <meta name="description" content="Frame Studio builds websites and digital tools that help Kenyan businesses establish their online presence, connect with customers and work smarter." />
      <link rel="canonical" href="https://www.framestudio.co.ke/about" />

      {/* Section A: Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_20%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-accent/[0.1] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              About Frame Studio
            </p>
            <h1 className="font-display text-[2.6rem] md:text-6xl lg:text-[4.2rem] font-semibold text-paper tracking-[-0.03em] leading-[0.98] text-balance">
              Technology should work for your <span className="accent-italic text-accent">business.</span>
            </h1>
            <p className="text-paper/55 text-lg mt-7 max-w-xl leading-relaxed">
              We build websites and digital tools that help Kenyan businesses show up professionally,
              connect with customers and work smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link
                to="/portfolio"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-ink font-semibold px-7 py-4 rounded-full hover:bg-accent-deep transition-all text-base"
              >
                Explore Our Work
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-paper/15 text-paper font-semibold px-7 py-4 rounded-full hover:border-accent/60 hover:text-accent transition-all text-base"
              >
                Start a Project
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Our Story */}
      <section ref={(el) => (sectionRefs.current[0] = el)} className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] leading-[1.05] text-balance mb-6">
                Built around real <span className="accent-italic">business needs.</span>
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-6">
                Frame Studio was created around a simple idea: businesses should be able to access useful
                digital solutions without needing complicated processes or enterprise-sized budgets.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed mb-6">
                From websites that introduce a business to the world, to catalogues that make products
                easier to explore and custom tools that simplify everyday operations, our focus is on
                building solutions with a clear purpose.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed">
                We believe good technology starts with understanding the people who will use it — their
                customers, their challenges and the way their business works.
              </p>
            </div>
            <div className="relative flex justify-center">
              <img
                src="/logo-frame-studio.png"
                alt="Frame Studio logo"
                className="w-full h-auto max-w-md lg:max-w-none rounded-3xl border border-ink/10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Our Approach */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/[0.12] rounded-full blur-[130px] pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mb-16">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] leading-[1.05] text-balance">
              Not just a website. A tool with a <span className="accent-italic">purpose.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {approachSteps.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => (sectionRefs.current[2 + i] = el)}
                className="p-7 rounded-3xl bg-paper border border-ink/10 hover:border-ink/25 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-ink text-accent flex items-center justify-center mb-5 font-mono text-xs">
                  {step.number}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{step.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section D: What We Stand For */}
      <section ref={(el) => (sectionRefs.current[5] = el)} className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mb-16">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] leading-[1.05] text-balance">
              Principles behind every <span className="accent-italic">project.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {principles.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => (sectionRefs.current[6 + i] = el)}
                className="p-7 rounded-3xl border border-ink/10 bg-paper hover:border-ink/25 transition-colors"
              >
                <h3 className="font-display text-base font-semibold text-ink mb-3">{p.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section E: Services & Vision */}
      <section ref={(el) => (sectionRefs.current[10] = el)} className="relative py-20 md:py-28 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_100%,#1a0e0a_0%,#0b0b0b_65%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-paper tracking-[-0.03em] leading-[1.05] text-balance mb-6">
              Building beyond the <span className="accent-italic text-accent">screen.</span>
            </h2>
            <p className="text-paper/55 text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Frame Studio's ambition is to make useful technology more accessible to businesses as they
              grow. That means going beyond websites when the need calls for it — exploring automation,
              integrations and custom digital tools that help businesses do more with the resources they
              have.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-paper/15 text-paper font-semibold px-7 py-4 rounded-full hover:border-accent/60 hover:text-accent transition-all text-base"
              >
                Explore Our Services
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/portfolio"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-ink font-semibold px-7 py-4 rounded-full hover:bg-accent-deep transition-all text-base"
              >
                See Our Work
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section F: Closing CTA */}
      <section ref={(el) => (sectionRefs.current[11] = el)} className="py-20 md:py-28 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] leading-[1.05] text-balance mb-6">
              Have a business idea? Let's build something <span className="accent-italic">useful.</span>
            </h2>
            <p className="text-ink-soft text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              Tell us what you're trying to achieve. We'll help you work out what needs to be built.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-ink text-paper font-semibold px-7 py-4 rounded-full hover:bg-accent hover:text-ink transition-all text-base"
              >
                Start a Project
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-ink/20 text-ink font-semibold px-7 py-4 rounded-full hover:border-ink/50 transition-all text-base"
              >
                Explore Our Services
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
