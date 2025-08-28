// /src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE?.trim() || '/.netlify/functions';

function authHeaders() {
  const token = localStorage.getItem('docvai_jwt');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() }, ...options });
  // SPA hosting sometimes returns the Netlify 404 HTML — catch that early:
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const body = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(body));
    } else {
      const text = await res.text();
      throw new Error(text || `${res.status} ${res.statusText}`);
    }
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${API_BASE}/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }),

  status: () => req('/status'),
  agents: () => req('/agents'), // .netlify/functions/agents
  conversations: () => req('/conversations'),
  conversationTranscript: (id) => req(`/conversations-id-transcript?id=${encodeURIComponent(id)}`),

  // Analytics (Netlify functions are hyphenated)
  analyticsSummary: () => req('/analytics-summary'),
  analyticsTimeseries: (window = '7d') => req(`/analytics-timeseries?window=${encodeURIComponent(window)}`),

  // Campaigns
  campaigns: () => req('/campaigns'),
  campaignCreate: (payload) =>
    req('/campaigns', { method: 'POST', body: JSON.stringify(payload) }),

  // Outbound
  outbound: ({ numbers, agentId, callerId }) =>
    req('/calls-outbound', {
      method: 'POST',
      body: JSON.stringify({ numbers, agentId, callerId })
    }),

  // Bolna helpers (optional: show agent list pulled from provider directly)
  bolnaAgentsProbe: () => req('/bolna-agents-probe'),
};
