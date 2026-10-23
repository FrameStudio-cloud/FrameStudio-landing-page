/**
 * Invoice helpers for the public invoice page.
 *
 * This is a deliberate mirror of `framestudio-dashboard/src/lib/invoiceDoc.js`.
 * The two apps are separate repos and share no build, so the rules are copied
 * rather than imported — but they must stay identical: the dashboard decides
 * what a customer owes, and this page charges it. If you change one, change the
 * other (balance maths, status derivation, currency and number formatting).
 */

export const INVOICE_STATUS_META = {
  draft: { label: 'Not sent', tone: 'muted' },
  sent: { label: 'Awaiting payment', tone: 'info' },
  partial: { label: 'Part paid', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  overdue: { label: 'Overdue', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
}

export const INVOICE_NUMBER_PREFIX = 'FS-INV'

export function invoicePublicUrl(token) {
  if (!token) return ''
  const base = import.meta.env.VITE_INVOICE_BASE_URL || 'https://www.framestudio.co.ke'
  return `${base.replace(/\/$/, '')}/invoice/${token}`
}

export function invoiceNumber(inv) {
  const seq = Number(inv?.numberSeq ?? inv?.number_seq ?? 0) || 0
  return `${INVOICE_NUMBER_PREFIX}-${String(seq).padStart(4, '0')}`
}

export function lineTotal(item) {
  const qty = Number(item?.qty) || 1
  const price = Number(item?.price) || 0
  return Math.round(price * qty)
}

export function sumItems(items = []) {
  return (items || []).reduce((sum, item) => sum + lineTotal(item), 0)
}

export function computeTotals({ items = [], discount = 0, tax = 0 } = {}) {
  const subtotal = sumItems(items)
  const total = Math.max(subtotal - (Number(discount) || 0) + (Number(tax) || 0), 0)
  return { subtotal, total }
}

export function balanceDue(inv) {
  return Math.max((Number(inv?.total) || 0) - (Number(inv?.amountPaid) || 0), 0)
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function isOverdue(inv) {
  if (!['sent', 'partial'].includes(inv?.status)) return false
  if (!inv?.due) return false
  if (balanceDue(inv) <= 0) return false
  const due = new Date(`${String(inv.due).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(due.getTime())) return false
  return due < startOfToday()
}

/**
 * "Overdue" is derived at render time, never stored — the customer should not
 * see a stale status because a cron job did not run.
 */
export function effectiveStatus(inv) {
  if (!inv) return 'draft'
  if (['paid', 'cancelled', 'draft'].includes(inv.status)) return inv.status
  return isOverdue(inv) ? 'overdue' : inv.status
}

export function isPayable(inv) {
  const status = effectiveStatus(inv)
  return !['draft', 'cancelled', 'paid'].includes(status) && balanceDue(inv) > 0
}

function normalizeItem(item, index) {
  return {
    id: item?.id ?? `item-${index}`,
    name: String(item?.name ?? item?.description ?? '').trim() || 'Item',
    qty: Number(item?.qty) || 1,
    price: Number(item?.price ?? item?.unit_price ?? item?.unitPrice) || 0,
  }
}

/**
 * One conversion from a DB row to the shape the page renders. Rows created
 * before line items existed (amount + description only) get a single synthetic
 * line so an old invoice still looks like an invoice.
 */
export function normalizeInvoice(row = {}) {
  const rawItems = Array.isArray(row.items) ? row.items : []
  const items = rawItems.length
    ? rawItems.map(normalizeItem)
    : [
        {
          id: 'item-legacy',
          name: String(row.description || '').trim() || 'Professional services',
          qty: 1,
          price: Number(row.amount ?? row.total) || 0,
        },
      ]

  const subtotal = row.subtotal != null ? Number(row.subtotal) || 0 : sumItems(items)
  const discount = Number(row.discount) || 0
  const tax = Number(row.tax) || 0
  const total =
    row.amount != null || row.total != null
      ? Number(row.amount ?? row.total) || 0
      : Math.max(subtotal - discount + tax, 0)

  return {
    ...row,
    id: row.id ?? null,
    items,
    subtotal,
    discount,
    tax,
    total,
    amountPaid: Number(row.amountPaid ?? row.amount_paid ?? row.paidAmount) || 0,
    numberSeq: Number(row.numberSeq ?? row.number_seq) || 0,
    clientName: row.clientName || row.client_name || 'Client',
    clientEmail: row.clientEmail || row.client_email || '',
    clientPhone: row.clientPhone || row.client_phone || '',
    issued: row.issued || null,
    due: row.due || null,
    paidAt: row.paidAt || row.paid_at || null,
    notes: row.notes ?? row.description ?? '',
    shareToken: row.shareToken ?? row.share_token ?? null,
    status: row.status || 'draft',
  }
}

export function formatKES(amount) {
  return `KES ${(Number(amount) || 0).toLocaleString()}`
}

export function formatDate(dateStr, opts) {
  if (!dateStr) return '-'
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? new Date(`${dateStr}T00:00:00`)
    : new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('en-KE', opts || { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Whole days from today to the due date. Negative when overdue. */
export function daysUntilDue(due) {
  if (!due) return null
  const target = new Date(`${String(due).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  return Math.round((target - startOfToday()) / 86400000)
}

/**
 * The one-line answer to "do I need to do anything?". Kept here rather than in
 * the component so the mobile bar, the status strip and the email (later) can
 * all say the same thing.
 */
export function dueCopy(inv) {
  const status = effectiveStatus(inv)
  const days = daysUntilDue(inv?.due)

  if (status === 'paid') return inv?.paidAt ? `Paid ${formatDate(inv.paidAt)}` : 'Paid in full'
  if (status === 'cancelled') return 'This invoice was cancelled'
  if (status === 'draft') return 'Not sent yet'
  if (days == null) return 'Payment due on receipt'
  if (days < 0) {
    const late = Math.abs(days)
    return `Overdue by ${late} day${late === 1 ? '' : 's'}`
  }
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}
