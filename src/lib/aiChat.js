const API_BASE = 'https://us-central1-stormglideio.cloudfunctions.net/api'

export function sendChatMessage(messages) {
  return fetch(`${API_BASE}/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  }).then(res => {
    if (!res.ok) throw new Error(`chat request failed: ${res.status}`)
    return res.json()
  })
}
