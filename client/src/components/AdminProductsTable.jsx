const AdminProductsTable = ({ products, onEdit, onDelete }) => {
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
            {products.map((p) => (
              <tr key={p._id || p.id} style={{ opacity: p.isActive === false ? 0.5 : 1 }}>
                <td className="text-secondary">{p._id ? p._id.substring(0, 8) + '...' : p.id}</td>
                <td className="fw-semibold">
                  {p.name}
                  {p.isActive === false && (
                    <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>Inactivo</span>
                  )}
                </td>
                <td><span className="badge bg-secondary-subtle text-dark">{p.category}</span></td>
                <td className="text-info">${Number(p.price).toLocaleString()}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        role="progressbar" 
                        style={{ width: `${(p.stock/30)*100}%` }}
                      ></div>
                    </div>
                    <span className="small">{p.stock}</span>
                  </div>
                </td>
                <td className="text-end">
                  <button 
                    className="btn btn-sm btn-action text-success" 
                    title="Editar"
                    onClick={() => onEdit(p)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-action text-danger" 
                    title="Eliminar"
                    onClick={() => onDelete(p)}
                    disabled={p.isActive === false}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsTable;
