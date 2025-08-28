
// src/spa/Outbound.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const DEFAULT_CALLER =
  import.meta.env.VITE_DEFAULT_CALLER_ID ||
  import.meta.env.VITE_OUTBOUND_CALLER_ID ||
  '';

export default function Outbound() {
  const [agents, setAgents] = useState([]);
  const [agentId, setAgentId] = useState('');
  const [callerId, setCallerId] = useState(DEFAULT_CALLER);
  const [numbersText, setNumbersText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await api.agents();
        setAgents(list);
        if (list.length && !agentId) {
          // prefer provider_agent_id if present
          setAgentId(list[0].provider_agent_id || list[0].id || '');
        }
      } catch (e) {
        setMsg(e.message || 'Failed to load agents');
      }
    })();
  }, []);

  const numbers = useMemo(() => {
    return numbersText
      .split(/\r?\n|,|;/g)
      .map(s => s.trim())
      .filter(Boolean);
  }, [numbersText]);

  async function startOutbound() {
    setMsg('');
    setSubmitting(true);
    try {
      if (!agentId) throw new Error('Choose an agent');
      if (!numbers.length) throw new Error('Add at least one phone number');
      const res = await api.outbound({
        numbers,
        agentId,
        callerId: callerId || undefined,
      });
      setMsg(`Created ${res?.created_count ?? numbers.length} call(s).`);
    } catch (e) {
      setMsg(e.message || 'Failed to start calls');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-gray-100">
      <h1 className="text-2xl font-semibold">Outbound</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Agent</span>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          >
            {agents.map(a => (
              <option key={a.provider_agent_id || a.id} value={a.provider_agent_id || a.id}>
                {a.name || a.agent_name || (a.provider_agent_id || a.id)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Caller ID (From)</span>
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            placeholder="+18005551234"
            value={callerId}
            onChange={(e) => setCallerId(e.target.value)}
          />
          {DEFAULT_CALLER && (
            <span className="block text-xs text-gray-400 mt-1">
              Default from env: <code>{DEFAULT_CALLER}</code>
            </span>
          )}
        </label>
      </div>

      <div>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">
            Phone numbers (newline, comma, or semicolon)
          </span>
          <textarea
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded p-3 font-mono"
            placeholder="+14155550123\n+14155550124"
            value={numbersText}
            onChange={(e) => setNumbersText(e.target.value)}
          />
        </label>
        <div className="text-sm text-gray-400 mt-1">{numbers.length} number(s)</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={startOutbound}
          disabled={submitting}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded px-4 py-2 font-medium"
        >
          {submitting ? 'Starting…' : 'Start Outbound'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </div>
    </div>
  );
}
