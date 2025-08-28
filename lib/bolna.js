const BASE = process.env.BOLNA_API_BASE || 'https://api.bolna.ai';
const API_KEY = process.env.BOLNA_API_KEY || '';

async function bolna(path, init={}){
  const url = BASE.replace(/\/$/,'') + path;
  const headers = Object.assign({ 'Authorization': `Bearer ${API_KEY}`, 'content-type':'application/json' }, init.headers||{});
  const res = await fetch(url, { ...init, headers });
  const body = await res.json().catch(()=> ({}));
  return { ok: res.ok, status: res.status, body };
}

async function listAgents(){
  return bolna('/agent/all', { method: 'GET' });
}

async function startCall(agent_id, recipient_phone_number){
  return bolna('/call', {
    method: 'POST',
    body: JSON.stringify({ agent_id, recipient_phone_number })
  });
}

module.exports = { listAgents, startCall };
