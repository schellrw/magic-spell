import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { user, profile, loading, requiredRole, location });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-white animate-pulse">
          Loading Magic...
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Redirecting to login...');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.log('Redirecting to home (role mismatch)...');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
