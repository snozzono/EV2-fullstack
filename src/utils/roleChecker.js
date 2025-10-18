import { getCurrentUser } from './auth';

/**
 * Utility functions for role-based authorization
 */

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.tipoUsuario === 'admin';
};

// Check if user is regular user
export const isUser = () => {
  const user = getCurrentUser();
  return user && user.tipoUsuario === 'cliente';
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.tipoUsuario === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles = []) => {
  const user = getCurrentUser();
  if (!user) return false;

  return roles.includes(user.tipoUsuario);
};

// Check if user can access admin panel
export const canAccessAdmin = () => {
  return isAdmin();
};

// Check if user can manage products
export const canManageProducts = () => {
  return isAdmin();
};

// Check if user can manage users
export const canManageUsers = () => {
  return isAdmin();
};

// Check if user can view orders
export const canViewOrders = () => {
  const user = getCurrentUser();
  return user !== null; // Both admin and users can view their orders
};

// Check if user can manage all orders (admin only)
export const canManageAllOrders = () => {
  return isAdmin();
};

// Check if user owns a resource (by user ID)
export const ownsResource = (resourceUserId) => {
  const user = getCurrentUser();
  if (!user) return false;

  return user.id === resourceUserId;
};

// Check if user can edit a resource (owner or admin)
export const canEditResource = (resourceUserId) => {
  return isAdmin() || ownsResource(resourceUserId);
};

// Check if user can delete a resource (owner or admin)
export const canDeleteResource = (resourceUserId) => {
  return isAdmin() || ownsResource(resourceUserId);
};
