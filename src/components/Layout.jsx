import React, { useState } from 'react';

export default function Layout({ role, setRole, theme, setTheme, activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`edupulse-app ${theme}`}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-box">
          <h2>EduPulse</h2>
          <span className="role-badge">{role} Portal</span>
        </div>
        <nav className="nav-links">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>📊 Dashboard</button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}>🎓 Student Records</button>
          {role !== 'Student' && (
            <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => { setActiveTab('staff'); setSidebarOpen(false); }}>👥 Staff Directory</button>
          )}
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>⚙️ Settings</button>
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="breadcrumb"><span>Home</span> / <strong>{activeTab.toUpperCase()} ({role})</strong></div>
          <div className="header-controls">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
            <button className="theme-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        <main className="content-container">{children}</main>
      </div>
    </div>
  );
}
