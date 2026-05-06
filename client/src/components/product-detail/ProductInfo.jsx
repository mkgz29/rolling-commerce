import ProductActions from './ProductActions';
import ProductPrice from './ProductPrice';
import ProductSpecs from './ProductSpecs';
import './ProductInfo.css';

export default function ProductInfo({ product, onAddToCart, onBuyNow, feedback, isAuthenticated }) {
  const stockAvailable = product.stock > 0;

  return (
    <section className="product-info-panel">
      <div className="product-heading">
        <div className="product-meta-row">
          <span className="product-category">{product.category || 'Tech Core'}</span>
          <span className={stockAvailable ? 'product-stock in-stock' : 'product-stock out-stock'}>
            {stockAvailable ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <h1>{product.title}</h1>
        {product.subtitle ? <p className="product-subtitle">{product.subtitle}</p> : null}
      </div>

      <ProductPrice price={product.price} oldPrice={product.oldPrice} discount={product.discount} />

      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>

      <ProductSpecs specs={product.specs} />

      <ProductActions
        disabled={!isAuthenticated || !stockAvailable}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        feedback={feedback}
        isAuthenticated={isAuthenticated}
      />
    </section>
  );
}
