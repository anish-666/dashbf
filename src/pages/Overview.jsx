import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Overview() {
  const [summary, setSummary] = useState(null)
  const [series, setSeries] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [s, t] = await Promise.all([
          api.analyticsSummary().catch(() => ({ total_calls: 0, connected: 0, avg_duration: 0 })),
          api.analyticsTimeseries('7d').catch(() => []),
        ])
        setSummary(s)
        setSeries(t)
      } catch (e) {
        setErr(`${e}`)
      }
    })()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card">
          <div className="text-sm text-gray-500">Total Calls</div>
          <div className="text-3xl font-semibold">{summary?.total_calls ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Connected</div>
          <div className="text-3xl font-semibold">{summary?.connected ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Avg Duration (s)</div>
          <div className="text-3xl font-semibold">{summary?.avg_duration ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="mb-3 font-semibold">Daily Calls (7d)</div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {err && <pre className="card overflow-auto text-xs text-red-500">{err}</pre>}
    </div>
  )
}
