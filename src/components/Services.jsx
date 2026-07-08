import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Bot, BarChart3, Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Globe,
    title: 'Websites',
    color: 'from-gray-100/50 to-transparent',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-700',
    checkColor: 'text-gray-500',
    items: ['E-commerce stores', 'Mobile-optimised designs', 'SEO & Google-ready', 'M-Pesa integration'],
    size: 'medium',
  },
  {
    icon: Bot,
    title: 'Bots & Automation',
    color: 'from-gray-100/30 to-transparent',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-700',
    checkColor: 'text-gray-500',
    items: ['WhatsApp order bots', 'Automated customer support', 'Lead generation flows', 'Telegram & SMS bots'],
    size: 'medium',
  },
  {
    icon: BarChart3,
    title: 'Dashboards',
    color: 'from-gray-100/30 to-transparent',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-700',
    checkColor: 'text-gray-500',
    items: ['Inventory tracking', 'Sales analytics', 'Real-time reporting', 'Multi-shop management'],
    size: 'medium',
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
    <section id="services" ref={sectionRef} className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="1.2" fill="#d4d4d4" />
              <path d="M 18 0 L 18 36 M 0 18 L 36 18" stroke="#e5e5e5" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-gradient-to-b from-gray-100/30 via-transparent to-transparent blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-purple-100/20 via-gray-50/10 to-transparent blur-[100px]" />
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-blue-100/20 via-gray-50/10 to-transparent blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerRef}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight text-balance">
            What We Build
          </h2>
          <p className="text-gray-500 max-w-xl mt-4 text-lg">
            Every solution is designed for Kenyan businesses — affordable, mobile-friendly, and built to scale.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          {services.map((service, i) => {
            const colSpan = 'md:col-span-3'

            return (
              <div
                key={service.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`${colSpan} group relative rounded-2xl border ${service.border} bg-gradient-to-br ${service.color} p-8 hover:border-gray-300 transition-all duration-500`}
              >
                <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-6`}>
                  <service.icon size={22} className={service.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-5">{service.title}</h3>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                      <Check size={16} className={`${service.checkColor} mt-0.5 shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          <div className="md:col-span-3 relative rounded-2xl bg-gradient-to-br from-black to-neutral-900 p-8 flex flex-col justify-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px]" />
            <p className="text-white/50 text-xs uppercase tracking-[0.15em] mb-3">Why Stop There?</p>
            <p className="text-white/90 text-lg leading-relaxed">
              Every project is built from scratch around your specific needs. Let's talk about what you need.
            </p>
            <a
              href="mailto:hello@framestudio.co.ke"
              className="mt-6 text-sm text-gray-400 hover:text-gray-300 transition-colors font-medium"
            >
              Tell us about your project →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
