import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Monitor, Wifi, Zap, Smartphone, ExternalLink } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: Monitor, text: 'Installs like a native app — no store needed' },
  { icon: Smartphone, text: 'Works on desktop and mobile browsers' },
  { icon: Wifi, text: 'Works offline, syncs when connected' },
  { icon: Zap, text: 'Faster loads with cached assets' },
]

export default function KeelDownload() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const featuresRef = useRef([])
  const buttonsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(featuresRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(buttonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(imageRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-ink md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_20%_50%,#1a0e0a_0%,#0b0b0b_60%)]" />
      <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-accent/[0.08] rounded-full blur-[130px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div ref={contentRef}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center gap-2.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
                Progressive Web App
              </p>
              <h2 className="font-display text-[2rem] md:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.02] text-paper text-balance">
                Install Keel <span className="accent-italic text-accent">anywhere</span>
              </h2>
              <p className="max-w-lg mt-5 text-lg leading-relaxed text-paper/55">
                Keel is now a PWA — install it directly from your browser on any device. No app store, no downloads, no updates to manage.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {features.map((f, i) => (
                <div
                  key={f.text}
                  ref={(el) => (featuresRef.current[i] = el)}
                  className="flex items-center gap-3 text-sm text-paper/70"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-paper/5 border border-paper/10 shrink-0 text-accent">
                    <f.icon size={15} />
                  </div>
                  {f.text}
                </div>
              ))}
            </div>

            <div ref={buttonsRef} className="mt-10">
              <a
                href="https://keel.framestudio.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-ink bg-accent hover:bg-accent-deep transition-all rounded-full"
              >
                <ExternalLink size={18} />
                Open Keel &amp; Install
              </a>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">
                Then tap "Install" or "Add to Home Screen" in your browser &bull; Chrome &bull; Edge &bull; Safari
              </p>
            </div>
          </div>

          <div ref={imageRef} className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-paper/10">
              <div className="absolute inset-0 bg-gradient-to-br from-paper/[0.06] to-transparent" />
              <img
                src="/keel thumbnail.png"
                alt="Keel App"
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
