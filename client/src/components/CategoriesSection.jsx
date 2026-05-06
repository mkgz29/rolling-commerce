import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Smartphones',
    marker: 'SM',
    description: 'Flagship power, refined cameras and connected daily essentials.',
  },
  {
    name: 'Laptops',
    marker: 'LP',
    description: 'Performance machines for work, creation and high-speed mobility.',
  },
  {
    name: 'Accessories',
    marker: 'AX',
    description: 'Chargers, audio and precision gear that complete every setup.',
  },
  {
    name: 'Gaming',
    marker: 'GM',
    description: 'Responsive peripherals and immersive gear for serious play.',
  },
];

function CategoriesSection() {
  return (
    <section className="categories-section py-5">
      <div className="container">
        <div className="section-heading d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div>
            <h2>Shop by category</h2>
            <p>Find the right upgrade path for your Tech Core setup.</p>
          </div>
          <Link to="/products" className="btn category-action">
            Browse all categories
          </Link>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div className="col-sm-6 col-xl-3" key={category.name}>
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="category-card-link">
                <article className="category-card h-100">
                  <div className="category-card-top">
                    <span className="category-icon">{category.marker}</span>
                    <span className="category-arrow" aria-hidden="true">→</span>
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
