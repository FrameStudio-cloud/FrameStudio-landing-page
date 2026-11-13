import { useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useProjects } from '../lib/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { projects, loading } = useProjects()
  const detailRef = useRef(null)

  const project = projects.find((p) => p.slug === slug)
  const projectIndex = projects.findIndex((p) => p.slug === slug)

  const nextProject = useMemo(() => {
    if (!projects.length) return null
    const next = projects[(projectIndex + 1) % projects.length]
    return next?.slug === slug ? null : next
  }, [projects, projectIndex, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50-soft">
            The FrameStudio Work
          </p>
          <p className="font-display text-2xl font-semibold text-ink">Loading…</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50-soft">
            The FrameStudio Work
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink tracking-[-0.02em]">Project not found</h1>
          <p className="text-ink-soft text-sm">This project may have been unpublished.</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-accent uppercase tracking-[0.14em]"
          >
            <ArrowLeft size={13} />
            Back to the work
          </Link>
        </div>
      </div>
    )
  }

  const heroShot = project.screenshots?.[0]

  return (
    <>
      <title>{`${project.title} | The FrameStudio Work`}</title>
      <meta name="description" content={heroShot?.caption || project.excerpt} />
      <meta property="og:title" content={`${project.title} | The FrameStudio Work`} />
      <meta property="og:image" content="https://www.framestudio.co.ke/og-image.png" />
      <meta name="twitter:image" content="https://www.framestudio.co.ke/og-image.png" />
      <meta property="og:description" content={project.excerpt} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={`https://www.framestudio.co.ke/portfolio/${project.slug}`} />

      <div className="bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-16">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-ink/40">
            <Link to="/portfolio" className="inline-flex items-center gap-1.5 hover:text-ink transition-colors">
              <ArrowLeft size={11} />
              The work
            </Link>
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-ink transition-colors">
              FrameStudio
              <ArrowUpRight size={11} />
            </Link>
          </div>

          <header className="mt-10 border-y border-ink/15 py-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                {project.category}
              </p>
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-[0.14em] text-ink/40">
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold leading-[1.02] text-ink tracking-[-0.03em]">
              {project.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft max-w-2xl">{project.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-ink text-xs font-semibold uppercase tracking-[0.16em] px-5 py-3 rounded-full transition-all hover:bg-accent-deep"
                >
                  Visit live site <ArrowUpRight size={14} />
                </a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-ink/20 text-ink text-xs font-semibold uppercase tracking-[0.16em] px-5 py-3 rounded-full transition-all hover:border-ink/60"
              >
                Build something like this <ArrowRight size={14} />
              </Link>
            </div>
          </header>

          <article ref={detailRef} className="mt-12">
            {project.screenshots.length > 0 && (
              <section>
                <div className="flex items-center gap-4">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                    Screens
                  </h2>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="mt-6 space-y-8">
                  {project.screenshots.map((shot, i) => (
                    <figure key={i}>
                      <div className="relative flex justify-center overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                        <img
                          src={shot.url}
                          alt={shot.title || shot.caption || project.title}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="w-auto h-auto max-w-full max-h-[75vh] object-contain"
                        />
                      </div>
                      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3">
                        <span className="text-sm font-semibold text-ink">{shot.title}</span>
                        <span className="hidden sm:block text-[11px] uppercase tracking-[0.14em] text-ink/40">
                          Fig. {String(i + 1).padStart(2, '0')}
                        </span>
                      </figcaption>
                      {shot.caption && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{shot.caption}</p>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-16">
              <div className="flex items-center gap-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                  The system
                </h2>
                <span className="h-px flex-1 bg-ink/10" />
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {project.palette.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">
                      Colour palette
                    </p>
                    <div className="mt-4 space-y-2">
                      {project.palette.map((c) => (
                        <div key={c.name} className="flex items-stretch gap-4 border border-ink/10 rounded-xl p-3">
                          <span
                            className="h-12 w-16 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="text-sm font-bold text-ink">{c.name}</span>
                            <span className="text-xs text-ink/40 font-mono uppercase">{c.hex}</span>
                          </div>
                          {c.role && (
                            <span className="ml-auto hidden sm:inline-block self-center text-xs text-ink-soft max-w-[40%] text-right">
                              {c.role}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.fonts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">
                      Typography
                    </p>
                    <div className="mt-4 space-y-2">
                      {project.fonts.map((f) => (
                        <div key={f.name} className="border border-ink/10 rounded-xl p-5">
                          <span className="text-3xl sm:text-4xl font-bold text-ink block">
                            {f.specimen || 'AaBbCc'}
                          </span>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink">{f.name}</span>
                            {f.role && (
                              <span className="text-[11px] uppercase tracking-[0.14em] text-ink/40">{f.role}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {project.stack.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40 mr-2">
                    Stack
                  </span>
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-full border border-ink/10 px-3 py-1 text-[11px] font-semibold text-ink-soft">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {project.story.length > 0 && (
              <section className="mt-16 max-w-3xl">
                <div className="flex items-center gap-4">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                    The story
                  </h2>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="mt-6">
                  {project.story.map((block, i) => {
                    if (block.type === 'heading') {
                      return (
                        <h3 key={i} className="mt-10 mb-3 font-display text-2xl sm:text-3xl font-semibold leading-snug text-ink tracking-[-0.02em]">
                          {block.text}
                        </h3>
                      )
                    }
                    if (block.type === 'paragraph') {
                      return (
                        <p key={i} className="mt-5 text-[1.0625rem] leading-[1.85] text-ink-soft">
                          {block.text}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
              </section>
            )}
          </article>

          {nextProject && (
            <Link
              to={`/portfolio/${nextProject.slug}`}
              className="group mt-16 flex items-center justify-between border-t border-ink/15 pt-8 transition-colors"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/40">Next project</p>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-ink group-hover:text-accent transition-colors">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          <div className="mt-16 border-t border-ink/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-ink tracking-[-0.02em]">The FrameStudio Work</p>
              <p className="mt-1 text-xs text-ink/40">Post by post. Build by build.</p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink hover:text-accent transition-colors"
            >
              Browse all work <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}