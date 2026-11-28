import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileX,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  RefreshCw,
  Send,
} from 'lucide-react'
import ScopeField from '../components/intake/ScopeField'
import { emailCopy, loadIntake, reportStep, submitAnswers } from '../lib/intakeApi'
import {
  answerSummary,
  formCompleteness,
  normalizeForm,
  openQuestions,
  sectionMissing,
} from '../lib/intake'

const WHATSAPP = 'https://wa.me/254793302518'
const CONTACT_EMAIL = 'email.framestudio@gmail.com'

const PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50'

const GHOST =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/15 px-4 py-2.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink/35 hover:text-ink'

const DRAFT_PREFIX = 'fs-scope-'

/**
 * The scope request a client fills in.
 *
 * A transactional page, like an invoice: no nav, no footer, nothing competing
 * with the next question. The whole design is aimed at one failure mode —
 * somebody opening this on a phone, getting to question eleven, feeling stupid,
 * and closing the tab. So it is stepped, every hard question accepts "not sure
 * yet", and the last screen tells them exactly what happens next.
 *
 * Two rules the code is built around:
 *
 *   * the page never says "thank you" before the database says `submitted` —
 *     `submit_intake` refuses an unfinished form, and a painted-over rejection
 *     is the one bug this page cannot afford.
 *   * a draft is kept locally, so closing the tab on question seven is a pause
 *     rather than lost work. `report_intake_step` tells us where they stopped,
 *     which is what makes a nudge specific.
 */
