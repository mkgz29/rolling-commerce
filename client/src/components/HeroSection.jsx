import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage, PRODUCT_IMAGE_FALLBACK } from '../utils/productImage';

const getProductId = (product) => product?._id || product?.id;

const hasProductImage = (product) => Boolean(product?.image || product?.images?.[0]?.url);

const getFeaturedProduct = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return products.find(hasProductImage) || products[0];
};

function HeroSection({ products = [], loading = false, error = null }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const featuredProduct = getFeaturedProduct(products);
  const productId = getProductId(featuredProduct);
  const productImage = featuredProduct ? getProductImage(featuredProduct) : PRODUCT_IMAGE_FALLBACK;
  const productName = featuredProduct?.name || 'Live Tech Core Catalog';
  const productDescription =
    featuredProduct?.description || 'Explore premium products selected for modern work, gaming and entertainment.';
  const productPrice = featuredProduct ? formatPrice(featuredProduct.price) : 'Browse catalog';
  const productMeta = featuredProduct?.category || (error ? 'Catalog unavailable' : 'Tech Core');
  const stockLabel =
    featuredProduct && Number(featuredProduct.stock) > 0 ? `${featuredProduct.stock} in stock` : productMeta;

  const handleAddToCart = async () => {
    if (!featuredProduct || !productId) {
      navigate('/products');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    await addItem(productId);
  };

  return (
    <section className="hero-section position-relative overflow-hidden py-5">
      <div className="hero-backdrop" />
      <div className="container position-relative">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6">
            <div className="hero-copy pe-xl-5">
              <span className="hero-badge d-inline-flex align-items-center mb-3">
                Premium tech, fast delivery
              </span>
              <h1 className="display-5 fw-bold text-white mb-4 split-heading">
                <span className="title-accent">Elevate your setup</span>
                <span className="title-main">with curated technology built for modern life.</span>
              </h1>
              <p className="hero-subtitle text-muted mb-4">
                Tech Core delivers the latest devices, trusted accessories and seamless checkout for professionals,
                creators and anyone who demands premium performance.
              </p>

              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-4 hero-action-group">
                <Link to="/products" className="btn btn-primary btn-lg px-4 py-3">
                  Shop Products
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg px-4 py-3">
                  Explore Deals
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-2 hero-benefits">
                <span className="benefit-pill">Fast delivery</span>
                <span className="benefit-pill">Secure checkout</span>
                <span className="benefit-pill">Premium tech</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-showcase card border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="hero-showcase-top d-flex justify-content-between align-items-center px-4 pt-4">
                <span className="badge hero-pill bg-gradient-primary text-white">Top pick</span>
                <span className="text-white-50 small">{loading ? 'Loading catalog...' : stockLabel}</span>
              </div>

              <div className="product-visual position-relative overflow-hidden rounded-4 mx-4 mt-4">
                <img src={productImage} alt={productName} className="img-fluid w-100" />
                <div className="product-glow" />
              </div>

              <div className="card-body px-4 pb-4 pt-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="h4 text-white mb-1">{loading ? 'Loading featured product...' : productName}</h3>
                    <p className="text-muted mb-0">{productDescription}</p>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">{featuredProduct ? 'From' : 'Start'}</div>
                    <div className="h4 text-white fw-semibold mb-0">{productPrice}</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4 hero-attributes">
                  <span className="attribute-pill">{productMeta}</span>
                  <span className="attribute-pill">{stockLabel}</span>
                  <span className="attribute-pill">Secure checkout</span>
                </div>

                <div className="d-flex gap-3 flex-column flex-sm-row">
                  <Link className="btn btn-outline-light flex-grow-1 py-3" to={productId ? `/products/${productId}` : '/products'}>
                    View details
                  </Link>
                  <button
                    className="btn btn-primary flex-grow-1 py-3"
                    type="button"
                    disabled={loading || (featuredProduct && Number(featuredProduct.stock) <= 0)}
                    onClick={handleAddToCart}
                  >
                    {featuredProduct && Number(featuredProduct.stock) <= 0 ? 'Out of stock' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
