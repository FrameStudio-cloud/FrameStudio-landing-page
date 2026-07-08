import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 500, suffix: '+', label: 'Happy Clients' },
  { value: 2, suffix: ' Weeks', prefix: '< ', label: 'Average Turnaround' },
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

    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        el.textContent = (prefix || '') + Math.round(obj.val) + (suffix || '')
      },
    })
  }, [value, prefix, suffix])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {prefix || ''}0{suffix || ''}
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
    <section id="why-us" ref={sectionRef} className="relative py-24 md:py-32 bg-gray-50 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-100/50 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerRef}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight text-balance">
            Why Kenyan Businesses Choose Us
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-6">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                ref={(el) => (reasonsRef.current[i] = el)}
                className="flex gap-4 items-start p-4 -mx-4 rounded-xl hover:bg-white/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{reason.title}</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div
              ref={statsRef}
              className="bg-gradient-to-br from-black to-neutral-900 rounded-3xl p-8 md:p-12 grid grid-cols-2 gap-8 md:gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className={stat.label === 'Average Turnaround' ? 'col-span-2' : ''}>
                  <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
