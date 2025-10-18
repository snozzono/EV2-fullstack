// MangaService.js
const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

const MangaService = {
  /**
   * Obtiene todos los mangas
   * GET /manga
   */
  async getAllMangas() {
    try {
      const response = await fetch(`${API_BASE_URL}/manga`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener mangas:', error);
      throw error;
    }
  },

  /**
   * Obtiene un manga por ID
   * GET /manga/{manga_id}
   */
  async getMangaById(mangaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener manga por ID:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo manga
   * POST /manga
   */
  async createManga(mangaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/manga`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mangaData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear manga:', error);
      throw error;
    }
  },

  /**
   * Actualiza un manga existente
   * PATCH /manga/{manga_id}
   */
  async updateManga(mangaId, mangaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mangaData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar manga:', error);
      throw error;
    }
  },

  /**
   * Elimina un manga
   * DELETE /manga/{manga_id}
   */
  async deleteManga(mangaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error al eliminar manga:', error);
      throw error;
    }
  },

  /**
   * Filtra mangas por stock disponible (mangas con stock > 0)
   */
  async getMangasDisponibles() {
    try {
      const mangas = await this.getAllMangas();
      return mangas.filter(manga => manga.stock > 0);
    } catch (error) {
      console.error('Error al obtener mangas disponibles:', error);
      throw error;
    }
  },

  /**
   * Filtra mangas por categoría/género (si tienes ese campo)
   * Nota: Adapta según la estructura real de tu base de datos
   */
  filterByGenre(mangas, genre) {
    if (!genre || genre === 'all') {
      return mangas;
    }
    // Adapta esto según cómo guardas las categorías en Xano
    return mangas.filter(manga => 
      manga.categoria === genre || 
      manga.genero === genre ||
      (manga.categorias && manga.categorias.includes(genre))
    );
  },

  /**
   * Búsqueda por título
   */
  searchByTitulo(mangas, titulo) {
    if (!titulo) return mangas;
    const search = titulo.toLowerCase();
    return mangas.filter(manga => 
      manga.titulo.toLowerCase().includes(search)
    );
  }
};

export default MangaService;