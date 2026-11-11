import React, { useState, useEffect } from 'react';
import { announceTicketCall } from '../utils/audioSynthesizer';

export const TVDisplay: React.FC = () => {
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [isBlinking, setIsBlinking] = useState(false);

  const fetchLiveState = async () => {
    try {
      const res = await fetch('/api/tickets/live');
      const data = await res.json();
      setCurrentCall(data.currentCall);
      setRecentCalls(data.recentCalls || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'TICKET_CALLED') {
        setCurrentCall(data.ticket);
        setIsBlinking(true);
        announceTicketCall(data.ticket.full_code, data.ticket.room_number || 'Room 1');
        setTimeout(() => setIsBlinking(false), 5000);
        fetchLiveState();
      } else if (data.type === 'TICKET_UPDATED' || data.type === 'TICKET_CREATED') {
        fetchLiveState();
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col font-sans overflow-hidden">
      <header className="bg-emerald-800 p-6 flex justify-between items-center border-b-4 border-emerald-500">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Sekhukhune QueueCare Hub — Live Status Board
        </h1>
        <div className="text-xl font-semibold bg-emerald-950 px-4 py-2 rounded-lg">
          Manganeng Primary Health Clinic
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 p-6">
        <div className="col-span-8 bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col justify-center items-center shadow-2xl">
          <span className="text-2xl font-bold text-emerald-400 tracking-wider mb-4 uppercase">
            NOW SERVING / SEGOLELO
          </span>

          {currentCall ? (
            <div className={`text-center ${isBlinking ? 'animate-bounce' : ''}`}>
              <div className="text-9xl font-black text-amber-400 tracking-tight drop-shadow-md">
                {currentCall.full_code}
              </div>
              <div className="text-5xl font-bold text-white mt-6 bg-emerald-700 px-8 py-3 rounded-xl inline-block shadow-lg">
                👉 {currentCall.room_number || 'Room 1'}
              </div>
            </div>
          ) : (
            <div className="text-4xl text-slate-500 font-bold">Waiting for next call...</div>
          )}
        </div>

        <div className="col-span-4 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
          <h2 className="text-xl font-bold text-slate-300 border-b border-slate-700 pb-3 mb-4">
            RECENT CALLS
          </h2>
          <div className="space-y-4 flex-1">
            {recentCalls.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                <span className="text-3xl font-bold text-emerald-300">{item.full_code}</span>
                <span className="text-xl font-semibold text-slate-200">{item.room_number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
