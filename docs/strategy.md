# FrameStudio — Market Research & Portfolio Strategy

> Working document. Captures the research and decisions from the strategy sessions.
> Last updated: November 2026.

---

## 1. Purpose

Two questions drove this document:

1. Which Kenyan businesses are **currently buying** websites, and which will **need one soon**?
2. What should FrameStudio build first, given the goal is a **portfolio that earns trust** and a business that is repeatable rather than one-off custom work?

The conclusion is that the answer is not a single niche. It is a **design system + a 10-site portfolio + one productized recurring offer**.

---

## 2. How the research was done

There is no public dataset of "who is buying websites." So three proxies were used, plus a local audit:

| Method | What it measures |
|---|---|
| Market scan | Which industries Kenyan agencies dedicate service pages and case studies to — a proxy for close rates |
| Local saturation audit | Actual Thika businesses, checked category by category for who already has a working site |
| Primary data | Kiambu County's Thika Municipality business registry (1,859 licensed businesses) |

**Caveat:** several sources found during the scan are agency marketing pages, not neutral research. Vendor claims are marked as such below.

---

## 3. The core insight

**The clearest predictor of who buys a website is not the industry — it is where their money already comes from.**

Businesses whose revenue already flows through a platform that takes a cut (Booking.com, Airbnb, Glovo, Instagram DMs) buy websites, because the site has an arithmetic ROI they can feel. Businesses that live on foot traffic (salons, walk-in dentists) mostly do not, no matter how bad their web presence is.

This reframes the sales pitch from *"you need a website"* to *"you are paying commission you don't have to."*

---

## 4. Sector findings

| Sector | Buying signal | Evidence | Verdict |
|---|---|---|---|
| **Short-stay / guesthouses** | Very strong | ~9,900–10,080 active Airbnb listings in Kenya; ~102,000 stays in 12 months to Oct 2026; 62% of Nairobi listings are multi-property hosts; OTA commission 15–30% | **Best** |
| **Clinics / dental** | Strong nationally | Agencies all target it; high value per patient | **Saturated locally** |
| **Restaurants / cafés** | Medium | Glovo / Uber Eats own discovery; 25–30% commission | Thin margins |
| **Schools** | Seasonal, strong Nov–Jan | January intake decisions happen now | Slow sales cycle |
| **Salons / spas** | Weak | Almost none have sites — because they don't need one | Skip |
| **Real estate / property management** | Strong | Listings + viewing bookings | Good second target |

### Key supporting data points

- Kenya has **7M+ MSMEs** (KNBS), employing over 80% of the workforce.
- **Fewer than 30% have a professional website** — *vendor claim (Tupate Studio), treat as directional.*
- One older Nairobi SME survey found **43% had no functioning website**, 31% were static, 22% were interactive.
- **~10,000 Airbnb listings** nationally, **51 towns** with 100+ homes.
- **December** is the busiest short-stay month nationally; Nairobi and Mombasa peak in December, Watamu/Diani in August.
- Short-stay commission is consistently cited at **15–20%** (Airbnb/Booking), with hotels paying up to **30%** through OTAs.

---

## 5. Thika saturation audit (primary evidence)

Checked category by category for who actually has a working site.

| Category | Sampled | Have own site | Read |
|---|---|---|---|
| Dental clinics | 7 | ~5 (Maxx, Heights, Primax, Nomad, Arrow) | **Saturated — do not enter** |
| Guesthouses | ~12 | 2 (The Hub, Edgewood — both well built) | **Wide open** |
| Restaurants | ~30 on Glovo | 1 own ordering site (Thika Greens) | Open, but low value |
| Salons | 26 listed | ~0 | Open, but no budget |

**Read:** the easy-sounding niches are the ones already taken. Dental is done. Salons have no budget. Hospitality is the gap — with the added note that the two Thika guesthouses that *do* have sites set a high bar, so a generic template will not win there.

---

## 6. Recommended direction (v1)

### Primary recommendation
**Direct-booking sites for short-stay hosts and guesthouses.**

