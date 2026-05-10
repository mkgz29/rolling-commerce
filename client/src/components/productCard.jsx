import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage } from '../utils/productImage';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

  const handleAddToCart = async () => {
    if (!productId) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return;
    }

    await addItem(productId);
  };

  return (
    <article className="featured-product-card">
      <Link to={`/products/${productId}`} className="product-card-link" aria-label={`View ${product?.name || 'product'}`}>
        <div className="product-card-image">
          <img src={productImage} alt={product?.name || 'Product'} />
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-copy">
          <p className="product-card-category">{product?.category || 'Tech Core'}</p>
          <h3>{product?.name || 'Untitled product'}</h3>
          <p>{product?.description || 'No description available yet.'}</p>
        </div>
        <div className="product-card-actions">
          <span>{formatPrice(product.price)}</span>
          <Link className="btn btn-primary btn-sm" to={`/products/${productId}`}>
            Details
          </Link>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={handleAddToCart} disabled={!productId}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
