// src/spa/Campaigns.jsx
import { useFetch } from '../hooks/useFetch';

export default function Campaigns() {
  const { data, loading, error } = useFetch('/campaigns', { initial: [] });
  const campaigns = Array.isArray(data) ? data : [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Campaigns</h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {!campaigns.length ? (
        <div className="text-sm text-gray-500">No campaigns yet.</div>
      ) : (
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Created</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">{c.name || c.id}</td>
                <td className="p-3">{c.status || '—'}</td>
                <td className="p-3">{c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
