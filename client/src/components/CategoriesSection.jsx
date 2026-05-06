import { Link } from 'react-router-dom';

const categories = ['Smartphones', 'Laptops', 'Accessories', 'Gaming'];

function CategoriesSection() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div>
            <h2>Shop by category</h2>
            <p className="text-muted">Find the perfect product in a few clicks.</p>
          </div>
          <Link to="/products" className="btn btn-link px-0">
            Browse all categories
          </Link>
        </div>

        <div className="row g-3">
          {categories.map((category) => (
            <div className="col-sm-6 col-xl-3" key={category}>
              <article className="category-card card border-0 shadow-sm h-100 p-4">
                <div className="mb-3 fs-3 text-success">■</div>
                <h3 className="h5">{category}</h3>
                <p className="text-muted mb-0">
                  Explore curated top-rated products in {category.toLowerCase()}.
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
