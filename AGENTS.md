# AGENTS.md — FrameStudio Landing Page

## Session Context

Vite + React 19 + React Router v7 + Tailwind CSS v3 + GSAP (ScrollTrigger).

## Design System

Tokens live in `tailwind.config.js` (colors, fonts, marquee keyframes) and
`src/index.css` (base surface, selection, focus ring, `accent-italic`,
`marquee-mask`). Change a value there, not in a component.

**Colour.** Black stays the base; cream replaces sterile white; one loud voice.

| Token | Value | Use |
|---|---|---|
| `ink` | `#0B0B0B` | Dark sections, text on light |
| `ink-soft` / `ink-faint` | `#52524B` / `#8A8A80` | Secondary / tertiary text |
| `paper` | `#FBF8F0` | Default page surface, light sections |
| `cream` | `#F3EDDF` | Alternating warm section |
| `accent` | themed (see below) | **Action + emphasis only** |

**The accent is themeable.** Values are CSS channels in `src/index.css`:
`:root` is lime `198 242 78`, `.theme-vermilion` is `255 90 54`. Tailwind's
`accent` colour reads those vars, so `bg-accent`, `text-accent`,
`border-accent/40` all follow the active theme. `src/components/Layout.jsx`
maps a route to a theme class (`ACCENT_THEMES`); the class sits on the Layout
root so nav, page and footer switch together. To change the site accent, change
`:root`. To add a challenger, add a `.theme-*` block and a route entry.
Current state: `/` is lime, **`/pricing` is vermilion for comparison**.

Rules that keep it from looking cheap:

- The accent is for: primary buttons, active nav, eyebrows, stat suffixes, one
  italic word per headline, hover on dark links. Never body copy, never a large
  fill outside a button.
- On cream/paper, an accent-coloured word is too low-contrast. Use
  `accent-italic` in `ink` there, or put ink text on an accent fill.
- Never mix the accent with a second colour accent (no amber/blue/purple
  highlights on the same screen).
- Selection and focus rings follow the accent too. That is the whole budget.

**Type.** Four fonts, four jobs. Do not borrow a font for another job.

| Role | Font | Class | Where |
|---|---|---|---|
| Display | Bricolage Grotesque | `font-display` (600) | h1, h2, card titles, wordmarks |
| Editorial accent | Instrument Serif *italic* | `accent-italic` | one word inside a display headline, pull quotes |
| Body / UI | General Sans | `font-sans` (root, via Layout) | paragraphs, buttons, forms |
| Labels / data | Space Mono | `font-mono`, uppercase + `tracking-[0.22em]` | eyebrows, stats, tags, hex codes, legal micro-copy |

Headline recipe: `font-display font-semibold tracking-[-0.03em] leading-[1.02]`
with one `<span className="accent-italic">word</span>` in it. More than one
italic word per headline cancels the charm.

Fonts load in `index.html` from Fontshare (General Sans) and Google Fonts (the
other three). Satoshi is gone; if you see `font-['Satoshi']` anywhere, it is a
regression.

**Status.** Every marketing route is on the new system: home, Services,
Portfolio, ProjectDetail, Blog, BlogPost, Pricing, About, Contact, FAQ and the
four policy pages via `PolicyLayout`. The accent is vermilion. The old
`gray-*`/`white` palette should not appear on any of these pages — if you see
it, it is a leftover. `src/pages/Invoice.jsx` and `src/components/invoice/*`
are exempt: the invoice is a document with a deliberate fixed light palette for
print, so do not restyle it to match the marketing site.

### LiveDemo (home, `#demo`)

The "Watch a shop run" section is a **scripted product demo**, not video and not
a card grid: one screen with a recording chrome (REC dot, timecode, chapter
rail), a 24-second GSAP timeline that loops, and real DOM inside. Edit the
timeline, not a video file.

Rules that must survive edits:

