/**
 * The FrameStudio portal mark as inline SVG, so it inherits `currentColor`
 * (white over the hero, black once the nav turns solid) and stays crisp.
 * The animated hero version lives in LogoReveal.jsx.
 */
export default function LogoMark({ className = '' }) {
  return (
    <svg
      viewBox="250 140 750 1050"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="770,500 983,398 987,959 770,850"
        fill="currentColor"
      />
      <polygon
        points="269,421 907,157 909,332 443,523 445,1011 760,899 933,985 479,1168 269,1060"
        fill="currentColor"
      />
    </svg>
  )
}
