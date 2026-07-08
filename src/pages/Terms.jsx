import PolicyLayout from './PolicyLayout'

const sections = [
  {
    title: 'Effective Date: July 2026',
    content: 'These Terms of Service ("Terms") govern all design, development, and related services provided by FrameStudio ("FrameStudio," "we," "us," or "our"), a web design and development agency based in Nairobi, Kenya, to any client ("Client," "you," or "your") who engages FrameStudio for services. By signing a proposal, invoice, or project agreement referencing these Terms, or by making a payment for services, you agree to be bound by these Terms.',
  },
  {
    title: '1. Services',
    content: 'FrameStudio provides website design, web application development, branding, and related digital services ("Services") as agreed with each Client in a written proposal, quotation, or Statement of Work ("Project Agreement"). The scope, deliverables, timeline, and fees for each engagement are defined in the applicable Project Agreement, which is incorporated into these Terms by reference. Any work not explicitly included in the Project Agreement — including additional pages, features, integrations, copywriting, photography, or ongoing maintenance — is considered outside the original scope and will be quoted separately.',
  },
  {
    title: '2. Project Process & Timelines',
    content: 'A typical project follows these stages: (a) discovery and requirements gathering, (b) design concept and approval, (c) development, (d) client review and revisions, and (e) launch/handover. Estimated timelines will be communicated at the start of the project but are not guaranteed, as they depend on the Client providing timely feedback and materials. Delays caused by the Client — including late delivery of content, images, logos, or approvals — may extend the project timeline accordingly and are not the responsibility of FrameStudio.',
  },
  {
    title: '3. Fees, Payment Terms & Currency',
    content: 'All fees are quoted in Kenya Shillings (KES) unless otherwise agreed in writing. Unless a different schedule is stated in the Project Agreement, the standard payment structure is: 50% deposit payable before work begins, to secure the project slot and cover initial costs; 50% balance payable upon Client approval of the completed work, prior to final handover, domain transfer, or site launch. Payments may be made via M-Pesa, bank transfer, or another method agreed with FrameStudio. FrameStudio will not commence work, deliver final files, launch a live site, or transfer domain/hosting access until all outstanding invoices are paid in full. Late payments (more than 7 days overdue) may attract a late fee and may result in a pause of work until the account is settled.',
  },
  {
    title: '4. Client Responsibilities',
    content: 'To keep the project on schedule, the Client agrees to: Provide accurate, complete content (text, images, logos, brand assets) in a timely manner; designate a single point of contact authorised to approve designs and provide feedback; respond to requests for feedback or approval within a reasonable time (recommended: 5 business days); ensure that any content, images, trademarks, or materials supplied to FrameStudio do not infringe on the rights of any third party. FrameStudio is not liable for delays or issues arising from the Client\'s failure to meet these responsibilities.',
  },
  {
    title: '5. Revisions & Change Requests',
    content: 'Each project includes a set number of revision rounds as specified in the Project Agreement (typically two rounds of design revisions). Revisions beyond this limit, or changes requested after a stage has been approved, will be billed at FrameStudio\'s standard hourly or per-item rate. A "revision" refers to refinements within the agreed scope (e.g., colour, layout, or copy adjustments). Requests that materially change the project\'s scope, structure, or number of pages are treated as new work and quoted separately.',
  },
  {
    title: '6. Intellectual Property & Ownership',
    content: 'Upon full and final payment, ownership of the final website design and custom code developed specifically for the Client\'s project transfers to the Client, except for: Any pre-existing tools, components, frameworks, or code libraries owned by FrameStudio (including FrameStudio\'s proprietary component library) that are licensed, not sold, for use within the delivered project; third-party assets such as stock photos, fonts, plugins, or icon sets, which remain subject to their original licence terms. Until full payment is received, all design concepts, code, and deliverables remain the exclusive property of FrameStudio and may not be used, copied, published, or distributed by the Client. FrameStudio retains the right to showcase completed work (including screenshots and descriptions) in its portfolio, website, and marketing materials, unless the Client requests confidentiality in writing and FrameStudio agrees to it.',
  },
  {
    title: '7. Third-Party Services, Hosting & Domains',
    content: 'Projects may rely on third-party services such as domain registrars, hosting providers, payment gateways (e.g., M-Pesa/IntaSend), or SaaS platforms. FrameStudio is not responsible for the pricing, uptime, security, or policy changes of these third parties. Where FrameStudio purchases or manages a domain or hosting plan on the Client\'s behalf, ownership/account access will be transferred to the Client upon request, provided all related costs have been reimbursed to FrameStudio.',
  },
  {
    title: '8. Confidentiality',
    content: 'Both parties agree to keep confidential any non-public business, technical, or financial information shared during the course of the project, and to use it solely for the purposes of completing the engagement. This obligation survives the completion or termination of the project.',
  },
  {
    title: '9. Warranties & Disclaimers',
    content: 'FrameStudio will perform Services in a professional and workmanlike manner consistent with industry standards. Except as expressly stated, Services are provided "as is" without warranties of any kind, whether express or implied, including but not limited to fitness for a particular purpose, non-infringement, or uninterrupted/error-free operation. FrameStudio does not guarantee specific business outcomes, such as search engine rankings, sales volume, or lead generation, as these depend on factors outside FrameStudio\'s control.',
  },
  {
    title: '10. Limitation of Liability',
    content: 'To the maximum extent permitted by law, FrameStudio\'s total liability arising out of or relating to a project shall not exceed the total fees paid by the Client for that specific project. FrameStudio shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunity, even if advised of the possibility of such damages.',
  },
  {
    title: '11. Indemnification',
    content: 'The Client agrees to indemnify and hold FrameStudio harmless from any claims, damages, or expenses (including legal fees) arising from: (a) content or materials supplied by the Client that infringe third-party rights, (b) the Client\'s misuse of the delivered website or application, or (c) the Client\'s breach of these Terms.',
  },
  {
    title: '12. Termination & Cancellation',
    content: 'Either party may terminate a project with written notice if the other party materially breaches these Terms and fails to remedy the breach within 7 days of being notified. If the Client cancels a project after work has begun, the deposit is non-refundable and covers work already completed. Any additional work completed beyond the deposit amount will be invoiced and due immediately, based on the percentage of work completed at the time of cancellation.',
  },
  {
    title: '13. Refund Policy',
    content: 'Deposits are non-refundable, as they secure FrameStudio\'s time and resources for the project. If FrameStudio is unable to begin or complete a project for reasons within its control, a partial or full refund of unused fees may be issued at FrameStudio\'s discretion.',
  },
  {
    title: '14. Data Protection & Privacy',
    content: 'FrameStudio will handle any personal data shared by the Client or collected through delivered websites/applications in accordance with the Kenya Data Protection Act, 2019. Where a delivered project collects personal data from end users (e.g., customer sign-ups, order forms), the Client is responsible for ensuring that project has an appropriate privacy policy and lawful basis for processing that data once handed over.',
  },
  {
    title: '15. Governing Law & Dispute Resolution',
    content: 'These Terms are governed by the laws of the Republic of Kenya. Any dispute arising from these Terms or a Project Agreement shall first be addressed through good-faith negotiation between the parties. If unresolved within 30 days, the dispute shall be referred to mediation, and if still unresolved, to the courts of Kenya, which shall have exclusive jurisdiction.',
  },
  {
    title: '16. Changes to These Terms',
    content: 'FrameStudio may update these Terms from time to time. Material changes will be communicated to active clients. Continued use of FrameStudio\'s Services after changes take effect constitutes acceptance of the revised Terms. Ongoing Project Agreements remain governed by the Terms in effect at the time they were signed, unless both parties agree otherwise.',
  },
  {
    title: '17. Contact Information',
    content: 'Questions about these Terms should be directed to: FrameStudio, Nairobi, Kenya. Email: hello@framestudio.co.ke. Website: framestudio.co.ke. WhatsApp: +254 793 302 518.',
  },
]

export default function Terms() {
  return (
    <PolicyLayout title="Terms of Service">
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
        FrameStudio is encouraged to have these Terms reviewed by a Kenyan-qualified advocate
        before publishing or relying on them.
      </p>
    </PolicyLayout>
  )
}
