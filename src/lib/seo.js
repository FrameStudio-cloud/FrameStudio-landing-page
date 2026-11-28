/**
 * /seo and the band on the home page read from here.
 *
 * Rules that keep the page honest:
 * - `logo` points at a real mark downloaded into `public/logos/` (simple-icons).
 *   The mark is there for recognition — ChatGPT and Google are doors a visitor
 *   already knows, and a logo answers "where do I show up?" faster than a
 *   sentence does. It does not imply a partnership, so the copy never says
 *   "trusted by" or "certified by".
 * - `line` is what we actually change, in as few words as possible. If a claim
 *   cannot be pointed at a fix on a page, it does not belong in this file.
 * - No prices. A quote is written per project; `/pricing` owns any figures.
 */

export const SURFACES = [
  {
    name: 'Google Search',
    logo: '/logos/search-google.svg',
    line: 'One page per thing you sell, with a title that says it.',
  },
  {
    name: 'Google Maps',
    logo: '/logos/maps.svg',
    line: 'Profile, hours, photos and categories, kept true.',
  },
  {
    name: 'ChatGPT',
    logo: '/logos/chatgpt.svg',
    line: 'Text a crawler can read, on a page that loads fast.',
  },
  {
    name: 'Gemini',
    logo: '/logos/gemini.svg',
    line: 'Facts in structured data — price, area, hours — not prose.',
  },
  {
    name: 'Perplexity',
    logo: '/logos/perplexity.svg',
    line: 'A page worth citing: a real author, a real date.',
  },
]
