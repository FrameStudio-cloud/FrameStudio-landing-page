import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  FileX,
  Loader2,
  MessageCircle,
  Printer,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from 'lucide-react'
import InvoicePaper from '../components/invoice/InvoicePaper'
import StatusChip from '../components/invoice/StatusChip'
import { demoStates } from '../data/invoiceDemo'
import { isDemoToken, loadInvoice, startPayment, verifyPayment } from '../lib/invoiceApi'
import {
  balanceDue,
  daysUntilDue,
  dueCopy,
  effectiveStatus,
  formatDate,
  formatKES,
  invoiceNumber,
  isPayable,
} from '../lib/invoice'

const WHATSAPP = 'https://wa.me/254793302518'
const CONTACT_EMAIL = 'email.framestudio@gmail.com'

const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_34px_-14px_rgba(245,158,11,0.65)] transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a] disabled:cursor-not-allowed disabled:opacity-60'

const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white'

// Frozen so a re-render cannot hand out a new object and re-trigger work.
const IDLE_PAY = Object.freeze({ status: 'idle', notice: false })

function Ambient() {
  return (
    <div
      aria-hidden="true"
      data-invoice-chrome
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-[120px]" />
      <div className="absolute -bottom-32 right-0 h-[420px] w-[560px] rounded-full bg-sky-500/[0.05] blur-[140px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

function PageHeader() {
  return (
    <header data-invoice-chrome className="flex items-center justify-between gap-4 pt-7">
      <Link to="/" className="group flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-black shadow-[0_8px_20px_-8px_rgba(245,158,11,0.8)]">
          F
        </span>
        <span>
          <span className="block text-sm font-bold leading-tight tracking-tight">FrameStudio</span>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/35 sm:block">
            Websites · Bots · Dashboards
          </span>
        </span>
      </Link>

      <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/35">
        <ShieldCheck size={13} className="text-emerald-400/70" />
        <span className="hidden sm:inline">Secure payment</span>
      </span>
    </header>
  )
}

function DemoBar({ activeKey, onSelect }) {
  return (
    <div
      data-invoice-chrome
      className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2"
    >
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/80">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Demo
      </span>
      <span className="text-[11px] text-white/40">Sample invoice — nothing here is real.</span>
      <label className="ml-auto flex items-center gap-2">
        <span className="sr-only">Demo state</span>
        <select
          value={activeKey}
          onChange={(e) => onSelect(e.target.value)}
          className="rounded-md border border-white/10 bg-[#101013] px-2 py-1 text-[11px] text-white/70 outline-none transition-colors hover:border-white/25 focus:border-amber-400/50"
        >
          {demoStates.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function StatusStrip({ invoice }) {
  const status = effectiveStatus(invoice)
  const days = daysUntilDue(invoice.due)
  const trailing =
    status === 'overdue' && days != null
      ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} late`
      : status === 'paid'
        ? invoice.paidAt
          ? `Received ${formatDate(invoice.paidAt)}`
          : 'Settled'
        : dueCopy(invoice)

  return (
    <div data-invoice-chrome className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <StatusChip status={status} />
        <span
          className={`truncate text-xs ${status === 'overdue' ? 'text-rose-300/70' : 'text-white/40'}`}
        >
          {trailing}
        </span>
      </div>
      <span className="flex-shrink-0 font-mono text-[11px] tracking-wider text-white/30">
        {invoiceNumber(invoice)}
      </span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-24 rounded bg-white/[0.05]" />
      </div>
      <div className="h-[520px] rounded-[18px] bg-white/[0.06]" />
      <div className="h-24 rounded-2xl bg-white/[0.05]" />
    </div>
  )
}

function PayPanel({ invoice, onPay, starting, notice }) {
  const balance = balanceDue(invoice)
  const days = daysUntilDue(invoice.due)
  const overdue = effectiveStatus(invoice) === 'overdue'
  const noticeRef = useRef(null)

  // The button sits at the bottom of the panel on a laptop, so an explanation
  // rendered under it would appear off-screen. Bring it into view instead of
  // leaving the click looking like it did nothing.
  useEffect(() => {
    if (notice) noticeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [notice])

  return (
    <section data-invoice-chrome className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur">
        <div className="flex flex-wrap items-end justify-between gap-5 p-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Amount due
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-white">
              {formatKES(balance)}
            </p>
            <p className="mt-1.5 text-xs text-white/40">
              {invoice.due ? `Due ${formatDate(invoice.due)}` : 'Due on receipt'}
              {overdue && days != null && (
                <>
                  <span className="mx-1.5 text-white/15">·</span>
                  <span className="text-rose-300/80">
                    {Math.abs(days)} day{Math.abs(days) === 1 ? '' : 's'} late
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onPay}
            disabled={starting}
            className={`${PRIMARY_BTN} hidden sm:inline-flex`}
          >
            {starting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                Pay {formatKES(balance)}
              </>
            )}
          </button>
        </div>

        {notice && (
          <div
            ref={noticeRef}
            className="flex items-start gap-2.5 border-t border-amber-400/20 bg-amber-400/[0.06] px-5 py-3.5 text-xs leading-relaxed text-amber-100/80"
          >
            <TriangleAlert size={14} className="mt-0.5 flex-shrink-0 text-amber-300/80" />
            <p>
              {notice} Pay by M-Pesa to{' '}
              <span className="font-semibold text-amber-100">0793 302 518</span> or{' '}
              <a
                href={WHATSAPP}
                className="underline decoration-amber-400/40 underline-offset-2 hover:text-white"
              >
                message us
              </a>{' '}
              and we’ll mark it paid.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/10 px-5 py-3 text-[11px] text-white/35">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400/60" />
            Secured by Paystack · card, M-Pesa, bank
          </span>
          <span className="hidden sm:inline">We never see your card details.</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => window.print()} className={GHOST_BTN}>
          <Printer size={13} />
          Save as PDF
        </button>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className={GHOST_BTN}>
          <MessageCircle size={13} />
          Questions? WhatsApp
        </a>
      </div>
    </section>
  )
}

function PaidPanel({ invoice }) {
  return (
    <section data-invoice-chrome className="mt-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Check size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-emerald-200">Paid in full</p>
          <p className="mt-0.5 text-xs text-white/45">
            {formatKES(invoice.total)} received
            {invoice.paidAt ? ` on ${formatDate(invoice.paidAt)}` : ''}
          </p>
        </div>
        <button type="button" onClick={() => window.print()} className={GHOST_BTN}>
          <Printer size={13} />
          Receipt
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] text-white/25">
        Nothing left to do — thank you for working with FrameStudio.
      </p>
    </section>
  )
}

function CancelledPanel() {
  return (
    <section data-invoice-chrome className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-3">
        <XCircle size={16} className="mt-0.5 flex-shrink-0 text-white/40" />
        <div>
          <p className="text-sm font-semibold text-white/80">This invoice was cancelled</p>
          <p className="mt-1 text-xs leading-relaxed text-white/45">
            Nothing is owed on it. If you were expecting a different invoice, message us and we’ll
            sort it out.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-300/90 hover:text-amber-200"
          >
            <MessageCircle size={13} />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}

function ConfirmingCard() {
  return (
    <div
      data-invoice-chrome
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center"
    >
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-amber-300">
        <Loader2 size={18} className="animate-spin" />
      </span>
      <h1 className="mt-4 text-lg font-semibold tracking-tight text-white">
        Confirming your payment…
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/45">
        We’re checking it with Paystack. This takes a few seconds — please don’t close this page.
      </p>
    </div>
  )
}

function NoticeCard({ icon: Icon, title, body, primary }) {
  return (
    <div
      data-invoice-chrome
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center"
    >
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/45">
        <Icon size={18} />
      </span>
      <h1 className="mt-4 text-lg font-semibold tracking-tight text-white">{title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/45">{body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {primary ?? (
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className={PRIMARY_BTN}>
            <MessageCircle size={15} />
            Message us
          </a>
        )}
        <Link to="/" className={GHOST_BTN}>
          <ArrowLeft size={13} />
          framestudio.co.ke
        </Link>
      </div>
    </div>
  )
}

function MobilePayBar({ invoice, onPay, starting }) {
  return (
    <div
      data-invoice-chrome
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0b0e]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Amount due</p>
          <p className="text-lg font-bold leading-tight tabular-nums text-white">
            {formatKES(balanceDue(invoice))}
          </p>
        </div>
        <button type="button" onClick={onPay} disabled={starting} className={PRIMARY_BTN}>
          {starting ? <Loader2 size={15} className="animate-spin" /> : null}
          Pay now
        </button>
      </div>
    </div>
  )
}

function PageFooter() {
  return (
    <footer data-invoice-chrome className="mt-10 border-t border-white/10 pt-5 text-[11px] text-white/25">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p>FrameStudio · Nairobi, Kenya</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white/50">
            {CONTACT_EMAIL}
          </a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-white/50">
            +254 793 302 518
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function Invoice() {
  const { token } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const demo = isDemoToken(token)
  const requestedState = searchParams.get('state')

  // `/invoice/demo` and `/invoice/demo-paid` both land on a demo invoice; the
  // first picks by `?state=`, the second is the state.
  const demoEntry = demo
    ? demoStates.find((s) => s.token === token) ||
      demoStates.find((s) => s.key === requestedState) ||
      demoStates[0]
    : null
  const activeKey = demoEntry ? demoEntry.key : null
  const resolvedToken = demo ? demoEntry.token : token

  // The token is part of the state, not a separate "loading" flag: when the
  // route changes, the stale result simply stops matching and the page is
  // loading again. That avoids a synchronous setState inside the effect (and
  // the flash of the previous invoice it would cause).
  const [loaded, setLoaded] = useState({ token: null, status: 'loading' })
  const [payAttempt, setPayAttempt] = useState({ token: null, ...IDLE_PAY })

  // Paystack sends the customer back here with ?reference= (or ?trxref=).
  const referenceParam = searchParams.get('reference') || searchParams.get('trxref')
  const verifyKey = referenceParam ? `${resolvedToken}:${referenceParam}` : null
  const [verification, setVerification] = useState({
    key: null,
    status: 'idle',
    error: null,
    justPaid: false,
  })

  const result = loaded.token === resolvedToken ? loaded : { status: 'loading' }
  const payState = payAttempt.token === resolvedToken ? payAttempt : IDLE_PAY
  const verifying = Boolean(verifyKey) && verification.key !== verifyKey

  useEffect(() => {
    let cancelled = false
    loadInvoice(resolvedToken).then((next) => {
      if (!cancelled) setLoaded({ token: resolvedToken, ...next })
    })
    return () => {
      cancelled = true
    }
  }, [resolvedToken])

  // Confirm the payment with the server, then show the invoice it returns.
  // The reference is stripped from the URL on success so a reload cannot
  // re-verify (and so the link is shareable in its clean form).
  useEffect(() => {
    if (!verifyKey) return undefined
    let cancelled = false

    verifyPayment({ token: resolvedToken, reference: referenceParam })
      .then((data) => {
        if (cancelled) return
        setVerification({ key: verifyKey, status: 'done', error: null, justPaid: true })
        if (data.invoice) {
          setLoaded({ token: resolvedToken, status: 'ok', invoice: data.invoice })
        }
        const next = new URLSearchParams(searchParams)
        next.delete('reference')
        next.delete('trxref')
        setSearchParams(next, { replace: true })
      })
      .catch((err) => {
        if (cancelled) return
        setVerification({
          key: verifyKey,
          status: 'error',
          error: err?.message || 'We could not confirm the payment.',
          justPaid: false,
        })
      })

    return () => {
      cancelled = true
    }
    // `searchParams`/`setSearchParams` are stable enough for this one-shot
    // confirmation; re-running on every render would re-verify the reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyKey, resolvedToken, referenceParam])

  const invoice = result.status === 'ok' ? result.invoice : null
  const payable = invoice ? isPayable(invoice) : false
  const status = invoice ? effectiveStatus(invoice) : null
  const isJustPaid = activeKey === 'just-paid' || verification.justPaid
  const verifyFailed = verifyKey && verification.key === verifyKey && verification.status === 'error'

  const title = useMemo(() => {
    if (!invoice) return 'Invoice · FrameStudio'
    return `Invoice ${invoiceNumber(invoice)} · FrameStudio`
  }, [invoice])

  const handleDemoChange = (key) => {
    const next = new URLSearchParams(searchParams)
    next.set('state', key)
    setSearchParams(next, { replace: true })
  }

  const handlePay = useCallback(async () => {
    if (payState.status === 'starting') return
    setPayAttempt({ token: resolvedToken, ...IDLE_PAY, status: 'starting' })

    try {
      const res = await startPayment({ token: resolvedToken, invoice })
      if (res.ok && res.authorizationUrl) {
        // Hand off to Paystack; it returns to this URL with ?reference=.
        window.location.assign(res.authorizationUrl)
        return
      }
      setPayAttempt({
        token: resolvedToken,
        ...IDLE_PAY,
        notice: 'Online payment is not switched on for this invoice yet.',
      })
    } catch (err) {
      setPayAttempt({
        token: resolvedToken,
        ...IDLE_PAY,
        notice: err?.message || 'We could not start the payment. Please try again.',
      })
    }
  }, [invoice, payState.status, resolvedToken])

  return (
    <div
      data-invoice-page
      className="relative min-h-screen bg-[#08080a] font-sans text-white antialiased"
    >
      <title>{title}</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={
          invoice
            ? `${formatKES(balanceDue(invoice) || invoice.total)} ${
                payable ? 'due' : status === 'paid' ? 'paid' : 'total'
              }${invoice.due && payable ? ` ${formatDate(invoice.due)}` : ''} · ${invoiceNumber(
                invoice,
              )} from FrameStudio.`
            : 'A FrameStudio invoice.'
        }
      />

      <Ambient />

      <div
        data-invoice-canvas
        className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-32 sm:px-6 sm:pb-12"
      >
        <PageHeader />

        {demo && <DemoBar activeKey={activeKey} onSelect={handleDemoChange} />}

        <main className="mt-6 flex-1">
          {verifying ? (
            <ConfirmingCard />
          ) : (
            <>
              {verifyFailed && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-4">
                  <TriangleAlert size={17} className="mt-0.5 flex-shrink-0 text-amber-300" />
                  <div>
                    <p className="text-sm font-semibold text-amber-200">
                      We couldn’t confirm that payment yet
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                      {verification.error} If money left your account, it is not lost —{' '}
                      <a
                        href={WHATSAPP}
                        className="underline decoration-amber-400/40 underline-offset-2 hover:text-white"
                      >
                        message us
                      </a>{' '}
                      and we’ll confirm it by hand.
                    </p>
                  </div>
                </div>
              )}

              {result.status === 'loading' && <Skeleton />}

              {result.status === 'error' && (
                <NoticeCard
                  icon={RefreshCw}
                  title="We couldn’t load this invoice"
                  body="The connection dropped on the way. Give it another try — if it keeps failing, message us and we’ll send the invoice directly."
                  primary={
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className={PRIMARY_BTN}
                    >
                      <RefreshCw size={15} />
                      Try again
                    </button>
                  }
                />
              )}

              {result.status === 'not-found' && (
                <NoticeCard
                  icon={FileX}
                  title="This invoice link isn’t valid"
                  body="It may have expired, been cancelled, or the address was copied incompletely. Ask us for a fresh link and we’ll resend it straight away."
                />
              )}

              {invoice && status === 'draft' && (
                <NoticeCard
                  icon={Clock}
                  title="This invoice hasn’t been sent yet"
                  body="It’s still being prepared on our side, so there’s nothing to pay here. We’ll send it the moment it’s ready."
                />
              )}

              {invoice && status !== 'draft' && (
                <>
                  <h1 className="sr-only">
                    Invoice {invoiceNumber(invoice)} from FrameStudio for {invoice.clientName}
                  </h1>

                  {isJustPaid && (
                    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                      <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-200">
                          Payment received — thank you
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-white/45">
                          We’ve marked {invoiceNumber(invoice)} as paid. Keep this page, or save it
                          as a PDF, for your records.
                        </p>
                      </div>
                    </div>
                  )}

                  <StatusStrip invoice={invoice} />
                  <div className="animate-fade-in motion-reduce:animate-none">
                    <InvoicePaper
                      invoice={invoice}
                      className="shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
                    />
                  </div>

                  {payable && (
                    <PayPanel
                      invoice={invoice}
                      onPay={handlePay}
                      starting={payState.status === 'starting'}
                      notice={payState.notice}
                    />
                  )}

                  {status === 'paid' && <PaidPanel invoice={invoice} />}
                  {status === 'cancelled' && <CancelledPanel />}
                </>
              )}
            </>
          )}
        </main>

        <PageFooter />
      </div>

      {payable && !verifying && (
        <MobilePayBar
          invoice={invoice}
          onPay={handlePay}
          starting={payState.status === 'starting'}
        />
      )}
    </div>
  )
}
