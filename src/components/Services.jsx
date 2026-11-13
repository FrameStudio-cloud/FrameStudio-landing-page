import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Bot, BarChart3, Check, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Globe,
    title: 'Websites',
    items: ['E-commerce stores', 'Mobile-optimised designs', 'SEO & Google-ready', 'M-Pesa integration'],
  },
  {
    icon: Bot,
    title: 'Bots & Automation',
    items: [
      'Table availability bots — restaurants, cafés & shops never miss a booking',
      'Appointment bots — reservations taken 24/7 while you focus on service',
      'FAQ bots — instant answers to the questions customers ask most',
      'Live on Telegram, SMS, and your website',
    ],
  },
  {
    icon: BarChart3,
    title: 'Dashboards',
    items: ['Inventory tracking', 'Sales analytics', 'Real-time reporting', 'Multi-shop management'],
  },
]

export default function Services() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative py-24 md:py-32 bg-paper overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="1.1" fill="#d8d2c2" />
              <path d="M 18 0 L 18 36 M 0 18 L 36 18" stroke="#e8e2d2" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -top-20 right-0 w-[45%] h-[55%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[40%] bg-cream blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerRef} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 mb-5 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/30" />
            What we do
          </p>
          <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
            What we <span className="accent-italic">build</span>
          </h2>
          <p className="text-ink-soft max-w-xl mt-5 text-lg leading-relaxed">
            Every solution is designed for Kenyan businesses — affordable, mobile-friendly, and built to scale.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-5">
          {services.map((service, i) => {
            const colSpan = 'md:col-span-3'

            return (
              <div
                key={service.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`${colSpan} group relative rounded-3xl border border-ink/10 bg-white/70 p-7 hover:border-ink/25 hover:bg-white hover:-translate-y-1 transition-all duration-500`}
              >
                <div className="flex items-start justify-between mb-7">
                  <div className="w-11 h-11 rounded-xl bg-ink text-accent flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                    <service.icon size={20} />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ink/25 pt-1">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-5 tracking-[-0.01em]">{service.title}</h3>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink-soft text-sm leading-relaxed">
                      <Check size={15} className="text-ink/30 mt-1 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          <div className="md:col-span-3 relative rounded-3xl bg-ink p-7 flex flex-col justify-center overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[60px]" />
            <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
              Why stop there?
            </p>
            <p className="relative text-paper/85 text-lg leading-snug font-display">
              Every project is built from scratch around your specific needs.
            </p>
            <a
              href="mailto:email.framestudio@gmail.com"
              className="group relative mt-7 inline-flex items-center gap-1.5 text-sm text-accent font-medium"
            >
              Tell us about your project
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
