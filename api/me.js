// api/me.js
const { json, requireAuth } = require('./_lib/auth');

exports.handler = async (event) => {
  try {
    const user = requireAuth(event);
    return json(200, { ok: true, user });
  } catch (e) {
    return json(e.statusCode || 401, { error: 'unauthorized' });
  }
};
