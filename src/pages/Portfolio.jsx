import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import KeelDownload from '../components/KeelDownload'

gsap.registerPlugin(ScrollTrigger)

const tabs = ['All', 'Websites', 'Bots', 'Dashboards']

const projects = [
  { title: 'Keel', category: 'Dashboards', desc: 'Multi-tenant shop management dashboard with inventory, sales, bots, and website management.' },
]

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('All')
  const sectionRefs = useRef([])
  const gridRef = useRef(null)

  const filtered = activeTab === 'All' ? projects : projects.filter((p) => p.category === activeTab)

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

  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(gridRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    )
  }, [activeTab])

  return (
    <>
      <Helmet>
        <title>Portfolio — FrameStudio | Our Work</title>
        <meta name="description" content="See real projects built by FrameStudio — including Keel, a multi-tenant dashboard for Kenyan shop owners. Websites, WhatsApp bots, and dashboards." />
        <meta property="og:title" content="Portfolio — FrameStudio" />
        <meta property="og:description" content="Real projects built by FrameStudio for Kenyan businesses." />
        <meta property="og:url" content="https://framestudio.co.ke/portfolio" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/portfolio" />
      </Helmet>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
            Our Work
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Real projects for real Kenyan businesses. Each one built from scratch, delivered on time.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={(el) => (sectionRefs.current[0] = el)} className="flex items-center gap-2 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div key={project.title} className="group rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-gray-100">
                  <img src="/keel thumbnail.png" alt="Keel dashboard" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.desc}</p>
                <a href="https://keel.framestudio.co.ke" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors">
                  Visit Site <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KeelDownload />

      <section className="py-20 md:py-28 bg-gray-50">
        <div ref={(el) => (sectionRefs.current[1] = el)} className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Want Your Project Here?</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mt-4">Let's build something great together.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all">
            Start Your Project <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
