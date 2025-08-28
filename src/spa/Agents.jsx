// src/spa/Agents.jsx
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Agents() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await api.agents()
        const list = Array.isArray(data) ? data : (data?.items || data?.rows || [])
        if (alive) setRows(list)
      } catch (e) {
        setError(e.message || 'Failed to load agents')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div className="stack-lg">
      <h1>Agents</h1>
      {loading && <div className="muted">Loading…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Provider Agent ID</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="4" className="muted">No agents found</td></tr>
              )}
              {rows.map((a) => (
                <tr key={a.id || a.provider_agent_id}>
                  <td>{a.id}</td>
                  <td>{a.name || a.agent_name || '-'}</td>
                  <td>{a.provider_agent_id}</td>
                  <td>{String(a.active ?? true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
