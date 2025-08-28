const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const ADMIN_KEY = process.env.ADMIN_KEY || process.env.JWT_SECRET || 'dev_admin_key';

function sign(user){
  return jwt.sign({ sub: user.email, name: user.name || user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function parseAuthHeader(event){
  const h = event.headers || {};
  const auth = h.authorization || h.Authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

function requireAuth(event){
  const token = parseAuthHeader(event);
  if (!token) throw new Error('unauthorized');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch(e){
    throw new Error('unauthorized');
  }
}

function isAdmin(event){
  const key = (event.headers && (event.headers['x-admin-key'] || event.headers['X-Admin-Key'])) || '';
  return key && key === ADMIN_KEY;
}

module.exports = { sign, requireAuth, isAdmin };
