const { withCors } = require('../lib/cors.js');
const { sign } = require('./_lib/auth')

function bodyJSON(event) {
  try { return JSON.parse(event.body || '{}') } catch { return {} }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // DEMO_USERS should be a JSON string, e.g. {"admin@docvai.com":"supersecret"}
  let users = {}
  try { users = JSON.parse(process.env.DEMO_USERS || '{}') } catch {}

  const { email, password } = bodyJSON(event)
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'email and password required' }) }
  }

  const expected = users[email]
  if (!expected || expected !== password) {
    return { statusCode: 401, body: JSON.stringify({ error: 'invalid credentials' }) }
  }

  const token = sign({ sub: email })
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, token })
  }
}
function parseDemoUsers(){
  // DEMO_USERS format: "email1:pass1;email2:pass2"
  const raw = process.env.DEMO_USERS || 'admin@docvai.com:admin123';
  const map = {};
  raw.split(';').map(s=>s.trim()).filter(Boolean).forEach(pair=>{
    const [e,p] = pair.split(':').map(s=>s.trim());
    if (e && p) map[e.toLowerCase()] = p;
  });
  return map;
}

exports.handler = withCors(async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }
  const { email, password } = JSON.parse(event.body || '{}');

  const users = parseDemoUsers();
  const ok = users[email?.toLowerCase?.() || ''] === password;
  if (!ok) return { statusCode: 401, body: JSON.stringify({ error: 'invalid_credentials' }) };

  const token = sign({ email });
  return { statusCode: 200, body: JSON.stringify({ token }) };
});
