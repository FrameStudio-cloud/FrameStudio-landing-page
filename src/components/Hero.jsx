import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, MessageCircle } from 'lucide-react'

const handleEmailClick = () => {
  window.location.href = 'mailto:hello@framestudio.co.ke'
}

const handleWhatsAppClick = () => {
  window.open('https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20services.', '_blank')
}

export default function Hero() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const decorRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(ctaRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        '-=0.3'
      )
      .fromTo(decorRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
        '-=1'
      )

      gsap.to(decorRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 min-h-[100dvh] flex items-center pt-16 md:pt-[72px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full items-center pb-16">
          <div ref={textRef} className="lg:col-span-7">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight text-balance"
            >
              Digital Tools for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Growing Kenyan
              </span>{' '}
              Businesses
            </h1>
            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-gray-400 max-w-xl mt-6 leading-relaxed"
            >
              FrameStudio builds modern websites, smart WhatsApp bots, and real-time business dashboards
              tailored for small and medium enterprises in Kenya.
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={handleEmailClick}
                className="group bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all text-base inline-flex items-center justify-center gap-2"
              >
                Start Your Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="group border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all text-base inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          <div ref={decorRef} className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.03] rounded-2xl border border-white/10 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-6 gap-3 p-8 w-full h-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                      style={{
                        gridColumn: i < 12 ? 'span 2' : 'span 3',
                        gridRow: i < 12 ? 'span 1' : 'span 1',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Trusted by 500+ businesses across Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
