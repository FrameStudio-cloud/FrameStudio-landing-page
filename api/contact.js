import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, service, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'FrameStudio <noreply@keel.framestudio.co.ke>',
      to: 'email.framestudio@gmail.com',
      replyTo: email,
      subject: `New Contact: ${name} — ${service || 'General'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px 0;color:#666;font-weight:600;">Name</td><td style="padding:8px 0;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#666;font-weight:600;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666;font-weight:600;">Service</td><td style="padding:8px 0;">${service || 'Not specified'}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="color:#333;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