- Booking calendar + availability, photo-led rooms, **M-Pesa deposit via STK push**, WhatsApp handoff, small owner dashboard
- Reuses existing assets: Supabase, the Paystack/M-Pesa plumbing from the invoice system, Keel's multi-tenant dashboard pattern
- Price at **KES 45,000–60,000 + KES 1,500/month** — lifts the floor above the current KES 15,000 Starter tier
- Pitch math: KES 5,000/night × 10 nights/month × 18% commission ≈ **KES 9,000/month lost**. Pays back in ~5 months.

**Honest caveat for the sales deck:** direct booking wins **repeat and corporate guests**, not first-time discovery. Never promise it replaces Airbnb.

### Runner-up
**Keel-powered retail storefront** — live inventory → site → WhatsApp bot. Highest asset reuse and sells to existing customers, but a weaker visual portfolio piece.

### Pipeline play (not a quick win)
**School admissions sites** — right season, wrong speed. Board approval cycles make this a 3-month sale.

### Explicitly skipped
- **Dental / clinic sites** — saturated in Thika
- **Salon sites** — no budget at this price point
- **Restaurants** — Glovo owns discovery, margins too thin to justify a 30k build
- **POS** — hardware and on-site support will consume more than it earns

---

## 7. Market ladder: what SMEs actually buy

| Layer | What it is | Willingness to pay | FrameStudio edge |
|---|---|---|---|
| **Front store** | 1–3 page site, catalogue, WhatsApp button | 5k–15k one-off | Commodity — race to the bottom |
| **Order capture** | Site → cart → WhatsApp order logged | 20k–30k | Strong |
| **Payments** | M-Pesa STK / deposit at checkout | 30k–45k | Strong — plumbing already exists |
| **System** | Orders, stock, receipts, debtors | 10k–25k **/month** | Keel |
| **Automation** | Reminders, receipts, review requests, DM replies | 3k–10k **/month** | Highest margin, lowest support |
| **POS** | Hardware + on-site support | — | **Skip** |

**Strategic read:** the front-store site is the **entry product**, not the business. Use it to get in, then the recurring layer is where the money is. Kenyan SMEs will pay a small monthly fee far more readily than a KES 45,000 invoice — which matches the observed pattern of small businesses balking at 45k.

---

## 8. Design language — glassmorphism + squircle

The intended signature: **glassmorphism + iPhone-style continuous corners**. This is a strong instinct but needs constraints, because the buyers are on Tecno/Infinix-class Android phones over 3G.

### Constraint 1 — blur is expensive
`backdrop-filter` is one of the most expensive operations for a low-end mobile GPU.

- Max **2 blurred surfaces** visible at once
- `blur ≤ 16px`
- **Never animate the blur**
- Never place body text on glass — only labels and headings over a fixed scrim
- Glass over photos fails contrast; glass over a solid brand tint works

### Constraint 2 — the signature is the edges, not the blur
Blur is the trend. **Squircle + hairline + specular highlight** is the craft, and it is cheap to render.

- Continuous-corner radii on a **20 / 24 / 32** scale (SVG squircle mask, not plain `border-radius`)
- Top highlight: `inset 0 1px 0 rgba(255,255,255,.55)` — the "iPhone edge"
- Dual shadows: one tight, one wide ambient, plus a coloured glow behind key cards
- iOS-style spring motion: **220–320ms**, one hero reveal, no scroll-jacking
- Respect `prefers-reduced-motion`
- Performance budget: LCP < 2.5s on 3G, JS < 120KB, AVIF/WebP images, mobile-lite motion

### Build once, reuse ten times
Create **15 primitives**: Card, GlassPanel, Squircle, Button, Input, Sheet, Chip, Nav, Hero, Section, Stat, Gallery, CTA, Footer, Reveal — as Tailwind tokens plus a `design/` folder.

**Why this matters:** 10 sites from one person in 10 days will otherwise become one template with ten colour swaps — which signals "template shop," the opposite of trust.