export default function Start() {
  const { token } = useParams()

  const [result, setResult] = useState({ status: 'loading' })
  const [answers, setAnswers] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState('form') // form | review | done
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copyState, setCopyState] = useState({ status: 'idle' })

  const request = result.request
  const form = useMemo(() => normalizeForm(request?.form), [request?.form])
  const sections = form.sections
  const status = request?.status
  const canEdit = status === 'sent' || status === 'submitted'

  // ─── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const response = await loadIntake(token)
      if (cancelled) return

      if (response.status === 'ok') {
        const saved = readDraft(token)
        const restored = { ...(response.request.answers || {}), ...(saved?.answers || {}) }
        const count = normalizeForm(response.request.form).sections.length
        setAnswers(restored)
        setStepIndex(Math.min(Number(saved?.step) || 0, Math.max(0, count - 1)))
        setPhase(response.request.status === 'sent' ? 'form' : 'done')
      }

      setResult(response)
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  // ─── Keep the draft, and tell the dashboard where they stopped ────────────
  useEffect(() => {
    if (result.status !== 'ok' || phase !== 'form') return
    writeDraft(token, { answers, step: stepIndex })
  }, [answers, stepIndex, result.status, phase, token])

  useEffect(() => {
    if (result.status !== 'ok' || status !== 'sent' || phase !== 'form') return
    const section = sections[stepIndex]
    if (!section) return
    reportStep(token, `${stepIndex + 1}/${sections.length} ${section.title}`)
    // Only when the step changes: `sections` is derived from the loaded row and
    // is stable for the life of this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, phase, result.status, status, token])

  const update = (fieldId, value) => {
    setFieldError(false)
    setError('')
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
  }

  const section = sections[stepIndex]
  const missing = section ? sectionMissing(section, answers) : []
  const gaps = useMemo(() => openQuestions(form, answers), [form, answers])
  const completeness = useMemo(() => formCompleteness(form, answers), [form, answers])
  const summary = useMemo(() => answerSummary(form, answers), [form, answers])

  const next = () => {
    if (missing.length > 0) {
      setFieldError(true)
      setError(
        `Still needed: ${missing.map((field) => field.label).join(', ')}. If you do not know yet, tap “Not sure yet”.`,
      )
      return
    }
    setError('')
    setFieldError(false)
    if (stepIndex < sections.length - 1) {
      setStepIndex((index) => index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setPhase('review')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const back = () => {
    setError('')
    setFieldError(false)
    if (stepIndex > 0) setStepIndex((index) => index - 1)
    else if (status === 'submitted') setPhase('done')
  }

  const submit = async () => {
    setBusy(true)
    setError('')
    const response = await submitAnswers({
      token,
      answers,
      lastStep: 'review',
    })
    setBusy(false)

    if (response.status !== 'ok') {
      setError(response.message || 'We could not save that. Please try again.')
      return
    }

    clearDraft(token)
    setResult({ status: 'ok', request: response.request })
    setPhase('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const editSection = (index) => {
    setStepIndex(index)
    setPhase('form')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onEmailCopy = async () => {
    setCopyState({ status: 'sending' })
    const outcome = await emailCopy({ token })
    if (outcome.ok) setCopyState({ status: 'sent', to: outcome.to })
    else if (outcome.reason === 'demo') setCopyState({ status: 'demo' })
    else setCopyState({ status: 'error', message: outcome.error })
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  const progress = sections.length
    ? Math.round((phase === 'form' ? stepIndex / sections.length : 1) * 100)
    : 0

  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <title>Scope request · FrameStudio</title>
      <meta name="robots" content="noindex, nofollow" />

      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-12 sm:px-6">
        <header className="flex items-center justify-between gap-4 pt-7">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-bold text-paper">
              F
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight tracking-tight">
                FrameStudio
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                {request?.reference || 'Scope request'}
              </span>
            </span>
          </Link>

          {status === 'sent' && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              {phase === 'form' ? `${stepIndex + 1} / ${sections.length}` : 'Review'}
            </span>
          )}
        </header>

        {status === 'sent' && (
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${Math.max(progress, 3)}%` }}
            />
          </div>
        )}

        {result.demo && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-accent/50 bg-accent/10 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">Demo</span>
            <span className="text-[11px] text-ink-soft">
              Sample request. Nothing here is real, and nothing is sent.
            </span>
          </div>
        )}

        <main className="flex-1 pt-6">
          {result.status === 'loading' && <Skeleton />}

          {result.status === 'not-found' && (
            <Notice
              icon={FileX}
              title="This link isn’t valid"
              body="It may have been closed, or the address was copied incompletely. Message us and we will send a fresh one."
            />
          )}

          {result.status === 'error' && (
            <Notice
              icon={RefreshCw}
              title="We couldn’t load this"
              body={result.message || 'The connection dropped on the way. Give it another try.'}
              action={
                <button type="button" className={PRIMARY} onClick={() => window.location.reload()}>
                  <RefreshCw size={15} /> Try again
                </button>
              }
            />
          )}

          {result.status === 'ok' && phase === 'done' && (
            <DoneView
              request={request}
              summary={summary}
              gaps={gaps}
              canEdit={canEdit}
              onEdit={() => editSection(0)}
              onEmail={onEmailCopy}
              copyState={copyState}
              demo={Boolean(result.demo)}
            />
          )}

          {result.status === 'ok' && phase === 'review' && (
            <ReviewView
              form={form}
              summary={summary}
              completeness={completeness}
              gaps={gaps}
              error={error}
              busy={busy}
              onEdit={editSection}
              onBack={() => setPhase('form')}
              onSubmit={submit}
            />
          )}

          {result.status === 'ok' && phase === 'form' && (
            <>
              {sections.length === 0 ? (
                <Notice
                  icon={FileX}
                  title="This request has no questions"
                  body="Something went wrong when it was written. Message us and we will send a fresh link."
                />
              ) : (
                <section key={section?.id} className="animate-fade-in motion-reduce:animate-none">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                    Section {stepIndex + 1} of {sections.length}
                  </p>
                  <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[30px]">
                    {section?.title || 'Untitled section'}
                  </h1>
                  {section?.intro && (
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{section.intro}</p>
                  )}

                  <div className="mt-5 rounded-2xl border border-ink/10 bg-paper p-4 shadow-[0_18px_40px_-30px_rgba(11,11,11,0.5)] sm:p-6">
                    <div className="space-y-6">
                      {section.fields.map((field) => {
                        const isMissing =
                          fieldError && field.required && sectionMissing(section, answers).some(
                            (entry) => entry.id === field.id,
                          )
                        // Choice, multi and links render a group rather than one
                        // control, so their heading is a paragraph with the
                        // group's own aria-label. Everything else gets a real
                        // label tied to the input — tapping the words focuses it.
                        const grouped = ['choice', 'multi', 'links'].includes(field.type)
                        const Heading = grouped ? 'p' : 'label'

                        return (
                          <div key={field.id}>
                            <Heading
                              {...(grouped ? {} : { htmlFor: `${field.id}-input` })}
                              className="block text-[15px] font-semibold leading-snug"
                            >
                              {field.label}
                              {field.required && <span className="ml-1 text-accent-deep">*</span>}
                            </Heading>
                            {field.help && (
                              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-faint">
                                {field.help}
                              </p>
                            )}
                            <div
                              className={`mt-2 rounded-xl ${
                                isMissing ? 'ring-2 ring-rose-400/50 ring-offset-2 ring-offset-paper' : ''
                              }`}
                            >
                              <ScopeField
                                field={field}
                                value={answers[field.id]}
                                onChange={(value) => update(field.id, value)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {error && (
                    <p className="mt-3 rounded-xl border border-rose-300/60 bg-rose-50 px-3 py-2 text-[12.5px] leading-relaxed text-rose-800">
                      {error}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2">
                    {stepIndex > 0 && (
                      <button type="button" className={GHOST} onClick={back}>
                        <ArrowLeft size={13} /> Back
                      </button>
                    )}
                    <button type="button" className={`${PRIMARY} ml-auto`} onClick={next}>
                      {stepIndex === sections.length - 1 ? 'Review your answers' : 'Continue'}
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[11px] text-ink-faint">
                    Your answers are saved on this device as you go. Nothing is sent until you
                    review and submit.
                  </p>
                </section>
              )}
            </>
          )}
        </main>

        <footer className="mt-10 border-t border-ink/10 pt-4 text-[11px] text-ink-faint">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span>FrameStudio · Websites · Bots · Dashboards</span>
            <span className="flex items-center gap-3">
              <a href={WHATSAPP} className="hover:text-ink">
                WhatsApp
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
                Email
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ─── Review ─────────────────────────────────────────────────────────────────

function ReviewView({ form, summary, completeness, gaps, error, busy, onEdit, onBack, onSubmit }) {
  return (
    <section className="animate-fade-in motion-reduce:animate-none">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        Before you send
      </p>
      <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[30px]">
        Here is what we <span className="accent-italic">heard</span>
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
        Read it back. If something is wrong or missing, change it now — this is the version we will
        quote from.
      </p>

      <div className="mt-5 space-y-4">
        {summary.map((section) => {
          const index = form.sections.findIndex((entry) => entry.id === section.id)
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-ink/10 bg-paper p-4 shadow-[0_18px_40px_-30px_rgba(11,11,11,0.5)] sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {section.title}
                </h2>
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-ink-soft hover:bg-ink/5 hover:text-ink"
                >
                  <Pencil size={11} /> Edit
                </button>
              </div>
              <dl className="mt-2 space-y-2">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <dt className="text-[12px] font-medium text-ink-faint">{item.label}</dt>
                    <dd
                      className={
                        item.unknown
                          ? 'text-[14px] italic text-ink-soft'
                          : 'whitespace-pre-wrap text-[14px] leading-relaxed text-ink'
                      }
                    >
                      {item.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}
      </div>

      {gaps.length > 0 && (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-paper px-4 py-3">
          <p className="text-[12px] font-semibold text-ink">
            The {gaps.length} thing{gaps.length === 1 ? '' : 's'} we will settle together
          </p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-faint">
            You said “not sure yet” here. That is fine — it is what the call is for.
          </p>
          <ul className="mt-1.5 space-y-0.5 text-[12.5px] text-ink-soft">
            {gaps.map((gap) => (
              <li key={gap.id}>· {gap.label}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-rose-300/60 bg-rose-50 px-3 py-2 text-[12.5px] leading-relaxed text-rose-800">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" className={GHOST} onClick={onBack} disabled={busy}>
          <ArrowLeft size={13} /> Back to the questions
        </button>
        <button type="button" className={`${PRIMARY} ml-auto`} onClick={onSubmit} disabled={busy}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {busy ? 'Sending…' : 'Send it to FrameStudio'}
        </button>
      </div>

      <p className="mt-3 text-[11px] text-ink-faint">
        {completeness.answered} of {completeness.total} questions answered. Sending this does not
        commit you to anything.
      </p>
    </section>
  )
}

// ─── Done ───────────────────────────────────────────────────────────────────

function DoneView({ request, summary, gaps, canEdit, onEdit, onEmail, copyState, demo }) {
  const declined = request?.status === 'declined'

  return (
    <section className="animate-fade-in motion-reduce:animate-none">
      <div className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_18px_40px_-30px_rgba(11,11,11,0.5)] sm:p-7">
        <span
          className={`grid h-11 w-11 place-items-center rounded-full ${
            declined ? 'bg-ink/10 text-ink-soft' : 'bg-accent text-ink'
          }`}
        >
          {declined ? <FileX size={20} /> : <CheckCircle2 size={20} />}
        </span>

        <h1 className="mt-3 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[30px]">
          {declined ? (
            'This request was closed'
          ) : (
            <>
              We have it. <span className="accent-italic">Thank you.</span>
            </>
          )}
        </h1>

        {declined ? (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            It did not go ahead on our side, so the link is closed. If you would like to talk it
            through, message us — we are happy to say why.
          </p>
        ) : (
          <>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              We will come back within <strong className="text-ink">one working day</strong> with a
              written scope and a price band, plus <strong className="text-ink">30 minutes</strong>{' '}
              to settle what is still open.
            </p>

            {gaps.length > 0 && (
              <div className="mt-4 rounded-xl border border-ink/10 bg-cream/60 px-3.5 py-3">
                <p className="text-[12px] font-semibold text-ink">
                  The 30 minutes will cover {gaps.length} thing{gaps.length === 1 ? '' : 's'}
                </p>
                <ul className="mt-1 space-y-0.5 text-[12.5px] text-ink-soft">
                  {gaps.map((gap) => (
                    <li key={gap.id}>· {gap.label}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
              You do not need to do anything else. If something changes, reply to the email you got
              this link in — or change an answer below while it is still open.
            </p>
          </>
        )}

        {canEdit && (
          <button type="button" className={`${GHOST} mt-4`} onClick={onEdit}>
            <Pencil size={12} /> Change an answer
          </button>
        )}

        {!declined && (
          <div className="mt-4 border-t border-ink/10 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={GHOST}
                onClick={onEmail}
                disabled={copyState?.status === 'sending'}
              >
                {copyState?.status === 'sending' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Mail size={12} />
                )}
                Email me a copy
              </button>

              {copyState?.status === 'sent' && (
                <span className="text-[11.5px] text-emerald-700">
                  Sent to {copyState.to}. Check spam if it is not there in a minute.
                </span>
              )}
              {copyState?.status === 'demo' && (
                <span className="text-[11.5px] text-ink-faint">
                  Demo — no email is sent from a sample request.
                </span>
              )}
              {copyState?.status === 'error' && (
                <span className="text-[11.5px] text-rose-700">{copyState.message}</span>
              )}
            </div>
            {demo && (
              <p className="mt-1.5 text-[10.5px] text-ink-faint">
                A real request emails the answers to the address you typed.
              </p>
            )}
          </div>
        )}
      </div>

      {summary.length > 0 && (
        <details className="mt-4 rounded-2xl border border-ink/10 bg-paper px-4 py-3">
          <summary className="cursor-pointer text-[12px] font-medium text-ink-soft">
            What you sent us
          </summary>
          <div className="mt-3 space-y-3">
            {summary.map((section) => (
              <div key={section.id}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {section.title}
                </p>
                <dl className="mt-1 space-y-1.5">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      <dt className="text-[11.5px] text-ink-faint">{item.label}</dt>
                      <dd className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
                        {item.text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  )
}

// ─── Bits ───────────────────────────────────────────────────────────────────

function Notice({ icon: Icon, title, body, action }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-6 text-center shadow-[0_18px_40px_-30px_rgba(11,11,11,0.5)]">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-ink/5 text-ink-soft">
        <Icon size={20} />
      </span>
      <h1 className="mt-3 font-display text-[22px] font-semibold tracking-[-0.02em]">{title}</h1>
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-soft">{body}</p>
      {action && <div className="mt-4">{action}</div>}
      <a
        href={WHATSAPP}
        className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink"
      >
        <MessageCircle size={13} /> Message us on WhatsApp
      </a>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 motion-reduce:animate-none">
      <div className="h-3 w-24 rounded bg-ink/10" />
      <div className="h-7 w-2/3 rounded bg-ink/10" />
      <div className="h-40 rounded-2xl bg-ink/[0.06]" />
    </div>
  )
}

// ─── Draft storage ──────────────────────────────────────────────────────────
// Local, not server-side: an unsent answer is the client's, and a half-finished
// form is not something to write to a database on every keystroke.

function readDraft(token) {
  try {
    const raw = window.localStorage.getItem(`${DRAFT_PREFIX}${token}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeDraft(token, draft) {
  try {
    window.localStorage.setItem(`${DRAFT_PREFIX}${token}`, JSON.stringify(draft))
  } catch {
    // A full or blocked localStorage is not worth interrupting an answer.
  }
}

function clearDraft(token) {
  try {
    window.localStorage.removeItem(`${DRAFT_PREFIX}${token}`)
  } catch {
    // ignore
  }
}
