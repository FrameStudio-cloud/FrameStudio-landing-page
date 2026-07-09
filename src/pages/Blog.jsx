import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, ExternalLink, BarChart3, Package, ShoppingCart, Globe, MessageSquare, Check, MessageCircle, Monitor, TrendingUp, Smartphone, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const postIcons = [MessageCircle, Monitor, TrendingUp, Smartphone, Shield]

const posts = [
  {
    title: 'Why Kenyan SMEs Need WhatsApp Bots',
    category: 'Business',
    body: [
      'Every day, Kenyan shop owners answer the same questions on WhatsApp: "Do you have X in stock?" "How much is Y?" "Are you open today?" Answering them one by one eats hours every week. A WhatsApp bot automates this — customers get instant replies about stock, prices, and hours without you typing a thing.',
      'We built bots for Mama Mboga (fresh produce) and Fundi Finder (local artisans). One handles 200+ customer enquiries daily. The other connects customers to vetted artisans within seconds. Both run 24/7 without needing a human on the other end.',
    ],
    highlights: ['Auto-reply stock and price enquiries', 'Accept orders via WhatsApp', 'Forward complex requests to you', 'Works on any phone, no app install'],
  },
  {
    title: 'Website vs WhatsApp Bot: What Does Your Business Need?',
    category: 'Guides',
    body: [
      'A common question we hear: "Should I get a website or a WhatsApp bot?" The answer depends on what you are trying to do. A website is best for discovery — it ranks on Google, shows your full catalogue, and builds trust. A WhatsApp bot is best for sales — it catches customers where they already chat and turns conversations into orders.',
      'Most businesses eventually need both. The website brings people in; the bot closes the sale. But if you are just starting, pick based on your biggest problem: no visibility (get a website) or too many messages (get a bot).',
    ],
    highlights: ['Websites: SEO, catalogue, trust, discoverability', 'WhatsApp bots: instant replies, orders, 24/7', 'Start with one, add the other as you grow', 'We build both and they integrate seamlessly'],
  },
  {
    title: '5 Signs Your Business Needs a Dashboard',
    category: 'Business',
    body: [
      'Still running your business on spreadsheets or a notebook? It works — until it does not. Here are five signs it is time to upgrade: (1) You do not know your stock levels without physically counting. (2) You cannot tell if you made a profit this month. (3) You keep running out of best-sellers. (4) Your sales data is scattered across M-Pesa messages, bank SMS, and handwritten notes. (5) You have more than one shop or location.',
      'A dashboard like Keel fixes all of this. Inventory updates in real time. Sales log in seconds. Profit and loss calculates itself. You see your entire business on one screen.',
    ],
    highlights: ['Real-time stock tracking with low-stock alerts', 'Profit & loss reports updated automatically', 'Sales logging in under 10 seconds', 'Multi-shop support from one account'],
  },
  {
    title: 'The Cost of Going Digital in Kenya (2026)',
    category: 'Business',
    body: [
      'How much should you budget for a website, WhatsApp bot, or dashboard in Kenya right now? Here is the reality: a professional business website runs KES 15,000–50,000 depending on pages and features. A WhatsApp bot costs KES 8,000–20,000. A full dashboard starts around KES 10,000 and goes up based on complexity.',
      'These are one-time build costs (plus annual hosting of about KES 3,000–8,000). Compared to the time and sales you lose without them, most businesses recover the investment within 1–3 months. We offer transparent pricing on our services page with no hidden fees.',
    ],
    highlights: ['Websites: KES 15K–50K one-time', 'WhatsApp bots: KES 8K–20K one-time', 'Dashboards: KES 10K–30K one-time', 'Hosting: KES 3K–8K per year'],
  },
  {
    title: 'How to Choose a Web Developer in Kenya',
    category: 'Guides',
    body: [
      'Not all web developers are the same. We have seen too many business owners pay for a site that never launches, or launches and does not work on phones. Here is what to look for: a portfolio with real, working sites (not just mockups), clear timelines in writing, mobile-first designs, and a maintenance plan after launch.',
      'Red flags: developers who promise everything in 24 hours, ask for full payment upfront, or cannot show you a live site they built. A proper website takes 1–3 weeks. Anything faster is usually a template with your logo slapped on.',
    ],
    highlights: ['Ask for live sites, not just screenshots', 'Get timelines and deliverables in writing', 'Never pay 100% upfront — 50/50 or milestone-based', 'Make sure the site works on phones first'],
  },
]

