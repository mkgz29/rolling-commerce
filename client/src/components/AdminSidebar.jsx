const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tablero', icon: 'bi-speedometer2' },
    { id: 'products', label: 'Productos', icon: 'bi-box' },
    { id: 'sales', label: 'Ventas', icon: 'bi-receipt' },
  ];

  return (
    <aside className="admin-sidebar p-4 d-flex flex-column">
      <h2 className="fs-4 mb-5 text-gradient fw-bold">Panel admin</h2>
      <nav className="nav flex-column gap-2 flex-grow-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link border-0 text-start ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`bi ${item.icon} me-2`} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
      <button className="btn btn-outline-danger mt-auto">
        <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
        Cerrar sesion
      </button>
    </aside>
  );
};

export default AdminSidebar;
