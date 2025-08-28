const { withCors } = require('../lib/cors.js');
const { requireAuth } = require('../lib/auth.js');
const { query } = require('../lib/db.js');

const TENANT_ID = process.env.DEFAULT_TENANT_ID || 't_demo';

exports.handler = withCors(async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  try { requireAuth(event); } catch(e){ return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) }; }

  const window = (event.queryStringParameters && event.queryStringParameters.window) || '7d';
  const days = window === '30d' ? 30 : 7;

  const q = `
    SELECT
      to_char(date_trunc('day', COALESCE(started_at, NOW())),'YYYY-MM-DD') AS day,
      COUNT(*)::int AS total,
      COALESCE(AVG(duration_sec),0)::float AS avg_duration
    FROM calls
    WHERE tenant_id = $1
      AND (started_at IS NOT NULL AND started_at >= NOW() - INTERVAL '${days} days')
    GROUP BY 1
    ORDER BY 1
  `;
  try {
    const { rows } = await query(q, [TENANT_ID]);
    return { statusCode: 200, body: JSON.stringify(rows) };
  } catch (e) {
    // Fallback when schema differs (no started_at)
    return { statusCode: 200, body: JSON.stringify([]) };
  }
});