const featured = {
  title: 'We Built Keel — A Multi-Tenant Dashboard for Kenyan Shop Owners',
  category: 'Projects',
  date: 'July 2026',
  body: [
    'Running a small retail business in Kenya today means juggling a notebook for inventory, WhatsApp for orders, Instagram for marketing, and maybe a website builder if you have one. None of these tools talk to each other. You cannot see your stock levels while logging a sale. You cannot publish a product to your website from your inventory list. There is no single place to check if your business is doing well today.',
    'So we built Keel — a mobile-first, multi-tenant dashboard that brings everything into one place. It is built for Kenyan SMEs and designed to work on any phone or computer.',
  ],
  highlights: [
    { icon: Package, label: 'Inventory', desc: 'Add products, track stock, low-stock alerts, barcode scanning.' },
    { icon: ShoppingCart, label: 'Sales', desc: 'Log sales in seconds, auto-deduct stock, print receipts.' },
    { icon: BarChart3, label: 'Reports', desc: 'Profit margins, P&L, slow-moving stock, sales charts.' },
    { icon: Globe, label: 'Website', desc: 'Auto-generated product catalogue with WhatsApp chat widget.' },
    { icon: MessageSquare, label: 'Bots', desc: 'WhatsApp and Telegram bots for automated customer replies.' },
  ],
  link: 'https://keel.framestudio.co.ke',
}

export default function Blog() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current?.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Helmet>
        <title>Blog — FrameStudio | Tips & Guides for Kenyan Businesses</title>
        <meta name="description" content="Tips, guides, and insights for Kenyan businesses going digital. Websites, WhatsApp bots, dashboards, and digital transformation advice from FrameStudio." />
        <meta property="og:title" content="Blog — FrameStudio | Tips & Guides for Kenyan Businesses" />
        <meta property="og:description" content="Tips, guides, and insights for Kenyan businesses going digital. Featuring the story of Keel — a multi-tenant dashboard for Kenyan shop owners." />
        <meta property="og:url" content="https://framestudio.co.ke/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/blog" />
      </Helmet>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance">
            Blog & Guides
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Tips, guides, and insights for Kenyan businesses going digital.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={sectionRef}>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-white bg-black px-3 py-1.5 rounded-full">{featured.category}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={12} />{featured.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">{featured.title}</h2>
              {featured.body.map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3 max-w-3xl">{p}</p>
              ))}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-8">
                {featured.highlights.map((h) => (
                  <div key={h.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <h.icon size={22} className="text-gray-700 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-gray-800 mb-0.5">{h.label}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
              <a href={featured.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
                Visit Keel <ExternalLink size={16} />
              </a>
            </div>

            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.12em] mb-6">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => {
                const Icon = postIcons[i]
                return (
                  <div key={post.title} className="group rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-gray-600" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full inline-block mb-3">{post.category}</span>
                    <h3 className="font-bold text-gray-900 leading-snug mb-3">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{post.body[0]}</p>
                    <ul className="space-y-1.5 mb-4">
                      {post.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-gray-500">
                          <Check size={12} className="mt-0.5 text-gray-400 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:text-gray-600 transition-colors">
                      Book a Consultation <ArrowRight size={12} />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Want Us to Cover a Topic?</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mt-4">Let us know what you'd like to learn about.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-black text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all">
            Suggest a Topic <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
