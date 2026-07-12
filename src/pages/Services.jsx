import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
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
    gradient: 'from-gray-100/50 to-transparent',
    image: '/services-websites.jpg',
  },
  {
    icon: Bot,
    title: 'WhatsApp Bots',
    desc: 'Automate your customer conversations. Handle orders, answer FAQs, and capture leads — all through WhatsApp, where your customers already are.',
    features: ['Automated order processing', '24/7 customer support', 'Lead qualification flows', 'Broadcast & marketing campaigns', 'Multi-agent handoff'],
    gradient: 'from-gray-100/30 to-transparent',
    image: '/services-bots.png',
  },
  {
    icon: BarChart3,
    title: 'Business Dashboards',
    desc: 'See your business in real time. Track inventory, analyse sales trends, and make data-driven decisions from a single dashboard.',
    features: ['Real-time inventory tracking', 'Sales analytics & reporting', 'Expense & profit tracking', 'Staff performance metrics', 'Export to PDF & Excel'],
    gradient: 'from-gray-100/30 to-transparent',
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
      <Helmet>
        <title>Services — FrameStudio | Websites, Bots & Dashboards for Kenyan SMEs</title>
        <meta name="description" content="FrameStudio builds modern websites, WhatsApp bots, and business dashboards for Kenyan businesses. Affordable, mobile-friendly, M-Pesa integration, and built for Kenya." />
        <meta property="og:title" content="Services — FrameStudio" />
        <meta property="og:description" content="Websites, WhatsApp bots, and business dashboards for Kenyan SMEs." />
        <meta property="og:url" content="https://framestudio.co.ke/services" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/services" />
      </Helmet>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
            What We Build
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Every solution is designed for Kenyan businesses — affordable, mobile-friendly, and built to scale.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 space-y-20">
          {services.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => (sectionRefs.current[i] = el)}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6`}>
                  <service.icon size={24} className="text-gray-700" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{service.title}</h2>
                <p className="text-gray-600 mt-4 leading-relaxed text-lg">{service.desc}</p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-gray-600 text-sm">
                      <Check size={16} className="text-gray-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors border-b border-black pb-0.5"
                >
                  Get a quote <ArrowRight size={16} />
                </Link>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={(el) => (sectionRefs.current[3] = el)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">How We Work</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-4">From idea to launch in weeks, not months.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <div key={p.step} ref={(el) => (sectionRefs.current[4 + i] = el)} className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {p.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to Start?</h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mt-4">Tell us what you need and we'll take it from there.</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all"
          >
            Start Your Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
