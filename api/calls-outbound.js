const { requireAuth } = require('./_lib/auth')
const { startCall }  = require('./_lib/bolna')
const { Client }     = require('pg')
const { v4: uuidv4 } = require('uuid')

module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) }
  }

  const auth = requireAuth(event)
  if (auth.statusCode) return auth

  let body = {}
  try { body = JSON.parse(event.body || '{}') } catch {}
  let numbers = body.numbers || []
  if (typeof numbers === 'string') {
    numbers = numbers.split(/[\s,;\n]+/).map(s => s.trim()).filter(Boolean)
  }
  const agentId = body.agentId || process.env.BOLNA_AGENT_ID
  if (!agentId) return { statusCode: 400, body: JSON.stringify({ error: 'missing_agent_id' }) }
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'no_numbers' }) }
  }

  const provider = []
  for (const phone of numbers) {
    const r = await startCall({ agent_id: agentId, recipient_phone_number: phone })
    const provider_call_id = r.body?.call_id || r.body?.id || null
    provider.push({ phone, ok: r.ok, status: r.status, id: provider_call_id, body: r.body })

    // optimistic DB insert so overview updates
    try {
      const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
      await client.connect()
      await client.query(
        `insert into calls (id, tenant_id, agent_id, provider_agent_id, provider_call_id, phone, status, direction, started_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8, now())`,
        [uuidv4(), auth.tenant_id || 't_demo', agentId, agentId, provider_call_id, phone, r.ok ? 'created' : 'error', 'outbound']
      )
      await client.end()
    } catch { /* swallow DB errors */ }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      created_count: provider.filter(p => p.ok).length,
      created: provider.filter(p => p.id).map(p => p.id),
      provider
    })
  }
}
