import React, { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'

function parseNumbers(text) {
  return text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)
}

export default function Campaigns() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [numbersText, setNumbersText] = useState('')
  const [agentId, setAgentId] = useState('')
  const [agents, setAgents] = useState([])
  const [callerId, setCallerId] = useState(import.meta.env.VITE_OUTBOUND_CALLER_ID || import.meta.env.OUTBOUND_CALLER_ID || '+918035316096')
  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState(null)
  const fileRef = useRef(null)

  const numbers = useMemo(()=>parseNumbers(numbersText), [numbersText])

  useEffect(() => {
    api.campaigns().then(setList).catch(()=>{})
    api.agents().then(setAgents).catch(()=>{})
  }, [])

  const onCSV = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      // extract likely phone tokens
      const tokens = text.split(/[\s,;]+/).filter(Boolean)
      setNumbersText(tokens.join('\n'))
    }
    reader.readAsText(f)
  }

  const create = async () => {
    setCreating(true); setErr(null)
    try {
      const created = await api.campaignCreate({ name, numbers, agentId, callerId })
      // optional: auto-kick off outbound using same payload
      await api.outbound({ numbers, agentId, callerId }).catch(()=>{})
      const newList = await api.campaigns().catch(()=>[])
      setList(newList)
      setName(''); setNumbersText('')
    } catch (e) {
      setErr(`${e}`)
    } finally {
      setCreating(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label">Campaign Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Warm Leads Q3" />
          </div>
          <div>
            <label className="label">Agent</label>
            <select className="input" value={agentId} onChange={e=>setAgentId(e.target.value)}>
              <option value="">Select agent…</option>
              {agents.map(a=>(
                <option key={a.id} value={a.provider_agent_id || a.id}>{a.name || a.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Caller ID</label>
            <input className="input" value={callerId} onChange={e=>setCallerId(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_200px] gap-3 items-start">
          <div>
            <label className="label">Numbers (paste or import CSV)</label>
            <textarea className="input h-48" value={numbersText} onChange={e=>setNumbersText(e.target.value)} placeholder="+91..., one per line" />
          </div>
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={onCSV} className="block w-full text-sm" />
            <div className="text-sm text-gray-500">Parsed: {numbers.length}</div>
            <button className="btn w-full" onClick={create} disabled={creating || !name || !agentId || numbers.length===0}>
              {creating ? 'Creating…' : 'Create & Start'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-3 font-semibold">Campaigns</div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Total</th><th>Completed</th><th>Created</th></tr>
          </thead>
          <tbody>
            {list.length===0 && <tr><td colSpan={5} className="py-6 text-center text-gray-500">No campaigns yet.</td></tr>}
            {list.map(c=>(
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><span className="badge">{c.status || 'queued'}</span></td>
                <td>{c.total ?? 0}</td>
                <td>{c.completed ?? 0}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err && <pre className="card overflow-auto text-xs text-red-500">{err}</pre>}
    </div>
  )
}
