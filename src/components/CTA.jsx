import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Mail, MessageCircle } from 'lucide-react'

const handleEmailClick = () => {
  window.location.href = 'mailto:email.framestudio@gmail.com'
}

const handleWhatsAppClick = () => {
  window.open('https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%27m%20interested%20in%20learning%20more%20about%20your%20services.', '_blank')
}

export default function CTA() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const decorRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      gsap.to(decorRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_120%,#1a0e0a_0%,#0b0b0b_65%)]" />

      <div ref={decorRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.09] text-accent">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="220" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="140" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="400" cy="400" r="60" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="currentColor" strokeWidth="0.3" />
          <line x1="400" y1="20" x2="400" y2="780" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div ref={contentRef} className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center justify-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Let's build
          </p>
          <h2 className="font-display text-[2rem] md:text-4xl lg:text-[3.5rem] font-semibold text-paper tracking-[-0.03em] leading-[1.0] text-balance">
            Ready to transform your <span className="accent-italic text-accent">business?</span>
          </h2>
          <p className="text-paper/55 text-lg max-w-lg mx-auto mt-6 leading-relaxed">
            Let's talk about what FrameStudio can do for you. No pressure, just a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <button
              onClick={handleEmailClick}
              className="group bg-accent text-ink hover:bg-accent-deep font-semibold px-7 py-4 rounded-full transition-all text-base inline-flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Email Us
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="group border border-paper/15 text-paper hover:border-accent/60 hover:text-accent font-semibold px-7 py-4 rounded-full transition-all text-base inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
