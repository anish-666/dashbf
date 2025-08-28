import React, { useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const n = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
// src/spa/Login.jsx  (only the submit bit)
import { api } from '../lib/api';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { token } = await api.post('/auth-login', { email, password });
      localStorage.setItem('docvai_token', token);
      location.href = '/';
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      {err && <div className="text-red-600 mb-3">{err}</div>}
      <input className="border rounded w-full p-2 mb-2" placeholder="Email"
             value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="border rounded w-full p-2 mb-4" placeholder="Password" type="password"
             value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="rounded bg-black text-white px-3 py-2 w-full">Login</button>
    </form>
  );
}

  const submit = async (e) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      const r = await api.login(email, password)
      localStorage.setItem('docvai_jwt', r.token)
      n('/')
    } catch (e) {
      setErr('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }
  // wherever you handle login submit (e.g., src/pages/Login.jsx)
import { api } from '../lib/api';

async function onSubmit(e) {
  e.preventDefault();
  const email = form.email;
  const password = form.password;
  const { token } = await api.post('/auth-login', { email, password });
  localStorage.setItem('docvai_token', token);
  location.href = '/';
}


  return (
    <div className="max-w-md mx-auto card space-y-3">
      <div className="text-xl font-semibold">Login</div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        {err && <div className="text-sm text-red-500">{err}</div>}
      </form>
    </div>
  )
}
