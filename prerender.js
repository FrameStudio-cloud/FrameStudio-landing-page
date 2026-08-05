import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

const routes = [
  '/', '/services', '/about', '/portfolio', '/pricing',
  '/contact', '/faq', '/blog', '/terms', '/privacy',
  '/refund', '/cookies',
]

async function getBlogSlugs() {
  try {
    const envPath = path.join(__dirname, '.env')
    let url = ''
    let key = ''
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, 'utf-8')
      url = env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim() || ''
      key = env.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/m)?.[1]?.trim() || ''
    }
    if (!url || !key) return []
    const res = await fetch(
      `${url}/rest/v1/blogs?select=slug,date&published=eq.true&site=in.(framestudio,all)&order=date.desc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (Array.isArray(data) ? data : []).map((r) => ({
      slug: `/blog/${r.slug}`,
      date: (r.date || '').slice(0, 10),
    }))
  } catch {
    return []
  }
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

function writeSitemap(blogPosts) {
  const today = new Date().toISOString().slice(0, 10)
  const base = 'https://framestudio.co.ke'
  const staticRoutes = [
    { path: '/', priority: '1.0' },
    { path: '/services', priority: '0.9' },
    { path: '/about', priority: '0.7' },
    { path: '/portfolio', priority: '0.8' },
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
  const allRoutes = [...routes, ...blogPosts.map((p) => p.slug)]
  console.log(`Prerendering ${allRoutes.length} routes (${blogPosts.length} blog posts)...`)

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
  const browser = await puppeteer.launch({ headless: true })

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
      console.log(`  -> ${path.relative(distDir, outputPath)}`)
    } catch (err) {
      console.error(`  Failed: ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()

  writeSitemap(blogPosts)

  console.log('Prerendering complete!')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
