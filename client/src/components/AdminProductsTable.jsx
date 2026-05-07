const AdminProductsTable = ({ products }) => {
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
              <tr key={p.id}>
                <td className="text-secondary">{p.id}</td>
                <td className="fw-semibold">{p.name}</td>
                <td><span className="badge bg-secondary-subtle text-light">{p.category}</span></td>
                <td className="text-info">{p.price}</td>
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
                  <button className="btn btn-sm btn-action me-2"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-sm btn-action text-danger"><i className="bi bi-trash"></i></button>
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
