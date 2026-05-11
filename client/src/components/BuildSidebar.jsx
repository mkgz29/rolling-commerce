import { CheckCircle, X } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage, getProductImageFallback } from '../utils/productImage';

const getProductName = (product) => product?.name || product?.title || 'Producto sin nombre';

const SelectedBuildItem = ({ category, product, onRemoveComponent }) => (
  <div className="selected-build-item">
    <img
      src={getProductImage(product)}
      alt={getProductName(product)}
      className="selected-build-item-image"
      onError={(event) => {
        const fallbackImage = getProductImageFallback(product);
        if (event.currentTarget.src !== fallbackImage) {
          event.currentTarget.src = fallbackImage;
        }
      }}
    />
    <div className="selected-build-item-copy">
      <span className="selected-build-item-category">{category.label}</span>
      <strong>{getProductName(product)}</strong>
      <span>{formatPrice(product?.price)}</span>
    </div>
    <button
      className="selected-build-item-remove"
      type="button"
      onClick={() => onRemoveComponent(category.categoryKey)}
      aria-label={`Quitar ${category.label}`}
    >
      <X size={15} strokeWidth={2.2} aria-hidden="true" />
    </button>
  </div>
);

const BuildSidebar = ({
  categories,
  activeCategory,
  onSelectCategory,
  selectedComponents = {},
  onRemoveComponent,
  onClearBuild,
}) => {
  const selectedEntries = categories
    .map((category) => ({ category, product: selectedComponents[category.categoryKey] }))
    .filter((entry) => Boolean(entry.product));
  const selectedCount = selectedEntries.length;
  const totalPrice = selectedEntries.reduce((total, entry) => total + Number(entry.product?.price || 0), 0);

  return (
    <aside className="ensambly-sidebar d-flex flex-column">
      <div className="p-4">
        <h5 className="fw-bold mb-1">COMPONENTES</h5>
        <p className="text-secondary small">SELECCIÓN DE HARDWARE</p>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.categoryKey;
          const isCompleted = Boolean(selectedComponents[category.categoryKey]);

          return (
            <button
              key={category.categoryKey}
              className={`nav-link-ensambly ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => onSelectCategory(category.categoryKey)}
              type="button"
              aria-pressed={isActive}
            >
              <Icon className="nav-link-ensambly-icon" size={21} strokeWidth={2.1} aria-hidden="true" />
              <span>{category.label}</span>
              {isCompleted && (
                <CheckCircle className="nav-link-ensambly-check" size={17} strokeWidth={2.1} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="ensambly-summary p-4 mt-auto">
        <div className="build-summary-header">
          <div>
            <span className="text-secondary small d-block">ENSAMBLE ACTUAL</span>
            <strong>
              {selectedCount} / {categories.length} componentes
            </strong>
          </div>
          <span className="build-summary-watts">0W EST.</span>
        </div>

        <div className="selected-build-list">
          {selectedEntries.length > 0 ? (
            selectedEntries.map(({ category, product }) => (
              <SelectedBuildItem
                key={category.categoryKey}
                category={category}
                product={product}
                onRemoveComponent={onRemoveComponent}
              />
            ))
          ) : (
            <p className="build-summary-empty">Seleccioná productos para empezar tu configuración.</p>
          )}
        </div>

        <div className="build-summary-total">
          <span className="text-secondary small d-block">PRECIO TOTAL</span>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold fs-3 text-gradient">{formatPrice(totalPrice)}</span>
            <button
              className="btn btn-outline-secondary btn-sm ms-auto"
              type="button"
              onClick={onClearBuild}
              disabled={selectedCount === 0}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BuildSidebar;
