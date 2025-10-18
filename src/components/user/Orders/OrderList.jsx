import React from 'react';

export default function OrderList({ orders, onViewDetails }) {
  if (orders.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-bag-check me-2"></i>Historial de Pedidos
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <p className="mt-3 text-muted">No tienes pedidos aún</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-bag-check me-2"></i>Historial de Pedidos
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.ordenCompra || pedido.id}</td>
                  <td>{new Date(pedido.fechaPedido || pedido.created_at).toLocaleDateString('es-CL')}</td>
                  <td>
                    <span className={`badge ${
                      pedido.estadoPedido === 'entregado' ? 'bg-success' :
                      pedido.estadoPedido === 'enviado' ? 'bg-info' :
                      pedido.estadoPedido === 'pendiente' ? 'bg-warning' :
                      'bg-secondary'
                    }`}>
                      {pedido.estadoPedido || 'Pendiente'}
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    ${pedido.total?.toLocaleString('es-CL') || '0'}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => onViewDetails(pedido.id)}
                    >
                      <i className="bi bi-eye me-1"></i>Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
