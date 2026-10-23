/**
 * Demo invoices for the public invoice page.
 *
 * Written in the *database row* shape (snake_case, `amount`, `amount_paid`,
 * `number_seq`) rather than the tidy document shape, so what you review here
 * goes through the same `normalizeInvoice()` the live RPC result will. If the
 * page can render these, it can render production rows.
 *
 * Dates are pinned around Oct 2026 so all the interesting states — due soon,
 * overdue, part paid, paid, cancelled — coexist on one day.
 */

const base = {
  currency: 'KES',
  sent_at: '2026-10-12T08:00:00Z',
  viewed_at: '2026-10-13T09:20:00Z',
}

export const demoInvoices = {
  'demo-sent': {
    ...base,
    id: 'demo-0009',
    number_seq: 9,
    client_name: 'PowerSec Solutions',
    client_email: 'info@powersec.co.ke',
    client_phone: '+254 700 000 003',
    status: 'sent',
    issued: '2026-10-16',
    due: '2026-10-29',
    paid_at: null,
    items: [
      { id: 'i1', name: 'Business website — design & build', qty: 1, price: 55000 },
      { id: 'i2', name: 'Client portal — authentication & dashboard', qty: 1, price: 10000 },
    ],
    subtotal: 65000,
    amount: 65000,
    amount_paid: 0,
    notes: 'Build begins on receipt of the first payment. Thanks for the quick approvals.',
  },

  'demo-partial': {
    ...base,
    id: 'demo-0008',
    number_seq: 8,
    client_name: 'Zuri Fashion',
    client_email: 'info@zurifashion.co.ke',
    client_phone: '+254 700 000 002',
    status: 'partial',
    issued: '2026-10-05',
    due: '2026-11-05',
    paid_at: '2026-10-06',
    items: [
      { id: 'i1', name: 'E-commerce catalogue — phase 1', qty: 1, price: 28000 },
      { id: 'i2', name: 'Inventory sync module', qty: 1, price: 7000 },
    ],
    subtotal: 35000,
    amount: 35000,
    amount_paid: 17500,
    notes: '50% deposit received on 6 Oct. Balance due on delivery.',
  },

  'demo-paid': {
    ...base,
    id: 'demo-0007',
    number_seq: 7,
    client_name: 'Ancy Luxe',
    client_email: 'ancy@ancyluxe.com',
    client_phone: '+254 700 000 001',
    status: 'paid',
    issued: '2026-10-01',
    due: '2026-10-15',
    paid_at: '2026-10-03',
    items: [
      { id: 'i1', name: 'Mini-catalogue website — design & build', qty: 1, price: 38000 },
      { id: 'i2', name: 'Domain & hosting (1 year)', qty: 1, price: 7000 },
    ],
    subtotal: 45000,
    amount: 45000,
    amount_paid: 45000,
    notes: 'Thank you for choosing FrameStudio. Payment via M-Pesa or bank transfer.',
  },

  'demo-overdue': {
    ...base,
    id: 'demo-0006',
    number_seq: 6,
    client_name: 'Mini Electricals',
    client_email: 'minielec@gmail.com',
    client_phone: '+254 700 000 004',
    status: 'sent',
    issued: '2026-09-20',
    due: '2026-10-05',
    paid_at: null,
    items: [
      { id: 'i1', name: 'Website maintenance — September', qty: 1, price: 12000 },
      { id: 'i2', name: 'Product photography — 12 items', qty: 1, price: 6000 },
    ],
    subtotal: 18000,
    amount: 18000,
    amount_paid: 0,
    notes: 'Monthly retainer — September 2026.',
  },

  'demo-cancelled': {
    ...base,
    id: 'demo-0005',
    number_seq: 5,
    client_name: 'Lumière Hair',
    client_email: 'lumiere@gmail.com',
    client_phone: '+254 700 000 006',
    status: 'cancelled',
    issued: '2026-09-02',
    due: '2026-09-30',
    paid_at: null,
    items: [{ id: 'i1', name: 'Portfolio site with booking', qty: 1, price: 15000 }],
    subtotal: 15000,
    amount: 15000,
    amount_paid: 0,
    notes: 'Cancelled — client paused the project until January.',
  },

  'demo-draft': {
    ...base,
    id: 'demo-0010',
    number_seq: 10,
    client_name: 'Campus Glow',
    client_email: 'hello@campusglow.com',
    client_phone: '+254 700 000 005',
    status: 'draft',
    issued: '2026-10-22',
    due: null,
    paid_at: null,
    items: [
      { id: 'i1', name: 'Online store — setup & product upload', qty: 1, price: 24000 },
      { id: 'i2', name: 'Booking form integration', qty: 1, price: 4000 },
    ],
    subtotal: 28000,
    amount: 28000,
    amount_paid: 0,
    notes: '',
  },

  // The state a customer lands on after returning from Paystack: the money has
  // cleared and the page should congratulate them, not ask again.
  'demo-just-paid': {
    ...base,
    id: 'demo-0011',
    number_seq: 11,
    client_name: 'Nairobi Coffee Collective',
    client_email: 'accounts@nairobicoffee.co.ke',
    client_phone: '+254 712 345 678',
    status: 'paid',
    issued: '2026-10-12',
    due: '2026-10-26',
    paid_at: '2026-10-23',
    items: [
      { id: 'i1', name: 'Branch website — design & build', qty: 1, price: 78000 },
      { id: 'i2', name: 'Online ordering with M-Pesa checkout', qty: 1, price: 32000 },
      { id: 'i3', name: 'Menu & inventory dashboard', qty: 1, price: 17500 },
    ],
    subtotal: 127500,
    discount: 5000,
    tax: 0,
    amount: 122500,
    amount_paid: 122500,
    notes: 'Quote valid for 30 days. Thank you for the deposit.',
  },
}

/** The review switcher on `/invoice/demo`. */
export const demoStates = [
  { key: 'sent', label: 'Awaiting payment', token: 'demo-sent' },
  { key: 'partial', label: 'Part paid', token: 'demo-partial' },
  { key: 'paid', label: 'Paid', token: 'demo-paid' },
  { key: 'overdue', label: 'Overdue', token: 'demo-overdue' },
  { key: 'cancelled', label: 'Cancelled', token: 'demo-cancelled' },
  { key: 'draft', label: 'Draft', token: 'demo-draft' },
  { key: 'just-paid', label: 'Just paid', token: 'demo-just-paid' },
  { key: 'not-found', label: 'Not found', token: null },
]

export function demoTokens() {
  return demoStates.map((s) => s.token).filter(Boolean)
}
