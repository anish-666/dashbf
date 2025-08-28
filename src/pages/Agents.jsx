import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Agents() {
  const [dbAgents, setDbAgents] = useState([])
  const [bolna, setBolna] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [a, b] = await Promise.all([
          api.agents().catch(() => []),
          api.bolnaAgentsProbe().catch(() => []),
        ])
        setDbAgents(a || [])
        setBolna(b || [])
      } catch (e) {
        setErr(`${e}`)
      }
    })()
  }, [])

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-3 font-semibold">Tenant Agents (database)</div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Provider Agent</th><th>Status</th></tr>
          </thead>
          <tbody>
            {dbAgents.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">No agents saved for this tenant.</td></tr>
            )}
            {dbAgents.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-xs">{a.id}</td>
                <td>{a.name}</td>
                <td className="font-mono text-xs">{a.provider_agent_id}</td>
                <td><span className="badge">{a.active ? 'active' : 'inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="mb-3 font-semibold">Bolna Agents (live)</div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Status</th><th>Webhook</th></tr>
          </thead>
          <tbody>
            {bolna.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">No agents returned by provider.</td></tr>
            )}
            {bolna.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-xs">{a.id}</td>
                <td>{a.agent_name}</td>
                <td><span className="badge">{a.agent_status}</span></td>
                <td className="truncate max-w-[300px]">{a.webhook_url || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err && <pre className="card overflow-auto text-xs text-red-500">{err}</pre>}
    </div>
  )
}
