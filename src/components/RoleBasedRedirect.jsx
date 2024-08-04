import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RoleBasedRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPath = location.pathname;

    if (user && user.role) {
      if (currentPath === '/' || currentPath === '/login') {
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else if (user.role === 'user') {
          navigate('/dashboard');
        }
      }
    } else {
      if (currentPath !== '/') {
        navigate('/');
      }
    }
    setLoading(false);
  }, [navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default RoleBasedRedirect;
