import { createClient } from '@supabase/supabase-js'

/**
 * Shared plumbing for the invoice API functions.
 *
 * Everything here runs on the server with the service role key. The public
 * invoice page never talks to these tables directly — it reads one invoice
 * through the `get_invoice_by_token` RPC and asks these endpoints to charge it.
 *
 * Vercel ignores files whose name starts with `_`, so this is not a route.
 */

export const PAYSTACK_BASE = 'https://api.paystack.co'

export function supabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

export function serviceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

export function paystackSecret() {
  return process.env.PAYSTACK_SECRET_KEY || ''
}

export function invoiceBaseUrl() {
  return (process.env.INVOICE_BASE_URL || 'https://www.framestudio.co.ke').replace(/\/$/, '')
}

export function admin() {
  const url = supabaseUrl()
  const key = serviceRoleKey()
  if (!url || !key) throw new Error('Supabase service credentials are not configured')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'framestudio-invoice-api' } },
  })
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || '')
}

/** The one public read: token in, safe invoice json out (or null). */
export async function loadInvoiceByToken(token) {
  if (!isUuid(token)) return null
  const { data, error } = await admin().rpc('get_invoice_by_token', { p_token: token })
  if (error) throw error
  return Array.isArray(data) ? data[0] || null : data || null
}

export async function paystack(path, { method = 'GET', body, secret } = {}) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret || paystackSecret()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok || payload.status === false) {
    const message = payload.message || `Paystack responded ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.payload = payload
    throw err
  }
  return payload.data
}

export function balanceOf(invoice) {
  return Math.max((Number(invoice?.amount) || 0) - (Number(invoice?.amount_paid) || 0), 0)
}

/**
 * Paystack references allow alphanumerics and `-`, `.`, `=` only. Keeping the
 * invoice number in the reference makes the Paystack dashboard readable and
 * lets support match a payment to an invoice by eye.
 */
export function paymentReference(invoice) {
  const seq = String(invoice?.number_seq || invoice?.id || '').replace(/[^a-z0-9]/gi, '').slice(-8)
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `FSINV-${seq || 'X'}-${stamp}-${rand}`
}

/** Which invoice states may take money. Mirrors `isPayable()` on the page. */
export function payableError(invoice) {
  if (!invoice) return 'This invoice link is not valid.'
  if (invoice.status === 'cancelled') return 'This invoice was cancelled.'
  if (invoice.status === 'draft') return 'This invoice has not been sent yet.'
  if (invoice.status === 'paid' || balanceOf(invoice) <= 0) return 'This invoice is already paid.'
  return null
}

export function sendJson(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

/**
 * The dashboard runs on its own origin and calls `invoice-send` cross-origin.
 * Bearer-token auth means no cookies, so echoing the caller's origin is enough
 * (no credentialed requests, no wildcard-with-credentials hole).
 */
export function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*')
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Max-Age', '600')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}

export function methodNotAllowed(res, allowed = 'POST') {
  res.setHeader('Allow', allowed)
  return sendJson(res, 405, { error: 'Method not allowed' })
}
