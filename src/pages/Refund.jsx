import { Helmet } from 'react-helmet-async'
import PolicyLayout from './PolicyLayout'

export default function Refund() {
  return (
    <>
      <Helmet>
        <title>Refund Policy — FrameStudio</title>
        <meta name="description" content="FrameStudio's refund and cancellation policy. Information about deposits, milestone payments, and refund terms for digital services." />
        <meta property="og:title" content="Refund Policy — FrameStudio" />
        <meta property="og:description" content="Refund policy for FrameStudio's digital services and project payments." />
        <meta property="og:url" content="https://framestudio.co.ke/refund" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://framestudio.co.ke/refund" />
      </Helmet>
      <PolicyLayout title="Refund & Cancellation Policy">
      <p className="text-gray-600">
        This page is under construction. In the meantime, if you have any questions
        about payments or refunds, please{' '}
        <a href="mailto:hello@framestudio.co.ke" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          email us
        </a>.
      </p>
      <p className="text-gray-600 mt-4">
        FrameStudio aims for full client satisfaction. Our refund and cancellation
        terms are designed to be fair for both parties — covering deposits, milestone
        payments, and ongoing service subscriptions. Full details coming soon.
      </p>
    </PolicyLayout>
    </>
  )
}
