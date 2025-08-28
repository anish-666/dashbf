
// src/spa/Login.jsx
import { useState } from 'react';

export default function Login() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [msg, setMsg] = useState('');

  function save() {
    if (token && token.trim().length > 0) {
      localStorage.setItem('token', token.trim());
      setMsg('Saved token to localStorage. Reload to apply.');
    } else {
      localStorage.removeItem('token');
      setMsg('Cleared token.');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-gray-100 space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-gray-400">
        Paste your JWT here (you can mint it via your backend). The UI will send it as{' '}
        <code>Authorization: Bearer &lt;token&gt;</code>.
      </p>
      <textarea
        rows={5}
        className="w-full bg-gray-900 border border-gray-700 rounded p-3 font-mono text-xs"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1..."
      />
      <div className="flex gap-3 items-center">
        <button onClick={save} className="bg-teal-600 hover:bg-teal-500 rounded px-4 py-2 font-medium">
          Save Token
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}
