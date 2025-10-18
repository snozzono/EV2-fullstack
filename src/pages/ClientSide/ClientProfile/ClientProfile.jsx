import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

export default function ClientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === 'pedidos') {
        fetchPedidos();
      } else if (activeTab === 'favoritos') {
        fetchFavoritos();
      }
    }
  }, [activeTab, user]);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        nombre: parsedUser.nombre || '',
        apellidos: parsedUser.apellidos || '',
        email: parsedUser.email || '',
        telefono: parsedUser.telefono || '',
        direccion: parsedUser.direccion || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al verificar autenticaci�n:', error);
      navigate('/');
    }
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pedido`);
      if (!response.ok) throw new Error('Error al cargar pedidos');

      const data = await response.json();
      // Filtrar pedidos del usuario actual
      const userPedidos = Array.isArray(data)
        ? data.filter(p => p._usuario?.id === user.id)
        : [];
      setPedidos(userPedidos);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    }
  };

  const fetchFavoritos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorito`);
      if (!response.ok) throw new Error('Error al cargar favoritos');

      const data = await response.json();
      // Filtrar favoritos del usuario actual
      const userFavoritos = Array.isArray(data)
        ? data.filter(f => f._usuario?.id === user.id)
        : [];
      setFavoritos(userFavoritos);
    } catch (error) {
      console.error('Error fetching favoritos:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al actualizar perfil');

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditMode(false);
      alert('Perfil actualizado exitosamente!');
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contrase�as no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contrase�a debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Aqu� deber�as implementar la l�gica de cambio de contrase�a seg�n tu API
      alert('Funci�n de cambio de contrase�a por implementar en el backend');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error al cambiar contrase�a: ' + error.message);
    }
  };

  const removeFavorito = async (favoritoId) => {
    if (!window.confirm('�Eliminar de favoritos?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/favorito/${favoritoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar favorito');

      fetchFavoritos();
      alert('Eliminado de favoritos');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const viewPedidoDetails = async (pedidoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/detallepedido`);
      if (!response.ok) throw new Error('Error al cargar detalles');

      const data = await response.json();
      const detalles = Array.isArray(data)
        ? data.filter(d => d._pedido?.id === pedidoId)
        : [];

      const pedido = pedidos.find(p => p.id === pedidoId);
      setSelectedPedido({ ...pedido, detalles });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar detalles del pedido');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold text-dark">
          <i className="bi bi-person-circle me-3"></i>Mi Perfil
        </h1>
        <p className="lead text-muted">Gestiona tu informaci�n personal y pedidos</p>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="bi bi-person me-2"></i>Informaci�n Personal
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            <i className="bi bi-bag-check me-2"></i>Mis Pedidos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'favoritos' ? 'active' : ''}`}
            onClick={() => setActiveTab('favoritos')}
          >
            <i className="bi bi-heart me-2"></i>Favoritos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="bi bi-shield-lock me-2"></i>Seguridad
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Informaci�n Personal */}
        {activeTab === 'info' && (
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-person-badge me-2"></i>Informaci�n Personal
              </h5>
            </div>
            <div className="card-body">
              {!editMode ? (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong><i className="bi bi-person me-2"></i>Nombre:</strong>
                      <p className="text-muted">{user.nombre || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6">
                      <strong><i className="bi bi-person me-2"></i>Apellidos:</strong>
                      <p className="text-muted">{user.apellidos || 'No especificado'}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong><i className="bi bi-envelope me-2"></i>Email:</strong>
                      <p className="text-muted">{user.email}</p>
                    </div>
                    <div className="col-md-6">
                      <strong><i className="bi bi-telephone me-2"></i>Tel�fono:</strong>
                      <p className="text-muted">{user.telefono || 'No especificado'}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <strong><i className="bi bi-geo-alt me-2"></i>Direcci�n:</strong>
                      <p className="text-muted">{user.direccion || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong><i className="bi bi-shield me-2"></i>Tipo de Usuario:</strong>
                      <p className="text-muted">
                        <span className={`badge ${user.tipoUsuario === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {user.tipoUsuario === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-warning"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Editar Informaci�n
                  </button>
                </>
              ) : (
                <form onSubmit={handleUpdateProfile}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Apellidos</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Tel�fono</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Direcci�n</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-warning me-2">
                    <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        nombre: user.nombre || '',
                        apellidos: user.apellidos || '',
                        email: user.email || '',
                        telefono: user.telefono || '',
                        direccion: user.direccion || ''
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Historial de Pedidos */}
        {activeTab === 'pedidos' && (
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-bag-check me-2"></i>Historial de Pedidos
              </h5>
            </div>
            <div className="card-body">
              {pedidos.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  <p className="mt-3 text-muted">No tienes pedidos a�n</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>N� Pedido</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td>#{pedido.ordenCompra || pedido.id}</td>
                          <td>{new Date(pedido.fechaPedido || pedido.created_at).toLocaleDateString('es-CL')}</td>
                          <td>
                            <span className={`badge ${
                              pedido.estadoPedido === 'entregado' ? 'bg-success' :
                              pedido.estadoPedido === 'enviado' ? 'bg-info' :
                              pedido.estadoPedido === 'pendiente' ? 'bg-warning' :
                              'bg-secondary'
                            }`}>
                              {pedido.estadoPedido || 'Pendiente'}
                            </span>
                          </td>
                          <td className="fw-bold text-success">
                            ${pedido.total?.toLocaleString('es-CL') || '0'}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              data-bs-toggle="modal"
                              data-bs-target="#pedidoDetailModal"
                              onClick={() => viewPedidoDetails(pedido.id)}
                            >
                              <i className="bi bi-eye me-1"></i>Ver Detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favoritos */}
        {activeTab === 'favoritos' && (
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-heart-fill me-2"></i>Mis Favoritos
              </h5>
            </div>
            <div className="card-body">
              {favoritos.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-heart" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  <p className="mt-3 text-muted">No tienes favoritos guardados</p>
                </div>
              ) : (
                <div className="row g-4">
                  {favoritos.map((favorito) => (
                    <div key={favorito.id} className="col-sm-6 col-md-4 col-lg-3">
                      <div className="card h-100">
                        <div className="position-relative">
                          {favorito._manga?.imagen ? (
                            <img
                              src={favorito._manga.imagen}
                              className="card-img-top"
                              alt={favorito._manga.titulo}
                              style={{ height: '250px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center bg-secondary"
                              style={{ height: '250px' }}
                            >
                              <i className="bi bi-image" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.5)' }}></i>
                            </div>
                          )}
                          <button
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                            onClick={() => removeFavorito(favorito.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="card-body">
                          <h6 className="card-title text-truncate">
                            {favorito._manga?.titulo || 'Manga'}
                          </h6>
                          <p className="card-text small text-muted">
                            {favorito._manga?.autor || 'Autor desconocido'}
                          </p>
                          <p className="fw-bold text-success">
                            ${favorito._manga?.precio?.toLocaleString('es-CL') || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cambiar Contrase�a */}
        {activeTab === 'password' && (
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-shield-lock me-2"></i>Cambiar Contrase�a
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Contrase�a Actual</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Nueva Contrase�a</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                    minLength="6"
                  />
                  <small className="text-muted">M�nimo 6 caracteres</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Confirmar Nueva Contrase�a</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-warning">
                  <i className="bi bi-check-circle me-2"></i>Cambiar Contrase�a
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle de Pedido */}
      <div
        className="modal fade"
        id="pedidoDetailModal"
        tabIndex="-1"
        aria-labelledby="pedidoDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title fw-bold" id="pedidoDetailModalLabel">
                Detalle del Pedido #{selectedPedido?.id}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedPedido && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Fecha:</strong>
                      <p>{new Date(selectedPedido.fechaPedido || selectedPedido.created_at).toLocaleDateString('es-CL')}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Estado:</strong>
                      <p>
                        <span className={`badge ${
                          selectedPedido.estadoPedido === 'entregado' ? 'bg-success' :
                          selectedPedido.estadoPedido === 'enviado' ? 'bg-info' :
                          'bg-warning'
                        }`}>
                          {selectedPedido.estadoPedido || 'Pendiente'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3">Productos:</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio Unit.</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPedido.detalles?.map((detalle, index) => (
                          <tr key={index}>
                            <td>{detalle._manga?.titulo || 'Producto'}</td>
                            <td>{detalle.cantidad}</td>
                            <td>${detalle.precioUnitario?.toLocaleString('es-CL')}</td>
                            <td>${(detalle.cantidad * detalle.precioUnitario)?.toLocaleString('es-CL')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="fw-bold">
                          <td colSpan="3" className="text-end">Total:</td>
                          <td className="text-success">
                            ${selectedPedido.total?.toLocaleString('es-CL')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nav-tabs .nav-link {
          color: #6c757d;
          border: none;
          border-bottom: 3px solid transparent;
        }
        .nav-tabs .nav-link:hover {
          border-color: #ffc107;
        }
        .nav-tabs .nav-link.active {
          color: #000;
          border-bottom: 3px solid #ffc107;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
