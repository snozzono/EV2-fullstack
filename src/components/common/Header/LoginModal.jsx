import React, { useState } from 'react';
import authService from '../../../services/authService';
import { validateEmail } from '../../../utils/auth';

export default function LoginModal({ onSwitchToRegister, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await authService.login(formData.email.trim(), formData.password);

      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
      if (modal) modal.hide();

      // Call success callback
      if (onSuccess) onSuccess();

      // Redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="modalLogin"
      tabIndex="-1"
      aria-labelledby="modalLoginLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h1 className="fw-bold mb-0 fs-2">Iniciar sesión</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body p-5 pt-0">
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                  id="loginEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@ejemplo.com"
                />
                <label htmlFor="loginEmail">Correo electrónico</label>
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control rounded-3 ${errors.password ? 'is-invalid' : ''}`}
                  id="loginPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                />
                <label htmlFor="loginPassword">Contraseña</label>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Entrar'}
              </button>

              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn-outline-primary"
                type="button"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Registrarse
              </button>

              <small className="text-body-secondary">
                ¿No tienes cuenta? Regístrate para comenzar.
              </small>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
