import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import { useBlogPosts, formatBlogDate, readingTime, kicker } from '../lib/blog'

export default function BlogPost() {
  const { slug } = useParams()
  const { posts, loading } = useBlogPosts()
  const [progress, setProgress] = useState(0)
  const articleRef = useRef(null)

  const post = posts.find((p) => p.slug === slug)
  const postIndex = posts.findIndex((p) => p.slug === slug)

  const related = useMemo(() => {
    if (!post) return []
    const sameTag = posts.filter(
      (p) => p.slug !== post.slug && (p.tags || []).some((t) => (post.tags || []).includes(t))
    )
    const rest = posts.filter((p) => p.slug !== post.slug && !sameTag.includes(p))
    return [...sameTag, ...rest].slice(0, 3)
  }, [post, posts])

  useEffect(() => {
    if (!post) return
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = Math.min(100, Math.max(0, (-rect.top / total) * 100))
      setProgress(pct)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [post])

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50-soft">
            The FrameStudio Journal
          </p>
          <p className="font-display text-2xl font-semibold text-ink">Loading…</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50-soft">
            The FrameStudio Journal
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink tracking-[-0.02em]">Story not found</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-accent uppercase tracking-[0.14em]"
          >
            <ArrowLeft size={13} />
            Back to the journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
        <title>{`${post.title} | The FrameStudio Journal`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | The FrameStudio Journal`} />
        <meta property="og:image" content="https://www.framestudio.co.ke/og-image.png" />
        <meta name="twitter:image" content="https://www.framestudio.co.ke/og-image.png" />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`https://www.framestudio.co.ke/blog/${post.slug}`} />

      <div className="bg-paper">
        <div
          className="fixed left-0 top-0 z-[60] h-0.5 bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />

        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-16">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-ink/40">
            <Link to="/blog" className="inline-flex items-center gap-1.5 hover:text-ink transition-colors">
              <ArrowLeft size={11} />
              The journal
            </Link>
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-ink transition-colors">
              FrameStudio
              <ArrowUpRight size={11} />
            </Link>
          </div>

          <article ref={articleRef} className="mt-10">
            <header className="border-y border-ink/20 py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                {kicker(post.tags)}
              </p>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold leading-[1.02] text-ink tracking-[-0.03em]">
                {post.title}
              </h1>
              <p className="mt-6 font-serif italic text-xl leading-snug text-ink-soft">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-ink/40">
                <span className="font-semibold text-ink">By {post.author}</span>
                <span className="hidden sm:block h-3 w-px bg-ink/20" />
                <span>{formatBlogDate(post.date)}</span>
                <span className="hidden sm:block h-3 w-px bg-ink/20" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  {readingTime(post)} min read
                </span>
              </div>
            </header>

            <div className="mt-8 border border-ink/10">
              <div className="relative aspect-[16/7] bg-ink">
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,90,54,0.18)_0%,transparent_45%)]" />
                <div className="absolute inset-x-0 top-0 h-px bg-paper/25" />
                <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                      {kicker(post.tags)}
                    </span>
                    <span className="text-sm font-medium text-paper/25 tabular-nums">
                      {String(postIndex + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="max-w-2xl font-display text-2xl sm:text-4xl font-semibold text-paper leading-[1.05] tracking-[-0.02em]">
                    {post.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-10">
              {post.content.map((block, i) => {
                if (block.type === 'heading') {
                  return (
                    <h2
                      key={i}
                      className="mt-12 mb-4 font-display text-2xl sm:text-3xl font-semibold leading-snug text-ink tracking-[-0.02em]"
                    >
                      {block.text}
                    </h2>
                  )
                }
                if (block.type === 'paragraph') {
                  const isFirst = i === 0
                  return (
                    <p
                      key={i}
                      className={`mt-5 text-[1.0625rem] leading-[1.85] text-ink-soft ${
                        isFirst ? 'first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-ink' : ''
                      }`}
                    >
                      {block.text}
                    </p>
                  )
                }
                return null
              })}

              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/40 mr-2">Filed under:</span>
                {(post.tags || []).map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-ink/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft hover:border-accent hover:text-ink transition-colors"
                  >
                    {kicker([tag])}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                  Keep reading
                </h2>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                    <div className="relative aspect-[16/11] bg-ink overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,rgba(255,90,54,0.18)_0%,transparent_45%)]" />
                      <div className="relative flex h-full flex-col justify-between p-4">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/50">
                          {kicker(p.tags)}
                        </span>
                        <h3 className="font-display text-sm font-semibold text-paper leading-snug tracking-[-0.01em] line-clamp-3 transition-colors group-hover:text-accent">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-ink/40">
                      {formatBlogDate(p.date)} · {readingTime(p)} min
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 border-t border-ink/15 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-ink tracking-[-0.02em]">The FrameStudio Journal</p>
              <p className="mt-1 text-xs text-ink/40">Written by the people doing the work.</p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink hover:text-accent"
            >
              Browse all stories <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
