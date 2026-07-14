import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, Monitor, Wifi, Zap, RefreshCw } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: Monitor, text: 'Runs natively — no browser tabs needed' },
  { icon: Wifi, text: 'Works offline, syncs when connected' },
  { icon: Zap, text: 'Faster than the web version' },
  { icon: RefreshCw, text: 'Auto-updates when new versions ship' },
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
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-black md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
      <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div ref={contentRef}>
              <span className="inline-block text-xs uppercase tracking-[0.15em] text-gray-500 mb-4">
                Desktop App
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl text-balance">
                Take Keel Offline
              </h2>
              <p className="max-w-lg mt-5 text-lg leading-relaxed text-gray-400">
                The full Keel experience as a native Windows app. Manage inventory, track sales, and run your shop even without internet.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {features.map((f, i) => (
                <div
                  key={f.text}
                  ref={(el) => (featuresRef.current[i] = el)}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <div className="flex items-center justify-center w-8 h-8 border rounded-lg bg-white/5 border-white/10 shrink-0">
                    <f.icon size={15} className="text-gray-400" />
                  </div>
                  {f.text}
                </div>
              ))}
            </div>

            <div ref={buttonsRef} className="mt-10 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/downloads/Keel_1.0.0_x64-setup.exe"
                  download
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-black transition-all bg-white group hover:bg-gray-100 rounded-xl"
                >
                  <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                  Download .exe Installer
                </a>
                <a
                  href="/downloads/Keel_1.0.0_x64_en-US.msi"
                  download
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all border group border-white/20 hover:bg-white/10 rounded-xl"
                >
                  Download .msi
                </a>
              </div>
              <p className="text-xs text-gray-500">
                Windows 10 or later &bull; v1.1.0 &bull; 
              </p>
            </div>
          </div>

          <div ref={imageRef} className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
              <img
                src="/keel thumbnail.png"
                alt="Keel Desktop App"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
