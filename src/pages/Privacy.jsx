import PolicyLayout from './PolicyLayout'

export default function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-gray-600">
        This page is under construction. In the meantime, if you have any questions
        about how we handle your data, please{' '}
        <a href="mailto:hello@framestudio.co.ke" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          email us
        </a>.
      </p>
      <p className="text-gray-600 mt-4">
        FrameStudio is committed to protecting your privacy. We collect only the
        information necessary to deliver our services. Full details on data collection,
        storage, and your rights will be published here soon.
      </p>
    </PolicyLayout>
  )
}
