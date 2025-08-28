// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './spa/Layout.jsx'
import Overview from './spa/Overview.jsx'
import Agents from './spa/Agents.jsx'
import Outbound from './spa/Outbound.jsx'
import Login from './spa/Login.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/outbound" element={<Outbound />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  )
}
