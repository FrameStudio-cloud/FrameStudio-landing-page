import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

const routes = [
  '/', '/services', '/seo', '/about', '/portfolio', '/developers', '/pricing',
  '/contact', '/faq', '/blog', '/terms', '/privacy',
  '/refund', '/cookies',
]

async function getBlogSlugs() {
  return getTable('blogs', 'published=eq.true', 'order=date.desc')
}

async function getProjectSlugs() {
  return getTable('portfolio_projects', 'published=eq.true', 'order=sort_order.asc')
}

async function getTableSlugList(table, siteFilter, orderClause) {
  const envPath = path.join(__dirname, '.env')
  let url = process.env.VITE_SUPABASE_URL || ''
  let key = process.env.VITE_SUPABASE_ANON_KEY || ''
  if (fs.existsSync(envPath) && (!url || !key)) {
    const env = fs.readFileSync(envPath, 'utf-8')
    url = url || env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim() || ''
    key = key || env.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/m)?.[1]?.trim() || ''
  }
  if (!url || !key) return []
  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?select=slug,date&${siteFilter}&site=in.(framestudio,all)&${orderClause}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (Array.isArray(data) ? data : []).map((r) => ({
      slug: r.slug,
      date: (r.date || '').slice(0, 10),
    }))
  } catch {
    return []
  }
}

async function getTable(table, siteFilter, orderClause) {
  const rows = await getTableSlugList(table, siteFilter, orderClause)
  return rows.map((r) => ({
    slug: `/${table === 'blogs' ? 'blog' : 'portfolio'}/${r.slug}`,
    date: r.date,
  }))
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.exe': 'application/octet-stream',
  '.msi': 'application/octet-stream',
  '.sig': 'application/octet-stream',
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  let filePath = path.join(distDir, url.pathname === '/' ? 'index.html' : url.pathname)
  const ext = path.extname(filePath)

  function serveIndex() {
    const indexPath = path.join(distDir, 'index.html')
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(fs.readFileSync(indexPath))
    } else {
      res.writeHead(404)
      res.end('Not found')
    }
  }

  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(fs.readFileSync(filePath))
      return
    }
  }

  if (!ext) {
    serveIndex()
    return
  }

  if (fs.existsSync(filePath)) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(fs.readFileSync(filePath))
  } else {
    serveIndex()
  }
}

async function getAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = http.createServer()
    server.listen(startPort, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1))
    })
  })
}

function writeSitemap(blogPosts, projectPosts) {
  const today = new Date().toISOString().slice(0, 10)
  const base = 'https://www.framestudio.co.ke'
  const staticRoutes = [
    { path: '/', priority: '1.0' },
    { path: '/services', priority: '0.9' },
    { path: '/seo', priority: '0.9' },
    { path: '/about', priority: '0.7' },
    { path: '/portfolio', priority: '0.8' },
    { path: '/developers', priority: '0.8' },
    { path: '/pricing', priority: '0.8' },
    { path: '/contact', priority: '0.7' },
    { path: '/faq', priority: '0.6' },
    { path: '/blog', priority: '0.9' },
    { path: '/terms', priority: '0.3' },
    { path: '/privacy', priority: '0.3' },
    { path: '/refund', priority: '0.3' },
    { path: '/cookies', priority: '0.3' },
  ]

  const urls = staticRoutes
    .map((r) => {
      const lastmod = r.path === '/blog' && blogPosts.length
        ? blogPosts[0].date
        : today
      return `  <url>\n    <loc>${base}${r.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`
    })
    .concat(
      blogPosts.map((p) => `  <url>\n    <loc>${base}${p.slug}</loc>\n    <lastmod>${p.date || today}</lastmod>\n    <priority>0.8</priority>\n  </url>`)
    )
    .concat(
      projectPosts.map((p) => `  <url>\n    <loc>${base}${p.slug}</loc>\n    <lastmod>${p.date || today}</lastmod>\n    <priority>0.7</priority>\n  </url>`)
    )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
  console.log(`Sitemap written with ${urls.length} URLs`)
}