---

## 9. The 10-site portfolio

One design system, **ten different layout archetypes** (editorial, split, full-bleed, grid, dashboard, single-column). Each site is both a niche to sell into and a capability to point at.

| # | Build | Buyer | Signature capability | Price |
|---|---|---|---|---|
| 1 | Guesthouse / lodge | Short-stay hosts | Live availability + M-Pesa deposit | 45k + 1.5k/mo |
| 2 | **Social seller shop** | TikTok/IG sellers | Catalogue + order + M-Pesa, multi-tenant | 1.5k/mo |
| 3 | Salon / spa | Beauty | Booking + deposit + SMS reminder | 25k + 1k/mo |
| 4 | Clinic | Private practice | Appointment + intake form | 35k |
| 5 | Restaurant / café | Independent food | WhatsApp ordering + delivery zones | 25k |
| 6 | Hardware / agrovet | Traders | Keel-linked catalogue + quote request | 30k |
| 7 | School | Private schools | Admissions + fee structure + gallery | 30k |
| 8 | Property agent | Real estate | Listings + viewing requests | 35k |
| 9 | Wedding / events vendor | Event businesses | Gallery + availability + deposit | 20k |
| 10 | Professional services | Law / accounting | Authority site + lead capture | 25k |

Sites **1–3 are deep builds** (live backend, real interaction). The other seven are 1–3 pages, each with **one** real interaction.

---

## 10. 10-day execution plan

| Day | Work |
|---|---|
| 0 (half day) | Design tokens, 15 primitives, 5 layout archetypes, page shell. **No site work.** |
| 1 | Site 1 — Guesthouse (hardest, proves the kit) |
| 2 | Site 2 — Social seller shop (the product) |
| 3 | Site 3 — Salon (reuses booking from Site 1) |
| 4–10 | One shallow site per day, in the order above |

**Per-site non-negotiables:**
- Real copy, no lorem ipsum
- 3+ real photographs
- Mobile QA on an actual cheap Android
- Lighthouse ≥ 90
- A CTA that does something real

**Each evening:** deploy to `demos.framestudio.co.ke/<slug>` and post one build clip.

---

## 11. The real opportunity: the TikTok/IG seller

### Who they are
Not "small businesses" in the abstract. A specific seller type: **one to three people, 5k–100k followers, selling only through IG DMs, TikTok Lives and WhatsApp.** Thrift and mitumba, skincare and wigs, phone accessories, custom cakes, Ankara, personalised gifts, home bakers. Revenue typically **KES 50k–500k/month**.

They have already solved the two hardest problems — **audience and demand**. What they lack is infrastructure.

### What their day looks like
1. Post a video or go live
2. Comments and DMs flood in: *"price?"*
3. Reply one by one, often with a screenshot of a price list
4. *"Do you have it in black?" "How much to Nakuru?"*
5. Quote, then paste their M-Pesa number
6. Buyer says *"sending"* — some don't
7. Screenshot the payment, ask for the address
8. The order lives in a WhatsApp thread or a notebook
9. Pack and courier
10. *"Where is my order?"* — scroll to find the chat

Nothing is recorded. At month end they cannot say what sold, what is left, or who still owes them. And Instagram throttles accounts sending too many new DMs — so the manual model has a hard ceiling.

### Why the 45k website never sold them
Because it solves a problem they do not have. They do not need "a website." They need **fewer DMs, faster payment, and a record of orders.** A website is corporate vocabulary. Many have also been burned by designers who took a deposit and vanished, and they do not want to learn a dashboard.

Their operating system is WhatsApp plus a bio link. Anything that asks them to leave those two places loses.

### The product
A link-in-bio shop that sits **beside** Instagram, not instead of it:

- Mobile-first shop page: products, prices, variants, stock status
- Tap a product → **"Order on WhatsApp"** with a prefilled message, or **"Pay deposit"** via M-Pesa STK
- Orders in one list: new → paid → packed → shipped → delivered
- Auto-receipt on payment; auto "where is my order" reply
- Shareable link + QR for Lives and stories
- Later: an auto-reply bot for the ten questions they answer daily

