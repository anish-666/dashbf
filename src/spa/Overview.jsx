import { useEffect, useState } from "react";

export default function Overview(){
  const [summary, setSummary] = useState({ total:0, connected:0, avg_duration:0 });
  const [series, setSeries] = useState([]);
  const token = localStorage.getItem("token") || "";

  useEffect(()=>{
    fetch("/.netlify/functions/analytics-summary", { headers:{ Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setSummary).catch(()=>{});
    fetch("/.netlify/functions/analytics-timeseries?window=7d", { headers:{ Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setSeries).catch(()=>{});
  },[]);

  return (
    <div>
      <h2>Overview</h2>
      <div>
        <div className="stat card"><div>Total Calls</div><div style={{fontSize:36}}>{summary.total||0}</div></div>
        <div className="stat card"><div>Connected</div><div style={{fontSize:36}}>{summary.connected||0}</div></div>
        <div className="stat card"><div>Avg Duration (s)</div><div style={{fontSize:36}}>{Math.round(summary.avg_duration||0)}</div></div>
      </div>
      <h3 style={{marginTop:24}}>Last 7 days</h3>
      <pre className="card">{JSON.stringify(series,null,2)}</pre>
    </div>
  );
}
