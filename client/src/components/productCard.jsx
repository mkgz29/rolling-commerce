import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage, getProductImageFallback } from '../utils/productImage';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

function ProductCard({ product, showActions = true }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);
  const productDetailPath = productId ? `/products/${productId}` : '/products';

  const handleAddToCart = async () => {
    if (!productId) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: productDetailPath } } });
      return;
    }

    await addItem(productId);
  };

  const cardContent = (
    <article className="featured-product-card">
      <div className="product-card-link">
        <div className="product-card-image">
          <img
            src={productImage}
            alt={product?.name || 'Producto'}
            onError={(event) => {
              const fallbackImage = getProductImageFallback(product);
              if (event.currentTarget.src !== fallbackImage) {
                event.currentTarget.src = fallbackImage;
              }
            }}
          />
        </div>
      </div>
      <div className="product-card-body">
        <div className="product-card-copy">
          <p className="product-card-category">{product?.category || 'Tech Core'}</p>
          <h3>{product?.name || 'Producto sin nombre'}</h3>
          <p>{product?.description || 'Sin descripción disponible.'}</p>
        </div>
        <div className={`product-card-actions ${showActions ? '' : 'product-card-actions-simple'}`}>
          <span>{formatPrice(product.price)}</span>
          {showActions ? (
            <>
              <Link className="btn btn-primary btn-sm" to={productDetailPath}>
                Detalle
              </Link>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={handleAddToCart} disabled={!productId}>
                Agregar
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!showActions) {
    return (
      <Link to={productDetailPath} className="product-card-clickable" aria-label={`Ver ${product?.name || 'producto'}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ProductCard;
