import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const r = await fetch("/.netlify/functions/auth-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(j.error || "Login failed"); return; }
    localStorage.setItem("token", j.token);
    navigate("/", { replace: true });
  };

  return (
    <div style={{maxWidth:360,margin:"60px auto"}}>
      <h2>Sign in</h2>
      <form onSubmit={submit} style={{display:"grid",gap:12}}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
        {err && <div style={{color:"crimson"}}>{err}</div>}
      </form>
    </div>
  );
}
