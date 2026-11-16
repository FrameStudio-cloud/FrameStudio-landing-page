import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

/**
 * `useForm()` from cite-ui, rebuilt here: required fields, an email shape check
 * and the library's Kenyan phone rule (07… / 01… / 254…). Errors appear on blur
 * and clear as you type, which is the part most form demos skip.
 */

const KENYAN_PHONE = /^(?:\+?254|0)(?:7|1)\d{8}$/

function validate(values) {
  const next = {}

  if (!values.name.trim()) next.name = 'We need a name to reply to.'

  if (!values.email.trim()) {
    next.email = 'An email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    next.email = 'That address is missing something.'
  }

  const phone = values.phone.replace(/[\s-]/g, '')
  if (!phone) {
    next.phone = 'A phone number is required.'
  } else if (!KENYAN_PHONE.test(phone)) {
    next.phone = 'Use 07…, 01… or 2547… — Kenyan numbers only.'
  }

  return next
}

function Field({ id, label, type = 'text', value, error, hint, onChange, onBlur, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-paper px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:ring-1 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/30'
            : 'border-ink/15 focus:border-accent focus:ring-accent/30'
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[11px] leading-snug text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-snug text-ink/55">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function FormDemo() {
  const [values, setValues] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (name) => (event) => {
    const next = { ...values, [name]: event.target.value }
    setValues(next)
    if (touched[name]) {
      const fieldErrors = validate(next)
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldErrors = validate(values)
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = validate(values)
    setErrors(next)
    setTouched({ name: true, email: true, phone: true })
    const first = Object.keys(next)[0]
    if (first) {
      document.getElementById(`lab-${first}`)?.focus()
      return
    }
    setSent(true)
  }

  const reset = () => {
    setValues({ name: '', email: '', phone: '' })
    setErrors({})
    setTouched({})
    setSent(false)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_290px]">
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-paper p-5 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,11,11,0.14)_1px,transparent_0)] [background-size:18px_18px]"
        />

        <div className="relative w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(11,11,11,0.5)]">
          {sent ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent text-ink">
                <CheckCircle2 size={20} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink">Message queued</p>
              <p className="mx-auto mt-2 max-w-[26ch] text-[12.5px] leading-relaxed text-ink-soft">
                This is a demo — nothing was sent. The validation above it is real.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-ink/40"
              >
                Send another
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Contact</p>
              <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] text-ink">Message us</p>

              <div className="mt-4 space-y-3.5">
                <Field
                  id="lab-name"
                  label="Name"
                  value={values.name}
                  error={errors.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  autoComplete="name"
                />
                <Field
                  id="lab-email"
                  label="Email"
                  type="email"
                  value={values.email}
                  error={errors.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoComplete="email"
                />
                <Field
                  id="lab-phone"
                  label="Phone"
                  type="tel"
                  value={values.phone}
                  error={errors.phone}
                  hint="Kenyan numbers only — 0712 345 678 or 254712345678."
                  onChange={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  autoComplete="tel"
                />
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                Send message
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <aside className="border-t border-ink/10 bg-cream/60 p-5 lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Rules running</p>
        <ul className="mt-3 space-y-2.5 text-[12px] text-ink-soft">
          <li className="flex items-center justify-between gap-3">
            <span>Name</span>
            <code className="font-mono text-[10px] text-ink/60">required</code>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>Email</span>
            <code className="font-mono text-[10px] text-ink/60">email</code>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>Phone</span>
            <code className="font-mono text-[10px] text-ink/60">phone · KE</code>
          </li>
        </ul>

        <p className="mt-5 text-[11px] leading-relaxed text-ink-soft">
          Try <span className="font-mono text-[10px] text-ink">0712 345 678</span>. Then try{' '}
          <span className="font-mono text-[10px] text-ink">0812 345 678</span> — it fails on purpose.
        </p>

        <p className="mt-4 border-t border-ink/10 pt-4 text-[11px] leading-relaxed text-ink/55">
          Errors appear on blur and clear as you type. Nothing is submitted anywhere.
        </p>
      </aside>
    </div>
  )
}
