import { INVOICE_STATUS_META } from '../../lib/invoice'

/**
 * Status on the dark page. The tones are separate from the paper's palette on
 * purpose: this sits on near-black, where `bg-amber-50 text-amber-700` would be
 * invisible.
 */
const TONES = {
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  danger: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
  info: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
  muted: 'border-white/15 bg-white/[0.04] text-white/50',
}

const DOTS = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-sky-400',
  muted: 'bg-white/40',
}

export default function StatusChip({ status = 'sent', className = '' }) {
  const meta = INVOICE_STATUS_META[status] || INVOICE_STATUS_META.sent
  const tone = meta.tone

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${TONES[tone]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />
      {meta.label}
    </span>
  )
}
