import PolicyLayout from './PolicyLayout'

export default function Refund() {
  return (
    <>
      <title>Refund Policy — FrameStudio</title>
      <meta name="description" content="FrameStudio's refund and cancellation policy. Information about deposits, milestone payments, and refund terms for digital services." />
      <meta property="og:title" content="Refund Policy — FrameStudio" />
      <meta property="og:description" content="Refund policy for FrameStudio's digital services and project payments." />
      <meta property="og:url" content="https://www.framestudio.co.ke/refund" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://www.framestudio.co.ke/refund" />
      <PolicyLayout title="Refund & Cancellation Policy">
        <p className="text-gray-600">
          Last updated: October 25, 2026
        </p>
        <p className="text-gray-600 mt-4">
          This Refund Policy explains when and how FrameStudio (“we”, “us”, “our”) issues refunds for web design, development, and related services bought through framestudio.co.ke or directly from us (the “Services”).
        </p>
        <p className="text-gray-600 mt-2">
          Because our work is custom and starts as soon as a project is agreed, our refunds depend on how far the project has progressed. Please read this policy before you pay.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">1. Project deposit</h3>
        <p className="text-gray-600">
          Most projects begin with an upfront deposit of [30]% of the agreed project price. This deposit secures your place in our schedule and covers initial planning, research, and design work.
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>If you cancel before we have started work, we will refund the deposit in full, less any payment processing fees.</li>
          <li>If you cancel after work has started, the deposit is non-refundable.</li>
        </ul>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">2. Refunds by project stage</h3>
        <p className="text-gray-600">
          If you cancel or end a project, any refund is based on the work completed up to the date you notify us in writing.
        </p>
        <table className="w-full border-collapse text-left mt-4">
          <thead>
            <tr>
              <th className="pb-2 text-gray-900 font-semibold border-b border-gray-200">Project stage</th>
              <th className="pb-2 text-gray-900 font-semibold border-b border-gray-200">Refund</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-600">Before work has started</td>
              <td className="py-2 text-gray-600">Full refund of amounts paid, less payment processing fees</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-600">Design or planning in progress</td>
              <td className="py-2 text-gray-600">Amounts paid minus the value of work completed, and never including the deposit</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-600">Development in progress</td>
              <td className="py-2 text-gray-600">Only the portion of payments covering milestones not yet started</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-600">Website delivered or launched</td>
              <td className="py-2 text-gray-600">No refund, except as set out in Section 4</td>
            </tr>
          </tbody>
        </table>
        <p className="text-gray-600 mt-4">
          We will give you a short written breakdown of the work completed so you can see how the refund was calculated.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">3. Non-refundable items</h3>
        <p className="text-gray-600">
          The following are not refundable once purchased or started:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Domain names, hosting, SSL certificates, and other third-party costs we paid on your behalf</li>
          <li>Premium themes, plugins, stock photos, fonts, or licenses bought for your project</li>
          <li>Completed milestones that you have approved</li>
          <li>Ongoing maintenance or support plans for the period already used</li>
        </ul>
        <p className="text-gray-600 mt-2">
          These costs go to third parties, and we cannot recover them.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">4. When we will fix or refund</h3>
        <p className="text-gray-600">
          We want you to be happy with what we build. If the finished work does not match what we agreed in writing:
        </p>
        <ol className="list-decimal list-inside text-gray-600 mt-2 space-y-1">
          <li>Tell us within [14] days of delivery, and describe the problem.</li>
          <li>We will fix the issue at no extra cost within a reasonable time.</li>
          <li>If we cannot fix it, we will refund the part of the price that relates to the work that does not meet the agreement.</li>
        </ol>
        <p className="text-gray-600 mt-2">
          A change in your own preferences, a change of mind, or new requests after you approve a design are not faults. We can handle these as paid revisions under a new quote.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">5. Delays caused by you</h3>
        <p className="text-gray-600">
          If a project is paused for more than [30] days because we are waiting for content, feedback, or payment from you, we may close the project. Amounts already paid for work completed are non-refundable, and restarting may need a new schedule and quote.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">6. Subscriptions and recurring services</h3>
        <p className="text-gray-600">
          For monthly or yearly services such as hosting, maintenance, or support:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>You can cancel at any time with [7] days’ written notice before your next billing date.</li>
          <li>We do not refund the current billing period once it has started.</li>
          <li>Cancelling stops future charges only.</li>
        </ul>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">7. How to request a refund</h3>
        <p className="text-gray-600">
          Send your request in writing to [your email address]. Please include:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Your name and business name</li>
          <li>The project or invoice reference</li>
          <li>The reason for your request</li>
        </ul>
        <p className="text-gray-600 mt-2">
          We will reply within [3] business days to confirm whether your request is approved and what the refund amount will be.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">8. How refunds are paid</h3>
        <p className="text-gray-600">
          Approved refunds are paid back to the original payment method, for example M-Pesa, bank transfer, or card, within [7–14] business days of approval. Payment processing or transfer fees charged by the provider may be deducted.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">9. Disputes</h3>
        <p className="text-gray-600">
          If you disagree with our decision, contact us first so we can try to resolve it directly. We will review your case fairly and respond in writing. Nothing in this policy limits your rights under Kenyan consumer protection law.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">10. Changes to this policy</h3>
        <p className="text-gray-600">
          We may update this policy from time to time. The version in force when you paid for the Services applies to that purchase. The “Last updated” date above shows when it was last revised.
        </p>
        <h3 className="text-gray-900 mt-6 mb-2 text-lg font-semibold">11. Contact</h3>
        <p className="text-gray-600">
          Questions about this policy can be sent to:
        </p>
        <p className="text-gray-600 mt-2">
          FrameStudio Email: email.framestudio@gmail.com&nbsp;|&nbsp;Website: https://framestudio.co.ke&nbsp;|&nbsp;Location: Nairobi, Kenya
        </p>
      </PolicyLayout>
    </>
  )
}
