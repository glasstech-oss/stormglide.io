const API_BASE = 'https://us-central1-stormglideio.cloudfunctions.net/api'

// Reads the /v1/chat SSE stream and reports each text chunk via onDelta as
// it arrives, so the UI can render tokens live instead of waiting for the
// full reply — the response body is a stream of `data: {...}\n\n` frames.
export async function sendChatMessage(messages, { onDelta } = {}) {
  const res = await fetch(`${API_BASE}/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok || !res.body) throw new Error(`chat request failed: ${res.status}`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''
  let booked = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const frames = buffer.split('\n\n')
    buffer = frames.pop()
    for (const frame of frames) {
      const line = frame.trim()
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      const evt = JSON.parse(payload)
      if (evt.delta) {
        fullText += evt.delta
        onDelta?.(fullText)
      } else if (evt.final) {
        fullText = evt.final
        booked = !!evt.booked
        onDelta?.(fullText)
      }
    }
  }

  if (!fullText) throw new Error('empty reply')
  return { reply: fullText, booked }
}
