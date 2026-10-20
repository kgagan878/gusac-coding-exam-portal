import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';

import Login from './pages/Login';
import Instructions from './pages/Instructions';
import ExamPortal from './pages/ExamPortal';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <Routes>
            {/* Student Flow */}
            <Route path="/" element={<Navigate to="/exam" replace />} />
            <Route path="/exam" element={<Login />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/portal" element={<ExamPortal />} />
            <Route path="/result" element={<Result />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Admin Flow */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/exam" replace />} />
          </Routes>
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
