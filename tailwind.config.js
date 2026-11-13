/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* Four fonts, four jobs. Do not use one for another's job.
         display -> headlines (Bricolage Grotesque)
         serif   -> one or two italic words inside a headline (Instrument Serif)
         sans    -> body copy, buttons, UI (General Sans)
         mono    -> labels, eyebrows, stats, tags, code (Space Mono)         */
      fontFamily: {
        sans: ['General Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Bricolage Grotesque', 'General Sans', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /* black stays the base; cream replaces sterile white; the accent is the
         one loud voice. `accent` reads its values from CSS vars so a single
         `.theme-*` class can swap it per route (see src/index.css). */
      colors: {
        ink: {
          DEFAULT: '#0B0B0B',
          2: '#171716',
          soft: '#52524B',
          faint: '#8A8A80',
        },
        paper: '#FBF8F0',
        cream: '#F3EDDF',
        accent: {
          DEFAULT: 'rgb(var(--fs-accent) / <alpha-value>)',
          deep: 'rgb(var(--fs-accent-deep) / <alpha-value>)',
        },
      },

      borderRadius: {
        '4xl': '2rem',
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 38s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
