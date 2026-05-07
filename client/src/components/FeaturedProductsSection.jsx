import { Link } from 'react-router-dom';
import ProductCard from './productCard';

function FeaturedProductsSection({ products = [], loading = false, error = null }) {
  return (
    <section className="featured-products-section py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div className="section-heading">
            <h2 className="split-heading">
              <span className="title-accent">Featured</span>
              <span className="title-main">Products</span>
            </h2>
            <p>Top picks selected from the live catalog.</p>
          </div>
          <Link to="/products" className="btn btn-outline-light">
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div className="col-md-6 col-xl-3" key={item}>
                <article className="featured-product-card is-loading">
                  <div className="product-card-image skeleton-block" />
                  <div className="product-card-body">
                    <div className="skeleton-line w-50" />
                    <div className="skeleton-line w-75" />
                    <div className="skeleton-line" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="home-state-panel">
            <div className="state-copy">
              <p className="state-eyebrow">Catalog unavailable</p>
              <h3>Featured products could not be loaded</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-6 col-xl-3" key={product._id || product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
