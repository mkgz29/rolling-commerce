const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="admin-sidebar p-4 d-flex flex-column">
      <h2 className="fs-4 mb-5 text-gradient fw-bold">Panel admin</h2>
      <nav className="nav flex-column gap-2 flex-grow-1">
        <button
          className={`nav-link border-0 text-start ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="bi bi-speedometer2 me-2"></i> Tablero
        </button>
      </nav>
      <button className="btn btn-outline-danger mt-auto">
        <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
      </button>
    </aside>
  );
};

export default AdminSidebar;
