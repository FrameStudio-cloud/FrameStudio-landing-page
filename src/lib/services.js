/**
 * The three things FrameStudio sells, in one place.
 *
 * `/services` renders from this file, and it is written to survive a pricing
 * decision that has not been made yet: every entry carries a `plan` slug for the
 * contact form and a fixed-quote promise, but no figures. When the numbers are
 * settled, they go in `src/lib/plans.js` and both this page and `/pricing`
 * read from there — do not type a price into this file.
 *
 * Rules that keep the copy honest:
 * - `deliverables` are countable ("up to five pages", "one scripted flow").
 * - `excluded` is not optional. Publishing what a package does NOT include is
 *   the part that makes a Kenyan buyer believe the quote.
 * - `timeline` is a commitment. It must match what `/faq` and `/pricing` say.
 * - `live` points at work that actually exists. Nothing else gets a live link.
 */

export const SERVICES = [
  {
    id: 'websites',
    name: 'Websites',
    schemaName: 'Website design and development',
    kicker: 'Websites',
    icon: 'Globe',
    headline: 'A site that closes before they call.',
    who: "For businesses customers can't find.",
    promise:
      'A site that answers the three questions every customer has before they message you: what do you sell, where are you, and can I trust you.',
    intro:
      'Five pages, built mobile-first and tested on a phone on a slow connection — because that is how your customer will open it. The site goes up in your name, with the domain and hosting under your control, and we sit with you once so you can change the words yourself.',
    deliverables: [
      'Up to five pages agreed in writing — home, about, services, gallery, contact',
      'Mobile-first, and built to a speed budget tested on a slow connection',
      'Conversion-focused layout: one primary action per page, WhatsApp and form paths that reach you',
      'Titles, descriptions, schema and your Google Business Profile',
      'M-Pesa via Daraja, or Paystack, when you take money online',
      'Owner training and a handover in your name, not ours',
    ],
    excluded: [
      'Copywriting from scratch — we edit what you bring',
      'Photography or video',
      'Domain and hosting, billed annually and always in your name',
      'E-commerce beyond a product catalogue — quoted separately',
    ],
    timeline: '1–2 weeks',
    plan: 'starter',
    stat: { value: '1.1s', label: 'Load on 3G' },
    cta: 'Start with a website',
  },
  {
    id: 'bots',
    name: 'Bots & Automation',
    schemaName: 'WhatsApp bot and business automation',
    kicker: 'Bots',
    icon: 'Bot',
    headline: 'The shop that answers at 2am.',
    who: 'For orders lost to an unanswered phone.',
    promise:
      'A bot that answers the five questions you answer all day — on WhatsApp, at 11pm, while you serve the customer standing in front of you.',
    intro:
      'We write one flow properly: hours, location, price, stock, and how to book or order. Customers tap rather than type, and the moment the bot cannot help, it hands the conversation to you instead of guessing. Setup is a fixed job; keeping it tuned is an optional monthly plan.',
    deliverables: [
      'One scripted WhatsApp flow: hours, location, price, stock, booking',
      'Tappable buttons and quick replies, so nobody has to type',
      'Handover to a human the moment the bot cannot help',
      'Orders and bookings land where you already look — not in a new dashboard',
      'Answers you can edit yourself, without calling us',
    ],
    excluded: [
      'WhatsApp Business API and message fees — charged by Meta, not us',
      'Bulk broadcast campaigns',
      'One-off integrations with a system you already run — quoted separately',
    ],
    timeline: '1–2 weeks',
    plan: 'business',
    stat: { value: '2s', label: 'First reply' },
    cta: 'Start with a bot',
  },
  {
    id: 'dashboards',
    name: 'Dashboards',
    schemaName: 'Business dashboard and reporting',
    kicker: 'Dashboards',
    icon: 'BarChart3',
    headline: 'Know today, not last month.',
    who: 'For numbers kept in a notebook.',
    promise:
      'Stock, sales and money on one screen, updated as the day happens — instead of a notebook, a memory, and three WhatsApp threads.',
    intro:
      'Most businesses do not need a bespoke dashboard built for them. They need Keel, the one we built and run: stock, sales, expenses, invoices and M-Pesa reconciliation, free to start. If your workflow genuinely does not fit, we scope a custom build and quote it in writing.',
    deliverables: [
      'Stock, sales, expenses and customers in one place',
      'Low-stock and daily-sales alerts before you run out',
      'Invoices with M-Pesa reconciliation, in your own name',
      'Reports you can export for the bank, a partner, or your own head',
      'Multi-shop, if you have more than one branch',
    ],
    excluded: [
      'Hardware and tills',
      'Typing up years of old records — quoted separately',
      'Bespoke builds outside Keel — scoped and quoted separately',
    ],
    timeline: 'Same day on Keel · 2–4 weeks custom',
    stat: { value: '3', label: 'Shops, one screen' },
    live: {
      href: 'https://keel.framestudio.co.ke',
      label: 'Open Keel',
    },
    cta: 'See Keel',
  },
]

