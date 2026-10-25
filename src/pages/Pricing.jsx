import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, ExternalLink, Star, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Mini Catalogue',
    price: '7,000',
    period: '/project',
    desc: 'For businesses that want to showcase products online.',
    features: [
      'Up to 20 product listings, each with an image, name, price and short description.',
      'Product catalogue with category organization, if included in your build.',
      'WhatsApp enquiry links for customers to ask about products.',
      'Mobile-friendly layout and basic SEO setup.',
      'Contact details and social media links.',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Starter',
    price: '15,000',
    period: '/project',
    desc: 'For businesses that need a complete online presence.',
    features: [
      'Up to five agreed pages, such as Home, About, Services, Gallery and Contact.',
      'Responsive design for phones, tablets and desktops.',
      'Contact form and WhatsApp enquiry link.',
      'Basic on-page SEO, including page titles and descriptions.',
      'One month of post-launch support.',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Business',
    price: '35,000',
    period: '/project',
    desc: 'For businesses ready to automate and improve their online operations.',
    features: [
      'Up to 10 agreed pages, or a defined dashboard-based application.',
      'Telegram bot integration for an agreed business workflow.',
      'M-Pesa payment integration, subject to the required account and payment provider setup.',
      'Advanced SEO configuration and analytics integration.',
      'Three months of post-launch support.',
      'Priority email support.',
    ],
    cta: 'Most Popular',
    featured: true,
  },
  {
    name: 'Custom',
    price: "Let's Talk",
    period: '',
    desc: 'Complex projects, ongoing automation, or multi-system integrations.',
    features: ['Custom scope & timeline', 'Dedicated project manager', 'Full API integrations', 'Staff training & documentation', 'Ongoing maintenance', 'SLA guarantee'],
    cta: 'Contact Us',
    featured: false,
  },
]

export default function Pricing() {
  const sectionRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
        <title>Pricing — FrameStudio | Affordable Digital Solutions for Kenyan SMEs</title>
        <meta name="description" content="Transparent pricing for Kenyan SMEs. Websites from KSh 15,000, WhatsApp bots from KSh 25,000, dashboards from KSh 10,000. No hidden fees." />
        <meta property="og:title" content="Pricing — FrameStudio" />
        <meta property="og:description" content="Transparent pricing for Kenyan SMEs. Websites, WhatsApp bots, and dashboards at affordable rates." />
        <meta property="og:url" content="https://www.framestudio.co.ke/pricing" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.framestudio.co.ke/pricing" />
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
            Simple Pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Transparent pricing for Kenyan SMEs. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                ref={(el) => (sectionRefs.current[i] = el)}
                className={`rounded-2xl p-8 flex flex-col ${
                  plan.featured
                    ? 'bg-black text-white ring-2 ring-gray-300 scale-[1.05]'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">KSh {plan.price}</span>
                  {plan.period && <span className={plan.featured ? 'text-gray-400' : 'text-gray-500'}>{plan.period}</span>}
                </div>
                <p className={`text-sm mt-2 ${plan.featured ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={`${plan.featured ? 'text-gray-400' : 'text-gray-500'} mt-0.5 shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/contact?plan=${plan.name.toLowerCase().replace(' ', '-')}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all ${
                    plan.featured
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 ref={(el) => (sectionRefs.current[4] = el)} className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Keel — Own Our Dashboard
            </h2>
            <p className="text-gray-400 text-lg mt-4 leading-relaxed">
              The same multi-tenant dashboard we build for clients is available as a subscription.
              Sales, inventory, social media, bots, storefront — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                id: 'basic',
                name: 'Basic',
                price: '500',
                icon: Shield,
                desc: 'Everything you need to run your shop day-to-day.',
                features: [
                  'Sales & inventory tracking',
                  'Service orders & expenses',
                  'Customer management',
                  'Stock alerts & basic reports',
                  'Social media management',
                ],
              },
              {
                id: 'pro',
                name: 'Pro',
                price: '1,000',
                icon: Star,
                desc: 'Everything in Basic plus a website, bots, and advanced tools.',
                features: [
                  'Custom website & storefront',
                  'WhatsApp & Telegram bots',
                  'AI caption generator',
                  'P&L reports & data export',
                  'M-Pesa reconciliation',
                  'QR codes & print catalogue',
                  'Website analytics',
                ],
                featured: true,
              },
            ].map((plan, i) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  ref={(el) => (sectionRefs.current[5 + i] = el)}
                  className={`rounded-2xl p-8 flex flex-col ${
                    plan.featured
                      ? 'bg-white/5 border border-amber-500/30 ring-1 ring-amber-500/10'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} className={plan.featured ? 'text-amber-400' : 'text-blue-400'} />
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">KSh {plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.desc}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check size={16} className="text-gray-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://keel.framestudio.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all ${
                      plan.featured
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Visit Keel <ExternalLink size={16} />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div ref={(el) => (sectionRefs.current[7] = el)} className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center">Frequently Asked</h2>
            <div className="mt-12 space-y-6">
              {[
                { q: 'Do you offer payment plans?', a: 'Yes. We typically ask for a 50% deposit to start, with the balance due on completion. For larger projects, we can arrange milestone-based payments.' },
                { q: 'How long does a project take?', a: 'Most websites and bots are delivered within 2 weeks. Dashboards and complex integrations may take 3-4 weeks depending on scope.' },
                { q: 'Do you provide hosting?', a: 'Yes — we handle domain setup and hosting for all our clients. Pricing is transparent and billed annually.' },
                { q: 'What if I need changes after launch?', a: 'Every project includes a support period. After that, we offer affordable maintenance packages starting at KSh 3,000/month.' },
              ].map((faq) => (
                <div key={faq.q} className="p-6 rounded-xl bg-white border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
