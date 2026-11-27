import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import LogoReveal from './LogoReveal'

gsap.registerPlugin(ScrollTrigger)

const handleEmailClick = () => {
  window.location.href = 'mailto:email.framestudio@gmail.com'
}

const handleWhatsAppClick = () => {
  window.open('https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20services.', '_blank')
}

const marqueeItems = [
  'Websites',
  'WhatsApp bots',
  'Dashboards',
  'M-Pesa',
  'SEO',
  'Automation',
]

export default function Hero() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const decorRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(eyebrowRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo(headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.3'
      )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(gsap.utils.toArray(ctaRef.current.children),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        '-=0.3'
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
    <section ref={sectionRef} className="relative min-h-[100dvh] bg-ink overflow-hidden">
      {/* accent light, not grey light — the glow is what makes the black feel lit
          rather than empty. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,#1a0e0a_0%,#0b0b0b_55%,#0b0b0b_100%)]" />
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-accent/15 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/3 -right-32 w-[420px] h-[420px] bg-accent/[0.09] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 min-h-[100dvh] flex items-center pt-16 md:pt-[72px] pb-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full items-center py-10 md:py-16">
          <div ref={textRef} className="lg:col-span-7">
            <p
              ref={eyebrowRef}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent flex items-center gap-2.5 mb-6"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="sm:hidden">Nairobi / Kenya</span>
              <span className="hidden sm:inline">Nairobi <span className="text-paper/25">/</span> Websites · Bots · Dashboards</span>
            </p>

            <h1
              ref={headlineRef}
              className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] font-semibold text-paper leading-[0.94] tracking-[-0.03em] text-balance"
            >
              Digital tools for{' '}
              <span className="accent-italic text-accent">growing</span>{' '}
              Kenyan businesses
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-paper/55 max-w-xl mt-7 leading-relaxed"
            >
              FrameStudio builds modern websites, smart WhatsApp bots, and real-time
              business dashboards tailored for small and medium enterprises in Kenya.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={handleEmailClick}
                className="group bg-accent text-ink hover:bg-accent-deep font-semibold px-7 py-4 rounded-full transition-all text-base inline-flex items-center justify-center gap-2"
              >
                Start Your Project
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="group border border-paper/15 text-paper hover:border-accent/60 hover:text-accent font-semibold px-7 py-4 rounded-full transition-all text-base inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          <div ref={decorRef} className="lg:col-span-5 relative flex items-center justify-center">
            <div className="hidden sm:block absolute w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] rounded-full border border-accent/20" />
            <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px] rounded-full border border-paper/10" />
            <LogoReveal wordmark={false} className="relative w-full max-w-[170px] sm:max-w-[280px] lg:max-w-[290px] text-paper drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* A slow strip of what we actually sell. Motion at the fold sells "alive";
          it also repeats the services without a second block of copy. */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-paper/10 bg-ink/60 backdrop-blur-sm">
        <div className="marquee-mask overflow-hidden py-4">
          <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45 flex items-center gap-8"
              >
                {item}
                <span className="text-accent/80 text-[9px]">✳</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
