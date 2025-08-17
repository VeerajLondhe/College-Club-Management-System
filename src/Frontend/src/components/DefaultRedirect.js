import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DefaultRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const role = user.role?.rname || user.role;
  const position = user.pos;
  
  if (role === 'admin' || role === 1) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if ((role === 'student' || role === 2) && position === 'club_head') {
    return <Navigate to="/club-head-dashboard" replace />;
  }
  
  return <Navigate to="/browse-clubs" replace />;
};

export default DefaultRedirect;
