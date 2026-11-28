import { useState } from 'react'
import { Smartphone, Tablet, Monitor } from 'lucide-react'

/**
 * Proof of "mobile-first" without a screenshot: one layout, watched reflowing.
 *
 * There is no measurement here on purpose. The inner page is a plain block whose
 * max-width changes; everything inside uses `auto-fill` grids and wrapping flex,
 * so it reflows on its own the way a real page would. That means the demo can
 * never drift from the claim — if it looks broken at 390px, the layout is broken.
 *
 * On a phone the frame is narrower than the widest option anyway, so the ground
 * truth is whatever the visitor's own screen is showing.
 */

const VIEWPORTS = [
  { id: 'phone', label: 'Phone', icon: Smartphone, maxWidth: '390px', bezel: true },
  { id: 'tablet', label: 'Tablet', icon: Tablet, maxWidth: '768px', bezel: true },
  { id: 'desktop', label: 'Desktop', icon: Monitor, maxWidth: '100%', bezel: false },
]

const PRODUCTS = [
  { name: 'Leather sandals', price: 'KSh 2,800', tone: 'bg-accent/15' },
  { name: 'Canvas tote', price: 'KSh 1,200', tone: 'bg-ink/10' },
  { name: 'Beaded belt', price: 'KSh 1,650', tone: 'bg-accent/10' },
  { name: 'Woven basket', price: 'KSh 950', tone: 'bg-ink/[0.07]' },
  { name: 'Maasai throw', price: 'KSh 3,400', tone: 'bg-accent/[0.08]' },
  { name: 'Soapstone bowl', price: 'KSh 1,100', tone: 'bg-ink/[0.05]' },
]

export default function DeviceFrame() {
  const [active, setActive] = useState('desktop')
  const viewport = VIEWPORTS.find((v) => v.id === active) || VIEWPORTS[2]

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 px-4 py-3 sm:px-6">
        <div className="flex gap-1" role="group" aria-label="Preview width">
          {VIEWPORTS.map(({ id, label, icon: Icon }) => {
            const selected = active === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                aria-pressed={selected}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  selected
                    ? 'bg-ink text-paper'
                    : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
        <p className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35">
          One layout · no separate mobile site
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-ink/[0.04] px-4 py-5 sm:px-8">
        <div
          className={`mx-auto w-full overflow-hidden transition-[max-width] duration-500 ease-out motion-reduce:transition-none ${
            viewport.bezel
              ? 'rounded-[30px] border-[7px] border-ink shadow-[0_30px_60px_-40px_rgba(11,11,11,0.8)]'
              : 'rounded-xl border border-ink/10 shadow-[0_20px_50px_-40px_rgba(11,11,11,0.7)]'
          }`}
          style={{ maxWidth: viewport.maxWidth }}
        >
          <div className="flex h-[330px] flex-col bg-white sm:h-[360px]">
            {/* shop chrome */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-ink/10 px-3 py-2.5 sm:px-4">
              <span className="font-display text-[13px] font-semibold text-ink">Sample store</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/35">
                demo
              </span>
              <nav className="ml-auto flex items-center gap-3">
                <span className="text-[10px] text-ink/55">Shop</span>
                <span className="text-[10px] text-ink/55">About</span>
                <span className="text-[10px] text-ink/55">Contact</span>
                <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-semibold text-paper">
                  Cart 2
                </span>
              </nav>
            </div>

            {/* hero */}
            <div className="px-3 pt-4 pb-3 sm:px-5">
              <p className="font-display text-[18px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[22px]">
                Quality products,
                <br />
                delivered to you.
              </p>
              <p className="mt-1.5 max-w-[38ch] text-[10px] leading-relaxed text-ink/55">
                Shop from trusted Kenyan stores. Pay with M-Pesa, delivered countrywide.
              </p>
              <span className="mt-3 inline-block rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold text-paper">
                Shop now
              </span>
            </div>

            {/* product grid: auto-fit is the whole trick */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(92px,1fr))] gap-2 px-3 pb-3 sm:px-5">
              {PRODUCTS.map((product) => (
                <div key={product.name} className="rounded-lg border border-ink/10 p-1.5">
                  <div className={`h-10 rounded ${product.tone}`} aria-hidden="true" />
                  <p className="mt-1.5 text-[10px] font-medium leading-tight text-ink">{product.name}</p>
                  <p className="text-[10px] text-ink/55">{product.price}</p>
                  <span className="mt-1 block rounded bg-ink/5 py-0.5 text-center text-[9px] font-semibold text-ink/70">
                    Add
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ink/10 px-3 py-2">
              <span className="text-[9px] font-medium text-ink/70">Pay with M-Pesa</span>
              <span className="text-[9px] text-ink/40">Delivered across Kenya</span>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-paper to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