**One-sentence promise:** *"Your followers already want to buy. Give them a link that shows prices, takes M-Pesa, and puts every order in one list."*

### Why it is a better business than custom sites

| | Guesthouse site | Seller shop |
|---|---|---|
| Price | 45k one-off | 1,500/mo recurring |
| Sales cycle | 3 weeks, meetings | Self-serve, minutes |
| Builds | Custom each time | Once, then tenants |
| Scale | 1 client at a time | 100 sellers, same code |
| Support | Low | Higher — this is the tax |

100 sellers × KES 1,500 = **KES 150,000/month recurring** on roughly KES 6,000 of infrastructure.

**Important distinction:**
- The **guesthouse** is the better *portfolio piece* — it proves craft.
- The **seller shop** is the better *company* — it proves product thinking and recurring revenue.
- Both are needed, which is why they are deep builds #1 and #2.

### Honest risks
1. **Churn.** If a seller gets no orders in two weeks, they cancel. First order within 48 hours of signup is the whole game.
2. **Their photos are bad.** A shop built from blurry WhatsApp images looks worse than their feed, and FrameStudio gets blamed. Photography becomes a requirement or an upsell.
3. **WhatsApp's free catalogue is the real competitor** — and it is improving. The wedge is what it does not do: a public link, order records, statuses, deposits, analytics. Never pitch it as a replacement.
4. **Payments.** Collecting into a FrameStudio account creates reconciliation and trust problems. Simpler: deposits go to the seller's own M-Pesa / Paystack subaccount, and FrameStudio only records the order.
5. **Platform risk.** If Meta ships native checkout for Kenyan sellers, the wedge narrows. Staying on the *operations* side (orders, stock, records) is safer than the *checkout* side.

### Cheap validation
Build one shop for one real seller, free. Instrument exactly three numbers:

- Link clicks
- Orders created
- Days to first order

Then repeat for five sellers.

**Kill criteria:** if fewer than 3 of 5 are still using it weekly after two weeks, the product is wrong — not the marketing. Start charging from seller six.

---

## 12. How the portfolio becomes clients

1. **Portfolio becomes a menu.** Every project page gets a "Get this" button → opens WhatsApp with the project name prefilled.
2. **Post the build, not the result.** Screen recordings of the WhatsApp order landing in a dashboard, the M-Pesa prompt firing, the 3-second load on 3G. Ten days of build-in-public is itself the marketing.
3. **Lead with the number, not the design.** "This guesthouse stops paying 18% to Booking.com on repeat guests." "This seller answered 200 DMs with 0 staff."
4. **Keep every demo live forever.** A screenshot proves nothing; a clickable demo is the trust asset.

---

## 13. Open decisions

- [ ] Design system spec first, or 10-site build sheet first? *(Recommendation: design system — all ten depend on it.)*
- [ ] Real client or concept demo for site #1?
- [ ] Market focus: Thika/Kiambu guesthouses, or coast/Naivasha short-stays?
- [ ] Is the goal inbound client work, or the recurring seller-shop product?

---

## 14. Source notes

- **AirROI** — Kenya Airbnb market data, 12 months to October 2026 (listings, stays, seasonality, occupancy).
- **Kiambu County** — Thika Municipality Business Database (1,859 licensed businesses).
- **KNBS** — MSME count and employment share (7M+, 80%+).
- **Tupate Studio** — "<30% have a professional website" — *vendor claim, directional only.*
- **Academia.edu SME surveys (Nairobi)** — 43% no functioning website; 63.8% reported market share gains from online marketing.
- Agency industry pages (Quest Web, HostingKE, Microstation, Zennys, Trulink) — used only as a proxy for which sectors are actively being sold to; their performance statistics are marketing claims.
- Local audit performed November 2026 via public search: Thika dental clinics, guesthouses, restaurants (Glovo listings), salons (directory listings).
