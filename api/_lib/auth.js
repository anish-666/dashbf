const jwt = require('jsonwebtoken')

function requireAuth(event) {
  const h = event.headers || {}
  const raw = h.authorization || h.Authorization || ''
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : null
  if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'no_token' }) }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    return { ok: true, user: payload, tenant_id: payload.tenant_id || 't_demo' }
  } catch {
    return { statusCode: 401, body: JSON.stringify({ error: 'invalid_token' }) }
  }
}

module.exports = { requireAuth }