- Keep the **Pause** button. Moving content that runs >5s beside other content
  needs a visible, keyboard-reachable control (WCAG 2.2.2). Do not add
  `aria-pressed` while the label switches between Pause and Play.
- `prefers-reduced-motion` must skip the timeline entirely — the JSX is written
  as the **final state**, so a reduced-motion or no-JS visitor sees a complete
  dashboard and a "static preview" note, not an empty frame.
- An IntersectionObserver pauses the timeline off-screen; keep it, or an idle
  tab animates forever.
- Tween `transform`/`opacity` only, and write numbers via `textContent` (never
  React state) so the loop never re-renders.
- Data is **sample data**, stated in the copy and in the caption. Do not put
  real client names, sales or phone numbers in it.
- Mobile shows the bot reply inline because the floating chat is hidden below
  `sm`; keep both paths in sync if you change the scene.

## Routes

| Path | Component | File |
|---|---|---|
| `/` | Home | `src/pages/Home.jsx` (Hero + Services + WhyUs + CTA) |
| `/services` | Services | `src/pages/Services.jsx` |
| `/about` | About | `src/pages/About.jsx` |
| `/portfolio` | Portfolio | `src/pages/Portfolio.jsx` (only Keel project) |
| `/pricing` | Pricing | `src/pages/Pricing.jsx` |
| `/contact` | Contact | `src/pages/Contact.jsx` |
| `/faq` | FAQ | `src/pages/FAQ.jsx` |
| `/blog` | Blog | `src/pages/Blog.jsx` (featured Keel post + 5 articles) |
| `/terms` | Terms | `src/pages/Terms.jsx` |
| `/privacy` | Privacy | `src/pages/Privacy.jsx` |
| `/refund` | Refund | `src/pages/Refund.jsx` |
| `/cookies` | Cookies | `src/pages/Cookies.jsx` |
| `/invoice/:token` | Public Invoice | `src/pages/Invoice.jsx` — outside `Layout` (no nav/footer) |
| `/invoice/demo` | Public Invoice (demo) | same page, `?state=sent\|partial\|paid\|overdue\|cancelled\|draft\|just-paid\|not-found` |

## Public Invoice Page (`/invoice/:token`)

The page a customer lands on from an emailed invoice link, to see it and pay it.
Dark ambient shell with a light "paper" document — the paper is what prints.

- `src/pages/Invoice.jsx` — routing/state machine. 8 states: loading, awaiting
  payment, part paid, paid, overdue, cancelled, draft, not found (plus the
  "just paid" confirmation banner after returning from Paystack). Only
  `sent`/`partial`/`overdue` with a balance show the pay panel.
- `src/lib/invoice.js` — **deliberate mirror** of
  `framestudio-dashboard/src/lib/invoiceDoc.js` (balance maths, `effectiveStatus`,
  `computeTotals`, `formatKES`, number formatting). The two repos share no build,
  so the rules are copied; **change both together**. "Overdue" is always derived
  at render time, never read from the row.
- `src/lib/invoiceApi.js` — the only data door. Demo tokens resolve from
  `src/data/invoiceDemo.js`; a real token calls the `get_invoice_by_token`
  Supabase RPC and a missing RPC is treated as "invalid link", not "retry".
  Payments go through the `/api/invoice-pay-*` functions below.
- `src/components/invoice/` — `InvoicePaper` (the document, fixed light palette
  so screen/print/dark mode agree), `InvoiceItemsTable`, `InvoiceTotals`,
  `StatusChip` (dark-page tones).
- `/invoice/demo` renders sample data with a state switcher; it says "Demo" out
  loud so a fixture can never be mistaken for a real invoice.

### Invoice API (`api/`)

Vercel functions. They hold the service role key and the Paystack secret — never
the browser, never the dashboard bundle.

