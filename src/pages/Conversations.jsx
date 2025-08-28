import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Conversations() {
  const [rows, setRows] = useState([])
  const [sel, setSel] = useState(null)
  const [detail, setDetail] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api.conversations().then(setRows).catch(e => setErr(`${e}`))
  }, [])

  useEffect(() => {
    if (!sel) return
    api.conversationTranscript(sel.id)
      .then(setDetail)
      .catch(e => setErr(`${e}`))
  }, [sel])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <div className="mb-3 font-semibold">Conversations</div>
        <table className="table">
          <thead>
            <tr><th>Customer</th><th>Status</th><th>Duration</th></tr>
          </thead>
          <tbody>
            {rows.length===0 && <tr><td colSpan={3} className="py-6 text-center text-gray-500">No conversations yet.</td></tr>}
            {rows.map(r=>(
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={()=>setSel(r)}>
                <td>{r.customer_number || r.phone || '—'}</td>
                <td><span className="badge">{r.status || '—'}</span></td>
                <td>{r.duration_seconds ?? r.duration_sec ?? 0}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="mb-3 font-semibold">Transcript & Recording</div>
        {!sel && <div className="text-gray-500">Select a conversation</div>}
        {detail && (
          <div className="space-y-3">
            {detail.recording_url && (
              <audio controls src={detail.recording_url} className="w-full" />
            )}
            <pre className="text-xs whitespace-pre-wrap">{detail.transcript || 'No transcript.'}</pre>
          </div>
        )}
      </div>

      {err && <pre className="card overflow-auto text-xs text-red-500 md:col-span-2">{err}</pre>}
    </div>
  )
}
