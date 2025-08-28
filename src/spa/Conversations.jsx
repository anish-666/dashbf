// src/spa/Conversations.jsx
import { useFetch } from '../hooks/useFetch';

export default function Conversations() {
  const { data, loading, error } = useFetch('/conversations', { initial: [] });
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Conversations</h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {!items.length ? (
        <div className="text-sm text-gray-500">No conversations found.</div>
      ) : (
        <ul className="divide-y rounded border">
          {items.map((cv) => (
            <li key={cv.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {cv.customer_name || cv.phone || cv.id}
                  </div>
                  <div className="text-xs text-gray-500">
                    {cv.started_at ? new Date(cv.started_at).toLocaleString() : '—'}
                  </div>
                </div>
                <div className="text-xs rounded px-2 py-1 border">
                  {cv.status || '—'}
                </div>
              </div>

              {cv.summary && (
                <div className="mt-2 text-sm text-gray-700">
                  {cv.summary}
                </div>
              )}

              {Array.isArray(cv.recordings) && cv.recordings.length > 0 && (
                <div className="mt-3 space-y-2">
                  {cv.recordings.map((r, i) => (
                    <audio key={i} controls src={r.url} className="w-full" />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
