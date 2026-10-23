import { createClient } from '@supabase/supabase-js'
import { normalizeInvoice } from './invoice'
import { demoInvoices } from '../data/invoiceDemo'

/**
 * The only place the public invoice page is allowed to get data.
 *
 * Two doors:
 *  - reads: the `get_invoice_by_token` RPC (one invoice per share token, no anon
 *    access to the `invoices` table)
 *  - money: the `/api/invoice-pay-*` functions, which recompute the amount
 *    server-side and verify every transaction with Paystack
 *
 * Demo tokens short-circuit both so the page can be reviewed without a backend.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Empty in production (same origin). Set in `.env` to point the dev server at
// `scripts/dev-api.mjs`, which mounts the Vercel functions locally.
const API_BASE = (import.meta.env.VITE_INVOICE_API_BASE || '').replace(/\/$/, '')

// Its own client rather than the one in `blog.js`: that module caches blog rows
// at import time and has no business owning auth for a payment page.
const client =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
    : null

const RPC = 'get_invoice_by_token'

export function isDemoToken(token) {
  return typeof token === 'string' && token.startsWith('demo')
}

function isUuid(token) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token || '')
}

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(payload.error || 'Something went wrong. Please try again.')
    error.status = res.status
    error.code = payload.code
    throw error
  }
  return payload
}

/**
 * Resolve a share token to an invoice.
 *
 * Returns `{ status: 'ok' | 'not-found' | 'error', invoice? }`. A missing
 * invoice and a broken request are different answers on purpose: one tells the
 * customer the link is dead, the other offers a retry.
 */
export async function loadInvoice(token) {
  if (!token) return { status: 'not-found' }

  if (demoInvoices[token]) {
    return { status: 'ok', invoice: normalizeInvoice(demoInvoices[token]), demo: true }
  }

  if (!client || !isUuid(token)) return { status: 'not-found' }

  try {
    const { data, error } = await client.rpc(RPC, { p_token: token })
    if (error) {
      // PGRST202 = function not found: the backend has not been deployed.
      if (error.code === 'PGRST202' || error.code === '404') return { status: 'not-found' }
      return { status: 'error' }
    }
    const row = Array.isArray(data) ? data[0] : data
    if (!row) return { status: 'not-found' }
    return { status: 'ok', invoice: normalizeInvoice(row) }
  } catch {
    return { status: 'error' }
  }
}

/**
 * Start a payment. The amount is not sent: `invoice-pay-init` re-reads the
 * invoice and charges its current balance.
 */
export async function startPayment({ token }) {
  if (isDemoToken(token)) return { ok: false, reason: 'not-connected' }
  const data = await post('/api/invoice-pay-init', { token })
  return { ok: true, authorizationUrl: data.authorization_url, reference: data.reference }
}

/**
 * Confirm a payment after Paystack sends the customer back. The server verifies
 * with Paystack and records the payment; the result is the updated invoice.
 */
export async function verifyPayment({ token, reference }) {
  const data = await post('/api/invoice-pay-verify', { token, reference })
  return {
    status: data.status,
    duplicate: Boolean(data.duplicate),
    amount: data.amount,
    invoice: data.invoice ? normalizeInvoice(data.invoice) : null,
  }
}
