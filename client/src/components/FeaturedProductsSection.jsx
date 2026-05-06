import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: 'Wireless Headphones', price: '$89.99', description: 'Noise cancelling sound for every playlist.' },
  { id: 2, name: 'Smart Watch', price: '$129.99', description: 'Track your health, notifications, and active life.' },
  { id: 3, name: 'Gaming Keyboard', price: '$74.99', description: 'Responsive keys with RGB lighting.' },
  { id: 4, name: 'Portable Speaker', price: '$59.99', description: 'Rich audio on the go with durable design.' },
];

function FeaturedProductsSection() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div>
            <h2>Featured Products</h2>
            <p className="text-muted">Top picks selected for your next upgrade.</p>
          </div>
          <Link to="/products" className="btn btn-outline-secondary">
            View all products
          </Link>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-md-6 col-xl-3" key={product.id}>
              <article className="card h-100 border-0 shadow-sm">
                <div className="ratio ratio-4x3 bg-secondary"></div>
                <div className="card-body d-flex flex-column">
                  <h3 className="h5">{product.name}</h3>
                  <p className="text-muted flex-grow-1">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold">{product.price}</span>
                    <button className="btn btn-success btn-sm">Add to cart</button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