/** Every project includes these, whichever of the three you pick. */
export const ALWAYS_INCLUDED = {
  lead: 'Every project, all three.',
  items: [
    'A written scope and a fixed price before work starts',
    'A private staging link while we build',
    'A handover where the keys, domain and accounts transfer to you',
  ],
}

/** Five steps, each naming what the client actually receives. */
export const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    gets: 'A written scope',
    desc: 'We ask what the business does, who buys, and what is costing you money.',
  },
  {
    step: '02',
    title: 'Design',
    gets: 'A first look',
    desc: 'Layout and colour before a line of code, so nothing is built on a guess.',
  },
  {
    step: '03',
    title: 'Build',
    gets: 'A staging link',
    desc: 'The real thing running on a private URL, on your own phone, as we go.',
  },
  {
    step: '04',
    title: 'Launch',
    gets: 'Keys in your name',
    desc: 'Domain, hosting and accounts transfer to you, and we show you how to edit.',
  },
  {
    step: '05',
    title: 'Support',
    gets: 'A person',
    desc: 'A support window after launch, then an optional monthly plan. WhatsApp, not tickets.',
  },
]

/* ---------------------------------------------------------------------------
   Breadth
   The three services above are what we deliver as projects. The groups below
   are what the studio can actually do — the reason a visitor should read past
   the first three cards. Every item either links to a section that proves it or
   to work that is live, so nothing here is a claim without a destination.
   ------------------------------------------------------------------------- */

export const CAPABILITY_GROUPS = [
  {
    key: 'build',
    label: 'What we build',
    note: 'From a five-page site to a custom product for a startup.',
    items: [
      {
        name: 'Websites',
        line: 'Five pages, one clear action, fast on a 3G phone.',
        icon: 'Globe',
        href: '#websites',
      },
      {
        name: 'Custom builds & startups',
        line: 'Booking, portals, catalogues — scoped like software, not a template.',
        icon: 'Layers',
        href: '#websites',
      },
      {
        name: 'Storefronts',
        line: 'Products, categories, WhatsApp enquiries, M-Pesa checkout.',
        icon: 'ShoppingBag',
        href: '#websites',
      },
    ],
  },
  {
    key: 'convert',
    label: 'How we make it work',
    note: 'A site that loads and converts beats a pretty one that does neither.',
    items: [
      {
        name: 'Conversion & clarity',
        line: 'One primary action per page, and copy a customer can act on.',
        icon: 'Target',
        href: '#websites',
      },
      {
        name: 'Speed',
        line: 'Built to a performance budget, tested on a slow connection.',
        icon: 'Gauge',
        href: '#websites',
      },
      {
        name: 'SEO',
        line: 'Titles, descriptions, schema, sitemap, Search Console, Google Business Profile.',
        icon: 'Search',
        href: '/seo',
      },
    ],
  },
  {
    key: 'money',
    label: 'Getting paid',
    note: 'The part most Kenyan sites leave as a WhatsApp link.',
    items: [
      {
        name: 'M-Pesa via Daraja',
        line: 'STK push, confirmation, and reconciliation against your orders.',
        icon: 'Smartphone',
        href: '#websites',
      },
      {
        name: 'Paystack',
        line: 'Cards and wallets, payment links, invoicing, webhooks that do not lose money.',
        icon: 'CreditCard',
        href: '#websites',
      },
      {
        name: 'Invoicing',
        line: 'Send an invoice, take the balance, mark it paid — without the follow-up calls.',
        icon: 'Receipt',
        href: '#dashboards',
      },
    ],
  },
  {
    key: 'automate',
    label: 'What runs without you',
    note: 'The 11pm customer, the stock count, the summary at the end of the day.',
    items: [
      {
        name: 'WhatsApp bots',
        line: 'Answer, qualify and take the order on the app they already open.',
        icon: 'MessageCircle',
        href: '#bots',
      },
      {
        name: 'Dashboards',
        line: 'Keel: stock, sales, expenses and reports in one place.',
        icon: 'BarChart3',
        href: '#dashboards',
      },
      {
        name: 'AI',
        line: 'Captions, product copy, and an assistant that reads your own numbers.',
        icon: 'Sparkles',
        href: '#ai',
      },
    ],
  },
]

