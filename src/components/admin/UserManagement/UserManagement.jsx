import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoUsuario: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();

      // Mapear los datos de Xano al formato esperado
      const mappedUsers = data.map(user => ({
        id: user.id,
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        tipoUsuario: user.tipoUsuario || 'user',
        fechaRegistro: user.created_at || user.fechaRegistro || new Date().toISOString()
      }));

      setUsers(mappedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios: ' + error.message);
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      nombre: user.nombre || '',
      apellidos: user.apellidos || '',
      email: user.email || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      tipoUsuario: user.tipoUsuario || 'user'
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamar a la API para actualizar usuario
      const updatedUser = await userService.updateUser(editingUser.id, editFormData);

      // Actualizar el estado local
      setUsers(users.map(u =>
        u.id === editingUser.id
          ? { ...u, ...editFormData }
          : u
      ));

      alert('Usuario actualizado exitosamente');
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario: ' + error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // Llamar a la API para eliminar usuario
      await userService.deleteUser(userToDelete.id);

      // Actualizar el estado local
      setUsers(users.filter(u => u.id !== userToDelete.id));

      alert('Usuario eliminado exitosamente');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.apellidos || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.tipoUsuario === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando usuarios...</span>
        </div>
        <p className="mt-3 text-muted">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h3>
          <i className="bi bi-people me-2"></i>
          Gestión de Usuarios
        </h3>
        <p className="text-muted">
          Administra todos los usuarios del sistema
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="user-management-filters">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, apellidos o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="user">Usuarios</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-danger w-100"
              onClick={fetchUsers}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="user-management-table">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    <i className="bi bi-inbox me-2"></i>
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-name-cell">
                        <i className={`bi ${user.tipoUsuario === 'admin' ? 'bi-shield-fill-check' : 'bi-person-circle'} me-2`}></i>
                        {user.nombre} {user.apellidos}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.telefono || '-'}</td>
                    <td>
                      <span className={`badge ${user.tipoUsuario === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.tipoUsuario === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td>{new Date(user.fechaRegistro).toLocaleDateString('es-CL')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(user)}
                          title="Editar usuario"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(user)}
                          title="Eliminar usuario"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="user-count">
          <p className="text-muted">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </p>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>
                <i className="bi bi-pencil-square me-2"></i>
                Editar Usuario
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={editFormData.nombre}
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
                      value={editFormData.apellidos}
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
                      value={editFormData.email}
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
                      value={editFormData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={editFormData.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tipo de Usuario</label>
                    <select
                      className="form-select"
                      name="tipoUsuario"
                      value={editFormData.tipoUsuario}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger">
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>
                <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.nombre} {userToDelete.apellidos}</strong>?
              </p>
              <p className="text-danger">
                <i className="bi bi-info-circle me-1"></i>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                <i className="bi bi-trash me-2"></i>
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
