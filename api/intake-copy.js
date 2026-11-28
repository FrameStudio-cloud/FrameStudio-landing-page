import { Resend } from 'resend'
import { admin, handleCors, isUuid, methodNotAllowed, sendJson } from './_invoice.js'

/**
 * POST /api/intake-copy
 * { token }
 *
 * Emails the client a copy of what they just sent.
 *
 * The token is the authorization, exactly as it is for the read and the submit:
 * whoever holds the link is the person the request was written for, and the copy
 * only ever goes to the address stored on that row. What that means is the
 * endpoint is a mail-sending button anyone with the link can press, so it is
 * bounded three ways — it refuses anything not yet answered, it refuses when
 * there is no address to send to, and it refuses a second copy within ten
 * minutes (`copy_sent_at`). A refresh or a double tap is harmless; a loop is not.
 *
 * `_invoice.js` is reused for the service client and the CORS/JSON helpers. The
 * name is historical: it is the shared plumbing for every public-function page.
 */

const FROM = process.env.INTAKE_FROM || process.env.INVOICE_FROM || 'FrameStudio <noreply@keel.framestudio.co.ke>'
const REPLY_TO = process.env.INTAKE_REPLY_TO || process.env.INVOICE_REPLY_TO || 'email.framestudio@gmail.com'
const SITE = (process.env.INTAKE_SITE_URL || 'https://www.framestudio.co.ke').replace(/\/$/, '')
const COOLDOWN_MS = 10 * 60 * 1000
const UNKNOWN = '__unknown__'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function reference(row) {
  return `IN-${String(row.number_seq || 0).padStart(4, '0')}`
}

/** The same rendering rules the page uses, in as little code as they need. */
function formatAnswer(value) {
  if (value === UNKNOWN) return { text: 'Not sure yet', unknown: true }
  if (value == null) return { text: '', unknown: false }

  if (Array.isArray(value)) {
    const text = value
      .map((entry) => {
        if (entry && typeof entry === 'object') {
          const url = String(entry.url || '').trim()
          const note = String(entry.note || '').trim()
          if (!url) return ''
          return note ? `${url} — ${note}` : url
        }
        return String(entry ?? '').trim()
      })
      .filter(Boolean)
      .join('; ')
    return { text, unknown: false }
  }

  return { text: String(value).trim(), unknown: false }
}

function sectionsOf(form) {
  const sections = Array.isArray(form?.sections) ? form.sections : []
  return sections.map((section) => {
    const fields = Array.isArray(section.fields) ? section.fields : []
    return { title: String(section.title || ''), fields }
  })
}

function renderEmail({ row, answers }) {
  const gaps = []

  const blocks = sectionsOf(row.form)
    .map((section) => {
      const rows = section.fields
        .map((field) => {
          const { text, unknown } = formatAnswer(answers[field.id])
          if (!text) return ''
          if (unknown) gaps.push(String(field.label || ''))
          return `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;vertical-align:top;color:#64748b;font-size:12px;width:42%;">${escapeHtml(
                field.label || '',
              )}</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:${
                unknown ? '#b45309' : '#0f172a'
              };font-size:13px;line-height:1.5;font-style:${unknown ? 'italic' : 'normal'};">${escapeHtml(text)}</td>
            </tr>`
        })
        .filter(Boolean)
        .join('')

      if (!rows) return ''
      return `
        <tr>
          <td colspan="2" style="padding:18px 0 4px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#94a3b8;">${escapeHtml(
            section.title || 'Questions',
          )}</td>
        </tr>
        ${rows}`
    })
    .filter(Boolean)
    .join('')

  const gapsBlock =
    gaps.length > 0
      ? `
      <tr>
        <td colspan="2" style="padding:20px 0 0;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#0f172a;">
            The ${gaps.length} thing${gaps.length === 1 ? '' : 's'} we will settle together
          </p>
          <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
            ${gaps.map((label) => escapeHtml(label)).join(' · ')}
          </p>
        </td>
      </tr>`
      : ''

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
                <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;">Scope request ${reference(
                  row,
                )}</p>
                <p style="margin:10px 0 0;font-size:15px;color:#334155;line-height:1.5;">
                  Hi ${escapeHtml(row.client_name || 'there')}, here is a copy of what you sent us.
                  Keep it — this is the version we quote from.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${blocks}
                  ${gapsBlock}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7ef;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0;font-size:12px;color:#0f172a;line-height:1.6;">
                        <strong>What happens next:</strong> we come back within one working day with a
                        written scope and a price band, plus 30 minutes for anything above.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 0;">
                <a href="${SITE}/start/${row.token}" style="display:inline-block;background:#0b0b0b;color:#fbf8f0;text-decoration:none;font-size:13px;font-weight:600;padding:12px 20px;border-radius:10px;">
                  Open the request
                </a>
                <p style="margin:14px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
                  If something changes, reply to this email and it reaches us directly.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 28px;">
                <p style="margin:0;font-size:11px;color:#cbd5e1;border-top:1px solid #f1f5f9;padding-top:14px;">
                  FrameStudio · Nairobi, Kenya
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

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return methodNotAllowed(res)

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}
  const token = body.token

  if (!isUuid(token)) return sendJson(res, 400, { error: 'This link is not valid.' })

  let row
  try {
    const { data, error } = await admin()
      .from('intake_requests')
      .select('id, token, status, number_seq, client_name, client_email, form, answers, copy_sent_at')
      .eq('token', token)
      .maybeSingle()
    if (error) throw error
    row = data
  } catch {
    return sendJson(res, 500, { error: 'We could not read that request. Please try again.' })
  }

  if (!row) return sendJson(res, 404, { error: 'This link is not valid.' })
  if (!['submitted', 'reviewed', 'converted'].includes(row.status)) {
    return sendJson(res, 409, { error: 'Send your answers first, then we can email you a copy.' })
  }
  if (!row.client_email) {
    return sendJson(res, 409, { error: 'There is no email address on this request to send to.' })
  }

  if (row.copy_sent_at) {
    const elapsed = Date.now() - new Date(row.copy_sent_at).getTime()
    if (Number.isFinite(elapsed) && elapsed < COOLDOWN_MS) {
      return sendJson(res, 429, {
        error: `We already sent a copy to ${row.client_email}. Check your inbox, and spam.`,
      })
    }
  }

  if (!process.env.RESEND_API_KEY) {
    return sendJson(res, 503, { error: 'Email is not configured yet. Message us and we will send it.' })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const answers = row.answers && typeof row.answers === 'object' ? row.answers : {}
    const { error } = await resend.emails.send({
      from: FROM,
      to: [row.client_email],
      replyTo: REPLY_TO,
      subject: `Your scope request ${reference(row)} · FrameStudio`,
      html: renderEmail({ row, answers }),
    })
    if (error) throw error
  } catch {
    return sendJson(res, 502, { error: 'We could not send that email. Message us and we will resend it.' })
  }

  // Stamped only after the mail actually left, so a failed send does not start
  // the cooldown and leave them unable to try again.
  try {
    await admin()
      .from('intake_requests')
      .update({ copy_sent_at: new Date().toISOString() })
      .eq('id', row.id)
  } catch {
    // A missing timestamp costs us nothing but the cooldown.
  }

  return sendJson(res, 200, { ok: true, to: row.client_email })
}

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}
