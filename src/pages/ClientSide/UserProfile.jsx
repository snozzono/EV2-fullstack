import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';
import userService from '../../services/userService';
import PersonalInfo from '../../components/user/Profile/PersonalInfo';
import OrderList from '../../components/user/Orders/OrderList';
import OrderDetailModal from '../../components/user/Orders/OrderDetailModal';
import WishlistGrid from '../../components/user/Wishlist/WishlistGrid';
import ChangePassword from '../../components/user/Profile/ChangePassword';
import './UserProfile.css';

export default function UserProfile() {
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
        loadPedidos();
      } else if (activeTab === 'favoritos') {
        loadFavoritos();
      }
    }
  }, [activeTab, user]);

  const checkAuth = () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
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

  const loadPedidos = async () => {
    try {
      const orders = await userService.getUserOrders(user.id);
      setPedidos(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadFavoritos = async () => {
    try {
      const favorites = await userService.getUserFavorites(user.id);
      setFavoritos(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      const updatedUser = await userService.updateProfile(user.id, formData);
      setUser(updatedUser);
      setEditMode(false);
      alert('Perfil actualizado exitosamente!');
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      alert('Función de cambio de contraseña por implementar en el backend');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error al cambiar contraseña: ' + error.message);
    }
  };

  const removeFavorito = async (favoritoId) => {
    if (!window.confirm('¿Eliminar de favoritos?')) return;

    try {
      await userService.removeFromFavorites(favoritoId);
      loadFavoritos();
      alert('Eliminado de favoritos');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const viewPedidoDetails = async (pedidoId) => {
    try {
      const detalles = await userService.getOrderDetails(pedidoId);
      const pedido = pedidos.find(p => p.id === pedidoId);
      setSelectedPedido({ ...pedido, detalles });

      const modal = new window.bootstrap.Modal(document.getElementById('pedidoDetailModal'));
      modal.show();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar detalles del pedido');
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

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-wrapper">
          <div className="spinner-border text-warning" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', icon: 'bi-person', label: 'Mi Información' },
    { id: 'pedidos', icon: 'bi-bag-check', label: 'Mis Pedidos', badge: pedidos.length },
    { id: 'favoritos', icon: 'bi-heart', label: 'Favoritos', badge: favoritos.length },
    { id: 'password', icon: 'bi-shield-lock', label: 'Seguridad' }
  ];

  return (
    <div className="user-profile-page">
      {/* Hero Header with Gradient */}
      <div className="profile-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="profile-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h1 className="profile-name">
                {user.nombre} {user.apellidos}
              </h1>
              <p className="profile-email">
                <i className="bi bi-envelope me-2"></i>
                {user.email}
              </p>
              {user.tipoUsuario && (
                <span className={`profile-badge ${user.tipoUsuario === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  <i className={`bi ${user.tipoUsuario === 'admin' ? 'bi-star-fill' : 'bi-person-check'} me-1`}></i>
                  {user.tipoUsuario === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs-wrapper">
        <div className="container">
          <ul className="profile-tabs">
            {tabs.map((tab) => (
              <li key={tab.id} className="profile-tab-item">
                <button
                  className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="profile-tab-badge">{tab.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container profile-content">
        <div className="tab-content-wrapper">
          {activeTab === 'info' && (
            <div className="fade-in">
              <PersonalInfo
                user={user}
                editMode={editMode}
                formData={formData}
                setFormData={setFormData}
                onEdit={() => setEditMode(true)}
                onSave={handleUpdateProfile}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="fade-in">
              <OrderList orders={pedidos} onViewDetails={viewPedidoDetails} />
            </div>
          )}

          {activeTab === 'favoritos' && (
            <div className="fade-in">
              <WishlistGrid favoritos={favoritos} onRemove={removeFavorito} />
            </div>
          )}

          {activeTab === 'password' && (
            <div className="fade-in">
              <ChangePassword
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onSubmit={handleChangePassword}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Pedido */}
      <OrderDetailModal order={selectedPedido} />
    </div>
  );
}
