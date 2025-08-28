// api/logout.js
const { json, clearAuthCookie } = require('./_lib/auth');

exports.handler = async () => {
  const cookie = clearAuthCookie();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    multiValueHeaders: { 'Set-Cookie': [cookie] },
    body: JSON.stringify({ ok: true }),
  };
};
