import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PolicyLayout({ title, children }) {
  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28 bg-paper">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45 hover:text-accent transition-colors mb-10">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <h1 className="font-display text-3xl md:text-[2.75rem] font-semibold text-ink tracking-[-0.03em] leading-[1.05] mb-10">{title}</h1>
        <div className="space-y-4 text-ink-soft leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
