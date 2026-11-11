import React,als useState, useEffect } from 'react';

export const Kiosk: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [issuedTicket, setIssuedTicket] = useState<any>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const requestTicket = async (categoryCode: string) => {
    try {
      const res = await fetch('/api/tickets/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_code: categoryCode, patient_name: patientName || 'Walk-in Patient' })
      });
      const ticket = await res.json();
      setIssuedTicket(ticket);
      setPatientName('');
      setCountdown(8); // Reset screen after 8 seconds
    } catch (err) {
      console.error('Kiosk ticket issuance error', err);
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setIssuedTicket(null);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-8 font-sans">
      <header className="text-center border-b border-slate-700 pb-6">
        <h1 className="text-4xl font-extrabold text-emerald-400">Sekhukhune QueueCare Hub</h1>
        <p className="text-xl text-slate-300 mt-2">Manganeng Primary Health Clinic — Patient Self-Service Kiosk</p>
      </header>

      {issuedTicket ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white text-slate-900 p-12 rounded-3xl shadow-2xl max-w-xl w-full border-4 border-emerald-500 animate-pulse">
            <h2 className="text-2xl font-bold text-gray-600 uppercase tracking-wider">Your Ticket Number</h2>
            <div className="text-9xl font-black text-emerald-800 my-6">{issuedTicket.full_code}</div>
            <p className="text-xl font-semibold text-gray-700">Please take a seat. Your number will be called on the TV screen.</p>
            <p className="text-sm text-gray-400 mt-6">Returning to main menu in {countdown}s...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-200">Select Your Service / Kgetha Tlotlo Ya Gago:</h2>
          
          <div className="mb-8 max-w-md mx-auto w-full">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Patient First Name (Optional)</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Mpho"
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-600 text-white text-lg focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => requestTicket('A')}
              className="p-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-left shadow-xl transition transform active:scale-95 border-2 border-blue-400"
            >
              <span className="text-3xl font-black block">A - General Consultation</span>
              <span className="text-lg opacity-90 mt-2 block">General checkups, minor ailments & standard care</span>
            </button>

            <button
              onClick={() => requestTicket('B')}
              className="p-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-left shadow-xl transition transform active:scale-95 border-2 border-emerald-400"
            >
              <span className="text-3xl font-black block">B - Chronic Care</span>
              <span className="text-lg opacity-90 mt-2 block">Repeat medication collection & chronic condition monitoring</span>
            </button>

            <button
              onClick={() => requestTicket('C')}
              className="p-8 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-left shadow-xl transition transform active:scale-95 border-2 border-purple-400"
            >
              <span className="text-3xl font-black block">C - Mother & Baby</span>
              <span className="text-lg opacity-90 mt-2 block">Antenatal care, immunizations & pediatric services</span>
            </button>

            <button
              onClick={() => requestTicket('E')}
              className="p-8 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-left shadow-xl transition transform active:scale-95 border-2 border-red-400 animate-pulse"
            >
              <span className="text-3xl font-black block">E - Emergency Priority</span>
              <span className="text-lg opacity-90 mt-2 block">Urgent medical attention & acute trauma cases</span>
            </button>
          </div>
        </div>
      )}

      <footer className="text-center text-slate-500 text-sm border-t border-slate-800 pt-4">
        Sekhukhune QueueCare Hub &bull; Rural Health Digital Infrastructure &bull; POPIA Compliant
      </footer>
    </div>
  );
};
