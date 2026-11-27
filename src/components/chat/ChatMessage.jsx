/**
 * One bubble. The speaker is announced to screen readers but not shown — the
 * alignment and colour carry it visually.
 */
export default function ChatMessage({ from, text }) {
  const mine = from === 'user'

  return (
    <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
      <p
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
          mine
            ? 'rounded-br-md bg-ink text-paper'
            : 'rounded-bl-md bg-cream text-ink'
        }`}
      >
        <span className="sr-only">{mine ? 'You said: ' : 'FrameStudio said: '}</span>
        {text}
      </p>
    </div>
  )
}
