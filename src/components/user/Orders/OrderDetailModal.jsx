import React from 'react';

export default function OrderDetailModal({ order }) {
  if (!order) return null;

  return (
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
              Detalle del Pedido #{order.id}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Fecha:</strong>
                <p>{new Date(order.fechaPedido || order.created_at).toLocaleDateString('es-CL')}</p>
              </div>
              <div className="col-md-6">
                <strong>Estado:</strong>
                <p>
                  <span className={`badge ${
                    order.estadoPedido === 'entregado' ? 'bg-success' :
                    order.estadoPedido === 'enviado' ? 'bg-info' :
                    'bg-warning'
                  }`}>
                    {order.estadoPedido || 'Pendiente'}
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
                  {order.detalles?.map((detalle, index) => (
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
                      ${order.total?.toLocaleString('es-CL')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
