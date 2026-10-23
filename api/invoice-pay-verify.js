import {
  admin,
  isUuid,
  loadInvoiceByToken,
  methodNotAllowed,
  paystack,
  sendJson,
} from './_invoice.js'

/**
 * POST /api/invoice-pay-verify
 * { token: uuid, reference: string }
 *
 * Called when the customer lands back from Paystack (`?reference=…` or
 * `?trxref=…`). Verifies the transaction with Paystack — never trusts the
 * redirect parameters — then records the payment.
 *
 * Idempotent: the unique `reference` index in `invoice_payments` means a reload
 * of the confirmation page cannot record the same money twice.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const token = typeof req.body?.token === 'string' ? req.body.token.trim() : ''
  const reference = typeof req.body?.reference === 'string' ? req.body.reference.trim() : ''

  if (!isUuid(token) || !reference) {
    return sendJson(res, 400, { error: 'Missing invoice or payment reference.' })
  }

  const invoice = await loadInvoiceByToken(token).catch((err) => {
    console.error('invoice-pay-verify: load failed', err)
    return null
  })
  if (!invoice) return sendJson(res, 404, { error: 'This invoice link is not valid.' })

  let transaction
  try {
    transaction = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`)
  } catch (err) {
    console.error('invoice-pay-verify: verify failed', err?.payload || err)
    return sendJson(res, 502, { error: 'We could not confirm the payment with Paystack yet.' })
  }

  if (transaction.status !== 'success') {
    return sendJson(res, 402, {
      error:
        transaction.status === 'abandoned' || transaction.status === 'ongoing'
          ? 'That payment was not completed.'
          : 'Paystack did not accept that payment.',
      code: transaction.status,
    })
  }

  // The reference must belong to *this* invoice, not to any other charge made
  // on the same Paystack account.
  const invoiceId = transaction.metadata?.invoice_id
  if (invoiceId && invoiceId !== invoice.id) {
    return sendJson(res, 409, { error: 'That payment belongs to a different invoice.' })
  }

  const amount = Math.round(Number(transaction.amount) / 100)
  if (!Number.isFinite(amount) || amount <= 0) {
    return sendJson(res, 502, { error: 'Paystack returned an unexpected amount.' })
  }

  try {
    const { data, error } = await admin().rpc('record_invoice_payment', {
      p_invoice_id: invoice.id,
      p_amount: amount,
      p_reference: transaction.reference || reference,
      p_method: 'paystack',
      p_paid_at: transaction.paid_at || new Date().toISOString(),
    })
    if (error) throw error

    const updated = data?.invoice || null
    return sendJson(res, 200, {
      status: updated?.status || 'paid',
      duplicate: Boolean(data?.duplicate),
      amount,
      invoice: updated,
    })
  } catch (err) {
    console.error('invoice-pay-verify: could not record payment', err)
    return sendJson(res, 500, {
      error: 'Your payment went through but we could not save it. Message us and we will fix it.',
    })
  }
}
