import React from 'react';

export const Admin: React.FC = () => {
  const resetDaily = async () => {
    if (!confirm('Are you sure you want to reset the daily queue sequence?')) return;
    const res = await fetch('/api/reports/reset-daily', { method: 'POST' });
    const data = await res.json();
    alert(data.message);
  };

  const downloadReport = () => {
    window.location.href = '/api/reports/doh-export';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">Sekhukhune QueueCare Hub</h1>
        <p className="text-gray-600">Clinic Administrator & Reports Dashboard</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Daily Queue Management</h2>
          <p className="text-gray-600 text-sm mb-4">Reset ticket sequences back to 001 for the next morning shift.</p>
          <button onClick={resetDaily} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow">
            Reset Daily Queue
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-2">DoH Compliance Reports</h2>
          <p className="text-gray-600 text-sm mb-4">Download daily department summary statistics in CSV format.</p>
          <button onClick={downloadReport} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow">
            Download DoH CSV Report
          </button>
        </div>
      </div>
    </div>
  );
};
