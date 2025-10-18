const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS';

const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el login');
      }

      const loginResponse = await response.json();
      console.log('Respuesta de login:', loginResponse);

      // Si la respuesta incluye authToken, obtener datos completos del usuario
      if (loginResponse.authToken) {
        localStorage.setItem('authToken', loginResponse.authToken);

        try {
          // Obtener datos completos del usuario usando /auth/me
          const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResponse.authToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('Datos completos del usuario desde /auth/me:', userData);

            // Guardar datos completos del usuario con el token
            const userWithToken = { ...userData, authToken: loginResponse.authToken };
            localStorage.setItem('user', JSON.stringify(userWithToken));

            return { ...loginResponse, user: userWithToken };
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
        }
      }

      // Fallback: guardar lo que venga en la respuesta
      if (loginResponse.user) {
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
      }

      return loginResponse;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Signup
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el registro');
      }

      const data = await response.json();

      // Guardar token y usuario en localStorage
      if (data.authToken) {
        localStorage.setItem('authToken', data.authToken);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Error en signup:', error);
      throw error;
    }
  },

  // Get current user (from /auth/me)
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuario actual');
      }

      const data = await response.json();

      // Actualizar localStorage con datos frescos
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get user from localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user && user.tipoUsuario === 'admin';
  },

  // Check if user is regular user
  isUser() {
    const user = this.getUser();
    return user && user.tipoUsuario === 'cliente';
  }
};

export default authService;
