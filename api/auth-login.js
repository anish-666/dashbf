// api/login.js
const { readBody, json, setAuthCookie } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  const { email, password } = readBody(event);

  // DEMO_USERS='[{"email":"admin@docvai.com","password":"supersecret","name":"Docvai Admin"}]'
  let user = null;
  try {
    const list = JSON.parse(process.env.DEMO_USERS || '[]');
    user = list.find(u => u.email === email && u.password === password);
  } catch {}

  if (!user) return json(401, { error: 'invalid_credentials' });

  const cookie = setAuthCookie({
    email: user.email,
    name: user.name || 'Docvai',
    role: user.role || 'user',
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    multiValueHeaders: { 'Set-Cookie': [cookie] },
    body: JSON.stringify({ ok: true, user: { email: user.email, name: user.name || 'Docvai' } }),
  };
};
