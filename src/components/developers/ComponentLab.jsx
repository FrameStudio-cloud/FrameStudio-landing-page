import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import CopyButton from './CopyButton'
import ToastDemo from './ToastDemo'
import FormDemo from './FormDemo'
import DrawerDemo from './DrawerDemo'

/**
 * The lab: three live components inside one window chrome.
 *
 * The demos are rebuilt against this site's tokens, not imported from the
 * package — the landing site stays free of a React 18 peer dependency and the
 * demos match the palette around them. Each tab's code panel shows the real
 * cite-ui API, and links to that component's section in the readme.
 */

const TABS = [
  {
    id: 'toasts',
    label: 'Toasts',
    file: 'app/checkout.jsx',
    docs: 'https://github.com/FrameStudio-cloud/cite-ui#toast',
    snippet: `import { ToastProvider, useToast } from 'cite-ui'

function Checkout() {
  const { toast } = useToast()

  const pay = () => toast.promise(chargeMpesa(), {
    loading: 'Waiting for M-Pesa…',
    success: 'Payment confirmed',
    error: 'Could not verify payment',
  })

  return <button onClick={pay}>Pay KES 2,400</button>
}`,
  },
  {
    id: 'form',
    label: 'Form validation',
    file: 'app/contact.jsx',
    docs: 'https://github.com/FrameStudio-cloud/cite-ui#useform',
    snippet: `import { useForm, TextField, Button } from 'cite-ui'

const { values, errors, handleChange, handleSubmit } = useForm({
  initial: { name: '', email: '', phone: '' },
  validate: {
    name: 'required',
    email: ['required', 'email'],
    phone: ['required', 'phone'], // 07… / 2547…
  },
  onSubmit: sendToInbox,
})`,
  },
  {
    id: 'drawer',
    label: 'Drawer',
    file: 'app/settings.jsx',
    docs: 'https://github.com/FrameStudio-cloud/cite-ui#drawer',
    snippet: `import { Drawer, Button } from 'cite-ui'

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Order settings"
  side="right"
  size="md"
  footer={<Button label="Save changes" />}
>
  <NotificationSettings />
</Drawer>`,
  },
]

const DEMOS = {
  toasts: ToastDemo,
  form: FormDemo,
  drawer: DrawerDemo,
}

/** Tints quoted strings and comments. Everything else stays plain ink. */
function highlight(line) {
  return line.split(/('(?:[^'\\]|\\.)*'|`[^`]*`|\/\/.*$)/g).map((part, index) => {
    if (!part) return null
    if (part.startsWith("'") || part.startsWith('`')) {
      return (
        <span key={index} className="text-accent">
          {part}
        </span>
      )
    }
    if (part.startsWith('//')) {
      return (
        <span key={index} className="text-paper/25">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function ComponentLab() {
  const [active, setActive] = useState('toasts')
  const tabRefs = useRef([])

  const tab = TABS.find((item) => item.id === active) || TABS[0]
  const Demo = DEMOS[active]

  const focusTab = (index) => {
    const next = TABS[index]
    if (!next) return
    setActive(next.id)
    tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab((index + 1) % TABS.length)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab((index - 1 + TABS.length) % TABS.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(TABS.length - 1)
    }
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-ink/10 bg-paper shadow-[0_50px_90px_-60px_rgba(11,11,11,0.5)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 bg-cream/70 px-4 py-3 sm:px-5">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">cite-ui / live</p>
        <span className="ml-auto hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Running in this page
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Live component demos"
        className="flex gap-1 overflow-x-auto border-b border-ink/10 px-2 py-2 sm:px-3"
      >
        {TABS.map((item, index) => {
          const selected = item.id === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`lab-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`lab-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                selected ? 'bg-ink text-paper' : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`lab-panel-${active}`} aria-labelledby={`lab-tab-${active}`} key={active}>
        <Demo />
      </div>

      <div className="border-t border-paper/10 bg-ink">
        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            {tab.file}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={tab.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45 transition-colors hover:text-accent"
            >
              Docs
              <ArrowUpRight size={12} />
            </a>
            <CopyButton value={tab.snippet} label="Copy" />
          </div>
        </div>
        <pre className="overflow-x-auto px-4 pb-5 pt-1 font-mono text-[12px] leading-[1.8] text-paper/75 sm:px-5">
          <code>
            {tab.snippet.split('\n').map((line, index) => (
              <span key={index} className="block whitespace-pre">
                {line ? highlight(line) : ' '}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
