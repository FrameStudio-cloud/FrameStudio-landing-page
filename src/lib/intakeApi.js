import { createClient } from '@supabase/supabase-js'
import { demoIntakes, isDemoToken } from '../data/intakeDemo'

/**
 * The only place the public scope-request page gets data.
 *
 * Three doors, all narrow:
 *
 *  - read:  `get_intake_by_token` — one request per token, no anon access to
 *           the `intake_requests` table. A draft returns null, so an unsent
 *           link is a dead page rather than a preview.
 *  - write: `submit_intake` — the token is the authorization. No service key in
 *           this bundle, and no Vercel function to keep in sync.
 *  - touch: `report_intake_step` — writes one text column so an abandoned
 *           request says which question it died on.
 *
 * Errors from the database are written for a person ("Still needed: Your
 * name"), so `submitAnswers` passes the message straight through.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The dev API server (`npm run dev:api` in this repo) mounts the Vercel
// functions locally. Empty in production, where they are same-origin.
const API_BASE = (import.meta.env.VITE_INVOICE_API_BASE || '').replace(/\/$/, '')

// Its own client, like the invoice page: this is a public page and has no
// business sharing auth or cache with a blog read.
const client =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
    : null

function isUuid(token) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token || '')
}

function unwrap(data) {
  return Array.isArray(data) ? data[0] || null : data || null
}

/**
 * Resolve a token to a request.
 *
 * `not-found` and `error` are different answers on purpose: one says the link
 * is dead and offers no retry, the other says the connection dropped.
 */
export async function loadIntake(token) {
  if (isDemoToken(token)) {
    const demo = demoIntakes[token]
    return demo ? { status: 'ok', request: demo, demo: true } : { status: 'not-found' }
  }

  if (!token || !client || !isUuid(token)) return { status: 'not-found' }

  try {
    const { data, error } = await client.rpc('get_intake_by_token', { p_token: token })
    if (error) {
      // PGRST202 = function not found: the backend has not been deployed yet.
      if (error.code === 'PGRST202' || error.code === '404') return { status: 'not-found' }
      return { status: 'error', message: error.message }
    }
    const request = unwrap(data)
    if (!request) return { status: 'not-found' }
    return { status: 'ok', request }
  } catch (error) {
    return { status: 'error', message: error.message }
  }
}

/**
 * Send the answers.
 *
 * Deliberately not optimistic: the page waits for the database to say
 * `submitted`, because the database is what decides whether the form was
 * finished. A "thank you" painted over a rejected submission is the one bug
 * this page cannot afford.
 */
export async function submitAnswers({ token, answers, lastStep }) {
  // The demo answers itself so the whole flow can be reviewed without a row.
  if (isDemoToken(token)) {
    const demo = demoIntakes[token]
    if (!demo) return { status: 'error', message: 'This link is not valid.' }
    return {
      status: 'ok',
      request: { ...demo, status: 'submitted', answers, submitted_at: new Date().toISOString() },
      demo: true,
    }
  }

  if (!client || !isUuid(token)) {
    return { status: 'error', message: 'This link is not valid.' }
  }

  try {
    const { data, error } = await client.rpc('submit_intake', {
      p_token: token,
      p_answers: answers,
      p_last_step: lastStep ?? null,
    })
    if (error) return { status: 'error', message: error.message }
    return { status: 'ok', request: unwrap(data) }
  } catch (error) {
    return { status: 'error', message: error.message }
  }
}

/**
 * "They are on question 7."
 *
 * Fire and forget: a lost step report is not worth an error in front of a
 * client who is halfway through answering. It cannot change their answers.
 */
export function reportStep(token, step) {
  if (isDemoToken(token)) return
  if (!client || !isUuid(token) || !step) return
  client
    .rpc('report_intake_step', { p_token: token, p_step: String(step).slice(0, 120) })
    .then(() => {}, () => {})
}

/**
 * Email the client a copy of what they sent.
 *
 * The only server-side code this page calls. It is bounded on the other side:
 * answered requests only, an address on the row only, and one copy per ten
 * minutes — because the token is the only credential and a mail button anyone
 * holding the link can press is an obvious thing to abuse.
 */
export async function emailCopy({ token }) {
  if (isDemoToken(token)) return { ok: false, reason: 'demo' }

  try {
    const res = await fetch(`${API_BASE}/api/intake-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const payload = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: payload.error || 'We could not send that email.' }
    return { ok: true, to: payload.to }
  } catch {
    return { ok: false, error: 'The connection dropped. Please try again.' }
  }
}
