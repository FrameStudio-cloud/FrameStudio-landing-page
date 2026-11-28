import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Seo from './pages/Seo'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Developers from './pages/Developers'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'
import Cookies from './pages/Cookies'
import Invoice from './pages/Invoice'
import Start from './pages/Start'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          {/* Not in the nav yet — the nav becomes a dropdown first. Until then the
              page is reached from the home band and the footer. */}
          <Route path="/seo" element={<Seo />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/developers" element={<Developers />} />
          {/* The page is called "Developers", but people type the singular. */}
          <Route path="/developer" element={<Navigate to="/developers" replace />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* Catch-all. Must stay last: it swallows every marketing URL we don't
              have, and it lives inside Layout so a lost visitor still gets nav
              and footer to leave by. */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Outside Layout on purpose: an invoice is a transactional page, not a
            marketing page. No nav, no footer, no cookie banner competing with
            the pay button. */}
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/:token" element={<Invoice />} />

        {/* Also outside Layout: a scope request is a form a client was sent, not
            a page they browsed to. Nav and footer are noise between them and
            the next question. */}
        <Route path="/start" element={<Start />} />
        <Route path="/start/:token" element={<Start />} />
      </Routes>
    </BrowserRouter>
  )
}
