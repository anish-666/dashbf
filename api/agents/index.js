const { withCors } = require('../../lib/cors.js');
const { requireAuth } = require('../../lib/auth.js');
const { listAgents } = require('../../lib/bolna.js');

exports.handler = withCors(async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  try {
    requireAuth(event);
  } catch(e){
    return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
  }

  const res = await listAgents();
  if (!res.ok) {
    return { statusCode: 502, body: JSON.stringify({ error: 'provider_error', detail: res.body }) };
  }
  // Normalize a tiny bit
  const agents = (Array.isArray(res.body) ? res.body : res.body?.data || []).map(a => ({
    id: a.id || a.agent_id || a.uuid || a.name,
    agent_name: a.agent_name || a.name || a.title || 'Agent',
    agent_status: a.agent_status || a.status || 'unknown',
    agent_welcome_message: a.agent_welcome_message || a.welcome_message || null,
    raw: a,
  }));
  return { statusCode: 200, body: JSON.stringify(agents) };
});
