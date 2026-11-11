import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('admin_manganeng');
  const [pin, setPin] = useState('4412');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'CLINIC_ADMIN') navigate('/admin');
      else if (data.role === 'RECEPTIONIST') navigate('/reception');
      else if (data.role === 'NURSE') navigate('/nurse');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-black text-emerald-800 mb-2">Sekhukhune QueueCare Hub</h1>
        <p className="text-sm text-gray-500 mb-6">Offline Clinic Staff Portal</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">4-Digit PIN</label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 border rounded-lg text-center tracking-widest text-2xl"
            required
          />
        </div>

        <button type="submit" className="w-full py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 shadow-lg">
          Sign In
        </button>
      </form>
    </div>
  );
};
