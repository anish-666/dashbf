// /src/App.jsx
import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Overview from './spa/Overview.jsx'
import Agents from './spa/Agents.jsx'
import Conversations from './spa/Conversations.jsx'
import Outbound from './spa/Outbound.jsx'
import Campaigns from './spa/Campaigns.jsx'
import Settings from './spa/Settings.jsx'
import Login from './spa/Login.jsx'


function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  const navigate = useNavigate()
  const authed = !!localStorage.getItem('docvai_jwt')

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="font-bold text-lg mb-4">Docvai Dashboard</div>
        <nav className="space-y-1">
          <SidebarLink to="/">Overview</SidebarLink>
          <SidebarLink to="/conversations">Conversations</SidebarLink>
          <SidebarLink to="/agents">Agents</SidebarLink>
          <SidebarLink to="/campaigns">Campaigns</SidebarLink>
          <SidebarLink to="/outbound">Outbound</SidebarLink>
          <SidebarLink to="/settings">Settings</SidebarLink>
        </nav>
        <div className="mt-6">
          {authed ? (
            <button
              className="btn w-full"
              onClick={() => {
                localStorage.removeItem('docvai_jwt')
                navigate('/login')
              }}
            >
              Logout
            </button>
          ) : (
            <button className="btn w-full" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </aside>

      <main className="p-4 space-y-4">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/outbound" element={<Outbound />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}
