import PolicyLayout from './PolicyLayout'

export default function Refund() {
  return (
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
  )
}
