import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './chat/ChatWidget'

/**
 * The accent comes from `--fs-accent` in src/index.css (vermilion). To run a
 * route on a different accent, override both vars in a class and add it here:
 *   const ACCENT_THEMES = { '/pricing': 'theme-lime' }
 * The class lives on the Layout root so nav, page and footer switch together.
 */
const ACCENT_THEMES = {}

export default function Layout() {
  const { pathname } = useLocation()
  const theme = ACCENT_THEMES[pathname] ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`min-h-screen bg-paper text-ink font-sans ${theme}`}>
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  )
}
