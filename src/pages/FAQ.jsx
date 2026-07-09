import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'How much does a website cost?',
    a: 'Our starter websites begin at KSh 15,000. The final price depends on the number of pages, features (e-commerce, booking, etc.), and integrations required. We give you a fixed quote before any work begins.',
  },
  {
    q: 'Do you offer WhatsApp bot services?',
    a: 'Yes — WhatsApp bots are one of our core services. We build automated ordering systems, customer support bots, and lead generation flows. Pricing starts at KSh 25,000 depending on complexity.',
  },
  {
    q: 'How long does it take to build a website?',
    a: "Most websites are delivered within 1-2 weeks. More complex projects like dashboards or multi-feature e-commerce stores may take 3-4 weeks. We'll give you a timeline upfront.",
  },
  {
    q: 'Do you accept M-Pesa?',
    a: 'Absolutely. We accept M-Pesa, bank transfers, and mobile money. We typically require a 50% deposit to begin, with the balance due on completion.',
  },
  {
    q: 'Can you integrate M-Pesa into my website?',
    a: 'Yes — M-Pesa integration is included in most of our builds. We set up the payment flow so your customers can pay via M-Pesa directly on your site.',
  },
  {
    q: 'Do I need technical skills to manage my site?',
    a: 'Not at all. We build sites that are easy to update, and we provide training after launch. We also offer maintenance packages if you prefer us to handle updates.',
  },
  {
    q: 'What if I need changes after the project is done?',
    a: 'Every project includes a support period (typically 1-3 months). After that, we offer maintenance packages starting at KSh 3,000/month for minor updates and support.',
  },
  {
    q: 'Do you work with clients outside Nairobi?',
    a: 'Yes — we work with clients across Kenya and East Africa. Everything is done remotely, and we communicate via WhatsApp, email, and video calls.',
  },
  {
    q: 'What information do you need to start?',
    a: "A brief description of your project, any examples of sites or bots you like, and your budget range. That's enough for us to give you a quote and timeline.",
  },
]

export default function FAQ() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Helmet>
        <title>FAQ — FrameStudio | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about FrameStudio's services, pricing, timelines, M-Pesa payments, and ongoing support for Kenyan businesses." />
        <meta property="og:title" content="FAQ — FrameStudio" />
        <meta property="og:description" content="Everything you need to know about working with FrameStudio. Pricing, timelines, M-Pesa, and support." />
        <meta property="og:url" content="https://framestudio.co.ke/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/faq" />
      </Helmet>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Everything you need to know about working with FrameStudio.
          </p>
        </div>
      </section>

      <section ref={sectionRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div ref={headerRef} className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-96 pb-6 px-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 text-sm mb-6">We're happy to help. Reach out and we'll get back to you quickly.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
