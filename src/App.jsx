// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Dashboard, Prizes, Raffles, Winners, Report, Settings } from './pages';
import { DefaultLayout,ProtectedRoute } from './components';
import { Toaster } from 'react-hot-toast';


const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const roleBasedRoutes = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DefaultLayout>
                  <Dashboard />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
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
        </>
      );
    } else if (userRole === 'user') {
      return (
        <>
          <Route
            path="/raffles"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DefaultLayout>
                  <Raffles />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/winners"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DefaultLayout>
                  <Winners />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <div className="h-[calc(100vh-2rem)]">
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            {roleBasedRoutes()}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
