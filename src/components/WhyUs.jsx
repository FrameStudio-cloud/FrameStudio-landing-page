import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 500, suffix: '+', label: 'Happy Clients' },
  { value: 2, suffix: 'Weeks', prefix: '<', label: 'Average Turnaround' },
]

const reasons = [
  { title: 'Affordable', desc: 'Pricing built for SMEs — no enterprise budgets required.' },
  { title: 'Fast & Reliable', desc: 'Optimised for M-Pesa, slow connections, and local payment methods.' },
  { title: 'Local Support', desc: 'Our team is based in Nairobi — we understand your market.' },
  { title: 'Custom Solutions', desc: 'Every project is built from scratch around your specific needs.' },
]

function Counter({ value, suffix, prefix }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.textContent = 0
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val)
      },
    })
  }, [value])

  return (
    <span className="flex items-baseline gap-1.5 font-display text-4xl md:text-5xl font-semibold text-paper tracking-[-0.03em]">
      {prefix && <span className="text-paper/30">{prefix}</span>}
      <span ref={ref}>{value}</span>
      {suffix && <span className="text-accent">{suffix}</span>}
    </span>
  )
}

export default function WhyUs() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const reasonsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      gsap.fromTo(statsRef.current?.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      reasonsRef.current.forEach((el, i) => {
        gsap.fromTo(el,
          { x: -20, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none reverse' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="why-us" ref={sectionRef} className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-accent/[0.12] rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerRef} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 mb-5 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/30" />
            Why us
          </p>
          <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-ink tracking-[-0.03em] leading-[1.02] text-balance">
            Why Kenyan businesses choose <span className="accent-italic">us</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-2">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                ref={(el) => (reasonsRef.current[i] = el)}
                className="flex gap-4 items-start p-4 -mx-4 rounded-2xl hover:bg-white/60 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="text-accent" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-ink text-lg">{reason.title}</h4>
                  <p className="text-ink-soft text-sm mt-1 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div
              ref={statsRef}
              className="relative bg-ink rounded-4xl p-8 md:p-11 grid grid-cols-2 gap-8 md:gap-10 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/[0.15] rounded-full blur-[70px] pointer-events-none" />
              {stats.map((stat) => (
                <div key={stat.label} className={stat.label === 'Average Turnaround' ? 'col-span-2' : ''}>
                  <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40 mt-3">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
