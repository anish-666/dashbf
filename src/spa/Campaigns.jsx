import { useState } from 'react'
import { api } from '../lib/api'

const parseNums = (text) =>
  text.split(/[\s,;|\n\r]+/)
      .map(s => s.trim())
      .map(s => s.replace(/[^+\d]/g, '').replace(/^00/, '+'))
      .filter(Boolean)

export default function Campaigns() {
  const [name, setName] = useState('')
  const [agentId, setAgentId] = useState('')
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function onFile(e) {
    const f = e.target.files[0]; if (!f) return
    setFileName(f.name)
    const r = new FileReader()
    r.onload = () => setText(parseNums(String(r.result || '')).join('\n'))
    r.readAsText(f)
  }

  async function start(e) {
    e.preventDefault()
    setError(''); setResult(null)
    const numbers = parseNums(text)
    if (numbers.length === 0) { setError('Please provide numbers (paste or upload file).'); return }
    setBusy(true)
    try {
      const res = await api.outbound(numbers, agentId || undefined)
      setResult({ campaign: name || '(ad-hoc)', ...res })
    } catch (err) { setError(err.message || 'Failed to start campaign') }
    finally { setBusy(false) }
  }

  return (
    <div className="stack-lg">
      <h1>Campaigns</h1>
      <div className="card">
        <form className="stack" onSubmit={start}>
          <div className="grid2">
            <div>
              <label className="label">Campaign name (optional)</label>
              <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Warm leads – Sep"/>
            </div>
            <div>
              <label className="label">Upload CSV/TXT</label>
              <input className="input" type="file" accept=".csv,.txt" onChange={onFile}/>
              {fileName && <div className="muted mt-1">Loaded: {fileName}</div>}
            </div>
          </div>

          <label className="label">Numbers (edit / paste here)</label>
          <textarea className="input" rows={8} value={text} onChange={e=>setText(e.target.value)} placeholder="+911234567890, +919876543210"/>
          <div className="muted">Count: <b>{parseNums(text).length}</b></div>

          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Starting…' : 'Start campaign'}</button>
        </form>
      </div>

      {result && (<div className="card"><div className="card-title">Result</div>
        <pre className="pre">{JSON.stringify(result, null, 2)}</pre></div>)}
    </div>
  )
}
