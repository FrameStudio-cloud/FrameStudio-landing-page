import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const socials = [
  {
    label: 'WhatsApp',
    url: 'https://wa.me/254793302518',
    icon: (props) => <MessageCircle {...props} />,
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/frame.studio12?igsh=ZWdieTk4ZGI4cjll',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/company/framestudio-ke',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    url: 'https://facebook.com/framestudio-ke',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    url: 'https://x.com/framestudio_ke',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    url: 'https://youtube.com/@framestudio_ke',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    url: 'https://vm.tiktok.com/ZS9MrQG9sjXfK-jv0Wd/',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    url: 'https://github.com/FrameStudio-cloud',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const footerRef = useRef(null)
  const colRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(colRefs.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 95%', toggleActions: 'play none none reverse' },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-black text-gray-400 py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div ref={(el) => (colRefs.current[0] = el)}>
            <Link to="/" className="text-white font-bold text-lg mb-4 block">
              Frame<span className="text-gray-400">Studio</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">Digital solutions</p>
            <p className="text-sm leading-relaxed text-gray-500">for Kenyan SMEs.</p>
            <p className="text-sm text-gray-500 mt-3">Nairobi, Kenya</p>
          </div>
          <div ref={(el) => (colRefs.current[1] = el)}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-[0.1em]">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="text-gray-500 hover:text-gray-300 transition-colors">Websites</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-gray-300 transition-colors">WhatsApp Bots</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-gray-300 transition-colors">Dashboards</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-gray-300 transition-colors">Automation</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-300 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div ref={(el) => (colRefs.current[2] = el)}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-[0.1em]">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:hello@framestudio.co.ke" className="text-gray-500 hover:text-gray-300 transition-colors">hello@framestudio.co.ke</a></li>
              <li><a href="mailto:admin@framestudio.co.ke" className="text-gray-500 hover:text-gray-300 transition-colors">admin@framestudio.co.ke</a></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">Nairobi, Kenya</Link></li>
            </ul>
          </div>
          <div ref={(el) => (colRefs.current[3] = el)}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-[0.1em]">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-500 hover:text-gray-300 transition-colors">Refund Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group relative w-5 h-5 text-gray-500 hover:text-white transition-colors"
                >
                  <s.icon size={20} />
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border border-gray-800 text-gray-300 text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.label}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} FrameStudio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
