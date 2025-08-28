import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const DEFAULT_CALLER = import.meta.env.PUBLIC_SITE_URL ? '' : '' // not used here
const ENV_CALLER = import.meta.env.VITE_OUTBOUND_CALLER_ID || import.meta.env.OUTBOUND_CALLER_ID || '+918035316096'
const ENV_AGENT = import.meta.env.VITE_BOLNA_AGENT_ID || import.meta.env.BOLNA_AGENT_ID || ''

export default function Outbound() {
  const [numbers, setNumbers] = useState('')
  const [agents, setAgents] = useState([])
  const [agentId, setAgentId] = useState(ENV_AGENT)
  const [callerId, setCallerId] = useState(ENV_CALLER)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api.agents().then(setAgents).catch(()=>{})
  }, [])

  const parsed = useMemo(() => {
    return numbers
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(Boolean)
  }, [numbers])

  const doCall = async () => {
    setErr(null); setResult(null); setRunning(true)
    try {
      const r = await api.outbound({ numbers: parsed, agentId, callerId })
      setResult(r)
    } catch(e) {
      setErr(`${e}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label">Agent</label>
            <select className="input" value={agentId} onChange={e=>setAgentId(e.target.value)}>
              <option value="">Select agent…</option>
              {agents.map(a => (
                <option key={a.id} value={a.provider_agent_id || a.id}>
                  {a.name || a.id}
                </option>
              ))}
              {ENV_AGENT && <option value={ENV_AGENT}>Default: {ENV_AGENT}</option>}
            </select>
          </div>
          <div>
            <label className="label">Caller ID (From)</label>
            <input className="input" value={callerId} onChange={e=>setCallerId(e.target.value)} placeholder="+918035316096" />
            <div className="text-xs text-gray-500 mt-1">Default is your env OUTBOUND_CALLER_ID ({ENV_CALLER}).</div>
          </div>
          <div>
            <label className="label">Count</label>
            <div className="input">{parsed.length}</div>
          </div>
        </div>

        <div>
          <label className="label">Phone numbers (newline, comma or semicolon separated)</label>
          <textarea className="input h-40" value={numbers} onChange={e=>setNumbers(e.target.value)} placeholder="+91..., +1..., one per line or separated with commas" />
        </div>

        <div className="flex gap-2">
          <button className="btn" disabled={running || parsed.length === 0 || !agentId} onClick={doCall}>
            {running ? 'Calling…' : 'Start Outbound'}
          </button>
        </div>
      </div>

      {result && <pre className="card overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>}
      {err && <pre className="card overflow-auto text-xs text-red-500">{err}</pre>}
    </div>
  )
}
