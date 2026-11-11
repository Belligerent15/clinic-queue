import React, { useState, useEffect } from 'react';

export const Reception: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [lastTicket, setLastTicket] = useState<any>(null);

  const issueTicket = async (categoryCode: string) => {
    try {
      const res = await fetch('/api/tickets/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_code: categoryCode, patient_name: patientName })
      });
      const ticket = await res.json();
      setLastTicket(ticket);
      setPatientName('');
      setTimeout(() => window.print(), 300);
    } catch (err) {
      console.error('Failed to issue ticket', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') { e.preventDefault(); issueTicket('A'); }
      if (e.key === 'F2') { e.preventDefault(); issueTicket('B'); }
      if (e.key === 'F3') { e.preventDefault(); issueTicket('C'); }
      if (e.key === 'F4') { e.preventDefault(); issueTicket('E'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patientName]);

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">Sekhukhune QueueCare Hub</h1>
        <p className="text-gray-600">Reception Ticket Issuance Workstation</p>
      </header>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Patient First Name (Optional - POPIA Compliant)
        </label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="e.g. Kholofelo"
          className="w-full p-3 border rounded-lg text-lg focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => issueTicket('A')} className="p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-left shadow-lg">
          <span className="block text-sm opacity-80">[F1 Key]</span>
          <span className="text-2xl font-bold">A - General</span>
        </button>
        <button onClick={() => issueTicket('B')} className="p-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-left shadow-lg">
          <span className="block text-sm opacity-80">[F2 Key]</span>
          <span className="text-2xl font-bold">B - Chronic</span>
        </button>
        <button onClick={() => issueTicket('C')} className="p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-left shadow-lg">
          <span className="block text-sm opacity-80">[F3 Key]</span>
          <span className="text-2xl font-bold">C - Mother & Baby</span>
        </button>
        <button onClick={() => issueTicket('E')} className="p-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-left shadow-lg animate-pulse">
          <span className="block text-sm opacity-80">[F4 Key] Priority</span>
          <span className="text-2xl font-bold">E - Emergency</span>
        </button>
      </div>

      {lastTicket && (
        <div className="printable-ticket border-2 border-dashed border-gray-400 p-6 rounded-lg text-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Manganeng Primary Health Clinic</h2>
          <div className="text-6xl font-extrabold my-4 text-emerald-900">{lastTicket.full_code}</div>
          {lastTicket.patient_name && <p className="text-lg text-gray-700 font-semibold">{lastTicket.patient_name}</p>}
          <p className="text-sm text-gray-500 mt-2">{new Date(lastTicket.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};
