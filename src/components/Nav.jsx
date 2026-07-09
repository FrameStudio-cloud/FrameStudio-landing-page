import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const links = [
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
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
        ? transparent ? 'text-white' : 'text-black'
        : transparent ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-black'
    }`

  return (<>
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent ? '' : 'bg-white/95 backdrop-blur border-b border-black/5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <NavLink to="/" className={`text-xl font-bold tracking-tight transition-colors duration-300 ${transparent ? 'text-white' : 'text-black'}`}>
            Frame<span className={transparent ? 'text-gray-400' : 'text-gray-500'}>Studio</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={`text-sm font-semibold px-5 py-2.5 rounded-lg transition-all ${
                transparent
                  ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Get Started
            </NavLink>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 relative z-50 transition-colors ${transparent ? 'text-white/80' : 'text-gray-600'}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>

    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex flex-col md:hidden"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `mobile-link text-2xl sm:text-3xl font-semibold transition-colors ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className="mobile-link mt-6 bg-white text-black font-semibold px-10 py-4 rounded-xl text-lg hover:bg-gray-100 transition-all"
        >
          Get Started
        </NavLink>
      </div>
    </div>
  </>)
}
