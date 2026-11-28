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

## Link previews & crawlers

Social crawlers (WhatsApp, Facebook, X, Slack, LinkedIn) **do not run JavaScript**.
Anything React renders is invisible to them, so the share tags must exist in the
HTML the server returns.

- `index.html` holds the shell-level `og:*` / `twitter:*` block and the
  `og:image` (1200×630). This is the safety net when prerendering fails.
- `index.html` deliberately does **not** contain `<title>`, `meta description`,
  `canonical` or `og:url`. Pages own those. A static copy here wins in document
  order and silently overrides the page's own value (this once made every tab
  read "FrameStudio" and every canonical point at the homepage).
- Pages keep `<title>`, `<meta name="description">` and `<link rel="canonical">`
  only. Do not add per-page `og:*` — the shell already provides it, and
  duplicates are ambiguous.
- `npm run og` rebuilds `public/og-image.png` from `scripts/og-card.html`
  (HTML → Puppeteer, so the card uses the real fonts and tokens). Edit the HTML,
  not the PNG.
- `npm run build:prerender` must log `<N>/<N> routes written with real head tags`.
  N grows with blog posts and portfolio projects, so check that the count matches
  the route list rather than memorising a number. If it logs `PRERENDER SKIPPED`,
  deploys fall back to the shell tags and Google gets an empty page — fix the
  browser launch, don't ignore it.
- After changing the image, re-scrape: Facebook Sharing Debugger, X Card
  Validator, and WhatsApp (which caches aggressively — bump the filename or add
  a query string to force a new fetch).

## Routes

| Path | Component | File |
|---|---|---|
| `/` | Home | `src/pages/Home.jsx` (Hero + Services + WhyUs + CTA) |
| `/services` | Services | `src/pages/Services.jsx` |
| `/seo` | SEO | `src/pages/Seo.jsx` — in the Services dropdown |
| `/about` | About | `src/pages/About.jsx` |
| `/portfolio` | Portfolio | `src/pages/Portfolio.jsx` (only Keel project) |
| `/developers` | Developers | `src/pages/Developers.jsx` — cite-ui showcase (see below) |
| `/developer` | redirect | `Navigate` to `/developers` for singular-URL typos |
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

## Developers Page (`/developers`)

A developer-facing page whose product is **cite-ui**, the React component library
FrameStudio publishes (`npm install cite-ui`, docs at `cite-ui.framestudio.co.ke`,
repo `FrameStudio-cloud/cite-ui`). It is a marketing page, not a second docs site.

Rules that keep it honest:

- **Only link what exists.** npm, the docs, the GitHub repo. Do not add an install
  badge, a download count or a "v1.3 coming" claim that is not true on the day.
- **The demos are rebuilt, not imported.** `src/components/developers/` re-creates
  Toast, `useForm` validation and Drawer with this site's tokens. Installing the
  package would add a React 18 peer to a React 19 app, require scanning
  `node_modules` in `tailwind.config.js`, and drop grey defaults into a
  vermilion/paper page. Each tab's code panel shows the package's real API and
  links to that component's readme section.
- **Status numbers live in `Developers.jsx`.** `39`, `21 kB gzip`, `v2.0.2` in the
  hero terminal. The count is the number of component exports in cite-ui's
  `src/index.jsx` (plus 4 hooks, 6 utilities). Update them with the package, or
  drop the number.
- **The docs preview is a real capture**, `public/developers/cite-ui-docs.png`,
  taken by `npm run docs:shot` from `DOCS` in `Developers.jsx`. The script opens
  `/components/toast`, waits for the page's own heading, then hides the docs'
  sticky header so the landing page's browser chrome is the only nav in the
  image. Re-run it after a docs redesign; the address bar is rendered in React
  from `DOCS`, so a domain move does not need a new image.
- **The docs domain is `cite-ui.framestudio.co.ke`** (Vercel, CNAME via
  host-ww.net). `DOCS` in `Developers.jsx` is the single source for every docs
  link and the screenshot's address bar. `cite-ui.vercel.app` still serves the
  app; set it to redirect in Vercel so the custom domain is canonical. The
  readme and npm `homepage` should match.
- **Toasts and drawer are interactive**, so they carry the same obligations as
  `LiveDemo`: Escape closes the drawer and returns focus to the trigger, toasts
  sit in an `aria-live` region, and `prefers-reduced-motion` skips the GSAP
  entrance (the page is written as the final state, so nothing hides).
- **The team list is local.** `src/lib/team.js` holds the roster; the dashboard's
  `team_members` is RLS-locked and `get_team_roster()` is revoked from anon. Swap
  the body of `fetchTeam()` for a public view/RPC when one exists — the shape is
  already the shape it would return. Open seats are invitations, not people.
- The singular `/developer` redirects, because people type it that way.

## Services Page (`/services`)

Reads as a studio, not a menu: breadth (capabilities), proof (live objects), then three deep dives.

