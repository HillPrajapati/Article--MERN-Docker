import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((s) => s.auth);
  if (!auth?.accessToken) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
