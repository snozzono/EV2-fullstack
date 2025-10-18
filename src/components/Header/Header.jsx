import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      showRegisterModal: false,
      loginEmail: "",
      loginPassword: "",
      registerData: {
        run: "",
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        confirmPassword: "",
        fechaNacimiento: "",
        tipoUsuario: "cliente",
        direccion: "",
        telefono: ""
      },
      errors: {},
      loading: false,
      errorMessage: "",
      isLoggedIn: false,
      currentUser: null
    };
  }

  async componentDidMount() {
    // Verificar si hay usuario logueado
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);

        // Si el usuario solo tiene authToken pero no tiene tipoUsuario, obtener datos completos
        if (userData.authToken && !userData.tipoUsuario) {
          try {
            const userResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS/auth/me', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${userData.authToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (userResponse.ok) {
              const completeUserData = await userResponse.json();
              const userWithToken = { ...completeUserData, authToken: userData.authToken };
              localStorage.setItem('user', JSON.stringify(userWithToken));
              this.setState({
                isLoggedIn: true,
                currentUser: userWithToken
              });
            } else {
              // Token inválido, limpiar
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            localStorage.removeItem('user');
          }
        } else if (userData.tipoUsuario) {
          // Usuario ya tiene todos los datos
          this.setState({
            isLoggedIn: true,
            currentUser: userData
          });
        } else {
          // Usuario incompleto, limpiar
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
      }
    }
  }

  handleLogout = () => {
    localStorage.removeItem('user');
    this.setState({ 
      isLoggedIn: false, 
      currentUser: null 
    });
    window.location.href = '/';
  };

  // Validación de email
  validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validación de RUN chileno
  validateRUN = (run) => {
    const cleanRUN = run.replace(/\./g, '').replace(/-/g, '');
    if (cleanRUN.length < 8) return false;
    
    const body = cleanRUN.slice(0, -1);
    const dv = cleanRUN.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplo = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(body.charAt(i));
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
  };

  // Validación de contraseña
  validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  // Validación de teléfono chileno
  validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    return /^(\+?56)?9\d{8}$/.test(cleanPhone);
  };

  // Manejo de cambios en login
  handleLoginChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Manejo de cambios en registro
  handleRegisterChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      registerData: {
        ...prevState.registerData,
        [name]: value
      }
    }));
  };

  // Validar formulario de login
  validateLoginForm = () => {
    const { loginEmail, loginPassword } = this.state;
    const errors = {};

    if (!loginEmail) {
      errors.loginEmail = "El correo es requerido";
    } else if (!this.validateEmail(loginEmail)) {
      errors.loginEmail = "Correo electrónico inválido";
    }

    if (!loginPassword) {
      errors.loginPassword = "La contraseña es requerida";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  // Validar formulario de registro
  validateRegisterForm = () => {
    const { registerData } = this.state;
    const errors = {};

    if (!registerData.run) {
      errors.run = "El RUN es requerido";
    } else if (!this.validateRUN(registerData.run)) {
      errors.run = "RUN inválido";
    }

    if (!registerData.nombre || registerData.nombre.length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!registerData.apellidos || registerData.apellidos.length < 2) {
      errors.apellidos = "Los apellidos deben tener al menos 2 caracteres";
    }

    if (!registerData.email) {
      errors.email = "El correo es requerido";
    } else if (!this.validateEmail(registerData.email)) {
      errors.email = "Correo electrónico inválido";
    }

    if (!registerData.password) {
      errors.password = "La contraseña es requerida";
    } else if (!this.validatePassword(registerData.password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!registerData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else {
      const edad = new Date().getFullYear() - new Date(registerData.fechaNacimiento).getFullYear();
      if (edad < 18) {
        errors.fechaNacimiento = "Debes ser mayor de 18 años";
      }
    }

    if (!registerData.direccion) {
      errors.direccion = "La dirección es requerida";
    }

    if (!registerData.telefono) {
      errors.telefono = "El teléfono es requerido";
    } else if (!this.validatePhone(registerData.telefono)) {
      errors.telefono = "Teléfono inválido (formato: +56912345678 o 912345678)";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  // Manejo de login
  handleLogin = async (e) => {
    e.preventDefault();
    
    if (!this.validateLoginForm()) {
      return;
    }

    this.setState({ loading: true, errorMessage: "" });

    try {
      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.loginEmail.trim(),
          password: this.state.loginPassword
        })
      });

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Credenciales incorrectas');
        } catch (parseError) {
          throw new Error('Usuario o contraseña incorrectos');
        }
      }

      const loginResponse = JSON.parse(responseText);
      console.log('Respuesta de login:', loginResponse);

      // Obtener datos completos del usuario usando /auth/me
      if (loginResponse.authToken) {
        try {
          const userResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:8a3HDoeS/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResponse.authToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('Datos completos del usuario desde /auth/me:', userData);

            // Guardar datos completos del usuario con el token
            const userWithToken = { ...userData, authToken: loginResponse.authToken };
            localStorage.setItem('user', JSON.stringify(userWithToken));
            this.setState({
              isLoggedIn: true,
              currentUser: userWithToken
            });
          } else {
            throw new Error('No se pudieron obtener los datos del usuario');
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          throw new Error('Error al obtener datos del usuario. Por favor intenta nuevamente.');
        }
      } else {
        // La respuesta ya incluye los datos del usuario
        localStorage.setItem('user', JSON.stringify(loginResponse));
        this.setState({
          isLoggedIn: true,
          currentUser: loginResponse
        });
      }
      
      alert('¡Bienvenido de nuevo!');
      
      // Cerrar modal
      const loginModal = window.bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
      if (loginModal) loginModal.hide();
      
      // Redirigir a home en lugar de dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('Error en login:', error);
      this.setState({ 
        errorMessage: error.message || "Error al iniciar sesión. Por favor intenta de nuevo.",
        loading: false 
      });
    }
  };

  // Manejo de registro
  handleRegister = async (e) => {
    e.preventDefault();
    
    if (!this.validateRegisterForm()) {
      return;
    }

    this.setState({ loading: true, errorMessage: "" });

    try {
      const { confirmPassword, ...dataToSend } = this.state.registerData;
      
      // Preparar los datos según el formato de la API
      const userData = {
        run: dataToSend.run.trim(),
        nombre: dataToSend.nombre.trim(),
        apellidos: dataToSend.apellidos.trim(),
        email: dataToSend.email.trim(),
        password: dataToSend.password,
        fechaNacimiento: dataToSend.fechaNacimiento,
        tipoUsuario: "cliente",
        direccion: dataToSend.direccion.trim(),
        telefono: dataToSend.telefono.trim(),
        fechaRegistro: Date.now(),
        activo: true
      };

      console.log('Datos a enviar:', userData);

      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Error al registrar usuario');
        } catch (parseError) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }

      const nuevoUsuario = JSON.parse(responseText);
      
      // Guardar usuario y actualizar estado
      localStorage.setItem('user', JSON.stringify(nuevoUsuario));
      this.setState({ 
        isLoggedIn: true, 
        currentUser: nuevoUsuario 
      });
      
      alert('¡Registro exitoso! Bienvenido a Manga Store');
      
      // Cerrar modal
      const registerModal = window.bootstrap.Modal.getInstance(document.getElementById('modalRegister'));
      if (registerModal) registerModal.hide();
      
      // Redirigir a home en lugar de dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('Error completo:', error);
      this.setState({ 
        errorMessage: error.message || "Error al registrar. Por favor intenta de nuevo.",
        loading: false 
      });
    }
  };

  // Cambiar entre modales
  switchToRegister = () => {
    const loginModal = window.bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
    if (loginModal) loginModal.hide();
    
    setTimeout(() => {
      const registerModal = new window.bootstrap.Modal(document.getElementById('modalRegister'));
      registerModal.show();
    }, 300);
  };

  switchToLogin = () => {
    const registerModal = window.bootstrap.Modal.getInstance(document.getElementById('modalRegister'));
    if (registerModal) registerModal.hide();
    
    setTimeout(() => {
      const loginModal = new window.bootstrap.Modal(document.getElementById('modalLogin'));
      loginModal.show();
    }, 300);
  };

  render() {
    const { loginEmail, loginPassword, registerData, errors, loading, errorMessage, isLoggedIn, currentUser } = this.state;

    return (
      <div>
        {/* INICIO: NavBar */}
        <header className="p-3 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <Link
                to="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <i className="bi bi-book-fill fs-3 me-2"> Manga Store</i>
              </Link>

              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <Link to="/about" className="nav-link px-2 text-white">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/catalogo" className="nav-link px-2 text-white">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="nav-link px-2 text-white">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="nav-link px-2 text-white">
                    Contáctanos
                  </Link>
                </li>
              </ul>

              <div className="text-end col-12 col-lg-auto">
                {isLoggedIn ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-white me-2">
                      <i className="bi bi-person-circle me-1"></i>
                      {currentUser?.nombre || 'Usuario'}
                    </span>
                    <Link
                      to={currentUser?.tipoUsuario === "admin" ? "/admin-perfil" : "/perfil"}
                      className="btn btn-warning"
                    >
                      <i className="bi bi-person-gear me-1"></i>
                      Perfil
                    </Link>
                    <button
                      onClick={this.handleLogout}
                      className="btn btn-outline-light"
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Salir
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalLogin"
                    className="btn btn-warning w-100 w-lg-auto"
                  >
                    Ingresa
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal Login */}
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
                <h1 className="fw-bold mb-0 fs-2" id="modalLoginLabel">
                  Iniciar sesión
                </h1>
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
                <form onSubmit={this.handleLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control rounded-3 ${errors.loginEmail ? 'is-invalid' : ''}`}
                      id="loginEmail"
                      name="loginEmail"
                      value={loginEmail}
                      onChange={this.handleLoginChange}
                      placeholder="nombre@ejemplo.com"
                    />
                    <label htmlFor="loginEmail">Correo electrónico</label>
                    {errors.loginEmail && (
                      <div className="invalid-feedback">{errors.loginEmail}</div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control rounded-3 ${errors.loginPassword ? 'is-invalid' : ''}`}
                      id="loginPassword"
                      name="loginPassword"
                      value={loginPassword}
                      onChange={this.handleLoginChange}
                      placeholder="Contraseña"
                    />
                    <label htmlFor="loginPassword">Contraseña</label>
                    {errors.loginPassword && (
                      <div className="invalid-feedback">{errors.loginPassword}</div>
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
                    onClick={this.switchToRegister}
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

        {/* Modal Registro */}
        <div
          className="modal fade"
          id="modalRegister"
          tabIndex="-1"
          aria-labelledby="modalRegisterLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header p-5 pb-4 border-bottom-0">
                <h1 className="fw-bold mb-0 fs-2" id="modalRegisterLabel">
                  Crear cuenta
                </h1>
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
                <form onSubmit={this.handleRegister}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className={`form-control rounded-3 ${errors.run ? 'is-invalid' : ''}`}
                          id="run"
                          name="run"
                          value={registerData.run}
                          onChange={this.handleRegisterChange}
                          placeholder="12345678-9"
                        />
                        <label htmlFor="run">RUN</label>
                        {errors.run && (
                          <div className="invalid-feedback">{errors.run}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className={`form-control rounded-3 ${errors.nombre ? 'is-invalid' : ''}`}
                          id="nombre"
                          name="nombre"
                          value={registerData.nombre}
                          onChange={this.handleRegisterChange}
                          placeholder="Juan"
                        />
                        <label htmlFor="nombre">Nombre</label>
                        {errors.nombre && (
                          <div className="invalid-feedback">{errors.nombre}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.apellidos ? 'is-invalid' : ''}`}
                      id="apellidos"
                      name="apellidos"
                      value={registerData.apellidos}
                      onChange={this.handleRegisterChange}
                      placeholder="Pérez González"
                    />
                    <label htmlFor="apellidos">Apellidos</label>
                    {errors.apellidos && (
                      <div className="invalid-feedback">{errors.apellidos}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={this.handleRegisterChange}
                      placeholder="nombre@ejemplo.com"
                    />
                    <label htmlFor="email">Correo electrónico</label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className={`form-control rounded-3 ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={registerData.password}
                          onChange={this.handleRegisterChange}
                          placeholder="Contraseña"
                        />
                        <label htmlFor="password">Contraseña</label>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className={`form-control rounded-3 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={this.handleRegisterChange}
                          placeholder="Confirmar contraseña"
                        />
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className={`form-control rounded-3 ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={registerData.fechaNacimiento}
                      onChange={this.handleRegisterChange}
                    />
                    <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                    {errors.fechaNacimiento && (
                      <div className="invalid-feedback">{errors.fechaNacimiento}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.direccion ? 'is-invalid' : ''}`}
                      id="direccion"
                      name="direccion"
                      value={registerData.direccion}
                      onChange={this.handleRegisterChange}
                      placeholder="Av. Principal 123"
                    />
                    <label htmlFor="direccion">Dirección</label>
                    {errors.direccion && (
                      <div className="invalid-feedback">{errors.direccion}</div>
                    )}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="tel"
                      className={`form-control rounded-3 ${errors.telefono ? 'is-invalid' : ''}`}
                      id="telefono"
                      name="telefono"
                      value={registerData.telefono}
                      onChange={this.handleRegisterChange}
                      placeholder="+56912345678"
                    />
                    <label htmlFor="telefono">Teléfono</label>
                    {errors.telefono && (
                      <div className="invalid-feedback">{errors.telefono}</div>
                    )}
                  </div>

                  <button
                    className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Crear cuenta'}
                  </button>
                  <button
                    className="w-100 mb-2 btn btn-lg rounded-3 btn-outline-secondary"
                    type="button"
                    onClick={this.switchToLogin}
                    disabled={loading}
                  >
                    Ya tengo cuenta
                  </button>
                  <small className="text-body-secondary">
                    Al registrarte, aceptas los términos de uso.
                  </small>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;