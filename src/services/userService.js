const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

const userService = {
  // Update user profile
  async updateProfile(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }

      const updatedUser = await response.json();

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get user orders (pedidos)
  async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedido`);

      if (!response.ok) {
        throw new Error('Error al cargar pedidos');
      }

      const data = await response.json();

      // Filter orders for current user
      const userOrders = Array.isArray(data)
        ? data.filter(p => p._usuario?.id === userId)
        : [];

      return userOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/detallepedido`);

      if (!response.ok) {
        throw new Error('Error al cargar detalles del pedido');
      }

      const data = await response.json();

      // Filter details for this order
      const orderDetails = Array.isArray(data)
        ? data.filter(d => d._pedido?.id === orderId)
        : [];

      return orderDetails;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Get user favorites
  async getUserFavorites(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorito`);

      if (!response.ok) {
        throw new Error('Error al cargar favoritos');
      }

      const data = await response.json();

      // Filter favorites for current user
      const userFavorites = Array.isArray(data)
        ? data.filter(f => f._usuario?.id === userId)
        : [];

      return userFavorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  // Add to favorites
  async addToFavorites(userId, mangaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _usuario: userId,
          _manga: mangaId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar a favoritos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites
  async removeFromFavorites(favoritoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorito/${favoritoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos');
      }

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Get user cart
  async getUserCart(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/carrito`);

      if (!response.ok) {
        throw new Error('Error al cargar carrito');
      }

      const data = await response.json();

      // Filter cart items for current user
      const userCart = Array.isArray(data)
        ? data.filter(c => c._usuario?.id === userId)
        : [];

      return userCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add to cart
  async addToCart(userId, mangaId, cantidad = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _usuario: userId,
          _manga: mangaId,
          cantidad
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Remove from cart
  async removeFromCart(carritoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/carrito/${carritoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar del carrito');
      }

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartQuantity(carritoId, cantidad) {
    try {
      const response = await fetch(`${API_BASE_URL}/carrito/${carritoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cantidad');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  // ====== ADMIN FUNCTIONS ======

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario`);

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const users = await response.json();
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // Get user by ID (admin only)
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${userId}`);

      if (!response.ok) {
        throw new Error('Error al cargar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user (admin only)
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default userService;
