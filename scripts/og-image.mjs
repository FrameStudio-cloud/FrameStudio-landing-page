import puppeteer from 'puppeteer'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/**
 * Renders scripts/og-card.html to public/og-image.png (1200x630).
 *
 * The card is HTML rather than a design file so it stays editable: change the
 * copy or the tokens in og-card.html and re-run `node scripts/og-image.mjs`.
 * Fonts are fetched from the same CDNs the site uses, so the card cannot drift
 * away from the live typography.
 */
const here = dirname(fileURLToPath(import.meta.url))
const card = join(here, 'og-card.html')
const out = join(here, '..', 'public', 'og-image.png')

const fallbacks = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

let browser
try {
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
} catch {
  for (const executablePath of fallbacks) {
    try {
      browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox'] })
      break
    } catch {
      // try the next candidate
    }
  }
}

if (!browser) {
  console.error('[og] no Chrome could be launched; card not regenerated')
  process.exit(1)
}

const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(`file://${card.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0', timeout: 60000 })
// Never screenshot before the webfonts have swapped in, or the card renders in
// a fallback face.
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 250))
await page.screenshot({ path: out, type: 'png' })
await browser.close()

console.log(`[og] wrote ${out}`)
