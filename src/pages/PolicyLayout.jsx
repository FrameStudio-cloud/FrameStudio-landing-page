import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PolicyLayout({ title, children }) {
  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">{title}</h1>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}
