import PolicyLayout from './PolicyLayout'

export default function Terms() {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="text-gray-600">
        This page is under construction. In the meantime, if you have any questions
        about our terms, please{' '}
        <a href="mailto:hello@framestudio.co.ke" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          email us
        </a>.
      </p>
      <p className="text-gray-600 mt-4">
        FrameStudio provides digital solutions including web development, WhatsApp bots,
        and business dashboards for Kenyan small and medium enterprises.
        Full terms covering project scope, payment schedules, intellectual property,
        and liability will be published here soon.
      </p>
    </PolicyLayout>
  )
}
