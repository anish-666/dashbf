// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || '/.netlify/functions';

function getToken() {
  return localStorage.getItem('docvai_token');
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function handle(res) {
  if (res.status === 401) {
    // Not logged in – bounce to login
    localStorage.removeItem('docvai_token');
    window.location.href = '/login';
    return;
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // Some functions return HTML on error – surface it.
    throw new Error(text || `HTTP ${res.status}`);
  }
}

export const api = {
  async get(path, params = {}) {
    const url = new URL(API_BASE + path, window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
    const res = await fetch(url, { headers: { ...authHeaders() } });
    return handle(res);
  },

  async post(path, body = {}) {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handle(res);
  },

  // Convenience wrappers for your functions
  login: (email, password) => fetch(API_BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handle),

  analyticsSummary: () => api.get('/analytics-summary'),
  analyticsTimeseries: (window = '7d') => api.get('/analytics-timeseries', { window }),
  agents: () => api.get('/agents'),
  conversations: () => api.get('/conversations'),
  outbound: (numbers, agentId) => api.post('/calls-outbound', { numbers, agentId }),
};

export default api;
