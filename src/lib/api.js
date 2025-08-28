
// src/lib/api.js
// Centralized API client with sane defaults and back-compat aliases.
//
// Exposes api.agents() and api.outbound(...) so legacy pages keep working.
// Adds token automatically from localStorage under "token".

const API_BASE = import.meta.env.VITE_API_BASE || '/.netlify/functions';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }

  if (!res.ok) {
    const msg = (data && (data.error || data.message || data.detail)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// Some endpoints in your functions use "-index" public variants.
// We'll try the private first (requires token), then fallback to public.
async function tryPrivateThenPublic(privatePath, publicPath) {
  try {
    return await request(privatePath);
  } catch (e) {
    // if unauthorized or missing, try the public one
    return await request(publicPath);
  }
}

export const api = {
  get: (p) => request(p, { method: 'GET' }),
  post: (p, body) => request(p, { method: 'POST', body }),

  // ---- resources ----
  agents: async () => {
    // private: /agents ; public cache/rehydrator: /agents-index
    const data = await tryPrivateThenPublic('/agents', '/agents-index');
    return Array.isArray(data) ? data : [];
  },

  analyticsSummary: async () => {
    try {
      return await request('/analytics-summary');
    } catch (e) {
      // Graceful empty state
      return { total: 0, connected: 0, avg_duration: 0 };
    }
  },

  analyticsTimeseries: async (window = '7d') => {
    try {
      const q = encodeURIComponent(window);
      const data = await request(`/analytics-timeseries?window=${q}`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  // Outbound calls (back-compat aliases)
  callsOutbound: ({ numbers, agentId, callerId }) =>
    request('/calls-outbound', { method: 'POST', body: { numbers, agentId, callerId } }),

  // legacy names used by old pages
  outbound: ({ numbers, agentId, callerId }) =>
    request('/calls-outbound', { method: 'POST', body: { numbers, agentId, callerId } }),
};

export default api;
