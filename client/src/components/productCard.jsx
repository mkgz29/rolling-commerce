import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage } from '../utils/productImage';

function ProductCard({ product }) {
  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);

  return (
    <article className="featured-product-card">
      <Link to={`/products/${productId}`} className="product-card-link" aria-label={`View ${product.name}`}>
        <div className="product-card-image">
          <img src={productImage} alt={product.name} />
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-copy">
          <p className="product-card-category">{product.category || 'Tech Core'}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-card-actions">
          <span>{formatPrice(product.price)}</span>
          <Link className="btn btn-primary btn-sm" to={`/products/${productId}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