/**
 * What we plug in. These are technologies we have actually shipped with.
 *
 * `logo` points at a real mark in `public/logos/` (downloaded, not hotlinked) —
 * people recognise the badge before they read the name, so the orbit uses the
 * marks and this list stays as the accessible, complete version. Daraja has no
 * mark of its own, which is why it appears here but not in the orbit.
 */
export const INTEGRATIONS = [
  { name: 'M-PESA', detail: 'Mobile money', logo: '/logos/mpesa.svg' },
  { name: 'Paystack', detail: 'Cards & wallets', logo: '/logos/paystack.svg' },
  { name: 'WhatsApp', detail: 'Business API', logo: '/logos/whatsapp.svg' },
  { name: 'Telegram', detail: 'Bots', logo: '/logos/telegram.svg' },
  { name: 'Google', detail: 'Search & Business', logo: '/logos/google.png' },
  { name: 'Supabase', detail: 'Database & auth', logo: '/logos/supabase.svg' },
  { name: 'Vercel', detail: 'Hosting', logo: '/logos/vercel.svg' },
  { name: 'Resend', detail: 'Email', logo: '/logos/resend.svg' },
  { name: 'GitHub', detail: 'Source control', logo: '/logos/github.svg' },
  { name: 'Daraja', detail: 'Safaricom M-Pesa API' },
]

/**
 * The wall on /services and on the home page.
 *
 * Recognition-first: these are marks people already know, and a visitor who
 * spots one they use stops scanning. `INTEGRATIONS` is what we plug into;
 * `STACK_BRANDS` adds the tools we build with, because a wall of three payment
 * logos reads as thin and a wall of fourteen reads as a studio.
 */
export const STACK_BRANDS = [
  { name: 'M-PESA', logo: '/logos/mpesa.svg', wide: true },
  { name: 'Paystack', logo: '/logos/paystack-mark.png' },
  { name: 'WhatsApp', logo: '/logos/whatsapp.svg' },
  { name: 'Telegram', logo: '/logos/telegram.svg' },
  { name: 'Google', logo: '/logos/google.png' },
  { name: 'Supabase', logo: '/logos/supabase.svg' },
  { name: 'Vercel', logo: '/logos/vercel-light.svg' },
  { name: 'Resend', logo: '/logos/resend-light.svg' },
  { name: 'GitHub', logo: '/logos/github-light.svg' },
  { name: 'React', logo: '/logos/react.svg' },
  { name: 'Vite', logo: '/logos/vite.svg' },
  { name: 'Tailwind', logo: '/logos/tailwind.svg' },
  { name: 'Node.js', logo: '/logos/node.svg' },
  { name: 'Figma', logo: '/logos/figma.svg' },
]

/** AI we have running, not AI we are thinking about. */
export const AI_WORK = [
  {
    name: 'Keel Assistant',
    line: 'Ask your own shop a question in plain English and get the number, not a report to read.',
    where: 'Keel Pro',
    sample: { q: 'What sold best in March?', a: 'Leather sandals — 42 pairs, KSh 117,600' },
  },
  {
    name: 'Product copy & captions',
    line: 'Descriptions and social captions drafted from your catalogue, then edited by you before anything is published.',
    where: 'Keel Pro',
    sample: { q: 'Caption for: woven basket', a: '“Handmade in Nairobi. Ready in two days. Tap to order.”' },
  },
  {
    name: 'WhatsApp answers',
    line: 'The assistant answers from your real stock and prices, and hands the thread to you the moment it is not sure.',
    where: 'Bots',
    sample: { q: 'Do you have size 42?', a: 'Yes — four left. Reserve one?' },
  },
]

/** Services that exist but do not get their own section. Schema only. */
export const CAPABILITY_SCHEMA = [
  {
    name: 'Search engine optimisation',
    promise: 'On-page SEO, structured data, sitemap, Search Console and Google Business Profile setup.',
  },
  {
    name: 'Payment integration',
    promise: 'M-Pesa via Daraja and Paystack, with reconciliation against orders and invoices.',
  },
  {
    name: 'AI automation',
    promise: 'AI assistants and generated copy inside the tools a business already runs.',
  },
]
