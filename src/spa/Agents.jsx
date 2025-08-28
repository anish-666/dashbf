import { useEffect, useState } from "react";

export default function Agents(){
  const [rows,setRows] = useState([]);
  const token = localStorage.getItem("token") || "";
  useEffect(()=>{
    fetch("/.netlify/functions/agents", { headers: { Authorization: `Bearer ${token}` }})
      .then(r=>r.json()).then(setRows).catch(()=>setRows([]));
  },[]);
  return (
    <div>
      <h2>Agents</h2>
      <pre className="card">{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
