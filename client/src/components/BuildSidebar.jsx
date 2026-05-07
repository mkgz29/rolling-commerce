const BuildSidebar = ({ categories, activeCat, setActiveCat }) => {
  return (
    <aside className="ensambly-sidebar d-flex flex-column">
      <div className="p-4">
        <h5 className="fw-bold mb-1">COMPONENTES</h5>
        <p className="text-secondary small">SELECCIÓN DE HARDWARE</p>
      </div>
      
      <nav className="nav flex-column flex-grow-1">
        {categories.map(cat => (
          <button 
            key={cat.id}
            className={`nav-link-ensambly ${activeCat === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCat(cat.id)}
          >
            <i className={`bi ${cat.icon} me-3`}></i>
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Resumen inferior (Watts y Total) */}
      <div className="ensambly-summary p-4 mt-auto">
        <div className="mb-3">
          <span className="text-secondary small d-block">CALCULADORA DE WATTS</span>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold fs-4">0W</span>
            <span className="text-secondary">EST.</span>
            <i className="bi bi-lightning-charge text-warning ms-auto"></i>
          </div>
        </div>
        <div className="pt-3 border-top border-secondary">
          <span className="text-secondary small d-block">PRECIO TOTAL</span>
          <div className="d-flex align-items-center">
            <span className="fw-bold fs-3 text-gradient">$0</span>
            <button className="btn btn-primary-gradient ms-auto btn-sm p-2">
              <i className="bi bi-cart-plus fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BuildSidebar;
