import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * Copy-to-clipboard with a quiet confirmation.
 *
 * The label swaps, so screen readers get a separate live region: changing a
 * button's accessible name mid-press is not reliably announced.
 */
export default function CopyButton({ value, label = 'Copy', tone = 'dark', className = '' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard blocked (insecure context, denied permission). Stay silent
      // rather than claiming success.
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  const tones = {
    dark: 'border-paper/15 text-paper/60 hover:border-accent/50 hover:text-accent',
    light: 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink',
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied to clipboard' : label}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${tones[tone]} ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span aria-hidden="true">{copied ? 'Copied' : label}</span>
      <span role="status" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  )
}
