import { useEffect } from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import LiveDemo from '../components/LiveDemo'
import SeoBand from '../components/SeoBand'
import FeaturedWork from '../components/FeaturedWork'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'
import BrandWall from '../components/services/BrandWall'

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FrameStudio",
  "url": "https://www.framestudio.co.ke",
  "description": "Digital solutions for Kenyan businesses — websites, WhatsApp bots, and business dashboards.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.framestudio.co.ke/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FrameStudio",
  "url": "https://www.framestudio.co.ke",
  "logo": "https://www.framestudio.co.ke/android-chrome-512x512.png",
  "image": "https://www.framestudio.co.ke/og-image.png",
  "email": "email.framestudio@gmail.com",
  "location": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" } }
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <title>FrameStudio — Digital Solutions for Kenyan Businesses</title>
        <meta name="description" content="FrameStudio builds websites, WhatsApp bots, and business dashboards for growing Kenyan businesses. Affordable, mobile-friendly, built for Kenya." />
        <link rel="canonical" href="https://www.framestudio.co.ke/" />
        <script type="application/ld+json">{JSON.stringify(siteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <Hero />
      <Services />
      <LiveDemo />
      <SeoBand />
      <FeaturedWork />
      <WhyUs />

      {/* Recognition wall. Nothing to read: a visitor who spots M-Pesa or React
          stops scanning, and that is the whole job of this band. */}
      <section className="relative py-20 md:py-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center justify-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              Built on
            </p>
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-paper tracking-[-0.03em] leading-[1.02] text-balance">
              The tools you already <span className="accent-italic text-accent">trust</span>.
            </h2>
            <p className="text-paper/55 text-lg mt-5 leading-relaxed">
              M-Pesa to Paystack, WhatsApp to Google — we build on the rails that already work
              in Kenya, then hand them over in your name.
            </p>
          </div>
          <div className="mt-12">
            <BrandWall />
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
