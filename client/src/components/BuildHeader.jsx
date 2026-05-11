const BuildHeader = ({
  categories,
  activeCategory,
  resultCount = 0,
  brands = [],
  selectedBrand = '',
  onBrandChange,
  sortOrder = '',
  onSortChange,
  title,
  subtitle,
  stepLabel,
}) => {
  const fallbackTitle = categories.find((category) => category.categoryKey === activeCategory)?.label;

  return (
    <header className="mb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-2">
        <div>
          {stepLabel && <span className="build-step-label">{stepLabel}</span>}
          <h1 className="display-5 fw-bold mb-0 text-uppercase">
            {title || fallbackTitle}
          </h1>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="btn btn-outline-secondary btn-sm text-nowrap build-filter-control"
            value={selectedBrand}
            onChange={(event) => onBrandChange(event.target.value)}
            aria-label="Filtrar por marca"
          >
            <option value="">FILTRAR POR MARCA</option>
            {brands.map((brand) => (
              <option value={brand} key={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select
            className="btn btn-outline-secondary btn-sm text-nowrap build-filter-control"
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Ordenar por precio"
          >
            <option value="">ORDENAR POR PRECIO</option>
            <option value="asc">MENOR A MAYOR</option>
            <option value="desc">MAYOR A MENOR</option>
          </select>
        </div>
      </div>
      <p className="text-secondary mb-0">
        {subtitle || `${resultCount} resultados encontrados para tu configuración actual.`}
      </p>
    </header>
  );
};

export default BuildHeader;
