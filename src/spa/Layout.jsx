// src/spa/Layout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Layout() {
  const nav = useNavigate()
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('docvai_token'))

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('docvai_token'))
  }, [])

  function logout() {
    localStorage.removeItem('docvai_token')
    nav('/login')
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">Docvai</div>
        <nav className="nav">
          <NavLink to="/overview">Overview</NavLink>
          <NavLink to="/agents">Agents</NavLink>
          <NavLink to="/outbound">Outbound</NavLink>
           <NavLink to="/campaigns">Campaigns</NavLink>
        </nav>
        <div className="nav-right">
          {loggedIn ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <NavLink className="btn" to="/login">Login</NavLink>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
