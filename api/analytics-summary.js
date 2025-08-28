const { withCors } = require('../lib/cors.js');
const { requireAuth } = require('../lib/auth.js');
const { query } = require('../lib/db.js');

const TENANT_ID = process.env.DEFAULT_TENANT_ID || 't_demo';

exports.handler = withCors(async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  try { requireAuth(event); } catch(e){ return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) }; }

  const q = `
    SELECT
      COUNT(*)::int AS total,
      SUM(CASE WHEN status IN ('completed','answered','connected','success') THEN 1 ELSE 0 END)::int AS connected,
      COALESCE(AVG(duration_sec),0)::float AS avg_duration
    FROM calls
    WHERE tenant_id = $1
      AND (started_at IS NOT NULL OR ended_at IS NOT NULL OR TRUE)
  `;
  try {
    const { rows } = await query(q, [TENANT_ID]);
    const row = rows[0] || { total:0, connected:0, avg_duration:0 };
    return { statusCode: 200, body: JSON.stringify(row) };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ total:0, connected:0, avg_duration:0, note:"db_schema_mismatch" }) };
  }
});
