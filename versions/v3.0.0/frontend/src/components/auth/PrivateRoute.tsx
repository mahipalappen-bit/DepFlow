import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface PrivateRouteProps {
  roles?: string[];
  fallbackPath?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  roles,
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role);
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to dashboard or unauthorized page
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required permissions
  return <Outlet />;
};

export default PrivateRoute;


