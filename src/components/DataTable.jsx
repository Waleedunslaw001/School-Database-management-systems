import React, { useState } from 'react';

export default function DataTable({ data, columns }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row =>
    Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = filteredData.map(row => columns.map(c => row[c.key]).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "edupulse_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="data-table-wrapper">
      <div className="table-controls">
        <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        <button onClick={exportToCSV} className="export-btn">Export CSV</button>
      </div>
      <table className="edupulse-table">
        <thead>
          <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <tr key={idx}>{columns.map(col => <td key={col.key}>{row[col.key]}</td>)}</tr>
            ))
          ) : (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center' }}>No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
