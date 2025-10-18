import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { isAdmin } from '../utils/roleChecker';

/**
 * AdminRoute component - Protects routes that require admin role
 *
 * Usage:
 * <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
 */
export default function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }

  if (!isAdmin()) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
}
