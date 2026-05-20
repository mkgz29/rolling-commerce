const CATEGORY_LABELS = {
  processors: 'Procesadores',
  'graphics-cards': 'Placas de video',
  ram: 'Memoria RAM',
  storage: 'Almacenamiento',
  'power-supplies': 'Fuentes',
  cases: 'Gabinetes',
};

const AdminProductsTable = ({ products, loading = false, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="table-container admin-table-state">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="table-container admin-table-state">
        <i className="bi bi-box-seam" aria-hidden="true" />
        <h3>No hay productos cargados</h3>
        <p>Creá el primer producto para publicarlo en el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="table-container p-4">
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const productId = product._id || product.id;
              const stock = Number(product.stock || 0);
              const stockPercent = Math.min((stock / 30) * 100, 100);

              return (
                <tr key={productId} style={{ opacity: product.isActive === false ? 0.5 : 1 }}>
                  <td className="text-secondary">{product._id ? `${product._id.substring(0, 8)}...` : product.id}</td>
                  <td className="fw-semibold">
                    {product.name}
                    {product.isActive === false && (
                      <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>Inactivo</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-dark">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </span>
                  </td>
                  <td className="text-info">${Number(product.price).toLocaleString()}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${stockPercent}%` }}
                          aria-valuenow={stock}
                          aria-valuemin="0"
                          aria-valuemax="30"
                        />
                      </div>
                      <span className="small">{stock}</span>
                    </div>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-action text-success"
                      title={`Editar ${product.name}`}
                      aria-label={`Editar ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <i className="bi bi-pencil-square" />
                    </button>
                    <button
                      className="btn btn-sm btn-action text-danger"
                      title={product.isActive === false ? 'Producto inactivo' : `Desactivar ${product.name}`}
                      aria-label={product.isActive === false ? 'Producto inactivo' : `Desactivar ${product.name}`}
                      onClick={() => onDelete(product)}
                      disabled={product.isActive === false}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsTable;
