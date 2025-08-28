import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Settings() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    api.status().then(setStatus).catch(()=>{})
  }, [])

  const publicSite = import.meta.env.PUBLIC_SITE_URL || 'https://docvai-dashboard.netlify.app'
  const webhook = `${publicSite}/.netlify/functions/bolna-webhook`

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="font-semibold mb-2">Webhooks</div>
        <div className="text-sm">
          Bolna webhook (set this in your automation if supported):<br/>
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{webhook}</code>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Status</div>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  )
}