- `src/lib/services.js` — the single source: `SERVICES`, `CAPABILITY_GROUPS`, `INTEGRATIONS`, `AI_WORK`, `PROCESS`. **No prices in this file.** When figures are settled they go in `plans.js` and both this page and `/pricing` read from there; the page currently prints none, only "fixed quote in writing" → `/pricing`.
- `src/components/services/` — `HeroDeck` (tilted cards + floating chips), `ServiceBento` (the 7/5/12 bento: label, headline, one line, and a DOM object), `ServiceConsole` (tablist → `DeviceFrame` / `BotChatDemo` / `DashboardPanel`), `CapabilityIndex` (icon rail + a mechanic card per group), `BrandWall` (the recognition wall, shared with the home page), `objects.jsx` (the shared `DottedGrid` / `FloatChip` / `StatBubble`). `IntegrationsOrbit.jsx` is no longer rendered — see its header.
- **Only the demos sit behind tabs.** All written copy — promises, deliverables, exclusions — is in normal sections, because `prerender.js` captures the open tab and a crawler never sees the others.
- `CapabilityIndex` fragments and the bot chat are **sample data**, labelled as such. No client names, no real phone numbers, nothing that charges.
- `public/logos/` holds real integration marks (downloaded, not hotlinked). The wall is logo-only by design — names live in `sr-only` text, and the Daraja mention stays in the section copy because it has no mark. Only show tools that have actually shipped.
- Tilt is decoration: `sm:` only, hover straightens, and `prefers-reduced-motion` removes the orbit spin and every lift. Rotation is capped at ±6°.
- The three `services-*.jpg/png` mockups are gone — do not reintroduce screenshots of imagined products.

## SEO Page (`/seo`)

Reached from the **Services** dropdown in the nav, the band on the home page, the
footer, and the SEO row in `/services`' capability index.

- `src/pages/Seo.jsx` — hero, five doors, three readers, the report, the close.
- `src/components/seo/Surfaces.jsx` — the five marks (Search, Maps, ChatGPT,
  Gemini, Perplexity) as hairline rows. Marks are real files in `public/logos/`,
  downloaded from simple-icons, monochrome ink: a row of five full-colour logos
  would fight the accent and imply a partnership we do not have.
- `src/components/seo/ReaderPanels.jsx` — the Search / Maps / AI tabs: three
  different artefacts (source rows, a map record, a chat answer), not three
  cards. Arrow keys move the tablist; the written copy stays outside the tabs so
  a crawler sees it.
- `src/components/seo/VisibilityPanel.jsx`, `SalesPanel.jsx`,
  `EngagementPanel.jsx` — the report triptych: a **line**, **columns**, and a
  **ring**, deliberately three different forms. Do not normalise them into three
  identical panels; the variety is the point.
- `src/lib/seo.js` — the surfaces list and their one-line fixes. No prices.

Rules that must survive edits:

- **No section label above a section.** No "Why us ·" pills, no eyebrow with a
  dot. The headline does that job; a label above it is the thing this page was
  asked not to look like.
- **No 3-up or 6-up feature cards.** Sections are a headline, one or two lines,
  and one object. If a section needs four bullet cards, the copy is wrong.
- **Every number is sample data and says so** — panel header, section note, and
  `figcaption`. A growth chart is exactly what a visitor screenshots and
  believes.
- The `/seo` hero uses the search illustration (`public/seo/google-result.webp`,
  transparent cut, 1200×800 WebP) with an "Illustration · not a live search
  result" caption — keep it.
- The home band is **not** an image: `src/components/SeoBand.jsx` is a working
  search field — type what you sell and it becomes the top result, domain and
  all, with "Preview · nothing is sent" beneath it. Nothing is submitted and
  nothing is queried; the field drives one line of text in a mock. Keep the note
  and the sample footer, or a visitor will read it as a real ranking.
- Discoverability is deliberate: the field types its example out once when 50%
  of the panel is on screen (skipped under `prefers-reduced-motion`), any focus
  stops it and hands over the finished sentence, and the whole pill is the
  `<label>` with `cursor-text` so a tap anywhere in it lands the caret. Remove
  any one of those and it reads as a screenshot again.
- `public/seo/google-search-light.webp` is the light cut of the same artwork,
  kept in case the static band is ever wanted back. It is not rendered today.
- Charts are SVG/DOM with GSAP entrances that skip under `prefers-reduced-motion`;
  no chart library, no screenshot of a dashboard.

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
- `src/components/Nav.jsx` — Links: Services (dropdown), Portfolio, Developers, Blog, Pricing, About, Contact + "Get Started"
- `src/components/Footer.jsx` — 4-column footer with social icons (WhatsApp, Instagram, LinkedIn, Facebook, X/Twitter, YouTube, TikTok, GitHub)
- `src/pages/Home.jsx` — Imports Hero, Services, WhyUs, CTA components

### Nav dropdown (`src/components/Nav.jsx`, `src/components/NavDropdown.jsx`)

`navItems` in `Nav.jsx` is the single source for the nav. A flat
`{ to, label }` is a link; an item with a `children` array opens a panel, and
its first child is the parent page itself.

To add a page: one entry in `navItems`, or one child under Services. To add one
that is planned but not built, give the child `soon: true` and no `to` — it
renders as text with a **Soon** chip rather than a dead link, so the nav can
announce what is coming without anyone landing on a 404.

Rules that must survive edits:

- The trigger is a `<button>` with `aria-expanded`/`aria-controls`, not a link.
  Hover *and* click both open it (touch has no hover), `ArrowDown` jumps to the
  first link, `Escape` closes and returns focus to the trigger, and tabbing out
  of the panel closes it. Remove any one and it stops working for keyboard users.
- `soon` children must never become `<Link>`s. The whole point is that the nav
  cannot produce a 404.
- The panel is `bg-paper` even when the nav is transparent over the hero —
  a see-through panel over a dark photo is unreadable.
- Mobile does not repeat the dropdown chrome: the overlay shows the parent
  link and its children as a smaller row beneath it, and every entry keeps the
  `mobile-link` class so the GSAP stagger still covers it.

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
