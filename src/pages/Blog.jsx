import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { useBlogPosts, formatBlogDate, readingTime, kicker } from '../lib/blog'

gsap.registerPlugin(ScrollTrigger)

const SPAN_PATTERN = [7, 5, 4, 4, 4, 6, 6]

function spanFor(index) {
  return SPAN_PATTERN[index % SPAN_PATTERN.length]
}

function coverAspect(span) {
  if (span >= 6) return 'aspect-[16/10]'
  if (span === 5) return 'aspect-[4/3]'
  return 'aspect-[16/11]'
}

function Cover({ post, index, size = 'md', className = '' }) {
  const num = String(index + 1).padStart(2, '0')
  const titleSize =
    size === 'lg'
      ? 'text-3xl sm:text-5xl'
      : size === 'sm'
        ? 'text-xl sm:text-2xl'
        : 'text-2xl sm:text-3xl'

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,90,54,0.16)_0%,transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-paper/25" />
      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-paper/60">
            {kicker(post.tags)}
          </span>
          <span className="font-mono text-sm sm:text-base leading-none text-paper/25">
            {num}
          </span>
        </div>
        <div className="pt-10">
          <h3 className={`font-display font-semibold leading-[1.05] text-paper tracking-[-0.02em] ${titleSize} line-clamp-3`}>
            {post.title}
          </h3>
          <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Read the story
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const { posts, loading } = useBlogPosts()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTag, setActiveTag] = useState('all')
  const heroRef = useRef(null)
  const gridRef = useRef(null)
  const mastheadRef = useRef(null)

  const categories = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)))
    return ['all', ...Array.from(set)]
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchesTag = activeTag === 'all' || (p.tags || []).includes(activeTag)
      if (!matchesTag) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [posts, query, activeTag])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  const updateQuery = (value) => {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (mastheadRef.current) {
          gsap.fromTo(mastheadRef.current,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          )
        }
        if (gridRef.current) {
          gsap.utils.toArray(gridRef.current.children).forEach((cell, i) => {
            gsap.fromTo(cell,
              { y: 24, opacity: 0 },
              {
                y: 0, opacity: 1, duration: 0.7, delay: (i % 4) * 0.07, ease: 'power2.out',
                scrollTrigger: { trigger: cell, start: 'top 92%' },
              }
            )
          })
        }
      })
    })
    return () => ctx.revert()
  }, [posts, filtered])

  return (
    <>
        <title>The FrameStudio Journal — Builders' Notes, Guides & Kenya Tech</title>
        <meta name="description" content="Build notes, honest guides, and on-the-ground insight from FrameStudio. Websites, WhatsApp bots, dashboards, and going digital in Kenya." />
        <link rel="canonical" href="https://www.framestudio.co.ke/blog" />

      <section ref={heroRef} className="relative pt-28 pb-16 md:pt-40 md:pb-24 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,#1a0e0a_0%,#0b0b0b_60%)]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[380px] bg-accent/[0.12] rounded-full blur-[140px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            The FrameStudio Journal
          </p>
          <h1 className="mt-5 font-display text-[3rem] md:text-7xl lg:text-[5.4rem] font-semibold text-paper tracking-[-0.04em] leading-[0.9]">
            Notes from
            <br />
            the <span className="accent-italic text-accent">build.</span>
          </h1>
          <p className="mt-7 text-paper/55 text-lg max-w-xl leading-relaxed">
            Build notes, honest guides, and on-the-ground insight on websites, WhatsApp bots,
            dashboards, and going digital in Kenya.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div ref={mastheadRef} className="border-b border-ink/15 pt-8 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono text-[10px] text-ink/50 uppercase tracking-[0.2em]">
                  {new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="hidden sm:block font-mono text-[10px] text-ink/30 uppercase tracking-[0.2em]">
                  Issue {String(posts.length).padStart(2, '0')}
                </span>
              </div>
              <div className="relative md:w-64">
                <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search the journal..."
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  className="w-full border-b border-ink/20 bg-transparent py-1.5 pl-6 pr-2 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {categories.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    activeTag === tag
                      ? 'text-accent'
                      : 'text-ink/40 hover:text-ink'
                  }`}
                >
                  {tag === 'all' ? 'All stories' : kicker([tag])}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-32 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-accent" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">Loading the journal…</p>
            </div>
          ) : !featured ? (
            <div className="py-32 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                No stories found{query ? ` for “${query}”` : ''}
              </p>
              <button
                onClick={() => { updateQuery(''); setActiveTag('all') }}
                className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink underline underline-offset-4 hover:text-accent"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            <div ref={gridRef}>
              <div className="py-12 grid gap-8 lg:grid-cols-12 lg:items-center border-b border-ink/10">
                <Link to={`/blog/${featured.slug}`} className="group block lg:col-span-7">
                  <Cover
                    post={featured}
                    index={posts.findIndex((p) => p.slug === featured.slug)}
                    size="lg"
                    className="aspect-[16/10] rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </Link>
                <div className="flex flex-col justify-center lg:col-span-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Cover story
                  </p>
                  <Link to={`/blog/${featured.slug}`} className="group mt-4 block">
                    <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-[1.04] text-ink tracking-[-0.03em] transition-colors group-hover:text-accent">
                      {featured.title}
                    </h2>
                  </Link>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{featured.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                    <span className="text-ink/70">{featured.author}</span>
                    <span>{formatBlogDate(featured.date)}</span>
                    <span>{readingTime(featured)} min read</span>
                  </div>
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="mt-6 inline-flex w-fit items-center gap-2 bg-accent text-ink text-xs font-semibold uppercase tracking-[0.16em] px-5 py-3 rounded-full transition-all hover:bg-accent-deep"
                  >
                    Read the story <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {rest.length > 0 && (
                <section className="py-12">
                  <div className="flex items-center gap-4">
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                      In this issue
                    </h2>
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
                    {rest.map((post, i) => {
                      const span = spanFor(i)
                      const col =
                        span === 4 ? 'lg:col-span-4'
                          : span === 5 ? 'lg:col-span-5'
                            : span === 6 ? 'lg:col-span-6'
                              : 'lg:col-span-7'
                      return (
                        <article key={post.slug} className={`group ${i % 2 === 1 ? 'sm:translate-y-6' : ''} ${col}`}>
                          <Link to={`/blog/${post.slug}`} className="block">
                            <Cover
                              post={post}
                              index={posts.findIndex((p) => p.slug === post.slug)}
                              size={span >= 6 ? 'md' : 'sm'}
                              className={`${coverAspect(span)} rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]`}
                            />
                            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                              {kicker(post.tags)}
                            </p>
                            <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold leading-snug text-ink tracking-[-0.02em] transition-colors group-hover:text-accent">
                              {post.title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                              {post.excerpt}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                              <span>{formatBlogDate(post.date)}</span>
                              <span>{readingTime(post)} min</span>
                            </div>
                          </Link>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )}

              <section className="py-12 border-t border-ink/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-[-0.02em]">
                      Want us to cover a topic?
                    </h2>
                    <p className="mt-2 text-ink-soft">
                      Tell us what you'd like to learn about — we write what we build.
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-ink text-paper font-semibold px-6 py-3.5 rounded-full hover:bg-accent hover:text-ink transition-all w-fit"
                  >
                    Suggest a topic <ArrowUpRight size={16} />
                  </Link>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
