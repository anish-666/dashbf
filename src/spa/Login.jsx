import { useState } from 'react'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(email, password)
      localStorage.setItem('token', res.token)
      window.location.href = '/'
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Sign in</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            className="border rounded-md w-full px-3 py-2"
            type="email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            className="border rounded-md w-full px-3 py-2"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button disabled={loading} className="w-full bg-teal-600 text-white rounded-md px-4 py-2 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
