import { useCallback, useEffect, useRef, useState } from 'react'
import { streamChat } from '../../lib/chatStream'
import { OPENING, SUGGESTIONS, whatsappHref } from './chatConfig'

let seed = 0
const nextId = () => `m${++seed}`

/**
 * The conversation, now driven by the dashboard's agent gateway instead of a
 * scripted flow.
 *
 * One turn:
 *   visitor message + empty bot bubble → thinking
 *   meta   → remember the session so a reload continues the same conversation
 *   delta  → fill the bubble
 *   event  → a lead was filed, so the WhatsApp handoff earns its place
 *   done   → idle, or `sent` when a lead landed
 *
 * The gateway is the only place that knows what an answer *is*; this hook only
 * moves frames into state.
 */
export default function useChat() {
  const [messages, setMessages] = useState(() => [
    { id: nextId(), from: 'bot', text: OPENING },
  ])
  const [status, setStatus] = useState('idle') // idle | thinking | sent | error
  const [suggestions, setSuggestions] = useState(SUGGESTIONS)
  const [whatsapp, setWhatsapp] = useState('')

  const sessionRef = useRef(null)
  const messagesRef = useRef(messages)
  const busy = useRef(false)
  const lastTurn = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(
    () => () => {
      abortRef.current?.abort()
    },
    []
  )

  const runTurn = useCallback(async ({ text, botId, history }) => {
    busy.current = true
    setStatus('thinking')
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    let lead = false
    let answered = ''

    try {
      await streamChat({
        base: import.meta.env.VITE_CHAT_API_BASE || '',
        message: text,
        sessionId: sessionRef.current,
        history,
        signal: controller.signal,
        onEvent(event, data) {
          if (event === 'meta' && data.sessionId) {
            sessionRef.current = data.sessionId
          } else if (event === 'delta' && data.text) {
            answered = data.text
            setMessages((list) =>
              list.map((message) =>
                message.id === botId ? { ...message, text: data.text } : message
              )
            )
          } else if (event === 'event') {
            if (data.kind === 'lead') lead = true
          } else if (event === 'done' && data.answer) {
            answered = data.answer
            setMessages((list) =>
              list.map((message) =>
                message.id === botId ? { ...message, text: data.answer } : message
              )
            )
          }
        },
      })

      if (lead) {
        setStatus('sent')
        setWhatsapp(whatsappHref(text))
      } else {
        setStatus('idle')
      }
    } catch (err) {
      if (err?.name === 'AbortError') return

      // The gateway's error text is written for the visitor, so show it rather
      // than a generic apology.
      const text =
        err?.message && err.message.length < 160
          ? err.message
          : "That didn't go through. Try again, or message us on WhatsApp."
      setMessages((list) =>
        list.map((message) => (message.id === botId ? { ...message, text } : message))
      )
      setStatus('error')
    } finally {
      busy.current = false
    }
  }, [])

  const send = useCallback(
    (raw) => {
      const text = String(raw || '').trim().slice(0, 600)
      if (!text || busy.current) return

      const history = messagesRef.current
        .filter((message) => message.text)
        .slice(-6)
        .map((message) => ({
          role: message.from === 'user' ? 'user' : 'assistant',
          content: message.text,
        }))

      const botId = nextId()
      setMessages((list) => [
        ...list,
        { id: nextId(), from: 'user', text },
        { id: botId, from: 'bot', text: '' },
      ])
      setSuggestions([])

      lastTurn.current = { text, botId, history }
      runTurn({ text, botId, history })
    },
    [runTurn]
  )

  const retry = useCallback(() => {
    const last = lastTurn.current
    if (!last || busy.current) return

    setMessages((list) =>
      list.map((message) => (message.id === last.botId ? { ...message, text: '' } : message))
    )
    runTurn(last)
  }, [runTurn])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    busy.current = false
    sessionRef.current = null
    lastTurn.current = null
    setMessages([{ id: nextId(), from: 'bot', text: OPENING }])
    setStatus('idle')
    setSuggestions(SUGGESTIONS)
    setWhatsapp('')
  }, [])

  return { messages, status, suggestions, whatsapp, send, retry, reset }
}
