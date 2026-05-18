const CATEGORY_LABELS = {
  processors: 'Procesadores',
  'graphics-cards': 'Placas de video',
  ram: 'Memoria RAM',
  storage: 'Almacenamiento',
  'power-supplies': 'Fuentes',
  cases: 'Gabinetes',
};

const AdminProductsTable = ({
  products,
  loading = false,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
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
                    <div className="dropdown">
  <button
    className="btn btn-sm btn-action text-light"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <i className="bi bi-three-dots-vertical" />
  </button>

  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
    <li>
      <button
        type="button"
        className="dropdown-item"
        onClick={() => onEdit(product)}
      >
        <i className="bi bi-pencil-square me-2" />
        Editar
      </button>
    </li>

    <li>
      <button
        type="button"
        className="dropdown-item"
        onClick={() => onToggleActive(product)}
      >
        <i
          className={`bi me-2 ${
            product.isActive === false
              ? 'bi-eye'
              : 'bi-eye-slash'
          }`}
        />

        {product.isActive === false
          ? 'Activar producto'
          : 'Desactivar producto'}
      </button>
    </li>

    <li>
      <hr className="dropdown-divider" />
    </li>

    <li>
      <button
        type="button"
        className="dropdown-item text-danger"
        onClick={() => onDelete(product)}
      >
        <i className="bi bi-trash me-2" />
        Eliminar permanentemente
      </button>
    </li>
  </ul>
</div>
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
