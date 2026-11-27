/**
 * POST /api/chat — the website adapter for the agent gateway.
 *
 * Deliberately thin. It proves the request came from this site, forwards it to
 * the dashboard with the agent's shared secret, and pipes the stream back. The
 * persona, the tools, the limits and the records all live in the gateway: if
 * this file grew a system prompt, the second subagent would be a second brain.
 *
 * The secret is server-side only. A browser that learns it could spend the
 * model budget, so it must never be a VITE_ variable.
 */

const GATEWAY = String(process.env.AGENT_GATEWAY_URL || '').replace(/\/+$/, '');
const AGENT_KEY = String(process.env.AGENT_KEY_SITE_CHAT || '').trim();
const EXTRA_ORIGIN = String(process.env.CHAT_ALLOWED_ORIGIN || '').trim();

const MAX_MESSAGE = 600;
const MAX_HISTORY = 6;
const WINDOW_MS = 60_000;
const PER_WINDOW = 20;

/** Per-instance only. The real limits are per visitor in the gateway; this is a
 *  cheap shield in front of them, not a security control. */
const hits = new Map();

function overLimit(ip) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();

  const record = hits.get(ip);
  if (!record || now - record.at > WINDOW_MS) {
    hits.set(ip, { at: now, count: 1 });
    return false;
  }
  record.count += 1;
  return record.count > PER_WINDOW;
}

function originAllowed(req) {
  const origin = String(req.headers?.origin || '');
  if (!origin) return true; // curl, server-to-server

  try {
    const { host, hostname } = new URL(origin);
    if (host === req.headers?.host) return true;
    if (EXTRA_ORIGIN && host === EXTRA_ORIGIN) return true;
    // The dev API runs on a different port than the Vite server.
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  if (!GATEWAY || !AGENT_KEY) {
    return res.status(503).json({
      error: 'Chat is not configured on this deployment.',
      code: 'not_configured',
    });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const message = String(body.message || '').trim().slice(0, MAX_MESSAGE);

  if (!message) return res.status(400).json({ error: 'Empty message.', code: 'empty' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Not allowed.', code: 'origin' });

  const ip = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim();
  if (overLimit(ip)) {
    return res.status(429).json({ error: 'Too many messages. Give it a minute.', code: 'rate_limited' });
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter((turn) => turn && typeof turn.content === 'string')
        .slice(-MAX_HISTORY)
        .map((turn) => ({
          role: turn.role === 'user' || turn.role === 'visitor' ? 'visitor' : 'agent',
          content: turn.content.slice(0, 400),
        }))
    : [];

  let upstream;
  try {
    upstream = await fetch(`${GATEWAY}/api/agents`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${AGENT_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        agent: 'site-chat',
        message,
        sessionId: body.sessionId || null,
        history,
      }),
      signal: AbortSignal.timeout(35_000),
    });
  } catch {
    return res.status(504).json({
      error: 'The assistant is unreachable right now.',
      code: 'gateway_unreachable',
    });
  }

  if (!upstream.ok) {
    const raw = await upstream.text().catch(() => '');
    let payload = {};
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = {};
    }
    return res.status(upstream.status).json({
      error: payload.error || 'The assistant could not answer that.',
      code: payload.code || 'upstream_error',
    });
  }

  res.setHeader('content-type', 'text/event-stream; charset=utf-8');
  res.setHeader('cache-control', 'no-cache, no-transform');
  res.setHeader('x-accel-buffering', 'no');

  const reader = upstream.body?.getReader();
  if (!reader) {
    res.end();
    return;
  }

  const decoder = new TextDecoder();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } catch {
    // The visitor closed the tab or the gateway died mid-stream. The turn is
    // already recorded server-side; there is nothing to repair here.
  }

  res.end();
}