| File | What it does |
|------|--------------|
| `api/_invoice.js` | Shared plumbing (service-role Supabase client, `get_invoice_by_token`, Paystack fetch, CORS, payable rules). Underscore = not a route. |
| `api/invoice-pay-init.js` | `POST { token }` → re-reads the invoice, charges its **current balance** (never trusts a browser-sent amount), returns Paystack `authorization_url`. |
| `api/invoice-pay-verify.js` | `POST { token, reference }` → verifies with Paystack, checks the reference belongs to this invoice, then records the payment. Idempotent. |
| `api/paystack-webhook.js` | `charge.success` handler. Validates the `x-paystack-signature` HMAC over the raw body, records the payment the same idempotent way. This is the durable path — a closed tab can't lose a payment. |
| `api/invoice-send.js` | `POST { invoiceId }` + `Authorization: Bearer <supabase access token>` → emails the invoice via Resend, then flips draft → sent and stamps `sent_at`. Only patches after the email actually left. |

Payment flow: `invoice-pay-init` → Paystack checkout → back to
`/invoice/<token>?reference=…` → `invoice-pay-verify` records it → page shows the
paid invoice. The webhook races the redirect on purpose; the unique index on
`invoice_payments.reference` makes the loser a no-op.

Server env vars (Vercel → Project → Settings → Environment Variables):

| Var | Notes |
|-----|-------|
| `SUPABASE_URL` | Falls back to `VITE_SUPABASE_URL` if unset |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Never prefix with `VITE_`. |
| `PAYSTACK_SECRET_KEY` | `sk_test_…` until go-live, then `sk_live_…` |
| `RESEND_API_KEY` | Already set for the contact form |
| `INVOICE_BASE_URL` | Optional, defaults to `https://www.framestudio.co.ke` |
| `INVOICE_FROM` / `INVOICE_REPLY_TO` | Optional sender overrides |

Paystack dashboard → Settings → API Keys & Webhooks → Webhook URL:
`https://www.framestudio.co.ke/api/paystack-webhook`.

### Local API (`scripts/dev-api.mjs`)

`vite dev` does not run `api/`, so `npm run dev:api` mounts the same handlers on
`http://localhost:5200` (Node http, tiny req/res shim, loads `.env`). Point the
app at it with `VITE_INVOICE_API_BASE=http://localhost:5200` in `.env.local`.

Gotchas:

- **`noindex`**: the page sets `<meta name="robots" content="noindex, nofollow">`
  and `vercel.json` also sends `X-Robots-Tag: noindex, nofollow` +
  `Cache-Control: private, no-store` for `/invoice/(.*)`. Invoice URLs are never
  added to `prerender.js` routes or `sitemap.xml`.
- **Print**: `index.css` hides everything marked `data-invoice-chrome`, blanks the
  dark background, drops the canvas max-width and strips the paper's ring/shadow.
  If you add page furniture, mark it `data-invoice-chrome` or it will print.
- **Mobile CTA**: the in-flow pay button is `hidden sm:inline-flex` — below `sm`
  the sticky bottom bar owns the primary action (with safe-area padding).
- **Demo tokens never charge**: `startPayment()` short-circuits `demo*` tokens to
  the honest M-Pesa/WhatsApp fallback. Real invoices go to Paystack.
- **Registering the payments**: `invoice_payments.reference` is unique on purpose
  (a plain, not partial, index so `on conflict (reference)` can infer it). Two
  retries of the same webhook record one payment.
- **Cloudflare on checkout**: `checkout.paystack.com` blocks headless browsers, so
  end-to-end payments are tested with Paystack's `/charge` test card instead of
  the hosted page.

## Site Structure

- `src/App.jsx` — BrowserRouter, Layout wrapper, 12 routes
- `src/components/Layout.jsx` — Nav + Outlet + Footer
- `src/components/Nav.jsx` — Links: Services, Portfolio, Blog, Pricing, About, Contact + "Get Started" mailto
- `src/components/Footer.jsx` — 4-column footer with social icons (WhatsApp, Instagram, LinkedIn, Facebook, X/Twitter, YouTube, TikTok, GitHub)
- `src/pages/Home.jsx` — Imports Hero, Services, WhyUs, CTA components

