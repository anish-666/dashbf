import { Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import Overview from "./spa/Overview.jsx";
import Agents from "./spa/Agents.jsx";
import Outbound from "./spa/Outbound.jsx";
import Login from "./spa/Login.jsx";

const authed = () => !!localStorage.getItem("token");

function Protected({ children }) {
  return authed() ? children : <Navigate to="/login" replace />;
}

function NavBar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };
  const link = (to, label) => (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "6px 10px",
        textDecoration: "none",
        color: isActive ? "#000" : "#6b7280",
        fontWeight: isActive ? 600 : 500,
      })}
      end
    >
      {label}
    </NavLink>
  );

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid #eee",background:"#fff"}}>
      <div style={{fontWeight:700}}>Docvai</div>
      <div style={{display:"flex",gap:16}}>
        {link("/", "Overview")}
        {link("/agents", "Agents")}
        {link("/outbound", "Outbound")}
      </div>
      <button onClick={logout} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6,background:"#fff",cursor:"pointer"}}>
        Logout
      </button>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Shell><Overview /></Shell></Protected>} />
      <Route path="/agents" element={<Protected><Shell><Agents /></Shell></Protected>} />
      <Route path="/outbound" element={<Protected><Shell><Outbound /></Shell></Protected>} />
      <Route path="*" element={<Navigate to={authed() ? '/' : '/login'} replace />} />
    </Routes>
  );
}
