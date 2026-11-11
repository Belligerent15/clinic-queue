import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Reception } from './pages/Reception';
import { Nurse } from './pages/Nurse';
import { TVDisplay } from './pages/TVDisplay';
import { Admin } from './pages/Admin';
import { Kiosk } from './pages/Kiosk';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/nurse" element={<Nurse />} />
        <Route path="/tv" element={<TVDisplay />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
