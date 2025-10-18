import React, { Component } from "react";
import { Link } from "react-router-dom";

export class HeroPage extends Component {
  render() {
    return (
      <div>
        {/* INICIO: Hero */}
        <div className="px-4 py-5 my-5 text-center">
          <i
            className="bi bi-book-fill d-block mx-auto mb-4"
            style={{ fontSize: "10rem" }}
          ></i>
          <h1 className="display-5 fw-bold text-body-emphasis">
            Bienvenido a Manga Store
          </h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
              Tu tienda online de manga favorita. Descubre los mejores títulos y
              las últimas novedades del mundo del manga japonés.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Link
                to="/catalogo"
                className="btn btn-dark btn-lg px-4 gap-6"
              >
                <i className="bi bi-bag-heart"></i> Ver catálogo
              </Link>
            </div>
          </div>
        </div>
        {/* FIN: Hero */}
      </div>
    );
  }
}

export default HeroPage;
