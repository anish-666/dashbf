// src/hooks/useFetch.js
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useFetch(path, { enabled = true, initial = null } = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(!!enabled);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    setLoading(true);
    setError('');

    api.get(path)
      .then((res) => { if (mounted) setData(res); })
      .catch((e) => { if (mounted) { setError(e.message || 'Failed'); setData(initial); } })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [path, enabled]);

  return { data, loading, error };
}
