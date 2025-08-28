// src/spa/Overview.jsx
import { useFetch } from '../hooks/useFetch';

export default function Overview() {
  const { data: summary, loading: loadingSummary, error: errSummary } =
    useFetch('/analytics-summary', { initial: {} });

  const { data: timeseries, loading: loadingTs, error: errTs } =
    useFetch('/analytics-timeseries?window=7d', { initial: [] });

  const safeSummary = summary && typeof summary === 'object' ? summary : {};
  const rows = Array.isArray(timeseries) ? timeseries : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>

      {(loadingSummary || loadingTs) && <div>Loading…</div>}
      {(errSummary || errTs) && (
        <div className="text-red-600">
          {errSummary || errTs}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Total Calls" value={safeSummary.total_calls ?? 0} />
        <Stat label="Completed" value={safeSummary.completed_calls ?? 0} />
        <Stat label="Failed" value={safeSummary.failed_calls ?? 0} />
      </div>

      <div className="mt-6">
        <h2 className="font-medium mb-2">Last 7 days</h2>
        {!rows.length ? (
          <div className="text-sm text-gray-500">No timeseries data.</div>
        ) : (
          <ul className="text-sm space-y-1">
            {rows.map((r, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{r.date || r.day || r.bucket || '—'}</span>
                <span>{Number(r.count ?? r.calls ?? 0)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
