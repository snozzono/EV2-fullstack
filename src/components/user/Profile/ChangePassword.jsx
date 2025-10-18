import React from 'react';

export default function ChangePassword({ passwordData, setPasswordData, onSubmit }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-shield-lock me-2"></i>Cambiar Contraseña
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Contraseña Actual</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Nueva Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength="6"
            />
            <small className="text-muted">Mínimo 6 caracteres</small>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning">
            <i className="bi bi-check-circle me-2"></i>Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
