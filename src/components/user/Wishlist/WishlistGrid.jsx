import React from 'react';

export default function WishlistGrid({ favoritos, onRemove }) {
  if (favoritos.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-heart-fill me-2"></i>Mis Favoritos
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-heart" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <p className="mt-3 text-muted">No tienes favoritos guardados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-heart-fill me-2"></i>Mis Favoritos
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-4">
          {favoritos.map((favorito) => (
            <div key={favorito.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100">
                <div className="position-relative">
                  {favorito._manga?.imagen ? (
                    <img
                      src={favorito._manga.imagen}
                      className="card-img-top"
                      alt={favorito._manga.titulo}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary"
                      style={{ height: '250px' }}
                    >
                      <i className="bi bi-image" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.5)' }}></i>
                    </div>
                  )}
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => onRemove(favorito.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <div className="card-body">
                  <h6 className="card-title text-truncate">
                    {favorito._manga?.titulo || 'Manga'}
                  </h6>
                  <p className="card-text small text-muted">
                    {favorito._manga?.autor || 'Autor desconocido'}
                  </p>
                  <p className="fw-bold text-success">
                    ${favorito._manga?.precio?.toLocaleString('es-CL') || '0'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
