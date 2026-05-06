import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getProductsRequest } from '../routes/productService';
import { formatPrice } from '../utils/formatPrice';

function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getProductsRequest()
      .then((data) => {
        if (active) {
          setProducts(data.slice(0, 4));
        }
      })
      .catch((requestError) => {
        if (active) {
          setProducts([]);
          setError(requestError.message || 'Products could not be loaded.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    try {
      setCartMessage('');
      await addItem(productId);
      setCartMessage('Product added to cart.');
    } catch (requestError) {
      setCartMessage(requestError.message || 'Could not add product to cart.');
    }
  };

  const renderStatePanel = ({ eyebrow, title, message, actionLabel }) => (
    <div className="home-state-panel">
      <div className="state-orb" aria-hidden="true">
        <span />
      </div>
      <div className="state-copy">
        <p className="state-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <Link to="/products" className="btn state-action">
        {actionLabel}
      </Link>
    </div>
  );

  return (
    <section className="featured-products-section py-5">
      <div className="container">
        <div className="section-heading d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div>
            <h2>Featured Products</h2>
            <p>Live picks from the Tech Core catalog.</p>
          </div>
          <Link to="/products" className="btn btn-outline-light">
            View all products
          </Link>
        </div>

        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div className="col-md-6 col-xl-3" key={item}>
                <article className="featured-product-card is-loading" aria-label="Loading product">
                  <div className="product-card-image skeleton-block" />
                  <div className="product-card-body">
                    <div className="skeleton-line w-75" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line w-50" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          renderStatePanel({
            eyebrow: 'Catalog signal interrupted',
            title: 'Products are unavailable',
            message: error,
            actionLabel: 'Open catalog',
          })
        )}

        {!loading && !error && products.length === 0 && (
          renderStatePanel({
            eyebrow: 'Catalog awaiting products',
            title: 'No featured products yet',
            message: 'Add products in the backend catalog and they will appear here automatically.',
            actionLabel: 'Browse catalog',
          })
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {cartMessage && <p className="cart-feedback mb-3">{cartMessage}</p>}
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-md-6 col-xl-3" key={product._id}>
                  <article className="featured-product-card h-100">
                    <Link to={`/products/${product._id}`} className="product-card-link" aria-label={`View ${product.name}`}>
                      <div className="product-card-image">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span>{product.category || 'Tech Core'}</span>
                        )}
                      </div>
                    </Link>
                    <div className="product-card-body">
                      <div className="product-card-copy">
                        <p className="product-card-category">{product.category}</p>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                      </div>
                      <div className="product-card-actions">
                        <span>{formatPrice(product.price)}</span>
                        <div className="d-flex gap-2">
                          <Link className="btn btn-outline-light btn-sm" to={`/products/${product._id}`}>
                            Details
                          </Link>
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            disabled={product.stock <= 0}
                            onClick={() => handleAddToCart(product._id)}
                          >
                            {product.stock <= 0 ? 'Out' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