## Build & Lint

```bash
npm run dev            # Vite dev server
npm run build          # Production build (Vite/Rolldown)
npm run build:prerender # Build + prerender all routes (Puppeteer)
npm run prerender      # Prerender only (after build)
npm run lint           # ESLint
```

## Dependencies

react 19, react-dom 19, react-router-dom 7, gsap 3, lucide-react, motion (Framer Motion), react-helmet-async

## Key Changes Made (Session July 2026)

### Portfolio Page (`src/pages/Portfolio.jsx`, `src/pages/ProjectDetail.jsx`)
- DB-driven, same architecture as the blog: `portfolio_projects` table in the FrameStudio Supabase project → `src/lib/projects.js` → list + detail pages
- Removed all 9 fake/placeholder projects — only real work is shown
- **Table `portfolio_projects`** (RLS: anon can read `published=true`, authenticated full access):
  - `slug`, `title`, `category` (Websites / Bots / Dashboards), `excerpt`, `date`, `tags[]`
  - `live_url`, `cover_palette`, `published`, `site` (framestudio/all), `sort_order`
  - `screenshots jsonb` — `[{title, caption, url}]` for per-page screenshots
  - `palette jsonb` — `[{name, hex, role}]` colour swatches
  - `fonts jsonb` — `[{name, role, specimen}]` typography specimens
  - `stack jsonb` — tech tags; `story jsonb` — `{type: heading|paragraph, text}` blocks
- Portfolio list cards link to `/portfolio/:slug` (no external links on cards)
- `ProjectDetail.jsx` shows: hero + live-site button, Screens section, "The system" (palette + typography + stack), "The story" blocks, next-project nav
- Seeded project: `keel` (Dashboards)
- `prerender.js` now pulls project slugs too — `/portfolio/<slug>` is prerendered and added to `sitemap.xml`
- Keel thumbnail at `/keel thumbnail.png`; Keel live at `https://keel.framestudio.co.ke`

### Blog Page (`src/pages/Blog.jsx`)
- Added featured post block: **"We Built Keel — A Multi-Tenant Dashboard for Kenyan Shop Owners"**
  - Full description (2 paragraphs), 5 feature highlights (Inventory, Sales, Reports, Website, Bots) with icons
  - "Visit Keel" button linking to `https://keel.framestudio.co.ke`
- Replaced 6 placeholder "Coming soon" posts with 5 full, detailed articles:
  1. **Why Kenyan SMEs Need WhatsApp Bots** — Auto-reply, order taking, real examples
  2. **Website vs WhatsApp Bot: What Does Your Business Need?** — Comparison guide
  3. **5 Signs Your Business Needs a Dashboard** — Pain points and solutions
  4. **The Cost of Going Digital in Kenya (2026)** — Real price brackets (KES)
  5. **How to Choose a Web Developer in Kenya** — Tips and red flags
- Each article has: icon, category badge, intro paragraph, bulleted highlights, "Book a Consultation" link

### Services Section (`src/components/Services.jsx`)
- "What We Build" section — all 3 service cards now `medium` size (was large for Websites)
- Added 4th bullet to each card: Websites (M-Pesa integration), Bots (Telegram & SMS bots), Dashboards (Multi-shop management)
- Added mesh dot-grid background (SVG pattern with crosshair lines + soft gradient blobs)
- Dark CTA card remains: "Why Stop There?" with mailto link

### Footer (`src/components/Footer.jsx`)
- Updated WhatsApp: `https://wa.me/254793302518`
- Updated Instagram: `https://www.instagram.com/frame.studio12?igsh=ZWdieTk4ZGI4cjll`
- Updated TikTok: `https://vm.tiktok.com/ZS9MrQG9sjXfK-jv0Wd/`
- Updated GitHub: `https://github.com/FrameStudio-cloud`
- Added Blog link under Services column

