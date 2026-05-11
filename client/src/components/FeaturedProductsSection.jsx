import { Link } from 'react-router-dom';
import ProductCard from './productCard';

function FeaturedProductsSection({ products = [], loading = false, error = null }) {
  return (
    <section className="featured-products-section py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div className="section-heading">
            <h2 className="split-heading">
              <span className="title-accent">Productos</span>
              <span className="title-main">destacados</span>
            </h2>
            <p>Selección recomendada desde el catálogo activo.</p>
          </div>
          <Link to="/products" className="btn btn-outline-light">
            Ver todos los productos
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
              <p className="state-eyebrow">Catálogo no disponible</p>
              <h3>No pudimos cargar los productos destacados</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-6 col-xl-3" key={product._id || product.id}>
                <ProductCard product={product} showActions={false} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
