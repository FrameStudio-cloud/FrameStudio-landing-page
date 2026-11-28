import { STACK_BRANDS } from '../../lib/services'

/**
 * The brand wall — the object from the Postiz board, on our palette.
 *
 * Words do not belong on the tiles. The whole point is recognition: a visitor
 * scanning for M-Pesa or React stops because they know the mark, and a caption
 * under it only slows that down. Screen readers still get every name.
 *
 * The brick stagger comes from row lengths (5 / 4 / 5) plus the empty edge tiles
 * on the middle row, exactly like the reference — no transforms, so nothing
 * overlaps or clips at any width.
 */

const ROWS = [
  STACK_BRANDS.slice(0, 5),
  [null, ...STACK_BRANDS.slice(5, 9), null],
  STACK_BRANDS.slice(9),
]

const TILE =
  'flex h-14 w-14 items-center justify-center rounded-xl sm:h-20 sm:w-20 sm:rounded-2xl'
const EMPTY = 'rounded-xl border border-paper/[0.06] bg-paper/[0.02] sm:rounded-2xl'

export default function BrandWall() {
  return (
    <ul className="flex flex-col items-center gap-2 sm:gap-3">
      {ROWS.map((row, rowIndex) => (
        <li key={rowIndex} className="flex justify-center gap-2 sm:gap-3">
          <ul className="flex gap-2 sm:gap-3">
            {row.map((brand, index) =>
              brand ? (
                <li key={brand.name} className={`${TILE} border border-paper/10 bg-paper/[0.05]`}>
                  <img
                    src={brand.logo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`w-auto object-contain ${
                      brand.wide
                        ? 'h-5 max-w-[56px] sm:h-6 sm:max-w-[64px]'
                        : 'h-6 max-w-[30px] sm:h-9 sm:max-w-[40px]'
                    }`}
                  />
                  <span className="sr-only">{brand.name}</span>
                </li>
              ) : (
                <li key={`empty-${index}`} aria-hidden="true" className={`${TILE} ${EMPTY}`} />
              )
            )}
          </ul>
        </li>
      ))}
    </ul>
  )
}
