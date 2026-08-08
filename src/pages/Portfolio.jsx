import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useProjects, categoriesOf } from '../lib/projects'
import KeelDownload from '../components/KeelDownload'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
  const { projects, loading } = useProjects()
  const [activeTab, setActiveTab] = useState('All')
  const sectionRefs = useRef([])
  const gridRef = useRef(null)

  const categories = categoriesOf(projects)
  const tabs = ['All', ...categories]

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

  useEffect(() => {
    if (filtered.length === 0) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray(gridRef.current.children).forEach((cell, i) => {
        gsap.fromTo(cell,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, delay: (i % 3) * 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: cell, start: 'top 95%' },
          }
        )
      })
    }, gridRef)
    return () => ctx.revert()
  }, [filtered])

  return (
    <>
      <title>Portfolio — FrameStudio | Our Work</title>
      <meta name="description" content="Real projects built by FrameStudio — dashboards, websites, and WhatsApp bots for Kenyan businesses. See how each one was built." />
      <meta property="og:title" content="Portfolio — FrameStudio" />
      <meta property="og:description" content="Real projects built by FrameStudio for Kenyan businesses." />
      <meta property="og:url" content="https://www.framestudio.co.ke/portfolio" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://www.framestudio.co.ke/portfolio" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-semibold">
            The FrameStudio Work
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.95]">
            Built for real. <br className="hidden md:block" /> Built properly.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Dashboards, websites, and bots we've designed and shipped from scratch.
            Open each one to see the screens, the colours, and the fonts behind the build.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex items-center gap-2 flex-wrap">
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
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              {filtered.length} project{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              <p className="mt-4 text-sm text-gray-400">Loading the work…</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-16 px-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500 font-medium">No {activeTab === 'All' ? 'projects' : `${activeTab.toLowerCase()} projects`} showcased yet.</p>
                  <p className="text-gray-400 text-sm mt-2">We're currently building something great in this category.</p>
                  <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors border-b border-black pb-0.5">
                    Request this service <ArrowRight size={14} />
                  </Link>
                </div>
              )}
              {filtered.map((project) => {
                const shot = project.screenshots?.[0]
                return (
                  <Link
                    key={project.slug}
                    to={`/portfolio/${project.slug}`}
                    className="group rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      {shot?.url ? (
                        <img
                          src={shot.url}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-black relative">
                          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,255,255,0.08)_0%,transparent_45%)]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-white/80">{project.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {project.category}
                      </p>
                      <h3 className="mt-2 font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                        {project.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-black group-hover:text-blue-600 transition-colors">
                          View the build <ArrowUpRight size={14} />
                        </span>
                        {project.liveUrl && (
                          <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400">
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <KeelDownload />

      <section className="py-20 md:py-28 bg-gray-50">
        <div ref={(el) => (sectionRefs.current[0] = el)} className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
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