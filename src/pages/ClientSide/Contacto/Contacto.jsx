import React, { Component } from "react";

export default class Contacto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      email: "",
      comentario: "",
      isSubmitting: false,
      submitStatus: null,
      errorMessage: ""
    };
  }

  handleInputChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    this.setState({ isSubmitting: true, submitStatus: null, errorMessage: "" });

    const { nombre, email, comentario } = this.state;

    // Preparar datos según el esquema de la tabla
    const contactData = {
      nombre: nombre,
      email: email,
      comentario: comentario,
      leido: false,
      respondido: false
      // created_at y fechaEnvio se generan automáticamente en el backend
    };

    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou/mensajecontacto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setState({
          submitStatus: "success",
          nombre: "",
          email: "",
          comentario: "",
          isSubmitting: false
        });
        console.log("Mensaje enviado exitosamente:", data);
      } else {
        const errorData = await response.json();
        this.setState({
          submitStatus: "error",
          errorMessage: errorData.message || "Error al enviar el mensaje",
          isSubmitting: false
        });
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({
        submitStatus: "error",
        errorMessage: "Error de conexión. Por favor, intenta nuevamente.",
        isSubmitting: false
      });
    }
  };

  render() {
    const { nombre, email, comentario, isSubmitting, submitStatus, errorMessage } = this.state;

    return (
      <>
        {/* Contacto */}
        <div className="container my-5" id="contacto">
          <h2 className="pb-2 border-bottom">Contáctanos</h2>
          
          {submitStatus === "success" && (
            <div className="alert alert-success mt-3" role="alert">
              ¡Mensaje enviado exitosamente! Te responderemos pronto.
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={this.handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={this.handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comentario" className="form-label">
                Tu pregunta
              </label>
              <textarea
                className="form-control"
                id="comentario"
                rows="4"
                value={comentario}
                onChange={this.handleInputChange}
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-warning"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </>
    );
  }
}