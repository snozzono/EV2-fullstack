import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
      <div>

        {/* INICIO: Nosotros */}
        <div className="container px-4 py-5" id="nosotros">
          <h2 className="pb-2 border-bottom">Sobre Nosotros</h2>
          <p className="lead text-muted">Conoce más sobre nuestra pasión por el manga y nuestro compromiso contigo</p>
          <div className="row row-cols-1 row-cols-md-3 g-4 py-5">
            <div className="col d-flex align-items-start">
              <i className="bi bi-collection fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Calidad Garantizada</h3>
                <p>Todos nuestros mangas son originales y están en perfectas condiciones...</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">
              <i className="bi bi-truck fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Alcance Nacional</h3>
                <p>Llevamos el mejor manga a toda Chile...</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">
              <i className="bi bi-people fs-2 me-3"></i>
              <div>
                <h3 className="fw-bold">Comunidad</h3>
                <p>Más que una tienda, somos una comunidad de amantes del manga...</p>
              </div>
            </div>
            <div className="col d-flex align-items-start">
            <i className="bi bi-star fs-2 me-3"></i>
            <div><h3 className="fw-bold">Nuestra Pasión</h3>
                <p>Somos fanáticos del manga desde hace más de 10 años. Nuestra pasión nos impulsa a seleccionar
                    cuidadosamente cada título que ofrecemos, asegurándonos de que llegues a descubrir las mejores
                    historias del manga japonés.</p></div>
        </div>
        <div className="col d-flex align-items-start">
            <i className="bi bi-gift fs-2 me-3"></i>
            <div><h3 className="fw-bold">Envío Rápido</h3>
                <p>Entendemos tu emoción por recibir tus mangas favoritos. Por eso ofrecemos envíos rápidos y seguros a
                    todo Chile, con tracking completo para que siempre sepas dónde está tu pedido.</p></div>
        </div>
        <div className="col d-flex align-items-start">
            <i className="bi bi-headset fs-2 me-3"></i>
            <div><h3 className="fw-bold">Soporte 24/7</h3>
                <p>Nuestro equipo de soporte está siempre disponible para ayudarte con cualquier consulta. Ya sea sobre
                    productos, pedidos o recomendaciones, estamos aquí para ti.</p></div>
        </div>
            {/* Agregás aquí los demás bloques iguales */}
          </div>
        </div>
        {/* FIN: Nosotros */}
      </div>
    )
  }
}
