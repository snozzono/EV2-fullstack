import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * PrivateRoute component - Protects routes that require authentication
 *
 * Usage:
 * <Route path="/perfil" element={<PrivateRoute><ClientProfile /></PrivateRoute>} />
 */
export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
}
