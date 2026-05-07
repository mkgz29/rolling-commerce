const BuildHeader = ({ categories, activeCat }) => {
  return (
    <header className="mb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-2">
        <h1 className="display-5 fw-bold mb-0 text-uppercase">
          {categories.find(c => c.id === activeCat)?.label}
        </h1>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-secondary btn-sm text-nowrap">FILTRAR POR MARCA</button>
          <button className="btn btn-outline-secondary btn-sm text-nowrap">ORDENAR POR PRECIO</button>
        </div>
      </div>
      <p className="text-secondary mb-0">64 resultados encontrados para tu configuración actual.</p>
    </header>
  );
};

export default BuildHeader;
