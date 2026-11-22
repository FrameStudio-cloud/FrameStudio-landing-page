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
        <link rel="canonical" href="https://www.framestudio.co.ke/pricing" />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,#1a0e0a_0%,#0b0b0b_55%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-accent/10 rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mb-5 flex items-center justify-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Pricing
          </p>
          <h1 className="font-display text-[2.6rem] md:text-6xl lg:text-[4.2rem] font-semibold text-paper tracking-[-0.03em] leading-[0.98] text-balance">
            Simple <span className="accent-italic text-accent">pricing</span>
          </h1>
          <p className="text-paper/55 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Transparent pricing for Kenyan SMEs. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                ref={(el) => (sectionRefs.current[i] = el)}
                className={`relative rounded-3xl p-7 flex flex-col transition-colors duration-300 ${
                  plan.featured
                    ? 'bg-ink text-paper border border-accent/70'
                    : 'bg-paper text-ink border border-ink/10 hover:border-ink/25'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-7 bg-accent text-ink font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-5">
                  <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{plan.name}</h3>
                  <span className={`font-mono text-[10px] tracking-[0.2em] pt-1 ${plan.featured ? 'text-paper/25' : 'text-ink/25'}`}>
                    0{i + 1}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="font-display text-[2rem] font-semibold tracking-[-0.03em] leading-none whitespace-nowrap">
                    {plan.price === "Let's Talk" ? plan.price : `KSh ${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className={`font-mono text-[10px] ${plan.featured ? 'text-paper/40' : 'text-ink/40'}`}>{plan.period}</span>
                  )}
                </div>
                <p className={`text-sm mt-3 leading-relaxed ${plan.featured ? 'text-paper/55' : 'text-ink-soft'}`}>{plan.desc}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-3 text-sm leading-relaxed ${plan.featured ? 'text-paper/70' : 'text-ink-soft'}`}>
                      <Check size={15} strokeWidth={3} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-accent' : 'text-ink/30'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contact?plan=${plan.name.toLowerCase().replace(' ', '-')}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-full transition-all ${
                    plan.featured
                      ? 'bg-accent text-ink hover:bg-accent-deep'
                      : 'bg-ink text-paper hover:bg-ink/90'
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ink relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/[0.07] rounded-full blur-[140px]" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 ref={(el) => (sectionRefs.current[4] = el)} className="font-display text-[2rem] md:text-4xl font-semibold text-paper tracking-[-0.03em] text-balance">
              Keel — own our <span className="accent-italic text-accent">dashboard</span>
            </h2>
            <p className="text-paper/55 text-lg mt-5 leading-relaxed">
              The same multi-tenant dashboard we build for clients is available as a subscription.
              Sales, inventory, social media, bots, storefront — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                id: 'free',
                name: 'Free',
                price: '0',
                icon: Shield,
                desc: 'Everything you need to run your shop day-to-day.',
                features: [
                  'Sales & inventory tracking',
                  'Service orders & expenses',
                  'Customer management',
                  'Stock alerts & reports',
                  'Invoicing, QR codes & marketing',
                ],
              },
              {
                id: 'pro',
                name: 'Pro',
                price: '1,000',
                icon: Star,
                desc: 'Everything in Free plus a website, bots, and advanced tools.',
                features: [
                  'Custom website & storefront',
                  'Keel Assistant',
                  'M-Pesa STK push & reconciliation',
                  'Online invoice payments',
                  'P&L reports & data export',
                  'AI captions & Telegram bot',
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
                  className={`rounded-3xl p-7 flex flex-col ${
                    plan.featured
                      ? 'bg-paper/[0.05] border border-accent/70'
                      : 'bg-paper/[0.04] border border-paper/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={17} className={plan.featured ? 'text-accent' : 'text-paper/45'} />
                    <h3 className="font-display text-lg font-semibold text-paper">{plan.name}</h3>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-[2rem] font-semibold text-paper tracking-[-0.03em] leading-none">
                      {plan.price === '0' ? 'Free' : `KSh ${plan.price}`}
                    </span>
                    <span className="font-mono text-[11px] text-paper/40">{plan.price === '0' ? 'forever' : '/month'}</span>
                  </div>
                  <p className="text-sm text-paper/55 mt-3 leading-relaxed">{plan.desc}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-paper/70 leading-relaxed">
                        <Check size={15} strokeWidth={3} className="text-paper/25 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://keel.framestudio.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-full transition-all ${
                      plan.featured
                        ? 'bg-accent text-ink hover:bg-accent-deep'
                        : 'border border-paper/15 text-paper hover:border-accent/60 hover:text-accent'
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

      <section className="py-20 md:py-28 bg-cream">
        <div ref={(el) => (sectionRefs.current[7] = el)} className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-[2rem] md:text-4xl font-semibold text-ink tracking-[-0.03em] text-center text-balance">
              Frequently asked
            </h2>
            <div className="mt-12 space-y-4">
              {[
                { q: 'Do you offer payment plans?', a: 'Yes. We typically ask for a 50% deposit to start, with the balance due on completion. For larger projects, we can arrange milestone-based payments.' },
                { q: 'How long does a project take?', a: 'Most websites and bots are delivered within 2 weeks. Dashboards and complex integrations may take 3-4 weeks depending on scope.' },
                { q: 'Do you provide hosting?', a: 'Yes — we handle domain setup and hosting for all our clients. Pricing is transparent and billed annually.' },
                { q: 'What if I need changes after launch?', a: 'Every project includes a support period. After that, we offer affordable maintenance packages starting at KSh 3,000/month.' },
              ].map((faq) => (
                <div key={faq.q} className="p-6 rounded-3xl bg-paper border border-ink/10">
                  <h3 className="font-display font-semibold text-ink mb-2">{faq.q}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
