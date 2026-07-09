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

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? transparent ? 'text-white' : 'text-black'
        : transparent ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-black'
    }`

  return (
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
            className={`md:hidden p-2 transition-colors ${transparent ? 'text-white/80' : 'text-gray-600'}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className={`md:hidden pb-4 pt-4 flex flex-col gap-3 border-t ${transparent ? 'border-white/10' : 'border-gray-100'}`}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={`text-sm font-semibold px-5 py-2.5 rounded-lg w-fit ${
                transparent
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'bg-black text-white'
              }`}
            >
              Get Started
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}
