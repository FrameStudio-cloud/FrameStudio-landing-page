import { Check, HelpCircle, Plus, X } from 'lucide-react'
import { UNKNOWN, emptyValue } from '../../lib/intake'

const INPUT =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] leading-snug text-ink placeholder:text-ink-faint/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10'

const CHOICE_BASE =
  'flex w-full items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-[14px] leading-snug transition-colors focus:outline-none focus:ring-2 focus:ring-ink/10'

const CHOICE_OFF = 'border-ink/15 bg-white text-ink hover:border-ink/35'
const CHOICE_ON = 'border-ink bg-ink text-paper'

/**
 * One question, in the client's hands.
 *
 * Four decisions that matter on a 360px screen:
 *
 *  - `choice` and `multi` are buttons, not a native select. A select hides the
 *    options until tapped, and on a phone it opens a system wheel that covers
 *    the question you are answering.
 *  - "Not sure yet" is a visible control on every question that allows it, not
 *    a hidden fifth option. It is the reason the form is answerable at all.
 *  - `links` is two short rows rather than one long box, because "paste a URL
 *    and tell me why" is two different pieces of information.
 *  - the note on links is optional. Requiring a reason turns a five-second
 *    question into a writing exercise.
 */
export default function ScopeField({ field, value, onChange, disabled = false }) {
  const unknown = value === UNKNOWN
  const setUnknown = (next) => onChange(next ? UNKNOWN : emptyValue(field))

  if (field.type === 'long') {
    return (
      <div className="space-y-2">
        <textarea
          id={`${field.id}-input`}
          aria-label={field.label}
          className={`${INPUT} min-h-[104px] resize-y`}
          value={unknown ? '' : value || ''}
          placeholder={unknown ? 'You said you are not sure yet.' : 'Type your answer'}
          disabled={disabled || unknown}
          onChange={(event) => onChange(event.target.value)}
        />
        <UnknownToggle field={field} unknown={unknown} onChange={setUnknown} />
      </div>
    )
  }

  if (field.type === 'choice') {
    return (
      <div role="radiogroup" aria-label={field.label} className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((option) => {
            const selected = !unknown && value === option
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                className={`${CHOICE_BASE} ${selected ? CHOICE_ON : CHOICE_OFF}`}
                onClick={() => onChange(selected ? '' : option)}
              >
                <span
                  className={`mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full border ${
                    selected ? 'border-paper/60' : 'border-ink/30'
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-paper" />}
                </span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
        <UnknownToggle field={field} unknown={unknown} onChange={setUnknown} />
      </div>
    )
  }

  if (field.type === 'multi') {
    const picks = Array.isArray(value) ? value : []
    const toggle = (option) => {
      const next = picks.includes(option)
        ? picks.filter((entry) => entry !== option)
        : [...picks, option]
      onChange(next)
    }

    return (
      <div role="group" aria-label={field.label} className="space-y-2">
        <p className="text-[11px] text-ink-faint">Pick any that apply.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((option) => {
            const selected = !unknown && picks.includes(option)
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                className={`${CHOICE_BASE} ${selected ? CHOICE_ON : CHOICE_OFF}`}
                onClick={() => toggle(option)}
              >
                <span
                  className={`mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded border ${
                    selected ? 'border-paper/60 bg-paper/20' : 'border-ink/30'
                  }`}
                >
                  {selected && <Check size={11} strokeWidth={3} />}
                </span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>
        <UnknownToggle field={field} unknown={unknown} onChange={setUnknown} />
      </div>
    )
  }

  if (field.type === 'links') {
    const rows = Array.isArray(value) ? value : []
    const update = (index, patch) =>
      onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
    const remove = (index) => onChange(rows.filter((_, i) => i !== index))

    return (
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="rounded-xl border border-ink/15 bg-white p-2.5">
            <div className="flex items-center gap-1.5">
              <input
                aria-label={`Link ${index + 1}`}
                className="h-9 w-full rounded-lg border border-ink/10 bg-paper px-2.5 text-[13px] text-ink placeholder:text-ink-faint/70 focus:border-ink/40 focus:outline-none"
                placeholder="https://…"
                value={row.url || ''}
                disabled={disabled || unknown}
                onChange={(event) => update(index, { url: event.target.value })}
              />
              <button
                type="button"
                aria-label="Remove this link"
                disabled={disabled}
                className="rounded-lg p-1.5 text-ink-faint hover:bg-ink/5 hover:text-ink"
                onClick={() => remove(index)}
              >
                <X size={14} />
              </button>
            </div>
            <input
              aria-label={`Why link ${index + 1} matters`}
              className="mt-1.5 h-8 w-full rounded-lg border border-ink/10 bg-paper px-2.5 text-[12px] text-ink placeholder:text-ink-faint/70 focus:border-ink/40 focus:outline-none"
              placeholder="What do you like or dislike about it?"
              value={row.note || ''}
              disabled={disabled || unknown}
              onChange={(event) => update(index, { note: event.target.value })}
            />
          </div>
        ))}

        <button
          type="button"
          disabled={disabled || unknown}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-ink/25 px-3 py-1.5 text-[12px] font-medium text-ink-soft hover:border-ink/50 hover:text-ink disabled:opacity-40"
          onClick={() => onChange([...rows, { url: '', note: '' }])}
        >
          <Plus size={13} /> Add a link
        </button>

        <UnknownToggle field={field} unknown={unknown} onChange={setUnknown} />
      </div>
    )
  }

  // short, date, url
  const type = field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'
  return (
    <div className="space-y-2">
      <input
        id={`${field.id}-input`}
        aria-label={field.label}
        type={type}
        className={`${INPUT} ${unknown ? 'opacity-50' : ''}`}
        value={unknown ? '' : value || ''}
        placeholder={
          unknown
            ? 'You said you are not sure yet.'
            : field.type === 'url'
              ? 'https://'
              : field.system === 'client_phone'
                ? '07…'
                : 'Type your answer'
        }
        inputMode={field.type === 'url' ? 'url' : field.system === 'client_email' ? 'email' : 'text'}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <UnknownToggle field={field} unknown={unknown} onChange={setUnknown} />
    </div>
  )
}

/**
 * "I don't know" as a control, not a failure state.
 *
 * It is deliberately quiet until chosen, and it stays reversible: a client who
 * picks it and then remembers the answer can tap it off.
 */
function UnknownToggle({ field, unknown, onChange }) {
  if (!field.allowUnknown) return null
  return (
    <button
      type="button"
      aria-pressed={unknown}
      aria-label={`Not sure yet: ${field.label}`}
      onClick={() => onChange(!unknown)}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] transition-colors ${
        unknown
          ? 'border-ink bg-ink/5 font-medium text-ink'
          : 'border-dashed border-ink/25 text-ink-faint hover:border-ink/40 hover:text-ink-soft'
      }`}
    >
      <HelpCircle size={12} />
      {unknown ? 'Not sure yet — noted' : 'Not sure yet'}
    </button>
  )
}
