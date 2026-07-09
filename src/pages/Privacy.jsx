import { Helmet } from 'react-helmet-async'
import PolicyLayout from './PolicyLayout'

const sections = [
  {
    title: 'Effective Date: July 2026',
    content: 'FrameStudio ("FrameStudio," "we," "us," or "our") is a web design and development agency based in Nairobi, Kenya. This Privacy Policy explains how we collect, use, share, and protect personal data when you visit our website, contact us, or engage us as a client. It is written to align with the Kenya Data Protection Act, 2019 ("the Act") and the regulations issued by the Office of the Data Protection Commissioner (ODPC).',
  },
  {
    title: '1. Who This Policy Covers',
    content: 'This Policy applies to personal data collected by FrameStudio through: Our website (framestudio.co.ke) and any contact, quote request, or newsletter forms on it; direct communication with us via WhatsApp, email, phone, or social media; our work as an agency delivering websites, applications, and related services to clients. This Policy does not cover the privacy practices of websites or applications we build for clients — each client is responsible for publishing their own privacy policy covering how they, as the site owner, handle their own users\' data.',
  },
  {
    title: '2. Information We Collect',
    content: 'We may collect the following categories of personal data: Contact details — name, email address, phone number, WhatsApp number, business name; project information — details you share about your business, goals, brand assets, and content provided for a project; payment information — M-Pesa transaction details or bank payment references relevant to invoicing (we do not store full card numbers or M-Pesa PINs); communications — messages, emails, and call notes exchanged with us during an engagement; website usage data — pages visited, browser type, device information, and approximate location, collected automatically via analytics tools.',
  },
  {
    title: '3. How We Use Your Information',
    content: 'We use personal data to: Respond to enquiries and prepare quotations or proposals; deliver, manage, and invoice projects we\'ve been engaged for; communicate updates, timelines, and requests for feedback during a project; improve our website, services, and marketing (e.g. understanding which content resonates); comply with legal, tax, and accounting obligations. We do not sell personal data to third parties.',
  },
  {
    title: '4. Legal Basis for Processing',
    content: 'Under the Data Protection Act, we rely on one or more of the following legal bases to process personal data: Consent — for example, when you submit a contact form or opt in to receive marketing messages; contractual necessity — to deliver services under a signed Project Agreement or Terms of Service; legitimate interest — for basic website analytics and maintaining business records, balanced against your rights; legal obligation — for tax, accounting, and regulatory record-keeping.',
  },
  {
    title: '5. Cookies & Analytics',
    content: 'Our website may use cookies or similar technologies to remember preferences and understand how visitors use the site (for example, via tools like Google Analytics). You can disable cookies through your browser settings; doing so may affect some site functionality.',
  },
  {
    title: '6. How We Share Information',
    content: 'We may share personal data with: Trusted service providers who support our operations, such as hosting providers, payment processors (e.g. IntaSend/M-Pesa), and cloud infrastructure providers (e.g. Supabase, Vercel); professional advisors, such as accountants, where necessary for legal or financial compliance; authorities, where required by law, court order, or to protect our legal rights. We require third-party service providers who process data on our behalf to protect it in a manner consistent with this Policy and applicable law.',
  },
  {
    title: '7. Data Storage & Security',
    content: 'Personal data is stored using reputable cloud infrastructure providers with industry-standard security measures, including access controls and encryption in transit. While we take reasonable steps to protect personal data, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Data Retention',
    content: 'We retain personal data only for as long as necessary to fulfil the purposes described in this Policy, including any legal, accounting, or reporting requirements. Project files and client communications are typically retained for the duration of the business relationship and a reasonable period afterward, after which they are securely deleted or anonymised.',
  },
  {
    title: '9. Your Rights Under the Data Protection Act',
    content: 'As a data subject under the Act, you have the right to: Be informed of how your personal data is being used; access the personal data we hold about you; request correction of inaccurate or outdated data; request deletion of your personal data, subject to legal or contractual limits; object to or restrict certain types of processing, including direct marketing; lodge a complaint with the Office of the Data Protection Commissioner (ODPC) if you believe your rights have been violated. To exercise any of these rights, contact us using the details in Section 12 below. We will respond within the timeframe required by the Act.',
  },
  {
    title: '10. Children\'s Privacy',
    content: 'Our services are intended for businesses and individuals aged 18 and above. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected data from a minor, we will take steps to delete it.',
  },
  {
    title: '11. International Data Transfers',
    content: 'Some of the third-party tools we use (such as cloud hosting or analytics providers) may store or process data outside Kenya. Where this occurs, we take reasonable steps to ensure such transfers comply with the Act\'s requirements for cross-border data transfers, including relying on providers with adequate data protection safeguards.',
  },
  {
    title: '12. Contact Us',
    content: 'For questions about this Policy or to exercise your data protection rights, contact: FrameStudio, Nairobi, Kenya. Email: hello@framestudio.co.ke. Website: framestudio.co.ke. WhatsApp: +254 793 302 518.',
  },
  {
    title: '13. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "Effective Date" at the top of this Policy will indicate when it was last revised. We encourage you to review this Policy periodically.',
  },
]

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — FrameStudio</title>
        <meta name="description" content="FrameStudio's Privacy Policy. How we handle personal data in compliance with the Kenya Data Protection Act 2019. Nairobi-based digital agency." />
        <meta property="og:title" content="Privacy Policy — FrameStudio" />
        <meta property="og:description" content="How FrameStudio handles your data in compliance with the Kenya Data Protection Act 2019." />
        <meta property="og:url" content="https://framestudio.co.ke/privacy" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/privacy" />
      </Helmet>
      <PolicyLayout title="Privacy Policy">
      {sections.map((s, i) => (
        <div key={i}>
          {s.title && (
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">{s.title}</h2>
          )}
          <p className="text-gray-600 leading-relaxed">{s.content}</p>
        </div>
      ))}
      <p className="text-gray-400 text-sm mt-10 pt-6 border-t border-gray-100">
        This document is a template provided for convenience and does not constitute legal advice.
        FrameStudio is encouraged to have this Policy reviewed by a Kenyan-qualified advocate
        familiar with the Data Protection Act, 2019 before publishing or relying on it.
      </p>
    </PolicyLayout>
    </>
  )
}