### Nav (`src/components/Nav.jsx`)
- Added Blog link between Portfolio and Pricing

### WhatsApp Number Updates
- `src/components/Hero.jsx` — WhatsApp button → `wa.me/254793302518`
- `src/components/CTA.jsx` — WhatsApp button → `wa.me/254793302518`
- `src/pages/Contact.jsx` — 2 WhatsApp links → `wa.me/254793302518`

### Keel Desktop App Download Section (`src/components/KeelDownload.jsx`)
- New component added to Portfolio page between project grid and CTA
- Dark section matching site's black-bg style, GSAP scroll-triggered animation
- Left column: "Take Keel Offline" headline, subtitle, 4 feature bullets (native, offline, faster, auto-updates), download buttons (`.exe` + `.msi`), version tag
- Right column: app screenshot from `public/keel thumbnail.png`
- Installers served from `public/downloads/` — direct links, no GitHub

### Release Infrastructure (`public/releases/`)
- Auto-update endpoint: `https://framestudio.co.ke/releases/latest.json`
- Files hosted: `Keel_1.0.0_x64-setup.exe`, `.sig` (Minisign signature), `latest.json`
- Linkers link directly to `/downloads/Keel_1.0.0_x64-setup.exe` (no GitHub)
- Tauri updater in `src-tauri/tauri.conf.json` points to framestudio.co.ke endpoint
- Signing key: `~/.tauri/keel.key` (password: `keel-updater-key`)
- **New version flow**: `.\release.ps1 -Version "1.0.1" -Notes "Bug fixes"` — builds, signs, updates manifest, bumps version in KeelDownload component
- Script path: `release.ps1` at repo root

### Terms & Privacy Pages
- `src/pages/Terms.jsx` — Full 17-section Terms of Service from legal docx
- `src/pages/Privacy.jsx` — Full 13-section Privacy Policy (Kenya Data Protection Act 2019)
- Replaced "under construction" placeholders on both pages

### SEO & Crawlability (July 2026)
- `public/robots.txt` — Allows all crawlers, points to sitemap
- `public/sitemap.xml` — Lists all 12 routes with priorities and changefreq
- `react-helmet-async` installed — all 12 pages have unique `<Helmet>` blocks with title, description, OG tags, Twitter card, canonical URL
- Home page also includes JSON-LD structured data (`WebSite` + `Organization` schemas)
- Prerendering via `prerender.js` (Puppeteer) — generates static HTML for every route at build time via `npm run build:prerender`
- GSAP ScrollTrigger handled by scrolling through the full page height during prerender capture
- Prerender output written to `dist/<route>/index.html` for each route; the root `/` overwrites `dist/index.html`
- `prerender.js` serves files from `dist/` via Node `http` module and renders each route with Puppeteer (`headless: true`, 1440×900 viewport)

### Mobile Nav Redesign & Hero Fix (`src/components/Nav.jsx`, `src/components/Hero.jsx`)
- Hero: Added `pt-16 md:pt-[72px]` so content clears the fixed nav on mobile viewports
- Nav: Replaced basic conditional mobile menu with full-screen overlay
- Overlay: `bg-black/95 backdrop-blur-md`, GSAP open animation (fade in + stagger links), GSAP close (fade out)
- Overlay placed as sibling outside `<nav>` to avoid `backdrop-filter` containing-block bug that trapped `position: fixed` elements
- Hamburger button: `relative z-50` to stay clickable above overlay
- Close animation: `gsap.to()` + `gsap.set()` instead of `timeline.reverse()` to avoid cleanup race condition

## Known Issues
- Blog has no individual post pages — cards are self-contained
- Contact form has no backend — just a submitted state toggle
- Keel project lives at `C:\Users\Administrator\projects\keel` (separate repo)
- Keel live at `https://keel.framestudio.co.ke`
