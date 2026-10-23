import { Resend } from 'resend'
import { admin, handleCors, invoiceBaseUrl, methodNotAllowed, sendJson } from './_invoice.js'

/**
 * POST /api/invoice-send
 * Authorization: Bearer <supabase access token>
 * { invoiceId: uuid }
 *
 * Sends the invoice to the client and, in the same step, publishes it: the
 * status moves draft → sent and `sent_at` is stamped. The share link is the
 * token the dashboard already generated, so resending is always safe — it is
 * the same URL, and an already-sent invoice is simply re-emailed.
 */

const FROM = process.env.INVOICE_FROM || 'FrameStudio <noreply@keel.framestudio.co.ke>'

function money(value) {
  return `KES ${(Number(value) || 0).toLocaleString('en-KE')}`
}

function prettyDate(value) {
  if (!value) return ''
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function number(invoice) {
  return `FS-INV-${String(invoice.number_seq || 0).padStart(4, '0')}`
}

function renderEmail({ invoice, link, balance }) {
  const due = invoice.due ? `before ${prettyDate(invoice.due)}` : 'on receipt'
  const rows = (Array.isArray(invoice.items) ? invoice.items : [])
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#334155;font-size:14px;">${escapeHtml(
            item.name || 'Item',
          )}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;text-align:right;white-space:nowrap;">${money(
            (Number(item.price) || 0) * (Number(item.qty) || 1),
          )}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#08080a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:28px 28px 0;">
                <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-0.01em;">FrameStudio</p>
                <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Websites · Bots · Dashboards</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 0;">
                <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;">Invoice ${number(
                  invoice,
                )}</p>
                <p style="margin:10px 0 0;font-size:15px;color:#334155;line-height:1.5;">
                  Hi ${escapeHtml(invoice.client_name || 'there')}, here is your invoice for
                  <strong style="color:#0f172a;">${money(balance)}</strong>, due ${due}.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows}
                  <tr>
                    <td style="padding:12px 0 0;font-size:14px;font-weight:600;color:#0f172a;">Total</td>
                    <td style="padding:12px 0 0;font-size:14px;font-weight:600;color:#0f172a;text-align:right;">${money(
                      balance,
                    )}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <a href="${link}" style="display:inline-block;background:#f59e0b;color:#0b0b0e;text-decoration:none;font-size:14px;font-weight:600;padding:13px 22px;border-radius:10px;">
                  View &amp; pay ${money(balance)}
                </a>
                <p style="margin:14px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
                  Or pay by M-Pesa to <strong style="color:#475569;">0793 302 518</strong> and reply to this email.
                  Card, M-Pesa and bank transfer are all accepted on the link.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 28px;">
                <p style="margin:0;padding-top:16px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;line-height:1.6;">
                  ${escapeHtml(link)}<br />
                  Questions? WhatsApp +254 793 302 518 · framestudio.co.ke
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return methodNotAllowed(res)

  const auth = String(req.headers.authorization || '')
  const accessToken = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!accessToken) return sendJson(res, 401, { error: 'Missing session' })

  const invoiceId = typeof req.body?.invoiceId === 'string' ? req.body.invoiceId : ''
  if (!invoiceId) return sendJson(res, 400, { error: 'invoiceId is required' })

  const db = admin()

  const { data: userData, error: userError } = await db.auth.getUser(accessToken)
  const user = userData?.user
  if (userError || !user) return sendJson(res, 401, { error: 'Session expired. Sign in again.' })

  const { data: invoice, error: loadError } = await db
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (loadError) {
    console.error('invoice-send: load failed', loadError)
    return sendJson(res, 500, { error: 'Could not load the invoice.' })
  }
  if (!invoice) return sendJson(res, 404, { error: 'Invoice not found.' })
  if (!invoice.client_email) {
    return sendJson(res, 422, { error: 'Add the client’s email address first.' })
  }
  if (invoice.status === 'cancelled') {
    return sendJson(res, 409, { error: 'Cancelled invoices cannot be sent.' })
  }

  const balance = Math.max((Number(invoice.amount) || 0) - (Number(invoice.amount_paid) || 0), 0)
  const link = `${invoiceBaseUrl()}/invoice/${invoice.share_token}`

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.error('invoice-send: RESEND_API_KEY is not set')
    return sendJson(res, 500, { error: 'Email is not configured.' })
  }

  try {
    const resend = new Resend(resendKey)
    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: invoice.client_email,
      replyTo: process.env.INVOICE_REPLY_TO || 'email.framestudio@gmail.com',
      subject: `Invoice ${number(invoice)} from FrameStudio — ${money(balance)}`,
      html: renderEmail({ invoice, link, balance }),
      text: `FrameStudio — invoice ${number(invoice)}\n\n${money(balance)} due ${
        invoice.due ? prettyDate(invoice.due) : 'on receipt'
      }.\n\nView and pay: ${link}\n\nOr pay by M-Pesa to 0793 302 518.\nQuestions? WhatsApp +254 793 302 518`,
    })
    if (sendError) throw sendError
  } catch (err) {
    console.error('invoice-send: resend error', err)
    return sendJson(res, 502, { error: 'The email did not send. Try again.' })
  }

  // Publish only after the email actually left, so a failed send does not leave
  // an invoice marked "sent" that the client never received.
  const patch = { sent_at: new Date().toISOString() }
  if (invoice.status === 'draft') patch.status = 'sent'

  const { data: updated, error: updateError } = await db
    .from('invoices')
    .update(patch)
    .eq('id', invoice.id)
    .select('id, status, sent_at, share_token')
    .single()

  if (updateError) {
    console.error('invoice-send: sent but could not mark as sent', updateError)
    return sendJson(res, 200, { sent: true, link, warning: 'Invoice sent, but its status did not update.' })
  }

  return sendJson(res, 200, {
    sent: true,
    link,
    email: invoice.client_email,
    status: updated.status,
    sent_at: updated.sent_at,
  })
}
