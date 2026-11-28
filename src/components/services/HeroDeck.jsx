import { ArrowUpRight, Globe, Bot, BarChart3 } from 'lucide-react'
import { SERVICES } from '../../lib/services'
import { DottedGrid, FloatChip } from './objects'

/**
 * The hero deck â€” three tilted cards carrying a small piece of the product each,
 * plus two floating chips whose labels name the job rather than a persona
 * ("Paid", "2am") because that is what a shop owner recognises.
 *
 * The cards stay links. Tilt is decoration: `sm:` only (touch gets a plain
 * stack), hover straightens the card, and `motion-reduce` removes the lift.
 */

const ICONS = { Globe, Bot, BarChart3 }
const TILT = ['sm:-rotate-[3deg]', 'sm:rotate-[1.5deg]', 'sm:-rotate-[1.5deg]']

function Preview({ id }) {
  if (id === 'websites') {
    return (
      <div className="flex h-8 items-stretch gap-1.5 sm:h-11" aria-hidden="true">
        <div className="flex flex-1 flex-col justify-center gap-1 rounded-md border border-paper/10 bg-paper/[0.04] p-1.5">
          <span className="h-1 w-9 rounded-full bg-paper/30" />
          <span className="h-1 w-6 rounded-full bg-paper/15" />
          <span className="mt-1 h-2.5 w-8 rounded-full bg-accent/60" />
        </div>
        <div className="flex w-12 flex-col gap-1">
          <span className="flex-1 rounded-md bg-paper/[0.08]" />
          <span className="flex-1 rounded-md bg-paper/[0.08]" />
        </div>
      </div>
    )
  }

  if (id === 'bots') {
    return (
      <div className="flex h-8 flex-col justify-center gap-1 sm:h-11 sm:gap-1.5" aria-hidden="true">
        <span className="ml-auto w-fit rounded-md bg-paper/[0.14] px-2 py-1 font-mono text-[7px] leading-none tracking-[0.02em] text-paper/70">
          Size 42?
        </span>
        <span className="w-fit rounded-md bg-paper/[0.07] px-2 py-1 font-mono text-[7px] leading-none tracking-[0.02em] text-paper/60">
          Yes â€” four left
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-8 items-end gap-1 sm:h-11" aria-hidden="true">
      {[42, 68, 54, 88, 60, 76].map((height, index) => (
        <span
          key={index}
          className={`flex-1 rounded-sm ${index === 3 ? 'bg-accent/70' : 'bg-paper/[0.12]'}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

export default function HeroDeck() {
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <DottedGrid className="pointer-events-none absolute -right-1 -top-8 hidden w-16 text-paper/20 sm:block" />
      <DottedGrid className="pointer-events-none absolute -left-7 bottom-2 hidden w-12 text-paper/[0.12] sm:block" />

      <div className="grid grid-cols-1 gap-3">
        {SERVICES.map((service, index) => {
          const Icon = ICONS[service.icon]
          return (
            <a
              key={service.id}
              href={`#${service.id}`}
              className={`group block rounded-2xl border border-paper/10 bg-paper/[0.05] p-3.5 transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:bg-paper/[0.08] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:hover:rotate-0 ${TILT[index]}`}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Preview id={service.id} />
                  <p className="mt-2.5 font-display text-[15px] font-semibold leading-tight text-paper">
                    {service.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-paper/45">{service.who}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper/[0.07] text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
                    <Icon size={13} aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="mt-auto text-paper/25 transition-colors group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      <FloatChip
        logo="/logos/mpesa.svg"
        name="Paid"
        rotate={-6}
        className="pointer-events-none absolute -left-9 top-[31%] z-20 hidden sm:flex"
      />
      <FloatChip
        logo="/logos/whatsapp.svg"
        name="2am"
        rotate={5}
        className="pointer-events-none absolute -right-8 top-[64%] z-20 hidden sm:flex"
      />
    </div>
  )
}
