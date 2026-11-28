import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Mascot } from 'framestudio-mascot/react'

/**
 * The catch-all route. There is no `*` route anywhere else in App.jsx, so before
 * this existed an unknown URL rendered an empty Layout — nav, footer, and a
 * blank hole between them.
 *
 * The mascot earns its keep here: this is the one page where a character
 * looking back at you is charming rather than distracting, and it competes with
 * nothing.
 */
const WHATSAPP = 'https://wa.me/254793302518?text=Hi%20FrameStudio%2C%20I%20followed%20a%20broken%20link%20on%20your%20site.'

export default function NotFound() {
  return (
    <>
      <title>Page not found — FrameStudio</title>
      <meta
        name="description"
        content="That page doesn't exist. Head back to FrameStudio for websites, WhatsApp bots and dashboards built for Kenyan SMEs."
      />
      {/* A soft 404 must never be indexed as a real page. */}
      <meta name="robots" content="noindex, follow" />

      <section className="relative bg-paper pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Warm ground, so the ball sits in light instead of on sterile white. */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_75%_at_72%_8%,#f3eddf_0%,#fbf8f0_62%)]" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent flex items-center gap-2.5 mb-6">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Error 404
              </p>

              <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.4rem] font-semibold text-ink leading-[0.96] tracking-[-0.03em] text-balance">
                This page <span className="accent-italic">wandered</span> off
              </h1>

              <p className="text-lg md:text-xl text-ink-soft max-w-lg mt-7 leading-relaxed">
                The link is old, the page moved, or the URL has a typo. The mascot
                checked twice and shrugged.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link
                  to="/"
                  className="group bg-accent text-ink hover:bg-accent-deep font-semibold px-7 py-4 rounded-full transition-all inline-flex items-center justify-center gap-2"
                >
                  Back home
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
                <Link
                  to="/services"
                  className="border border-ink/15 text-ink hover:border-ink/40 font-semibold px-7 py-4 rounded-full transition-all inline-flex items-center justify-center gap-2"
                >
                  See what we build
                </Link>
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint mt-8 flex items-center gap-2">
                <MessageCircle size={13} />
                Still lost?
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:text-accent underline underline-offset-4 transition-colors"
                >
                  WhatsApp us
                </a>
              </p>
            </div>

            {/* No `interactive` here. The hover beat tints the eyes toward the
                accent, which on vermilion reads as a pale pink mistake rather
                than a reaction. The prop stays in the package for places where
                the mascot is genuinely something you interact with. */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <Mascot size="clamp(150px, 30vw, 250px)" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
