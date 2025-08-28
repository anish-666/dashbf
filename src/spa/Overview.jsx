// src/spa/Overview.jsx
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Overview() {
  const [summary, setSummary] = useState(null)
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const [sum, ts] = await Promise.all([
          api.analyticsSummary(),               // { total_calls, connected, avg_duration_s } or similar
          api.analyticsTimeseries('7d'),        // [{ day, total, avg_duration }]
        ])
        if (!alive) return
        setSummary(sum || {})
        setSeries(Array.isArray(ts) ? ts : (ts?.rows || []))
      } catch (e) {
        setError(e.message || 'Failed to load analytics')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div className="stack-lg">
      <h1>Overview</h1>

      {loading && <div className="muted">Loading…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid3">
            <div className="stat">
              <div className="stat-title">Total Calls</div>
              <div className="stat-value">{summary?.total ?? summary?.total_calls ?? 0}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Connected</div>
              <div className="stat-value">{summary?.connected ?? 0}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Avg Duration (s)</div>
              <div className="stat-value">
                {summary?.avg_duration ?? summary?.avg_duration_s ?? 0}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Last 7 days</div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '40%'}}>Day</th>
                  <th>Total</th>
                  <th>Avg Duration (s)</th>
                </tr>
              </thead>
              <tbody>
                {series.length === 0 && (
                  <tr><td colSpan="3" className="muted">No data yet</td></tr>
                )}
                {series.map((row, i) => (
                  <tr key={i}>
                    <td>{row.day || row.date || row.d || '-'}</td>
                    <td>{row.total ?? row.count ?? 0}</td>
                    <td>{row.avg_duration ?? row.avg_duration_s ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