async function prerender() {
  if (!fs.existsSync(distDir)) {
    console.error('dist directory not found. Run `vite build` first.')
    process.exit(1)
  }

  const blogPosts = await getBlogSlugs()
  const projectPosts = await getProjectSlugs()
  const allRoutes = [...routes, ...blogPosts.map((p) => p.slug), ...projectPosts.map((p) => p.slug)]
  console.log(`Prerendering ${allRoutes.length} routes (${blogPosts.length} blog posts, ${projectPosts.length} projects)...`)

  const indexPath = path.join(distDir, 'index.html')
  const originalIndex = path.join(distDir, '_index.original.html')

  if (!fs.existsSync(originalIndex)) {
    fs.copyFileSync(indexPath, originalIndex)
  }

  console.log('Starting prerender server...')
  const port = await getAvailablePort(4173)
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (!path.extname(url.pathname)) {
      const indexContent = fs.readFileSync(originalIndex, 'utf-8')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(indexContent)
      return
    }
    serveStatic(req, res)
  })

  await new Promise((resolve) => server.listen(port, resolve))
  console.log(`Server running on http://localhost:${port}`)

  console.log('Launching Puppeteer...')
  let browser
  let launchError
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  } catch (err) {
    launchError = err
    // Vercel's build image often cannot launch the browser Puppeteer downloaded,
    // even after `puppeteer browsers install chrome`. Try a system binary before
    // giving up, so a deploy can still ship real HTML.
    const candidates = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    ].filter(Boolean)

    for (const executablePath of candidates) {
      try {
        browser = await puppeteer.launch({
          headless: true,
          executablePath,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        })
        console.log(`  launched with ${executablePath}`)
        break
      } catch {
        // try the next candidate
      }
    }
  }

  if (!browser) {
    // Loud on purpose: a skipped prerender used to only emit a warning, so
    // deploys shipped an empty shell (no title, no OG tags) for weeks.
    console.error('')
    console.error('==================================================================')
    console.error('  PRERENDER SKIPPED — deploying SPA shell for every route.')
    console.error('  Link previews and crawlable HTML will fall back to the static')
    console.error('  tags in index.html.')
    console.error(`  Reason: ${launchError?.message}`)
    console.error('  On Vercel: set PUPPETEER_EXECUTABLE_PATH, or install the')
    console.error('  system Chrome/Chromium the build image expects.')
    console.error('==================================================================')
    console.error('')
    server.close()
    writeSitemap(blogPosts, projectPosts)

    // A skipped prerender is a broken deploy, not a warning: every route ships
    // an empty shell with no title, description or OG tags. Google and every
    // link-preview crawler read that. Fail the build so it cannot go unnoticed.
    if (String(process.env.PRERENDER_OPTIONAL || '') === '1') {
      console.error('  PRERENDER_OPTIONAL=1 — shipping the shell on purpose.')
      return
    }

    console.error('  Failing the build. Set PRERENDER_OPTIONAL=1 to ship the shell')
    console.error('  anyway (e.g. a provider outage you cannot wait out).')
    process.exit(1)
  }

  let written = 0
  let failed = 0
  for (const route of allRoutes) {
    console.log(`Prerendering ${route}...`)
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)

    try {
      await page.setViewport({ width: 1440, height: 900 })
      await page.goto(`http://localhost:${port}${route}`, {
        waitUntil: 'networkidle0',
      })

      await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)))

      await page.evaluate(async () => {
        const scrollStep = 300
        const totalHeight = document.body.scrollHeight
        let scrolled = 0
        while (scrolled < totalHeight) {
          window.scrollTo(0, scrolled)
          await new Promise((r) => setTimeout(r, 80))
          scrolled += scrollStep
        }
        window.scrollTo(0, 0)
        await new Promise((r) => setTimeout(r, 2500))
      })

      const html = await page.content()

      const outputPath = route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.slice(1), 'index.html')

      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, html)
      written++
      console.log(`  -> ${path.relative(distDir, outputPath)}`)
    } catch (err) {
      failed += 1
      console.error(`  Failed ${route}: ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()

  writeSitemap(blogPosts, projectPosts)

  // A prerender that "succeeds" without writing anything is the exact failure
  // that shipped an empty shell for weeks. The build only passes when every
  // route was written and the sample has a real <title>.
  const samplePath = path.join(distDir, 'pricing', 'index.html')
  const sampleHtml = fs.existsSync(samplePath) ? fs.readFileSync(samplePath, 'utf8') : ''
  const hasHead = /<title>/i.test(sampleHtml)
  const complete = written === allRoutes.length && failed === 0 && hasHead

  if (complete) {
    console.log(`[prerender] ${written}/${allRoutes.length} routes written with real head tags ✓`)
  } else {
    console.error(
      `[prerender] ${written}/${allRoutes.length} routes written, ${failed} failed, head tags ${
        hasHead ? 'present' : 'MISSING'
      }`
    )

    if (String(process.env.PRERENDER_OPTIONAL || '') === '1') {
      console.error('[prerender] PRERENDER_OPTIONAL=1 — shipping a partial prerender.')
    } else {
      console.error('[prerender] Failing the build: a partial prerender ships shells.')
      console.error('[prerender] Set PRERENDER_OPTIONAL=1 only if you accept that.')
      process.exit(1)
    }
  }

  console.log('Prerendering complete!')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
