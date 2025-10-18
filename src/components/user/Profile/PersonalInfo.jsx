import React from 'react';

export default function PersonalInfo({ user, editMode, formData, setFormData, onEdit, onSave, onCancel }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-person-badge me-2"></i>Información Personal
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
                <strong><i className="bi bi-telephone me-2"></i>Teléfono:</strong>
                <p className="text-muted">{user.telefono || 'No especificado'}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <strong><i className="bi bi-geo-alt me-2"></i>Dirección:</strong>
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
            <button className="btn btn-warning" onClick={onEdit}>
              <i className="bi bi-pencil me-2"></i>Editar Información
            </button>
          </>
        ) : (
          <form onSubmit={onSave}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-warning me-2">
              <i className="bi bi-check-circle me-2"></i>Guardar Cambios
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
