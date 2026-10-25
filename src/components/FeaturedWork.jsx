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

      gsap.fromTo(gridRef.current?.children,
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
    <section id="featured-work" ref={sectionRef} className="relative py-24 md:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={headerWrapRef} className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-semibold mb-4">
            Recent Website Builds
          </p>
          <h2 ref={headerRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
            Websites Built for Kenyan Businesses
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            A selection of websites we've designed and shipped — mobile-friendly, fast,
            and built around how Kenyan customers actually buy.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {websites.map((project) => {
            const shot = project.screenshots?.[0]
            return (
              <Link
                key={project.slug}
                to={`/portfolio/${project.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-white/[0.03]">
                  {shot?.url ? (
                    <img
                      src={shot.url}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.03] relative flex items-center justify-center">
                      <span className="text-xl font-bold text-white/30">{project.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                    {project.category}
                  </p>
                  <h3 className="font-bold text-white group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">
                    {project.excerpt}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors border-b border-gray-500/30 pb-0.5">
                    View project <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            See More Projects <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
