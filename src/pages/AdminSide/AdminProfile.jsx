import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';
import './AdminProfile.css';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const currentUser = getCurrentUser();

      // Verificar que sea admin
      if (!currentUser || currentUser.tipoUsuario !== 'admin') {
        alert('Acceso denegado. Solo administradores pueden acceder.');
        navigate('/');
        return;
      }

      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || '',
        apellidos: currentUser.apellidos || '',
        email: currentUser.email || '',
        telefono: currentUser.telefono || '',
        direccion: currentUser.direccion || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      navigate('/');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      // Aquí irá la llamada a la API para actualizar el perfil
      alert('Actualización de perfil de admin - Por implementar');
      setEditMode(false);
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      nombre: user.nombre || '',
      apellidos: user.apellidos || '',
      email: user.email || '',
      telefono: user.telefono || '',
      direccion: user.direccion || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="admin-profile-loading">
        <div className="spinner-wrapper">
          <div className="spinner-border text-danger" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando panel de administrador...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', icon: 'bi-person-gear', label: 'Mi Información' },
    { id: 'stats', icon: 'bi-graph-up', label: 'Estadísticas' },
    { id: 'settings', icon: 'bi-gear', label: 'Configuración' }
  ];

  return (
    <div className="admin-profile-page">
      {/* Hero Header */}
      <div className="admin-profile-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="admin-avatar">
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <h1 className="admin-name">
                {user.nombre} {user.apellidos}
              </h1>
              <p className="admin-email">
                <i className="bi bi-envelope me-2"></i>
                {user.email}
              </p>
              <span className="admin-badge">
                <i className="bi bi-shield-fill-check me-1"></i>
                Administrador
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs-wrapper">
        <div className="container">
          <ul className="admin-tabs">
            {tabs.map((tab) => (
              <li key={tab.id} className="admin-tab-item">
                <button
                  className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container admin-content">
        <div className="tab-content-wrapper">
          {activeTab === 'info' && (
            <div className="fade-in">
              <div className="admin-info-card">
                <div className="card-header">
                  <h3>
                    <i className="bi bi-person-circle me-2"></i>
                    Información Personal
                  </h3>
                </div>
                <div className="card-body">
                  {!editMode ? (
                    <div className="info-display">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <strong><i className="bi bi-person me-2"></i>Nombre:</strong>
                          <p className="text-muted">{user.nombre}</p>
                        </div>
                        <div className="col-md-6">
                          <strong><i className="bi bi-person me-2"></i>Apellidos:</strong>
                          <p className="text-muted">{user.apellidos}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <strong><i className="bi bi-envelope me-2"></i>Email:</strong>
                          <p className="text-muted">{user.email}</p>
                        </div>
                        <div className="col-md-6">
                          <strong><i className="bi bi-telephone me-2"></i>Teléfono:</strong>
                          <p className="text-muted">{user.telefono || 'No especificado'}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <strong><i className="bi bi-geo-alt me-2"></i>Dirección:</strong>
                          <p className="text-muted">{user.direccion || 'No especificada'}</p>
                        </div>
                        <div className="col-md-6">
                          <strong><i className="bi bi-shield me-2"></i>Tipo de Usuario:</strong>
                          <p className="text-muted">
                            <span className="badge bg-danger">Administrador</span>
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-danger" onClick={() => setEditMode(true)}>
                        <i className="bi bi-pencil me-2"></i>Editar Información
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            className="form-control"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Teléfono</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label">Dirección</label>
                          <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-danger">
                          <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                          <i className="bi bi-x-circle me-2"></i>Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="fade-in">
              <div className="admin-info-card">
                <div className="card-header">
                  <h3>
                    <i className="bi bi-graph-up me-2"></i>
                    Estadísticas del Sistema
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-4">
                      <div className="stat-card">
                        <i className="bi bi-people-fill stat-icon"></i>
                        <h4>Usuarios</h4>
                        <p className="stat-number">-</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-4">
                      <div className="stat-card">
                        <i className="bi bi-book-fill stat-icon"></i>
                        <h4>Mangas</h4>
                        <p className="stat-number">-</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-4">
                      <div className="stat-card">
                        <i className="bi bi-cart-fill stat-icon"></i>
                        <h4>Pedidos</h4>
                        <p className="stat-number">-</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-4">
                      <div className="stat-card">
                        <i className="bi bi-cash-stack stat-icon"></i>
                        <h4>Ingresos</h4>
                        <p className="stat-number">$-</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted text-center">
                    <i className="bi bi-info-circle me-1"></i>
                    Estadísticas por implementar
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="fade-in">
              <div className="admin-info-card">
                <div className="card-header">
                  <h3>
                    <i className="bi bi-gear me-2"></i>
                    Configuración del Sistema
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-muted">
                    <i className="bi bi-tools me-1"></i>
                    Panel de configuración por implementar
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
