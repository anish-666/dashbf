const BASE = process.env.BOLNA_BASE || 'https://api.bolna.ai'
const KEY  = process.env.BOLNA_API_KEY

async function bolna(path, init = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  })
  const text = await res.text()
  let body; try { body = JSON.parse(text) } catch { body = text }
  return { ok: res.ok, status: res.status, body }
}

const startCall  = ({ agent_id, recipient_phone_number }) =>
  bolna('/call', { method: 'POST', body: JSON.stringify({ agent_id, recipient_phone_number }) })

const listAgents = () => bolna('/agent/all')

module.exports = { bolna, startCall, listAgents }
