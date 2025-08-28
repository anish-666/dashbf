// src/spa/Agents.jsx
import { useFetch } from '../hooks/useFetch';

export default function Agents() {
  const { data, loading, error } = useFetch('/agents', { initial: [] });
  const agents = Array.isArray(data) ? data : [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Agents</h1>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {!agents.length ? (
        <div className="text-sm text-gray-500">No agents found.</div>
      ) : (
        <ul className="divide-y rounded border">
          {agents.map((a) => (
            <li key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.name || a.provider_agent_id || a.id}</div>
                <div className="text-xs text-gray-500">
                  {a.active ? 'Active' : 'Inactive'} • Tenant: {a.tenant_id || '—'}
                </div>
              </div>
              <span className="text-xs rounded px-2 py-1 border">
                {a.active ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
