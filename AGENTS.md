# AGENTS.md — FrameStudio Landing Page

## Session Context

Vite + React 19 + React Router v7 + Tailwind CSS v3 + GSAP (ScrollTrigger).

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

### Portfolio Page (`src/pages/Portfolio.jsx`)
- Removed all 9 fake/placeholder projects
- Only real project remains: **Keel** (Dashboard — multi-tenant shop management)
- Added thumbnail image from `/keel thumbnail.png`
- Added "Visit Site" link to `https://keel.framestudio.co.ke`

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
- Portfolio tabs (All, Websites, Bots, Dashboards) still show but only "Dashboards" has content
- Blog has no individual post pages — cards are self-contained
- Contact form has no backend — just a submitted state toggle
- Keel project lives at `C:\Users\Administrator\projects\keel` (separate repo)
- Keel live at `https://keel.framestudio.co.ke`
