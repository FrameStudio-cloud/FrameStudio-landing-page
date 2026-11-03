import { useEffect, useRef } from 'react'

/**
 * The FrameStudio portal mark, drawn once when it scrolls into view — and, on
 * the landing page, redrawn forever on a cycle so the hero keeps moving.
 *
 * Base styles are the *final* state (filled, unclipped), and the `play` class
 * adds keyframes with `animation-fill-mode: both` so the first frame hides it
 * again. That means the logo is always visible if JS, IntersectionObserver or
 * the animation never runs — the prerender snapshot and no-JS crawlers get the
 * finished logo, not an empty box.
 *
 * Timings mirror public/logo-reveal.html. Change them together.
 */
const CSS = `
.fsr {
  --fsr-ease-draw: cubic-bezier(.6, 0, .2, 1);
  --fsr-ease-door: cubic-bezier(.2, .8, .2, 1);
  --fsr-ease-wipe: cubic-bezier(.65, 0, .35, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(14px, 3vw, 22px);
}

.fsr__mark {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.fsr__shape {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 5;
  stroke-linejoin: miter;
  stroke-linecap: butt;
  stroke-miterlimit: 4;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  fill-opacity: 1;
}

.fsr__wordmark {
  font-size: clamp(1.35rem, 5vw, 1.95rem);
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  white-space: nowrap;
  padding: 0.04em 0.02em 0.1em;
  -webkit-clip-path: inset(0 0 0 0);
  clip-path: inset(0 0 0 0);
}

@keyframes fsr-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}
@keyframes fsr-fill {
  from { fill-opacity: 0; }
  to { fill-opacity: 1; }
}
@keyframes fsr-slide {
  from { transform: translateX(-90px); }
  to { transform: translateX(0); }
}
@keyframes fsr-wipe {
  from {
    -webkit-clip-path: inset(0 100% 0 0);
            clip-path: inset(0 100% 0 0);
  }
  to {
    -webkit-clip-path: inset(0 0 0 0);
            clip-path: inset(0 0 0 0);
  }
}
@keyframes fsr-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fsr--play .fsr__shape--main {
  animation:
    fsr-draw 1.5s var(--fsr-ease-draw) .2s both,
    fsr-fill .7s ease-out 1.2s both;
}

.fsr--play .fsr__shape--panel {
  animation:
    fsr-draw 1.2s var(--fsr-ease-draw) .7s both,
    fsr-fill .6s ease-out 1.7s both,
    fsr-slide 1s var(--fsr-ease-door) 1.4s both;
}

.fsr--play .fsr__wordmark {
  animation: fsr-wipe .9s var(--fsr-ease-wipe) 2.3s both;
}

/* the whole lockup bows out before the next pass */
.fsr--exit {
  animation: fsr-exit .45s ease-in forwards;
}

@media (prefers-reduced-motion: reduce) {
  .fsr--play .fsr__shape,
  .fsr--play .fsr__wordmark,
  .fsr--exit {
    animation: none;
  }
}
`

export default function LogoReveal({ wordmark = true, loop = true, hold = 1800, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timer
    let observer

    // Restart from frame zero: drop the class, force a reflow, put it back.
    const draw = () => {
      el.classList.remove('fsr--exit', 'fsr--play')
      void el.offsetWidth
      el.classList.add('fsr--play')
    }

    // One pass ends at 4.1s; then hold, fade out, and go again.
    const cycle = () => {
      timer = setTimeout(() => {
        el.classList.add('fsr--exit')
        timer = setTimeout(() => {
          draw()
          cycle()
        }, 450)
      }, 4100 + hold)
    }

    const start = () => {
      draw()
      if (loop) cycle()
    }

    if (typeof IntersectionObserver === 'undefined') {
      start()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          start()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)

    return () => {
      clearTimeout(timer)
      if (observer) observer.disconnect()
    }
  }, [loop, hold])

  return (
    <>
      <style>{CSS}</style>
      <div ref={ref} className={`fsr ${className}`}>
        <svg
          viewBox="250 140 750 1050"
          className="fsr__mark"
          aria-hidden="true"
          focusable="false"
        >
          <polygon
            className="fsr__shape fsr__shape--panel"
            pathLength="1"
            points="770,500 983,398 987,959 770,850"
          />
          <polygon
            className="fsr__shape fsr__shape--main"
            pathLength="1"
            points="269,421 907,157 909,332 443,523 445,1011 760,899 933,985 479,1168 269,1060"
          />
        </svg>
        {wordmark && <span className="fsr__wordmark">FrameStudio</span>}
      </div>
    </>
  )
}
