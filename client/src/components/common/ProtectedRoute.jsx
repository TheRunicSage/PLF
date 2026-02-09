import { Navigate, useLocation } from 'react-router-dom';

import { hasValidAuthToken } from '../../config.js';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!hasValidAuthToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location, reason: 'missing' }} />;
  }

  return children;
};

export default ProtectedRoute;
