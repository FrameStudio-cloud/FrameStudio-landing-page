import http from 'node:http'
import fs from 'node:fs'
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
  // The scope request's "email me a copy". Mounted here for the same reason as
  // the invoice ones: `vite dev` does not run the Vercel functions.
  '/api/intake-copy': 'intake-copy.js',
  // The site chat adapter, which streams. It needs `write` on the response shim
  // below; without it the whole answer would arrive at once.
  '/api/chat': 'chat.js',
}

/**
 * Read a .env file by hand rather than with `process.loadEnvFile`, whose
 * overwrite behaviour differs between Node versions. `.env.local` is applied
 * last and wins, which is how the local gateway URL stays out of the file that
 * gets imported into Vercel.
 */
function loadEnvFile(file, override) {
  try {
    const text = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
      if (!match) continue
      if (!override && process.env[match[1]] !== undefined) continue
      process.env[match[1]] = match[2]
    }
  } catch {
    // Missing files are normal: .env.local only exists on a developer machine.
  }
}

loadEnvFile('.env', false)
loadEnvFile('.env.local', true)

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
  let started = false
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-paystack-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  const start = () => {
    if (!started) {
      started = true
      nodeRes.writeHead(statusCode, headers)
    }
    return nodeRes
  }

  return {
    setHeader(key, value) {
      headers[key] = value
    },
    status(code) {
      statusCode = code
      return this
    },
    // Streaming routes need this. `json`/`send`/`end` still finish the response
    // in one go, so the invoice handlers are unaffected.
    write(chunk) {
      start()
      return nodeRes.write(chunk)
    },
    json(body) {
      headers['Content-Type'] = 'application/json'
      start()
      nodeRes.end(JSON.stringify(body))
      return this
    },
    end(chunk) {
      start()
      nodeRes.end(chunk)
      return this
    },
    send(text) {
      start()
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
