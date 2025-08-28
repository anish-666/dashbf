const { withCors } = require('../lib/cors.js');
const { requireAuth } = require('../lib/auth.js');
const { startCall, listAgents } = require('../lib/bolna.js');
const { query } = require('../lib/db.js');
const { v4: uuidv4 } = require('uuid');

const TENANT_ID = process.env.DEFAULT_TENANT_ID || 't_demo';

exports.handler = withCors(async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  try { requireAuth(event); } catch(e){ return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) }; }

  const body = JSON.parse(event.body || '{}');
  const numbers = (body.numbers || []).filter(Boolean);
  let agentId = body.agentId;

  if (!numbers.length) return { statusCode: 400, body: JSON.stringify({ error: 'no_numbers' }) };

  if (!agentId) {
    const agents = await listAgents();
    if (agents.ok && Array.isArray(agents.body) && agents.body.length) {
      agentId = agents.body[0].id || agents.body[0].agent_id;
    }
  }
  if (!agentId) return { statusCode: 400, body: JSON.stringify({ error: 'no_agent' }) };

  const created = [];
  const provider = [];
  for (const phone of numbers) {
    const id = uuidv4();
    // call provider
    const r = await startCall(agentId, phone);
    provider.push({ phone, ok: r.ok, status: r.status, body: r.body || null });
    // persist basic record regardless, so UI shows "created"
    try {
      await query(
        `INSERT INTO calls (id, tenant_id, agent_id, phone, status, started_at, provider_agent_id, provider_call_id)
         VALUES ($1,$2,$3,$4,$5, NOW(), $6, $7)`,
        [id, TENANT_ID, agentId, phone, r.ok ? 'created' : 'error', agentId, r.body?.id || r.body?.call_id || null]
      );
    } catch (e) {
      // best-effort; ignore schema mismatches
    }
    created.push(id);
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, created_count: created.length, created, provider }) };
});
