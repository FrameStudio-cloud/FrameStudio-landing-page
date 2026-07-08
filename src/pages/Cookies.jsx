import PolicyLayout from './PolicyLayout'

export default function Cookies() {
  return (
    <PolicyLayout title="Cookie Policy">
      <p className="text-gray-600">
        This page is under construction. In the meantime, if you have any questions
        about our use of cookies, please{' '}
        <a href="mailto:hello@framestudio.co.ke" className="text-gray-900 underline underline-offset-2 hover:no-underline">
          email us
        </a>.
      </p>
      <p className="text-gray-600 mt-4">
        FrameStudio uses minimal cookies — primarily for analytics (to understand how
        visitors use our site) and basic functionality. We do not sell your data.
        Full details on the specific cookies we use will be published here soon.
      </p>
    </PolicyLayout>
  )
}
