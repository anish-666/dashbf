import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const DEFAULT_CALLER = import.meta.env.VITE_OUTBOUND_CALLER_ID || '+918035316096'
const DEFAULT_AGENT  = import.meta.env.VITE_BOLNA_AGENT_ID     || ''

export default function Outbound() {
  // ---- STATE (declare everything used below) ----
  const [numbersText, setNumbersText] = useState('')
  const [callerId, setCallerId]       = useState(DEFAULT_CALLER)
  const [agentId, setAgentId]         = useState(DEFAULT_AGENT)
  const [agents, setAgents]           = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [result, setResult]           = useState(null)

  // ---- FETCH AGENTS (safe) ----
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/agents')
        const list = Array.isArray(res?.agents) ? res.agents : Array.isArray(res) ? res : []
        if (!cancelled) setAgents(list)
      } catch {
        if (!cancelled) setAgents([])
      }
    })()
    return () => { cancelled = true }
  }, [])

  // ---- PARSE NUMBERS ----
  const numbers = useMemo(() => (
    numbersText
      .split(/[\s,;\n]+/)
      .map(s => s.trim())
      .filter(Boolean)
  ), [numbersText])

  // ---- SUBMIT ----
  async function startOutbound(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!numbers.length) { setError('Add at least one phone number.'); return }

    try {
      setLoading(true)
      const resp = await api.post('/calls-outbound', {
        numbers,
        agentId: agentId || undefined,
        callerId: callerId || undefined,
      })
      setResult(resp)
    } catch (err) {
      setError(err?.message || 'Failed to start calls.')
    } finally {
      setLoading(false)
    }
  }

  // ---- UI ----
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Outbound calls</h1>

      <form onSubmit={startOutbound} className="bg-white rounded-xl shadow p-4 space-y-4 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Agent</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={agentId}
              onChange={e => setAgentId(e.target.value)}
            >
              <option value="">{DEFAULT_AGENT ? '(Use default from .env)' : '(Select an agent)'}</option>
              {agents.map((a) => {
                const id   = a.provider_agent_id || a.id
                const name = a.name || a.agent_name || id
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Default agent from env: <code>{DEFAULT_AGENT || '(none set)'}</code>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">Caller ID (From)</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={callerId}
              onChange={e => setCallerId(e.target.value)}
              placeholder="+918035316096"
            />
            <p className="text-xs text-gray-500 mt-1">
              Defaults to <code>VITE_OUTBOUND_CALLER_ID</code>.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Phone numbers (newline, comma, or semicolon)
          </label>
          <textarea
            rows={6}
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={numbersText}
            onChange={e => setNumbersText(e.target.value)}
            placeholder="+919748109372, +918035316096"
          />
          <div className="text-xs text-gray-500 mt-1">Count: <b>{numbers.length}</b></div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          className="rounded-md bg-teal-600 text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Starting…' : 'Start Outbound'}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl shadow p-4 max-w-3xl">
          <div className="font-medium mb-2">Result</div>
          <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
