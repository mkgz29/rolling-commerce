import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { PRODUCT_IMAGE_FALLBACK, getProductImage } from '../utils/productImage';

const getProductName = (product) => product?.name || product?.title || 'Producto sin nombre';

const SummaryProductImage = ({ product }) => {
  const productImage = getProductImage(product);
  const [failedImage, setFailedImage] = useState('');
  const imageSrc = failedImage === productImage ? PRODUCT_IMAGE_FALLBACK : productImage;

  return (
    <img
      src={imageSrc}
      alt={getProductName(product)}
      onError={() => {
        if (imageSrc !== PRODUCT_IMAGE_FALLBACK) {
          setFailedImage(productImage);
        }
      }}
    />
  );
};

const BuildSummary = ({
  categories,
  selectedComponents,
  totalPrice,
  missingCount,
  onEditCategory,
  onAddBuildToCart,
  onContinueCheckout,
  pending = false,
  feedback = '',
}) => {
  const isComplete = missingCount === 0;

  return (
    <section className="build-final-summary">
      <div className="build-final-hero">
        <span className="build-step-label">Resumen final</span>
        <h1>Tu PC está lista</h1>
        <p>Revisá los componentes seleccionados antes de continuar. Puedes volver a editar cualquier categoría.</p>
      </div>

      {!isComplete && (
        <div className="build-summary-alert">
          Faltan {missingCount} componente{missingCount === 1 ? '' : 's'} para completar el armado.
        </div>
      )}

      <div className="build-summary-grid">
        <div className="build-summary-list">
          {categories.map((category) => {
            const product = selectedComponents[category.categoryKey];

            return (
              <article className={`build-summary-item ${product ? '' : 'missing'}`} key={category.categoryKey}>
                <div className="build-summary-image">{product ? <SummaryProductImage product={product} /> : <span />}</div>
                <div className="build-summary-copy">
                  <span>{category.label}</span>
                  <h3>{product ? getProductName(product) : 'Pendiente de selección'}</h3>
                  <p>{product ? formatPrice(product.price) : 'Elegí un producto para completar este paso.'}</p>
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onEditCategory(category.categoryKey)}>
                  Editar
                </button>
              </article>
            );
          })}
        </div>

        <aside className="build-summary-checkout">
          <span className="build-step-label">Total del ensamble</span>
          <strong>{formatPrice(totalPrice)}</strong>
          <p>Compatibilidad técnica avanzada preparada para futuras validaciones. El carrito mantiene cada producto como item individual.</p>
          {feedback && <div className="build-summary-feedback">{feedback}</div>}
          <button
            type="button"
            className="btn btn-primary-gradient w-100"
            onClick={onAddBuildToCart}
            disabled={!isComplete || pending}
          >
            {pending ? 'Agregando...' : 'Agregar al carrito'}
          </button>
          <button
            type="button"
            className="btn btn-outline-light w-100 mt-2"
            onClick={onContinueCheckout}
            disabled={!isComplete || pending}
          >
            Continuar al checkout
          </button>
          <small>{isComplete ? 'Impuestos y envío se calculan en checkout.' : 'Completa todas las categorías para continuar.'}</small>
        </aside>
      </div>
    </section>
  );
};

export default BuildSummary;
