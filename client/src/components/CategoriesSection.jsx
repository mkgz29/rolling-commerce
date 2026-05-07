import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Smartphones',
    icon: 'SP',
    accent: 'cyan',
    description: 'Flagship phones, sharp displays and everyday performance.',
  },
  {
    name: 'Laptops',
    icon: 'LP',
    accent: 'violet',
    description: 'Portable power for creators, workstations and gaming setups.',
  },
  {
    name: 'Accessories',
    icon: 'AX',
    accent: 'blue',
    description: 'Premium add-ons that complete a cleaner, faster desk.',
  },
  {
    name: 'Gaming',
    icon: 'GX',
    accent: 'magenta',
    description: 'Responsive gear for competitive play and immersive sessions.',
  },
];

function CategoriesSection() {
  return (
    <section className="categories-section py-5">
      <div className="container">
        <div className="category-section-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div className="section-heading">
            <h2 className="split-heading">
              <span className="title-accent">Shop refined</span>
              <span className="title-main">tech categories</span>
            </h2>
            <p className="text-muted">Move through the catalog by setup need, device class and performance profile.</p>
          </div>
          <Link to="/products" className="category-action">
            Browse all categories
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className={`category-card-link category-${category.accent}`}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.name}
            >
              <article className="category-card">
                <div className="category-card-top">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-arrow">&gt;</span>
                </div>
                <div className="category-card-copy">
                  <span className="category-kicker">Tech Core</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <span className="category-cta">Explore category</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
