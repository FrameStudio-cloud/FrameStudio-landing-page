import { INTEGRATIONS } from '../../lib/services'
import LogoMark from '../LogoMark'

/**
 * NOT CURRENTLY RENDERED — kept for reference.
 *
 * This is the integration orbit. It was replaced on /services by the brand wall
 * (`BrandWall.jsx`), which reads faster and needs no captions. The component and
 * its `fs-orbit-*` keyframes in src/index.css still work if the orbit is ever
 * wanted back, but nothing imports them today.
 *
 * The integration constellation.
 *
 * The badges are real marks, downloaded into `public/logos/` rather than
 * hotlinked — people read a badge before they read a name, and a missing logo is
 * worse than no logo at all.
 *
 * Two rings turn in opposite directions and every badge counter-rotates at the
 * same duration, so the marks stay upright. All of it stops under
 * `prefers-reduced-motion` (see src/index.css). The orbit itself is decorative
 * and hidden from assistive tech; the list underneath is the real content, and
 * it is the only place Daraja appears, because Daraja has no mark of its own.
 */

const WITH_LOGOS = INTEGRATIONS.filter((item) => item.logo)
const RING_A = WITH_LOGOS.slice(0, 5)
const RING_B = WITH_LOGOS.slice(5)

function Ring({ items, radiusVar, ringClass, badgeClass }) {
  return (
    <div className={`absolute inset-0 ${ringClass}`}>
      {items.map((item, index) => {
        const angle = (360 / items.length) * index
        return (
          <div key={item.name}>
            <span
              className="absolute left-1/2 top-1/2 h-px origin-left bg-paper/10"
              style={{
                width: `var(${radiusVar})`,
                transform: `rotate(${angle - 90}deg)`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(calc(-1 * var(${radiusVar}))) rotate(${-angle}deg)`,
              }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-1/2">
                <div className={badgeClass}>
                  <span className="flex h-11 items-center rounded-xl bg-paper px-2.5 shadow-[0_18px_30px_-24px_rgba(0,0,0,0.9)] sm:h-12 sm:px-3">
                    <img
                      src={item.logo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-4 w-auto max-w-[76px] object-contain sm:h-[18px]"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function IntegrationsOrbit() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[560px] [--ra:88px] [--rb:126px] sm:h-[500px] sm:max-w-[640px] sm:[--ra:150px] sm:[--rb:215px]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-paper/15"
        style={{ width: 'calc(var(--ra) * 2)', height: 'calc(var(--ra) * 2)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-paper/10"
        style={{ width: 'calc(var(--rb) * 2)', height: 'calc(var(--rb) * 2)' }}
        aria-hidden="true"
      />

      <div aria-hidden="true" className="absolute inset-0">
        <Ring items={RING_A} radiusVar="--ra" ringClass="fs-orbit-a" badgeClass="fs-orbit-a-badge" />
        <Ring items={RING_B} radiusVar="--rb" ringClass="fs-orbit-b" badgeClass="fs-orbit-b-badge" />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <LogoMark className="mx-auto h-7 w-7 text-accent sm:h-8 sm:w-8" />
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45">
          framestudio
        </p>
      </div>
    </div>
  )
}

/**
 * The readable version, and the only place Daraja appears — it has no mark of
 * its own, which is why it never joins the orbit.
 */
export function IntegrationsList() {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-paper/10 pt-7 sm:grid-cols-3 lg:grid-cols-5">
      {INTEGRATIONS.map((item) => (
        <li key={item.name} className="flex items-center gap-3">
          <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md bg-paper/95">
            {item.logo ? (
              <img
                src={item.logo}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-3.5 w-auto max-w-[32px] object-contain"
              />
            ) : (
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.06em] text-ink/70">
                API
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-paper/85">{item.name}</span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35">
              {item.detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
