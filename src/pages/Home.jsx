import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FrameStudio",
  "url": "https://framestudio.co.ke",
  "description": "Digital solutions for Kenyan businesses — websites, WhatsApp bots, and business dashboards.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://framestudio.co.ke/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FrameStudio",
  "url": "https://framestudio.co.ke",
  "email": "hello@framestudio.co.ke",
  "location": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" } }
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>FrameStudio — Digital Solutions for Kenyan Businesses</title>
        <meta name="description" content="FrameStudio builds websites, WhatsApp bots, and business dashboards for growing Kenyan businesses. Affordable, mobile-friendly, built for Kenya." />
        <meta property="og:title" content="FrameStudio — Digital Solutions for Kenyan Businesses" />
        <meta property="og:description" content="Websites, WhatsApp bots, and business dashboards for Kenyan SMEs. M-Pesa integration, real-time inventory, automated customer replies." />
        <meta property="og:url" content="https://framestudio.co.ke/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/" />
        <script type="application/ld+json">{JSON.stringify(siteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Hero />
      <Services />
      <WhyUs />
      <CTA />
    </>
  )
}
