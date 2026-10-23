import http from 'node:http'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pathToFileURL } from 'node:url'

/**
 * Local runner for the Vercel functions in `api/`.
 *
 * Vercel serves those files automatically in production; `vite dev` does not.
 * This mounts the same handlers on :5199 so "Pay" can be clicked locally
 * without deploying. It is a development tool only — nothing here ships.
 *
 *   node scripts/dev-api.mjs          (or: npm run dev:api)
 *
 * Point the app at it with VITE_INVOICE_API_BASE=http://localhost:5200
 */

const PORT = Number(process.env.API_PORT || 5200)
const apiDir = path.resolve(process.cwd(), 'api')

const ROUTES = {
  '/api/invoice-pay-init': 'invoice-pay-init.js',
  '/api/invoice-pay-verify': 'invoice-pay-verify.js',
  '/api/paystack-webhook': 'paystack-webhook.js',
  '/api/invoice-send': 'invoice-send.js',
}

try {
  process.loadEnvFile(path.resolve(process.cwd(), '.env'))
} catch {
  console.warn('[dev-api] no .env found — using the ambient environment')
}

function readAll(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

function makeRes(nodeRes) {
  let statusCode = 200
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-paystack-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
  return {
    setHeader(key, value) {
      headers[key] = value
    },
    status(code) {
      statusCode = code
      return this
    },
    json(body) {
      headers['Content-Type'] = 'application/json'
      nodeRes.writeHead(statusCode, headers)
      nodeRes.end(JSON.stringify(body))
      return this
    },
    end() {
      nodeRes.writeHead(statusCode, headers)
      nodeRes.end()
      return this
    },
    send(text) {
      nodeRes.writeHead(statusCode, headers)
      nodeRes.end(text)
      return this
    },
  }
}

const server = http.createServer(async (req, res) => {
  const started = Date.now()
  const pathname = (req.url || '').split('?')[0].replace(/\/+$/, '')

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-paystack-signature',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '600',
    })
    res.end()
    return
  }

  const file = ROUTES[pathname]
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ error: `No dev route for ${pathname}` }))
    return
  }

  const raw = await readAll(req)

  // Vercel's Node runtime hands handlers a request with a parsed body (unless
  // the function opted out of the body parser) and still allows streaming it.
  const fakeReq = new Readable({ read() {} })
  fakeReq.push(raw)
  fakeReq.push(null)
  fakeReq.method = req.method
  fakeReq.headers = req.headers
  fakeReq.url = req.url
  try {
    fakeReq.body = raw.length ? JSON.parse(raw.toString('utf8')) : {}
  } catch {
    fakeReq.body = {}
  }

  try {
    const mod = await import(pathToFileURL(path.join(apiDir, file)).href)
    await mod.default(fakeReq, makeRes(res))
    console.log(`${req.method} ${pathname} → ${res.statusCode} (${Date.now() - started}ms)`)
  } catch (err) {
    console.error(`${req.method} ${pathname} threw`, err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Dev API crashed — see the terminal.' }))
    }
  }
})

server.listen(PORT, () => {
  console.log(`[dev-api] invoice functions on http://localhost:${PORT}`)
  for (const route of Object.keys(ROUTES)) console.log(`[dev-api]   ${route}`)
})
