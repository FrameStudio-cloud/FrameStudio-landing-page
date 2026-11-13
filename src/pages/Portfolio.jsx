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
      <link rel="canonical" href="https://www.framestudio.co.ke/portfolio" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-accent/[0.12] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent flex items-center justify-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            The FrameStudio Work
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] md:text-6xl lg:text-[4.6rem] font-semibold text-paper tracking-[-0.03em] leading-[0.95] text-balance">
            Built for real. <br className="hidden md:block" /> Built <span className="accent-italic text-accent">properly.</span>
          </h1>
          <p className="text-paper/55 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Dashboards, websites, and bots we've designed and shipped from scratch.
            Open each one to see the screens, the colours, and the fonts behind the build.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex items-center gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm px-4 py-2 rounded-full transition-all ${
                    activeTab === tab
                      ? 'bg-accent text-ink font-semibold'
                      : 'bg-ink/5 text-ink/60 hover:bg-ink/10 hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
              {filtered.length} project{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-accent" />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">Loading the work…</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center py-16 px-6 rounded-3xl border border-dashed border-ink/20 bg-cream">
                  <p className="text-ink font-display font-semibold">No {activeTab === 'All' ? 'projects' : `${activeTab.toLowerCase()} projects`} showcased yet.</p>
                  <p className="text-ink-soft text-sm mt-2">We're currently building something great in this category.</p>
                  <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink border-b border-ink/25 hover:border-accent pb-1 transition-colors">
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
                    className="group rounded-3xl border border-ink/10 bg-paper hover:border-ink/25 transition-all duration-500 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-cream">
                      {shot?.url ? (
                        <img
                          src={shot.url}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full bg-ink relative">
                          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,90,54,0.18)_0%,transparent_45%)]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-xl font-semibold text-paper/80">{project.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                        {project.category}
                      </p>
                      <h3 className="mt-3 font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-ink-soft text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                        {project.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 group-hover:text-accent transition-colors">
                          View the build <ArrowUpRight size={14} />
                        </span>
                        {project.liveUrl && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">
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

      <section className="py-20 md:py-28 bg-cream">
        <div ref={(el) => (sectionRefs.current[0] = el)} className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] text-balance">
            Want your project <span className="accent-italic">here?</span>
          </h2>
          <p className="text-ink-soft text-lg max-w-lg mx-auto mt-5">Let's build something great together.</p>
          <Link to="/contact" className="group mt-8 inline-flex items-center gap-2 bg-ink text-paper font-semibold px-7 py-4 rounded-full hover:bg-accent hover:text-ink transition-all">
            Start Your Project
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  )
}
