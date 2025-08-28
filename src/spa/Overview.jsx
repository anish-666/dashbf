
// src/spa/Overview.jsx
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Overview() {
  const [summary, setSummary] = useState({ total: 0, connected: 0, avg_duration: 0 });
  const [series, setSeries] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const s = await api.analyticsSummary();
        setSummary(s || { total: 0, connected: 0, avg_duration: 0 });
      } catch (e) {
        setErr(e.message || 'Failed to load summary');
      }
      try {
        const t = await api.analyticsTimeseries('7d');
        setSeries(Array.isArray(t) ? t : []);
      } catch {}
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-gray-100">
      <h1 className="text-2xl font-semibold">Overview</h1>
      {err && <div className="text-red-400 text-sm">{err}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Total Calls" value={summary.total ?? 0} />
        <Stat title="Connected" value={summary.connected ?? 0} />
        <Stat title="Avg Duration (s)" value={summary.avg_duration ?? 0} />
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded p-4">
        <div className="text-sm text-gray-400 mb-2">Last 7 days (raw)</div>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(series, null, 2)}</pre>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-gray-900 rounded border border-gray-700 p-4">
      <div className="text-gray-400 text-sm">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}
