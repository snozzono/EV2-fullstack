import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    descripcionCorta: '',
    imagen: '',
    activo: true
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchBlogs();
    checkAdminStatus();
  }, []);

  // Verificar si el usuario es administrador
  const checkAdminStatus = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        console.log('Usuario actual:', userData); // Para debug
        console.log('Tipo de usuario:', userData.tipoUsuario); // Para debug
        // Verificar SOLO si el tipoUsuario es exactamente "admin"
        if (userData.tipoUsuario === 'admin') {
          setIsAdmin(true);
          console.log('Usuario es admin'); // Para debug
        } else {
          setIsAdmin(false);
          console.log('Usuario NO es admin'); // Para debug
        }
      } else {
        setIsAdmin(false);
        console.log('No hay usuario logueado'); // Para debug
      }
    } catch (error) {
      console.error('Error al verificar estado de admin:', error);
      setIsAdmin(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blog`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los blogs');
      }
      
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear el blog');

      await fetchBlogs();
      resetForm();
      const modal = document.getElementById('createBlogModal');
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
      alert('Blog creado exitosamente!');
    } catch (err) {
      alert('Error al crear el blog: ' + err.message);
    }
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${selectedBlog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al actualizar el blog');

      await fetchBlogs();
      resetForm();
      const modal = document.getElementById('createBlogModal');
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
      alert('Blog actualizado exitosamente!');
    } catch (err) {
      alert('Error al actualizar el blog: ' + err.message);
    }
  };

  const deleteBlog = async (blogId) => {
    if (!window.confirm('¿Estás seguro de eliminar este blog?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el blog');

      await fetchBlogs();
      alert('Blog eliminado exitosamente!');
    } catch (err) {
      alert('Error al eliminar el blog: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      contenido: '',
      descripcionCorta: '',
      imagen: '',
      activo: true
    });
    setEditMode(false);
    setSelectedBlog(null);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      titulo: blog.titulo || '',
      contenido: blog.contenido || '',
      descripcionCorta: blog.descripcionCorta || '',
      imagen: blog.imagen || '',
      activo: blog.activo !== undefined ? blog.activo : true
    });
    setEditMode(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    // Si es epoch (número)
    if (typeof dateString === 'number') {
      const date = new Date(dateString * 1000);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    // Si es string de fecha
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando blogs...</p>
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
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchBlogs}>
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
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark">
            <i className="bi bi-journal-text me-3"></i>Blog de Manga Store
          </h1>
          <p className="lead text-muted">
            Descubre las últimas noticias del mundo del manga
          </p>
          {isAdmin && (
            <div className="mt-3">
              <span className="badge bg-success me-2">
                <i className="bi bi-shield-check me-1"></i>Modo Administrador
              </span>
              <button 
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#createBlogModal"
                onClick={resetForm}
              >
                <i className="bi bi-plus-circle me-2"></i>Crear Blog
              </button>
            </div>
          )}
        </div>

        {blogs.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No hay blogs disponibles en este momento
          </div>
        ) : (
          <div id="blogCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              {blogs.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#blogCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            <div className="carousel-inner">
              {blogs.map((blog, index) => (
                <div key={blog.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                      <div className="card shadow-lg border-0">
                        <div
                          className="card-header text-white text-center py-4 position-relative"
                          style={{ 
                            background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                            minHeight: '100px'
                          }}
                        >
                          <h3 className="card-title mb-0 fw-bold text-white">
                            <i className="bi bi-fire me-2"></i>
                            {blog.titulo || 'Sin título'}
                          </h3>
                          {isAdmin && (
                            <div className="position-absolute top-0 end-0 p-2">
                              <button 
                                className="btn btn-sm btn-light me-1"
                                data-bs-toggle="modal"
                                data-bs-target="#createBlogModal"
                                onClick={() => openEditModal(blog)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteBlog(blog.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>

                        {blog.imagen && (
                          <img 
                            src={blog.imagen} 
                            className="card-img-top" 
                            alt={blog.titulo}
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}

                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <i className="bi bi-calendar3 text-primary me-2"></i>
                            <small className="text-muted">
                              {formatDate(blog.fechaPublicacion || blog.created_at)}
                            </small>
                            <span className="ms-auto">
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-star-fill me-1"></i>Trending
                              </span>
                            </span>
                          </div>

                          <p className="card-text text-muted">
                            {blog.descripcionCorta || blog.contenido?.substring(0, 150) || 'Sin descripción disponible'}
                            {(blog.descripcionCorta?.length > 150 || blog.contenido?.length > 150) && '...'}
                          </p>

                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-eye text-secondary me-1"></i>
                              <small className="text-muted">
                                {blog.views || Math.floor(Math.random() * 5000)} lecturas
                              </small>
                            </div>
                            <button
                              className="btn btn-warning btn-lg fw-semibold"
                              onClick={() => setSelectedBlog(blog)}
                              data-bs-toggle="modal"
                              data-bs-target="#blogModal"
                            >
                              <i className="bi bi-book-open me-2"></i>Leer más
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#blogCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#blogCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal para ver blog completo */}
      <div
        className="modal fade"
        id="blogModal"
        tabIndex="-1"
        aria-labelledby="blogModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div
              className="modal-header text-white"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #ffa500)' }}
            >
              <h5 className="modal-title fw-bold" id="blogModalLabel">
                {selectedBlog?.titulo}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBlog?.imagen && (
                <img
                  src={selectedBlog.imagen}
                  className="img-fluid rounded mb-3"
                  alt={selectedBlog.titulo}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="mb-3">
                <i className="bi bi-calendar3 text-primary me-2"></i>
                <small className="text-muted">
                  {formatDate(selectedBlog?.fechaPublicacion || selectedBlog?.created_at)}
                </small>
              </div>
              <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedBlog?.contenido || 'Contenido no disponible'}
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

      {/* Modal para crear/editar blog - Solo visible para admins */}
      {isAdmin && (
        <div
          className="modal fade"
          id="createBlogModal"
          tabIndex="-1"
          aria-labelledby="createBlogModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div
                className="modal-header text-white"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #ffa500)' }}
              >
                <h5 className="modal-title fw-bold" id="createBlogModalLabel">
                  <i className="bi bi-plus-circle me-2"></i>
                  {editMode ? 'Editar Blog' : 'Crear Nuevo Blog'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={editMode ? updateBlog : createBlog}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label fw-bold">
                      <i className="bi bi-type me-2"></i>Título
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      required
                      placeholder="Ej: Los Manga Más Populares de 2024"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcionCorta" className="form-label fw-bold">
                      <i className="bi bi-file-text me-2"></i>Descripción Corta
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcionCorta"
                      rows="2"
                      value={formData.descripcionCorta}
                      onChange={(e) => setFormData({...formData, descripcionCorta: e.target.value})}
                      placeholder="Breve descripción del blog..."
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contenido" className="form-label fw-bold">
                      <i className="bi bi-file-richtext me-2"></i>Contenido
                    </label>
                    <textarea
                      className="form-control"
                      id="contenido"
                      rows="8"
                      value={formData.contenido}
                      onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                      required
                      placeholder="Contenido completo del blog..."
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imagen" className="form-label fw-bold">
                      <i className="bi bi-image me-2"></i>URL de la Imagen
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imagen"
                      value={formData.imagen}
                      onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formData.imagen && (
                      <div className="mt-2">
                        <img 
                          src={formData.imagen} 
                          alt="Preview" 
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px' }}
                          onError={(e) => {
                            e.target.src = '';
                            e.target.alt = 'Error al cargar imagen';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="activo"
                      checked={formData.activo}
                      onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="activo">
                      Blog activo
                    </label>
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
                    {editMode ? 'Actualizar' : 'Crear'} Blog
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}