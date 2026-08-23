 import React from 'react';

export default function SettingsPanel({ theme, setTheme, role, onResetData }) {
  return (
    <div className="settings-panel">
      <h2>Portal Preferences & System Settings</h2>
      <div className="setting-item">
        <div><h4>Current Active Role</h4><p>Logged in with <strong>{role}</strong> privileges.</p></div>
        <span className="badge">{role}</span>
      </div>
      <div className="setting-item">
        <div><h4>Interface Theme</h4><p>Switch between light and dark display modes.</p></div>
        <button className="theme-toggle-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </div>
      <div className="setting-item danger-zone">
        <div><h4>Data Management</h4><p>Clear all local data and restore default portal state.</p></div>
        <button className="btn-danger" onClick={onResetData}>Reset LocalStorage</button>
      </div>
    </div>
  );
}
