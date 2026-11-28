import { Resend } from 'resend'

/** Everything below is interpolated into an email, so escape it. */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Subjects are headers: a newline in one is a header-injection bug. */
const oneLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').slice(0, 160)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, service, message, source } = req.body || {}

  // A phone is enough now: the site chat asks for "a phone number or an email".
  // The contact form still sends both, so nothing there changes.
  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({ error: 'Name, and an email or phone, are required' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromChat = source === 'chat'

  try {
    await resend.emails.send({
      from: 'FrameStudio <noreply@keel.framestudio.co.ke>',
      to: 'email.framestudio@gmail.com',
      ...(email ? { replyTo: email } : {}),
      subject: `${fromChat ? '[Chat] ' : ''}New Contact: ${oneLine(name)} — ${oneLine(service || 'General')}`,
      html: `
        <h2>${fromChat ? 'New chat enquiry' : 'New Contact Form Submission'}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px 0;color:#666;font-weight:600;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
          ${email ? `<tr><td style="padding:8px 0;color:#666;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` : ''}
          ${phone ? `<tr><td style="padding:8px 0;color:#666;font-weight:600;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666;font-weight:600;">Service</td><td style="padding:8px 0;">${escapeHtml(service || 'Not specified')}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="color:#333;line-height:1.6;white-space:pre-line;">${escapeHtml(message)}</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
