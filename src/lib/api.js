// src/lib/api.js
const API_BASE =
  (import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.trim()) ||
  '/.netlify/functions'; // or '/api' if you use the Netlify redirect

async function request(path, opts = {}) {
  const token = localStorage.getItem('docvai_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...opts, headers });

  if (res.status === 401) {
    localStorage.removeItem('docvai_token');
    if (!location.pathname.includes('/login')) location.href = '/login';
    throw new Error('Unauthorized');
  }

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
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body: JSON.stringify(body || {}) }),
  put: (p, body) => request(p, { method: 'PUT', body: JSON.stringify(body || {}) }),
  del: (p) => request(p, { method: 'DELETE' }),
};
