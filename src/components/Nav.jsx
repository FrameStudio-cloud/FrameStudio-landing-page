import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'
import LogoMark from './LogoMark'

gsap.registerPlugin(ScrollTrigger)

const links = [
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/developers', label: 'Developers' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [homeScrolled, setHomeScrolled] = useState(false)
  const navRef = useRef(null)
  const overlayRef = useRef(null)
  const tlRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const scrolled = !isHome || homeScrolled
  const transparent = !scrolled

  useEffect(() => {
    if (isHome) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: document.body,
          start: '80px top',
          onEnter: () => setHomeScrolled(true),
          onLeaveBack: () => setHomeScrolled(false),
        })
      })
      return () => ctx.revert()
    }
  }, [isHome])

  useEffect(() => {
    requestAnimationFrame(() => setMenuOpen(false))
  }, [location.pathname])

  useEffect(() => {
    if (!overlayRef.current) return

    const overlay = overlayRef.current
    const items = overlay.querySelectorAll('.mobile-link')

    if (menuOpen) {
      tlRef.current = gsap.timeline()
        .fromTo(overlay,
          { opacity: 0, visibility: 'hidden', pointerEvents: 'none' },
          { opacity: 1, visibility: 'visible', pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' }
        )
        .fromTo(items,
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' },
          '-=0.1'
        )
    } else {
      gsap.to(overlay, {
        opacity: 0, visibility: 'hidden', pointerEvents: 'none',
        duration: 0.2, ease: 'power2.in',
      })
      gsap.set(items, { y: -24, opacity: 0 })
    }

    return () => {
      gsap.killTweensOf(overlay)
      gsap.killTweensOf(items)
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [menuOpen])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? transparent ? 'text-accent' : 'text-ink'
        : transparent ? 'text-paper/65 hover:text-accent' : 'text-ink/55 hover:text-ink'
    }`

  return (<>
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent ? '' : 'bg-paper/90 backdrop-blur border-b border-ink/10'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <NavLink to="/" className={`flex items-center gap-2 font-display text-xl font-semibold tracking-[-0.02em] shrink-0 transition-colors duration-300 ${transparent ? 'text-paper' : 'text-ink'}`}>
            <LogoMark className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${transparent ? 'text-accent' : 'text-ink'}`} />
            Frame<span className={transparent ? 'text-paper/45' : 'text-ink/40'}>Studio</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all bg-accent text-ink hover:bg-accent-deep"
            >
              Get Started
            </NavLink>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`lg:hidden p-2 -mr-2 relative z-50 transition-colors ${transparent ? 'text-paper/80' : 'text-ink/60'}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>

    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex flex-col lg:hidden"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div className="absolute inset-0 bg-ink/95 backdrop-blur-md" />
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-accent/[0.12] rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-7 px-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `mobile-link font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] transition-colors ${
                isActive ? 'text-accent' : 'text-paper/55 hover:text-paper'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className="mobile-link mt-6 bg-accent text-ink font-semibold px-10 py-4 rounded-full text-lg hover:bg-accent-deep transition-all"
        >
          Get Started
        </NavLink>
      </div>
    </div>
  </>)
}
