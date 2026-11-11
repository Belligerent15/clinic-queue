import React, { useState, useEffect } from 'react';

export const Nurse: React.FC = () => {
  const [roomNumber, setRoomNumber] = useState('Room 2');
  const [activeTicket, setActiveTicket] = useState<any>(null);

  const callNext = async () => {
    const res = await fetch('/api/tickets/call-next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_number: roomNumber })
    });
    if (res.ok) {
      const ticket = await res.json();
      setActiveTicket(ticket);
    }
  };

  const updateStatus = async (status: string) => {
    if (!activeTicket) return;
    const res = await fetch('/api/tickets/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id: activeTicket.id, status, room_number: roomNumber })
    });
    const updated = await res.json();
    if (status === 'COMPLETED' || status === 'NO_SHOW') {
      setActiveTicket(null);
    } else {
      setActiveTicket(updated);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+') { e.preventDefault(); callNext(); }
      if (e.key === '*') { e.preventDefault(); updateStatus('NO_SHOW'); }
      if (e.key === '/') { e.preventDefault(); updateStatus('CALLED'); }
      if (e.key === 'Enter') { e.preventDefault(); updateStatus('COMPLETED'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTicket, roomNumber]);

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nurse Numpad Station</h1>
        <select
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="p-2 border rounded-md font-bold text-lg bg-emerald-50 text-emerald-900"
        >
          <option value="Room 1">Room 1</option>
          <option value="Room 2">Room 2</option>
          <option value="Room 3">Room 3</option>
        </select>
      </header>

      {activeTicket ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 text-center mb-8">
          <span className="text-sm uppercase font-bold text-emerald-600">Currently Serving</span>
          <div className="text-7xl font-black text-emerald-900 my-2">{activeTicket.full_code}</div>
          {activeTicket.patient_name && <div className="text-2xl text-gray-700">{activeTicket.patient_name}</div>}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500 mb-8 font-semibold">
          No active patient selected. Press [+] to Call Next.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={callNext} className="p-6 bg-emerald-600 text-white font-bold rounded-xl text-xl flex justify-between items-center shadow-lg hover:bg-emerald-700">
          <span>CALL NEXT</span>
          <span className="text-sm bg-emerald-800 px-3 py-1 rounded">[ + ]</span>
        </button>
        <button onClick={() => updateStatus('COMPLETED')} className="p-6 bg-blue-600 text-white font-bold rounded-xl text-xl flex justify-between items-center shadow-lg hover:bg-blue-700">
          <span>COMPLETE</span>
          <span className="text-sm bg-blue-800 px-3 py-1 rounded">[ Enter ]</span>
        </button>
        <button onClick={() => updateStatus('CALLED')} className="p-6 bg-amber-600 text-white font-bold rounded-xl text-xl flex justify-between items-center shadow-lg hover:bg-amber-700">
          <span>RE-CALL</span>
          <span className="text-sm bg-amber-800 px-3 py-1 rounded">[ / ]</span>
        </button>
        <button onClick={() => updateStatus('NO_SHOW')} className="p-6 bg-red-600 text-white font-bold rounded-xl text-xl flex justify-between items-center shadow-lg hover:bg-red-700">
          <span>NO SHOW</span>
          <span className="text-sm bg-red-800 px-3 py-1 rounded">[ * ]</span>
        </button>
      </div>
    </div>
  );
};
