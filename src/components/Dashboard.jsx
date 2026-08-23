import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const attendanceData = [
  { day: 'Mon', rate: 95 },
  { day: 'Tue', rate: 92 },
  { day: 'Wed', rate: 96 },
  { day: 'Thu', rate: 94 },
  { day: 'Fri', rate: 91 },
];

export default function Dashboard({ role }) {
  return (
    <div className="dashboard-view">
      <h1>{role} Overview</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><h3>Active Students</h3><p className="kpi-number">1,420</p></div>
        <div className="kpi-card"><h3>Avg. Attendance</h3><p className="kpi-number">93.6%</p></div>
        <div className="kpi-card"><h3>Pending Tasks</h3><p className="kpi-number">14</p></div>
      </div>
      <div className="chart-container">
        <h3>Weekly Attendance Trends</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
