const { requireAuth } = require('../_lib/auth')
const { listAgents }  = require('../_lib/bolna')


module.exports.handler = async (event) => {
  const auth = requireAuth(event)
  if (auth.statusCode) return auth
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) }
  }

  const resp  = await listAgents()
  const items = Array.isArray(resp.body) ? resp.body : (resp.body?.items || [])
  const rows  = items.map(a => ({
    id: a.id || a.provider_agent_id || a.agent_id || a.uuid,
    name: a.agent_name || a.name || 'Agent',
    provider_agent_id: a.id || a.provider_agent_id || a.agent_id,
    active: true,
  }))

  return { statusCode: 200, body: JSON.stringify(rows) }
}
