// src/lib/api.js
const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() ||
  '/.netlify/functions'; // or '/api' if you're using the redirect

async function request(path, opts = {}) {
  const token = localStorage.getItem('docvai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(
    `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`,
    { ...opts, headers }
  );

  // If unauthorized, clear token and bounce to login
  if (res.status === 401) {
    localStorage.removeItem('docvai_token');
    // avoid infinite loops if already on /login
    if (!location.pathname.includes('/login')) location.href = '/login';
    throw new Error('Unauthorized');
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message || data.detail)) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body || {}) }),
  del: (path) => request(path, { method: 'DELETE' }),
  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body || {}) }),
};
