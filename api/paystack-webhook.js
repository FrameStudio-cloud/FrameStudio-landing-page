import crypto from 'node:crypto'
import { admin, paystackSecret, sendJson } from './_invoice.js'

/**
 * POST /api/paystack-webhook
 *
 * Paystack's server-to-server confirmation. The redirect back to the invoice
 * page can be lost (closed tab, flaky network), so this is the path that makes
 * a payment durable: verify the signature, then record the payment exactly the
 * same way `invoice-pay-verify` does — idempotent on the reference.
 *
 * Configure the URL in the Paystack dashboard:
 *   https://www.framestudio.co.ke/api/paystack-webhook
 */

// Signature validation needs the exact bytes Paystack signed.
export const config = { api: { bodyParser: false } }

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed' })
  }

  const secret = paystackSecret()
  if (!secret) {
    console.error('paystack-webhook: PAYSTACK_SECRET_KEY is not set')
    return sendJson(res, 500, { error: 'Webhook is not configured' })
  }

  let raw
  try {
    raw = await readRawBody(req)
  } catch (err) {
    console.error('paystack-webhook: could not read body', err)
    return sendJson(res, 400, { error: 'Unreadable body' })
  }

  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex')
  const provided = String(req.headers['x-paystack-signature'] || '')
  const valid =
    provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(provided, 'utf8'), Buffer.from(expected, 'utf8'))

  if (!valid) {
    console.warn('paystack-webhook: signature mismatch')
    return sendJson(res, 401, { error: 'Invalid signature' })
  }

  let event
  try {
    event = JSON.parse(raw.toString('utf8'))
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON' })
  }

  // Everything that is not a successful charge is acknowledged and ignored.
  if (event?.event !== 'charge.success') {
    return sendJson(res, 200, { received: true })
  }

  const data = event.data || {}
  const invoiceId = data.metadata?.invoice_id
  const amount = Math.round(Number(data.amount) / 100)

  if (!invoiceId || !Number.isFinite(amount) || amount <= 0) {
    console.warn('paystack-webhook: charge.success without invoice metadata', data.reference)
    return sendJson(res, 200, { received: true, ignored: true })
  }

  try {
    const { error } = await admin().rpc('record_invoice_payment', {
      p_invoice_id: invoiceId,
      p_amount: amount,
      p_reference: data.reference,
      p_method: 'paystack',
      p_paid_at: data.paid_at || new Date().toISOString(),
    })
    if (error) throw error
    return sendJson(res, 200, { received: true })
  } catch (err) {
    // A 500 makes Paystack retry, which is what we want if the database was
    // briefly unavailable. The unique reference keeps retries safe.
    console.error('paystack-webhook: could not record payment', err)
    return sendJson(res, 500, { error: 'Could not record payment' })
  }
}
