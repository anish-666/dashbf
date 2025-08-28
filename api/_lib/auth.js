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
}// CommonJS so Netlify/esbuild won’t choke on ESM in Functions
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env'

function sign(payload, opts = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...opts })
}

function verify(token) {
  return jwt.verify(token, JWT_SECRET)
}

function requireAuth(event) {
  const hdr = event.headers.authorization || event.headers.Authorization || ''
  const m = hdr.match(/^Bearer\s+(.+)/i)
  if (!m) {
    const err = new Error('Unauthorized'); err.statusCode = 401; throw err
  }
  try {
    const user = verify(m[1])
    return user
  } catch {
    const err = new Error('Unauthorized'); err.statusCode = 401; throw err
  }
}

module.exports = { sign, verify, requireAuth }


module.exports = { requireAuth }
