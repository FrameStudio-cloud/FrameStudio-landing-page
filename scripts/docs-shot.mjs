/**
 * Refreshes the docs screenshot used on /developers.
 *
 * The image is a real capture of the docs, not a mockup. The docs' own sticky
 * header is hidden because the landing page draws its own browser chrome around
 * the image (and a second nav would read as a mistake).
 *
 *   npm run docs:shot
 *   DOCS_URL=http://localhost:5203 npm run docs:shot
 */
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const URL_TO_CAPTURE = process.env.DOCS_URL || 'https://cite-ui.framestudio.co.ke'
const OUT = path.resolve('public/developers/cite-ui-docs.png')
const PAGE = process.env.DOCS_PAGE || 'components/toast'
const HEADING = process.env.DOCS_HEADING || 'Toast'

const candidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)

let browser
try {
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
} catch {
  for (const executablePath of candidates) {
    try {
      browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox'] })
      break
    } catch {
      // try the next candidate
    }
  }
}

if (!browser) {
  console.error('No browser available. Set PUPPETEER_EXECUTABLE_PATH.')
  process.exit(1)
}

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(`${URL_TO_CAPTURE.replace(/\/$/, '')}/${PAGE}`, { waitUntil: 'networkidle0' })

// Client-rendered docs: wait for the page's own heading before photographing it.
await page.waitForFunction(
  (heading) => document.querySelector('h1')?.textContent.trim() === heading,
  { timeout: 15000 },
  HEADING
)
await new Promise((resolve) => setTimeout(resolve, 700))

await page.evaluate(() => {
  const header = document.querySelector('header')
  if (header) header.style.display = 'none'
})
await new Promise((resolve) => setTimeout(resolve, 250))

fs.mkdirSync(path.dirname(OUT), { recursive: true })
await page.screenshot({ path: OUT })

await browser.close()
const { size } = fs.statSync(OUT)
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${Math.round(size / 1024)} kB) from ${URL_TO_CAPTURE}/${PAGE}`)
