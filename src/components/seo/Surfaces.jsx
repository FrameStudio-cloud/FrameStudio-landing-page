import { SURFACES } from '../../lib/seo'

/**
 * The places a business gets found, as marks.
 *
 * Recognition first: a visitor who spots the ChatGPT or Maps logo knows the
 * question ("do I show up there?") before reading a word. So the row is a logo,
 * a name, and the one fix — no cards, no numbers, no "step 1".
 *
 * The mark is monochrome ink, not brand colour, because five coloured logos in a
 * row would fight the accent and look like an ad. Colour would also suggest we
 * are a partner of these platforms, which we are not.
 */
export default function Surfaces() {
  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {SURFACES.map((surface) => (
        <li
          key={surface.name}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[auto_190px_minmax(0,1fr)] sm:gap-x-6"
        >
          <span className="row-span-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-paper sm:row-span-1">
            <img
              src={surface.logo}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-[18px] w-[18px] object-contain opacity-80"
            />
          </span>

          <h3 className="self-end font-display text-[15px] font-semibold leading-tight text-ink sm:self-auto">
            {surface.name}
          </h3>

          <p className="col-start-2 self-start text-[13.5px] leading-relaxed text-ink-soft sm:col-start-3 sm:self-auto">
            {surface.line}
          </p>
        </li>
      ))}
    </ul>
  )
}
