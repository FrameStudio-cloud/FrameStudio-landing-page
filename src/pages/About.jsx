import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 500, suffix: '+', label: 'Happy Clients' },
  { value: 2, suffix: ' Weeks', prefix: '< ', label: 'Average Turnaround' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
]

const values = [
  { title: 'Built for Kenya', desc: 'We optimise for M-Pesa, slow connections, and local payment methods — not Silicon Valley.' },
  { title: 'Affordable by Design', desc: 'Pricing built for SMEs. No enterprise budgets, no hidden fees.' },
  { title: 'Local Team, Local Market', desc: 'Based in Nairobi. We understand Kenyan businesses because we are one.' },
  { title: 'Custom Every Time', desc: 'No templates. Every project is built from scratch around your specific needs.' },
]

function Counter({ value, suffix, prefix }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      onUpdate: () => { el.textContent = (prefix || '') + Math.round(obj.val) + (suffix || '') },
    })
  }, [value, prefix, suffix])

  return <span ref={ref} className="text-4xl md:text-5xl font-bold text-white">{prefix || ''}0{suffix || ''}</span>
}

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
      <Helmet>
        <title>About — FrameStudio | Nairobi Digital Agency</title>
        <meta name="description" content="FrameStudio is a Nairobi-based digital agency building websites, WhatsApp bots, and real-time dashboards designed for how Kenyan businesses actually operate." />
        <meta property="og:title" content="About — FrameStudio" />
        <meta property="og:description" content="Nairobi-based digital agency building modern websites, smart WhatsApp bots, and real-time dashboards for Kenyan businesses." />
        <meta property="og:url" content="https://framestudio.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/about" />
      </Helmet>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
              We Build Digital Tools for Kenyan Businesses
            </h1>
            <p className="text-gray-400 text-lg mt-5 leading-relaxed">
              FrameStudio was founded with a simple mission: make professional digital solutions accessible
              to every Kenyan small and medium business — not just those with enterprise budgets.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={(el) => (sectionRefs.current[0] = el)} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Our Story</h2>
              <p className="text-gray-600 mt-5 leading-relaxed">
                We saw too many Kenyan businesses struggling with expensive, outsourced digital solutions
                that didn't understand the local market. Complex payment integrations where M-Pesa was an
                afterthought. Websites that looked great on a desktop but broke on the phones most Kenyans use.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                So we built FrameStudio — a Nairobi-based team that builds modern websites, smart WhatsApp bots,
                and real-time business dashboards designed for how Kenyan businesses actually operate.
              </p>
            </div>
            <div className="bg-gradient-to-br from-black to-neutral-900 rounded-3xl p-8 md:p-12 grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className={stat.label === 'Average Turnaround' || stat.label === 'Client Satisfaction' ? 'col-span-2 md:col-span-1' : ''}>
                  <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={(el) => (sectionRefs.current[1] = el)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={v.title} ref={(el) => (sectionRefs.current[2 + i] = el)} className="p-8 rounded-2xl bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-4">
                  <Check size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Want to Work Together?</h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto mt-4">Let's talk about what FrameStudio can do for your business.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Get in Touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
