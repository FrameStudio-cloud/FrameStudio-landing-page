import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Bot, BarChart3, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Globe,
    title: 'Websites',
    desc: 'Modern, mobile-optimised websites that put your business on the map. From e-commerce stores to portfolio sites — we build what you need.',
    features: ['E-commerce & online stores', 'Mobile-optimised responsive design', 'SEO & Google-ready', 'Fast hosting & domain setup', 'M-Pesa integration'],
    image: '/services-websites.jpg',
  },
  {
    icon: Bot,
    title: 'Automation Bots',
    desc: "Smart bots that handle the back-and-forth so you don't have to. Table availability for restaurants and cafés, 24/7 appointment booking, and instant answers to the questions your customers ask most — live on Telegram, SMS, and your website.",
    features: ['Table availability bots — never miss a booking', 'Appointment bots — reservations taken around the clock', 'FAQ bots — instant answers to common customer questions', 'Live on Telegram, SMS, and your website'],
    image: '/services-bots.png',
  },
  {
    icon: BarChart3,
    title: 'Business Dashboards',
    desc: 'See your business in real time. Track inventory, analyse sales trends, and make data-driven decisions from a single dashboard.',
    features: ['Real-time inventory tracking', 'Sales analytics & reporting', 'Expense & profit tracking', 'Staff performance metrics', 'Export to PDF & Excel'],
    image: '/services-dashboard.png',
  },
]

const process = [
  { step: '01', title: 'Discovery', desc: 'We learn about your business, goals, and audience.' },
  { step: '02', title: 'Design', desc: 'We create wireframes and mockups for your approval.' },
  { step: '03', title: 'Build', desc: 'We develop and test your solution.' },
  { step: '04', title: 'Launch', desc: 'We deploy and hand over with training.' },
  { step: '05', title: 'Support', desc: 'Ongoing maintenance and updates as needed.' },
]

export default function Services() {
  const sectionRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
        <title>Services — FrameStudio | Websites, Bots & Dashboards for Kenyan SMEs</title>
        <meta name="description" content="FrameStudio builds modern websites, automation bots, and business dashboards for Kenyan businesses. Affordable, mobile-friendly, M-Pesa integration, and built for Kenya." />
        <link rel="canonical" href="https://www.framestudio.co.ke/services" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-accent/[0.12] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center justify-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            What we do
          </p>
          <h1 className="font-display text-[2.6rem] md:text-6xl lg:text-[4.2rem] font-semibold text-paper tracking-[-0.03em] leading-[0.98] text-balance">
            What We <span className="accent-italic text-accent">Build</span>
          </h1>
          <p className="text-paper/55 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Every solution is designed for Kenyan businesses — affordable, mobile-friendly, and built to scale.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 space-y-20 md:space-y-28">
          {services.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-12 h-12 rounded-xl bg-ink text-accent flex items-center justify-center mb-6">
                  <service.icon size={22} />
                </div>
                <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02]">
                  {service.title}
                </h2>
                <p className="text-ink-soft mt-4 leading-relaxed text-lg">{service.desc}</p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-ink-soft text-sm leading-relaxed">
                      <Check size={15} strokeWidth={3} className="text-ink/30 mt-1 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink border-b border-ink/25 hover:border-accent pb-1 transition-colors"
                >
                  Get a quote
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-ink/10 bg-cream">
                  <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-[40%] h-[50%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={(el) => (sectionRefs.current[3] = el)} className="text-center mb-16">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] text-balance">
              How We <span className="accent-italic">Work</span>
            </h2>
            <p className="text-ink-soft max-w-xl mx-auto mt-4">From idea to launch in weeks, not months.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <div key={p.step} ref={(el) => (sectionRefs.current[4 + i] = el)} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-ink text-accent flex items-center justify-center mx-auto mb-4 font-mono text-xs">
                  {p.step}
                </div>
                <h3 className="font-display font-semibold text-ink mb-2">{p.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_120%,#1a0e0a_0%,#0b0b0b_65%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-paper tracking-[-0.03em] text-balance">
            Ready to <span className="accent-italic text-accent">start?</span>
          </h2>
          <p className="text-paper/55 text-lg max-w-lg mx-auto mt-5">Tell us what you need and we'll take it from there.</p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 bg-accent text-ink font-semibold px-7 py-4 rounded-full hover:bg-accent-deep transition-all"
          >
            Start Your Project
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  )
}
