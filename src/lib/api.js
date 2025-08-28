// src/lib/api.js
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

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message || data.detail)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // generic
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),

  // keep the old shape so calling code like api.agents() still works
  agents: () => request('/agents'),

  // analytics
  analyticsSummary: () => request('/analytics-summary'),
  analyticsTimeseries: (window = '7d') =>
    request(`/analytics-timeseries?window=${encodeURIComponent(window)}`),

  // calls
  callsOutbound: ({ numbers, agentId, callerId }) =>
    request('/calls-outbound', {
      method: 'POST',
      body: { numbers, agentId, callerId },
    }),
};

export default api;
