// Sends marketing-site form submissions to the real backend (Firestore
// `leads` collection, visible in the admin portal's Leads page) — separate
// from AdminContext's addInquiry/addDemoRequest, which only ever wrote to
// localStorage (or Supabase, if configured) and never reached the server.
const API_BASE = 'https://us-central1-stormglideio.cloudfunctions.net/api'

export function submitLead(payload) {
  return fetch(`${API_BASE}/v1/crm/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error(`lead submit failed: ${res.status}`)
    return res.json()
  })
}
