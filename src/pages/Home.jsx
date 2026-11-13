import { useEffect } from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import LiveDemo from '../components/LiveDemo'
import FeaturedWork from '../components/FeaturedWork'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'

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
      <FeaturedWork />
      <WhyUs />
      <CTA />
    </>
  )
}
