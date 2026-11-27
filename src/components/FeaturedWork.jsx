import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProjects } from '../lib/projects'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedWork() {
  const { projects } = useProjects()
  const sectionRef = useRef(null)
  const headerWrapRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  const websites = projects.filter((p) => p.category === 'Websites').slice(0, 3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerWrapRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerWrapRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      gsap.fromTo(gsap.utils.toArray(gridRef.current?.children || []),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [websites])

  return (
    <section id="featured-work" ref={sectionRef} className="relative py-24 md:py-32 bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_80%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent/[0.12] rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerWrapRef} className="text-center mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center justify-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Recent website builds
          </p>
          <h2 ref={headerRef} className="font-display text-[2rem] md:text-4xl lg:text-[3.25rem] font-semibold text-paper tracking-[-0.03em] leading-[1.02] text-balance">
            Websites built for <span className="accent-italic text-accent">Kenyan</span> businesses
          </h2>
          <p className="text-paper/55 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            A selection of websites we've designed and shipped — mobile-friendly, fast,
            and built around how Kenyan customers actually buy.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {websites.map((project) => {
            const shot = project.screenshots?.[0]
            return (
              <Link
                key={project.slug}
                to={`/portfolio/${project.slug}`}
                className="group flex flex-col rounded-3xl border border-paper/10 bg-paper/[0.04] hover:border-accent/60 hover:bg-paper/[0.06] transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-paper/[0.03]">
                  {shot?.url ? (
                    <img
                      src={shot.url}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full bg-paper/[0.03] relative flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-paper/30">{project.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">
                    {project.category}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-paper group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2.5 text-paper/50 text-sm leading-relaxed line-clamp-2 flex-1">
                    {project.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-paper/80 group-hover:text-accent transition-colors">
                    View project <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 bg-accent text-ink font-semibold px-7 py-4 rounded-full hover:bg-accent-deep transition-all">
            See more projects <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
