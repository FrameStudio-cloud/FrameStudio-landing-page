import {
  balanceOf,
  invoiceBaseUrl,
  loadInvoiceByToken,
  payableError,
  paymentReference,
  paystack,
  sendJson,
  methodNotAllowed,
} from './_invoice.js'

/**
 * POST /api/invoice-pay-init
 * { token: uuid, email?: string }
 *
 * → { authorization_url, reference, access_code } for Paystack checkout.
 *
 * The amount is computed here from the invoice row, never trusted from the
 * browser: a customer cannot edit a number in devtools to pay KES 1 for a
 * KES 65,000 invoice.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const token = typeof req.body?.token === 'string' ? req.body.token.trim() : ''
  const fallbackEmail = typeof req.body?.email === 'string' ? req.body.email.trim() : ''

  let invoice
  try {
    invoice = await loadInvoiceByToken(token)
  } catch (err) {
    console.error('invoice-pay-init: could not load invoice', err)
    return sendJson(res, 500, { error: 'Could not load this invoice. Try again in a moment.' })
  }

  const blocked = payableError(invoice)
  if (blocked) {
    return sendJson(res, invoice ? 409 : 404, { error: blocked })
  }

  const amount = balanceOf(invoice)
  const email = invoice.client_email || fallbackEmail
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return sendJson(res, 422, {
      error: 'We need an email address on this invoice to send a receipt.',
      code: 'missing_email',
    })
  }

  const reference = paymentReference(invoice)

  try {
    const data = await paystack('/transaction/initialize', {
      method: 'POST',
      body: {
        email,
        // Paystack works in the currency's subunit: KES 1,500 → 150000.
        amount: amount * 100,
        currency: 'KES',
        reference,
        callback_url: `${invoiceBaseUrl()}/invoice/${token}`,
        metadata: {
          invoice_id: invoice.id,
          invoice_number: `FS-INV-${String(invoice.number_seq || 0).padStart(4, '0')}`,
          token,
          integration: 'framestudio-dashboard',
        },
      },
    })

    return sendJson(res, 200, {
      authorization_url: data.authorization_url,
      access_code: data.access_code,
      reference: data.reference,
    })
  } catch (err) {
    console.error('invoice-pay-init: paystack error', err?.payload || err)
    return sendJson(res, 502, {
      error: 'Paystack could not start the payment. Please try again or pay by M-Pesa.',
    })
  }
}
