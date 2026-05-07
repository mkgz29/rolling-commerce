const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="admin-sidebar p-4 d-flex flex-column">
      <h2 className="fs-4 mb-5 text-gradient fw-bold">Admin Panel</h2>
      <nav className="nav flex-column gap-2 flex-grow-1">
        <button 
          className={`nav-link border-0 text-start ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </button>
        <button 
          className={`nav-link border-0 text-start ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <i className="bi bi-box-seam me-2"></i> Productos
        </button>
        <button 
          className={`nav-link border-0 text-start ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <i className="bi bi-cart-check me-2"></i> Órdenes
        </button>
        <button 
          className={`nav-link border-0 text-start ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="bi bi-people me-2"></i> Usuarios
        </button>
      </nav>
      <button className="btn btn-outline-danger mt-auto">
        <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
      </button>
    </aside>
  );
};

export default AdminSidebar;
