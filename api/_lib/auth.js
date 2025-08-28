// api/_lib/auth.js
const jwt = require('jsonwebtoken');

const COOKIE = 'docvai_token';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function readBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch { return {}; }
}

function json(status, data, extraHeaders = {}, cookies = []) {
  const res = {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(data),
  };
  if (cookies.length) res.multiValueHeaders = { 'Set-Cookie': cookies };
  return res;
}

function getCookie(event, name) {
  const raw = event.headers?.cookie || event.headers?.Cookie || '';
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function sign(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verify(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

function requireAuth(event) {
  const token = getCookie(event, COOKIE);
  const user = token && verify(token);
  if (!user) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  return user;
}

function setAuthCookie(user) {
  const token = sign(user);
  const parts = [
    `${COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE}`,
  ];
  if (process.env.PUBLIC_SITE_URL?.startsWith('https://')) parts.push('Secure');
  return parts.join('; ');
}

function clearAuthCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

module.exports = { readBody, json, requireAuth, setAuthCookie, clearAuthCookie };
