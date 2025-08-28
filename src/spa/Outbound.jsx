import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const DEFAULT_CALLER = import.meta.env.VITE_OUTBOUND_CALLER_ID || '(set VITE_OUTBOUND_CALLER_ID)'

export default function Outbound() {
  // ...state unchanged
  // ...fetch agents unchanged

  const numbers = useMemo(() =>
    numbersText.split(/[\s,;\n]+/).map(s => s.trim()).filter(Boolean),
    [numbersText]
  )

  async function startOutbound(e) {
    e.preventDefault()
    setError(''); setResult(null)
    if (numbers.length === 0) { setError('Add at least one phone number'); return }
    try {
      setLoading(true)
      const res = await api.outbound(numbers, agentId || undefined)  // POST → /.netlify/functions/calls-outbound
      setResult(res)
    } catch (e) { setError(e.message || 'Failed to start calls') }
    finally { setLoading(false) }
  }

  return (
    <div className="stack-lg">
      <h1>Outbound</h1>
      <div className="card">
        <form className="stack" onSubmit={startOutbound}>
          <div className="grid2">
            <div>
              <label className="label">Agent</label>
              <select className="input" value={agentId} onChange={e=>setAgentId(e.target.value)}>
                <option value="">(Default)</option>
                {agents.map(a => (
                  <option key={a.id || a.provider_agent_id} value={a.provider_agent_id || a.id}>
                    {a.name || a.agent_name || a.provider_agent_id}
                  </option>
                ))}
              </select>
              <div className="muted mt-1">
                <b>Caller ID (From)</b>: {DEFAULT_CALLER}
              </div>
            </div>

            <div>
              <label className="label">Phone numbers (newline, comma, or semicolon)</label>
              <textarea className="input" rows={5} value={numbersText}
                        onChange={e=>setNumbersText(e.target.value)}
                        placeholder="+911234567890, +919876543210" />
              <div className="muted mt-1">Count: <b>{numbers.length}</b></div>
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Starting…' : 'Start Outbound'}
          </button>
        </form>
      </div>

      {result && (<div className="card"><div className="card-title">Created</div>
        <pre className="pre">{JSON.stringify(result, null, 2)}</pre></div>)}
    </div>
  )
}
