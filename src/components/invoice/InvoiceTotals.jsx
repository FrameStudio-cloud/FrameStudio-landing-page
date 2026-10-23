import { formatKES } from '../../lib/invoice'

function TotalsRow({ label, value, emphasis = false, tone }) {
  const toneClass =
    tone === 'amber' ? 'text-amber-700' : tone === 'emerald' ? 'text-emerald-700' : ''
  return (
    <div
      className={[
        'flex items-baseline justify-between gap-4',
        emphasis ? 'pt-2 text-base font-semibold text-slate-900' : 'text-sm text-slate-500',
        toneClass,
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

/**
 * Subtotal → discount → tax → total → paid → balance.
 *
 * Zero rows are dropped, so a simple invoice shows two lines. "Balance due" is
 * last and loudest on purpose — it is the only number the customer came for.
 */
export default function InvoiceTotals({ invoice, className = '' }) {
  const { subtotal = 0, discount = 0, tax = 0, total = 0, amountPaid = 0 } = invoice || {}
  const balance = Math.max(total - amountPaid, 0)

  return (
    <div className={`ml-auto w-full max-w-[260px] space-y-1.5 ${className}`}>
      <TotalsRow label="Subtotal" value={formatKES(subtotal)} />
      {discount > 0 && <TotalsRow label="Discount" value={`− ${formatKES(discount)}`} />}
      {tax > 0 && <TotalsRow label="Tax" value={formatKES(tax)} />}
      <div className="border-t border-slate-200" />
      <TotalsRow label="Total" value={formatKES(total)} emphasis />
      {amountPaid > 0 && (
        <TotalsRow label="Amount paid" value={`− ${formatKES(amountPaid)}`} tone="emerald" />
      )}
      {balance > 0 && amountPaid > 0 && (
        <div className="flex items-baseline justify-between gap-4 border-t border-slate-200 pt-1.5 text-sm font-semibold text-amber-700">
          <span>Balance due</span>
          <span className="tabular-nums">{formatKES(balance)}</span>
        </div>
      )}
    </div>
  )
}
