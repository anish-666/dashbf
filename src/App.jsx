
// src/App.jsx
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Overview from './spa/Overview.jsx';
import Agents from './spa/Agents.jsx';
import Outbound from './spa/Outbound.jsx';
import Login from './spa/Login.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <nav className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6 text-gray-100">
            <div className="font-semibold">Docvai Dashboard</div>
            <Link to="/">Overview</Link>
            <Link to="/agents">Agents</Link>
            <Link to="/outbound">Outbound</Link>
            <div className="ml-auto" />
            <Link to="/login" className="text-sm bg-gray-800 px-3 py-1 rounded border border-gray-700">Login</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/outbound" element={<Outbound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
