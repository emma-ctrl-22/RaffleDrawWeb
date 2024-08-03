import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Dashboard, Prizes, Raffles, Winners, Report, Settings } from './pages';
import { DefaultLayout, ProtectedRoute } from './components';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div className="h-[calc(100vh-2rem)]">
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DefaultLayout>
                    <Report />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prizes"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DefaultLayout>
                    <Prizes />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DefaultLayout>
                    <Settings />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />

            {/* User and Admin Routes */}
            <Route
              path="/raffles"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <DefaultLayout>
                    <Raffles />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/winners"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <DefaultLayout>
                    <Winners />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin','user']}>
                  <DefaultLayout>
                    <Dashboard />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;