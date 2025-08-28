
// src/spa/Agents.jsx
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Agents() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.agents();
        setList(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || 'Failed to load agents');
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 text-gray-100">
      <h1 className="text-2xl font-semibold">Agents</h1>
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="text-left px-3 py-2 border-b border-gray-700">Name</th>
              <th className="text-left px-3 py-2 border-b border-gray-700">Provider Agent ID</th>
              <th className="text-left px-3 py-2 border-b border-gray-700">Active</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).map((a) => (
              <tr key={a.provider_agent_id || a.id} className="odd:bg-gray-900 even:bg-gray-900/70">
                <td className="px-3 py-2">{a.name || a.agent_name || '—'}</td>
                <td className="px-3 py-2 font-mono text-xs">{a.provider_agent_id || a.id}</td>
                <td className="px-3 py-2">{String(a.active ?? true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
