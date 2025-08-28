import { useState } from "react";

export default function Outbound(){
  const [numbers,setNumbers] = useState("+911234567890");
  const [agentId,setAgentId] = useState("");
  const [msg,setMsg] = useState("");

  const go = async() => {
    setMsg("");
    const token = localStorage.getItem("token") || "";
    const r = await fetch("/.netlify/functions/calls-outbound", {
      method:"POST",
      headers:{ "content-type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ numbers: numbers.split(/[,\s]+/).filter(Boolean), agentId: agentId || undefined })
    });
    const j = await r.json().catch(()=>({}));
    setMsg(JSON.stringify(j,null,2));
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>Outbound</h2>
      <textarea rows={4} value={numbers} onChange={e=>setNumbers(e.target.value)} style={{width:"100%",marginBottom:8}}/>
      <input placeholder="Agent ID (optional)" value={agentId} onChange={e=>setAgentId(e.target.value)} style={{width:"100%",marginBottom:8}}/>
      <button onClick={go}>Start</button>
      {msg && <pre className="card" style={{marginTop:12}}>{msg}</pre>}
    </div>
  );
}
