// src/lib/api.js
// Small fetch wrapper + all frontend endpoints in one place.
// Works in Vite. Uses VITE_API_BASE (default "/api") so Netlify redirects → Functions.

const BASE = import.meta.env.VITE_API_BASE || '/api';

// Build a query string from a params object
function qs(params) {
  const entries = Object.entries(params || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '');
  const s = new URLSearchParams(entries).toString();
  return s ? `?${s}` : '';
}

// Core HTTP helper
async function http(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    credentials: 'include', // send cookies/JWT if your functions set them
  });

  // Try JSON first, then text
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg =
      (isJson && data && (data.error || data.message || data.detail)) ||
      (typeof data === 'string' && data.slice(0, 500)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // Auth
  me() {
    return http('/me');
  },
  login(email, password) {
    return http('/login', { method: 'POST', body: { email, password } });
  },
  logout() {
    return http('/logout', { method: 'POST' });
  },

  // Agents
  agents() {
    return http('/agents');
  },

  // Analytics
  analyticsSummary() {
    return http('/analytics-summary');
  },
  analyticsTimeseries(window = '7d') {
    return http(`/analytics-timeseries${qs({ window })}`);
  },

  // Conversations & recordings (if you have these routes)
  conversations(params = {}) {
    return http(`/conversations${qs(params)}`);
  },
  recordings(params = {}) {
    return http(`/recordings${qs(params)}`);
  },

  // Outbound calling
  outbound(numbers = [], agentId) {
    if (!Array.isArray(numbers)) {
      throw new Error('numbers must be an array of E.164 strings');
    }
    const payload = { numbers };
    if (agentId) payload.agentId = agentId;
    return http('/calls-outbound', { method: 'POST', body: payload });
  },

  // Campaigns (placeholder endpoints; wire to your functions)
  campaignsList() {
    return http('/campaigns');
  },
  campaignsCreate({ name, numbers = [], agentId }) {
    return http('/campaigns', {
      method: 'POST',
      body: { name, numbers, agentId },
    });
  },
};
