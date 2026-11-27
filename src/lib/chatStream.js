/**
 * Client half of the chat SSE stream.
 *
 * `EventSource` cannot POST, and the widget has to send history, so this reads
 * the response body directly and hands each frame to the caller.
 *
 * Frames, in the order the gateway sends them:
 *   meta  { sessionId }   first, so a reload can continue the conversation
 *   delta { text }        the answer (one frame today; token streaming later)
 *   event { kind, summary } when a lead or escalation was filed
 *   done  { answer, model, degraded }
 */
export async function streamChat({ base = '', message, sessionId, history, signal, onEvent }) {
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, sessionId, history }),
    signal,
  });

  if (!response.ok) {
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    const error = new Error(payload.error || 'The assistant could not answer that.');
    error.code = payload.code || 'http_error';
    error.status = response.status;
    throw error;
  }

  if (!response.body) throw new Error('No stream in the response.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() || '';

    for (const frame of frames) {
      let event = 'message';
      let data = '';

      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }

      if (!data) continue;

      try {
        onEvent(event, JSON.parse(data));
      } catch {
        // A malformed frame is not worth killing a conversation over.
      }
    }
  }
}
