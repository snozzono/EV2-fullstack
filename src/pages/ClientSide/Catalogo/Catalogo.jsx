import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';
const UPLOAD_API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

// Imagen placeholder en base64 (1x1 pixel transparente)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%236c757d"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="%23ffffff"%3ESin Imagen%3C/text%3E%3C/svg%3E';

export default function Catalogo() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedManga, setSelectedManga] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    ilustrador: '',
    descripcion: '',
    imagenPortada: '',
    precio: '',
    stock: '',
    stockCritico: '',
    anioPublicacion: '',
    paginas: '',
    editorial: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    fetchMangas();
    checkAdminStatus();
  }, []);

  // Verificar si el usuario es administrador
  const checkAdminStatus = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        console.log('Usuario actual:', userData);
        console.log('Tipo de usuario:', userData.tipoUsuario);
        if (userData.tipoUsuario === 'admin') {
          setIsAdmin(true);
          console.log('Usuario es admin');
        } else {
          setIsAdmin(false);
          console.log('Usuario NO es admin');
        }
      } else {
        setIsAdmin(false);
        console.log('No hay usuario logueado');
      }
    } catch (error) {
      console.error('Error al verificar estado de admin:', error);
      setIsAdmin(false);
    }
  };

  const fetchMangas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/manga`);

      if (!response.ok) {
        throw new Error('Error al cargar los mangas');
      }

      const data = await response.json();
      console.log('Mangas recibidos:', data);
      if (data.length > 0) {
        console.log('Estructura de imagenPortada:', data[0].imagenPortada);
      }
      setMangas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching mangas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir imagen al endpoint de Xano
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('content', file, file.name);

      console.log('Subiendo imagen:', file.name);

      const response = await fetch(`${UPLOAD_API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al subir imagen:', errorData);
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      console.log('Imagen subida exitosamente:', result);

      // Xano devuelve un objeto con la información de la imagen
      // Si no tiene url, la construimos desde el path
      if (!result.url && result.path) {
        result.url = `https://x8ki-letl-twmt.n7.xano.io${result.path}`;
      }

      return result;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  };

  const createManga = async (e) => {
    e.preventDefault();
    try {
      // Validar que haya imagen
      if (!imageFile) {
        alert('Por favor selecciona una imagen de portada');
        return;
      }

      // Paso 1: Subir la imagen al endpoint de upload
      console.log('Paso 1: Subiendo imagen...');
      const uploadedImage = await uploadImage(imageFile);

      // Paso 2: Crear el manga con el objeto de imagen retornado
      console.log('Paso 2: Creando manga con la imagen subida...');

      const payload = {
        titulo: formData.titulo,
        autor: formData.autor,
        ilustrador: formData.ilustrador || '',
        descripcion: formData.descripcion || '',
        precio: parseFloat(formData.precio) || 0,
        stock: parseInt(formData.stock) || 0,
        stockCritico: parseInt(formData.stockCritico) || 0,
        anioPublicacion: parseInt(formData.anioPublicacion) || 0,
        paginas: parseInt(formData.paginas) || 0,
        editorial: formData.editorial || '',
        imagenPortada: uploadedImage // El objeto completo de la imagen
      };

      console.log('Payload a enviar:', payload);

      const response = await fetch(`${API_BASE_URL}/manga`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al crear el manga');
      }

      await fetchMangas();
      resetForm();
      const modal = document.getElementById('createMangaModal');
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
      alert('Manga creado exitosamente!');
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al crear el manga: ' + err.message);
    }
  };

  const updateManga = async (e) => {
    e.preventDefault();
    try {
      let imagenPortadaData = selectedManga.imagenPortada; // Usar la imagen existente por defecto

      // Si hay una nueva imagen, subirla primero
      if (imageFile) {
        console.log('Subiendo nueva imagen...');
        imagenPortadaData = await uploadImage(imageFile);
      }

      // Preparar el payload con todos los datos
      const payload = {
        titulo: formData.titulo,
        autor: formData.autor,
        ilustrador: formData.ilustrador || '',
        descripcion: formData.descripcion || '',
        precio: parseFloat(formData.precio) || 0,
        stock: parseInt(formData.stock) || 0,
        stockCritico: parseInt(formData.stockCritico) || 0,
        anioPublicacion: parseInt(formData.anioPublicacion) || 0,
        paginas: parseInt(formData.paginas) || 0,
        editorial: formData.editorial || '',
        imagenPortada: imagenPortadaData
      };

      console.log('Actualizando manga ID:', selectedManga.id);
      console.log('Payload:', payload);

      const response = await fetch(`${API_BASE_URL}/manga/${selectedManga.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al actualizar el manga');
      }

      await fetchMangas();
      resetForm();
      const modal = document.getElementById('createMangaModal');
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
      alert('Manga actualizado exitosamente!');
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al actualizar el manga: ' + err.message);
    }
  };

  const deleteManga = async (mangaId) => {
    if (!window.confirm('¿Estás seguro de eliminar este manga?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el manga');

      await fetchMangas();
      alert('Manga eliminado exitosamente!');
    } catch (err) {
      alert('Error al eliminar el manga: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      autor: '',
      ilustrador: '',
      descripcion: '',
      imagenPortada: '',
      precio: '',
      stock: '',
      stockCritico: '',
      anioPublicacion: '',
      paginas: '',
      editorial: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setSelectedManga(null);
  };

  const openEditModal = (manga) => {
    setSelectedManga(manga);
    setFormData({
      titulo: manga.titulo || '',
      autor: manga.autor || '',
      ilustrador: manga.ilustrador || '',
      descripcion: manga.descripcion || '',
      imagenPortada: manga.imagenPortada || '',
      precio: manga.precio || '',
      stock: manga.stock || '',
      stockCritico: manga.stockCritico || '',
      anioPublicacion: manga.anioPublicacion || '',
      paginas: manga.paginas || '',
      editorial: manga.editorial || ''
    });
    // Establecer preview de imagen existente
    setImagePreview(manga.imagenPortada?.url || null);
    setImageFile(null);
    setEditMode(true);
  };

  const openDetailModal = (manga) => {
    setSelectedManga(manga);
  };

  // Filtrar mangas por búsqueda y género
  const filteredMangas = mangas.filter(manga => {
    const matchesSearch = manga.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manga.autor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === '' || manga.genero === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Obtener géneros únicos
  const genres = [...new Set(mangas.map(manga => manga.genero).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <strong>Error:</strong> {error}
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchMangas}>
              <i className="bi bi-arrow-clockwise me-1"></i>Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark">
            <i className="bi bi-book me-3"></i>Catálogo de Mangas
          </h1>
          <p className="lead text-muted">
            Descubre nuestra colección completa
          </p>
          {isAdmin && (
            <div className="mt-3">
              <span className="badge bg-success me-2">
                <i className="bi bi-shield-check me-1"></i>Modo Administrador
              </span>
              <button 
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#createMangaModal"
                onClick={resetForm}
              >
                <i className="bi bi-plus-circle me-2"></i>Agregar Manga
              </button>
            </div>
          )}
        </div>

        {/* Filtros y búsqueda */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text bg-warning text-dark">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de mangas */}
        {filteredMangas.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron mangas
          </div>
        ) : (
          <div className="row g-4">
            {filteredMangas.map((manga) => (
              <div key={manga.id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm hover-shadow transition">
                  <div className="position-relative">
                    <img
                      src={manga.imagenPortada?.url || PLACEHOLDER_IMAGE}
                      className="card-img-top"
                      alt={manga.titulo}
                      style={{ height: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevenir bucle infinito
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    {isAdmin && (
                      <div className="position-absolute top-0 end-0 p-2">
                        <button 
                          className="btn btn-sm btn-light me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#createMangaModal"
                          onClick={() => openEditModal(manga)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteManga(manga.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                    {manga.stock === 0 && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                        Agotado
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate" title={manga.titulo}>
                      {manga.titulo}
                    </h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-person me-1"></i>
                      {manga.autor || 'Autor desconocido'}
                    </p>
                    {manga.genero && (
                      <span className="badge bg-warning text-dark mb-2 align-self-start">
                        {manga.genero}
                      </span>
                    )}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 mb-0 text-success">
                          ${manga.precio?.toLocaleString('es-CL')}
                        </span>
                        <small className="text-muted">
                          Stock: {manga.stock || 0}
                        </small>
                      </div>
                      <button
                        className="btn btn-warning w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#mangaDetailModal"
                        onClick={() => openDetailModal(manga)}
                      >
                        <i className="bi bi-eye me-1"></i>Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle del manga */}
      <div
        className="modal fade"
        id="mangaDetailModal"
        tabIndex="-1"
        aria-labelledby="mangaDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title fw-bold" id="mangaDetailModalLabel">
                {selectedManga?.titulo}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-5">
                  <img
                    src={selectedManga?.imagenPortada?.url || PLACEHOLDER_IMAGE}
                    className="img-fluid rounded"
                    alt={selectedManga?.titulo}
                    onError={(e) => {
                      e.target.onerror = null; // Prevenir bucle infinito
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className="col-md-7">
                  <h3 className="mb-3">{selectedManga?.titulo}</h3>
                  <div className="mb-3">
                    <strong><i className="bi bi-person me-2"></i>Autor:</strong> {selectedManga?.autor}
                  </div>
                  <div className="mb-3">
                    <strong><i className="bi bi-building me-2"></i>Editorial:</strong> {selectedManga?.editorial?.nombre || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong><i className="bi bi-calendar me-2"></i>Año:</strong> {selectedManga?.añoPublicacion || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong><i className="bi bi-file-earmark-text me-2"></i>Páginas:</strong> {selectedManga?.paginas || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong><i className="bi bi-globe me-2"></i>Idioma:</strong> {selectedManga?.idioma || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong><i className="bi bi-box-seam me-2"></i>Stock:</strong> 
                    <span className={`badge ms-2 ${selectedManga?.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {selectedManga?.stock || 0} unidades
                    </span>
                  </div>
                  <div className="mb-3">
                    <h4 className="text-success">${selectedManga?.precio?.toLocaleString('es-CL')}</h4>
                  </div>
                  <div className="mb-3">
                    <strong>Descripción:</strong>
                    <p className="mt-2 text-muted">{selectedManga?.descripcion || 'Sin descripción disponible'}</p>
                  </div>
                  <button className="btn btn-warning w-100 btn-lg" disabled={selectedManga?.stock === 0}>
                    <i className="bi bi-cart-plus me-2"></i>
                    {selectedManga?.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar manga - Solo visible para admins */}
      {isAdmin && (
        <div
          className="modal fade"
          id="createMangaModal"
          tabIndex="-1"
          aria-labelledby="createMangaModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold" id="createMangaModalLabel">
                  <i className="bi bi-plus-circle me-2"></i>
                  {editMode ? 'Editar Manga' : 'Agregar Nuevo Manga'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={editMode ? updateManga : createManga}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="titulo" className="form-label fw-bold">
                        <i className="bi bi-type me-2"></i>Título *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        required
                        placeholder="Ej: One Piece Vol. 1"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="autor" className="form-label fw-bold">
                        <i className="bi bi-person me-2"></i>Autor *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="autor"
                        value={formData.autor}
                        onChange={(e) => setFormData({...formData, autor: e.target.value})}
                        required
                        placeholder="Ej: Eiichiro Oda"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ilustrador" className="form-label fw-bold">
                        <i className="bi bi-brush me-2"></i>Ilustrador
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ilustrador"
                        value={formData.ilustrador}
                        onChange={(e) => setFormData({...formData, ilustrador: e.target.value})}
                        placeholder="Ej: Nombre del ilustrador"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editorial" className="form-label fw-bold">
                        <i className="bi bi-building me-2"></i>Editorial
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="editorial"
                        value={formData.editorial}
                        onChange={(e) => setFormData({...formData, editorial: e.target.value})}
                        placeholder="Ej: Panini Comics"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="precio" className="form-label fw-bold">
                        <i className="bi bi-currency-dollar me-2"></i>Precio *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="precio"
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                        placeholder="9990"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="stock" className="form-label fw-bold">
                        <i className="bi bi-box-seam me-2"></i>Stock
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        min="0"
                        placeholder="10"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="stockCritico" className="form-label fw-bold">
                        <i className="bi bi-exclamation-triangle me-2"></i>Stock Crítico
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="stockCritico"
                        value={formData.stockCritico}
                        onChange={(e) => setFormData({...formData, stockCritico: e.target.value})}
                        min="0"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="anioPublicacion" className="form-label fw-bold">
                        <i className="bi bi-calendar me-2"></i>Año de Publicación
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="anioPublicacion"
                        value={formData.anioPublicacion}
                        onChange={(e) => setFormData({...formData, anioPublicacion: e.target.value})}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        placeholder="2024"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="paginas" className="form-label fw-bold">
                        <i className="bi bi-file-earmark-text me-2"></i>Páginas
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="paginas"
                        value={formData.paginas}
                        onChange={(e) => setFormData({...formData, paginas: e.target.value})}
                        min="1"
                        placeholder="Ej: 192"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imagenPortada" className="form-label fw-bold">
                      <i className="bi bi-image me-2"></i>Imagen de Portada
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="imagenPortada"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted">Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB</small>
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded shadow"
                          style={{ maxHeight: '200px' }}
                        />
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                              document.getElementById('imagenPortada').value = '';
                            }}
                          >
                            <i className="bi bi-trash me-1"></i>Eliminar imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label fw-bold">
                      <i className="bi bi-file-text me-2"></i>Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      rows="4"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Descripción del manga..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <i className="bi bi-check-circle me-2"></i>
                    {editMode ? 'Actualizar' : 'Crear'} Manga
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}