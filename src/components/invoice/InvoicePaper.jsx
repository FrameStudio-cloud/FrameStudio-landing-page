import { balanceDue, formatDate, formatKES, invoiceNumber } from '../../lib/invoice'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceTotals from './InvoiceTotals'

/**
 * The invoice itself.
 *
 * A fixed light "paper" palette, not theme tokens: an invoice is a white
 * document, it is what the customer prints, and it must match the copy the
 * dashboard shows and the PDF that gets emailed. It is intentionally the same
 * markup as `framestudio-dashboard/src/components/invoices/InvoiceDocument.jsx`
 * — one invoice, one look, wherever it is opened.
 */
export default function InvoicePaper({ invoice, className = '' }) {
  if (!invoice) return null

  const stamp =
    invoice.status === 'paid' ? 'PAID' : invoice.status === 'cancelled' ? 'CANCELLED' : null
  const balance = balanceDue(invoice)
  const cancelled = invoice.status === 'cancelled'

  return (
    <article
      data-invoice-document
      className={`relative min-w-0 overflow-hidden rounded-[18px] bg-white text-slate-900 ring-1 ring-black/5 ${className}`}
    >
      <div className="p-5 sm:p-9">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-sm">
              F
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight tracking-tight">FrameStudio</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Websites · Bots · Dashboards</p>
              <div className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-slate-500">
                <p>framestudio.co.ke</p>
                <p>email.framestudio@gmail.com</p>
                <p>+254 793 302 518</p>
              </div>
            </div>
          </div>

          <div className="w-full text-left sm:w-auto sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Invoice
              </p>
              {stamp && (
                <span
                  className={[
                    'rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]',
                    stamp === 'PAID'
                      ? 'border-emerald-600/25 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-slate-50 text-slate-500',
                  ].join(' ')}
                >
                  {stamp}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xl font-bold tracking-tight tabular-nums">
              {invoiceNumber(invoice)}
            </p>
            <div className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-slate-500">
              <p>Issued {formatDate(invoice.issued)}</p>
              {invoice.due && <p>Due {formatDate(invoice.due)}</p>}
            </div>
          </div>
        </header>

        <div className="my-6 border-t border-slate-200" />

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Billed to
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">
              {invoice.clientName}
            </p>
            {invoice.clientEmail && (
              <p className="truncate text-[11px] text-slate-500">{invoice.clientEmail}</p>
            )}
            {invoice.clientPhone && (
              <p className="text-[11px] text-slate-500">{invoice.clientPhone}</p>
            )}
          </div>

          <div className="sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {cancelled ? 'Invoice total' : balance > 0 ? 'Amount due' : 'Amount paid'}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-slate-900">
              {formatKES(cancelled || balance <= 0 ? invoice.total : balance)}
            </p>
            <p className="text-[11px] text-slate-500">
              {cancelled
                ? 'Cancelled — nothing is owed'
                : invoice.amountPaid > 0 && balance > 0
                  ? `of ${formatKES(invoice.total)} total`
                  : balance > 0
                    ? 'Payable online or by M-Pesa'
                    : 'Settled in full — thank you'}
            </p>
          </div>
        </section>

        <InvoiceItemsTable items={invoice.items} className="mt-6" />
        <InvoiceTotals invoice={invoice} className="mt-4" />

        {invoice.notes && (
          <section className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Notes
            </p>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">
              {invoice.notes}
            </p>
          </section>
        )}

        <footer className="mt-8 border-t border-slate-200 pt-4 text-center">
          <p className="text-[11px] font-medium text-slate-600">
            {cancelled
              ? 'This invoice was cancelled and is not payable.'
              : invoice.status === 'paid'
                ? 'Paid in full — thank you for your business.'
                : 'Pay by M-Pesa, bank transfer or card · settle online at framestudio.co.ke'}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            {cancelled || invoice.status === 'paid'
              ? 'Questions? WhatsApp +254 793 302 518 · FrameStudio'
              : 'Questions? WhatsApp +254 793 302 518 · Thank you for your business.'}
          </p>
        </footer>
      </div>
    </article>
  )
}
