/**
 * Utility functions for authentication and authorization
 */

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  try {
    const userData = JSON.parse(user);
    return !!(userData && userData.authToken);
  } catch {
    return false;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Save user to localStorage
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength (min 6 characters)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Check if passwords match
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Get user ID
export const getUserId = () => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.tipoUsuario : null;
};

// Get user name
export const getUserName = () => {
  const user = getCurrentUser();
  if (!user) return '';

  return `${user.nombre || ''} ${user.apellidos || ''}`.trim() || user.email || 'Usuario';
};
