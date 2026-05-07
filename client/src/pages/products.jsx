import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getProductsRequest } from '../routes/productService';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage } from '../utils/productImage';
import '../styles/home.css';

const categories = ['Smartphones', 'Laptops', 'Accessories', 'Gaming'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }),
    [searchParams],
  );

  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsRequest(filters);
        if (active) {
          setProducts(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Products could not be loaded.');
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [filters]);

  const updateFilters = (nextFilters) => {
    const nextParams = {};

    if (nextFilters.search?.trim()) {
      nextParams.search = nextFilters.search.trim();
    }

    if (nextFilters.category) {
      nextParams.category = nextFilters.category;
    }

    setSearchParams(nextParams);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateFilters(draftFilters);
  };

  const handleCategoryChange = (event) => {
    const nextFilters = { ...draftFilters, category: event.target.value };
    setDraftFilters(nextFilters);
    updateFilters(nextFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters({ search: '', category: '' });
    setSearchParams({});
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/products', search: searchParams.toString() } } });
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

  return (
    <div className="page products-page catalog-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="catalog-hero-grid">
            <div>
              <span className="catalog-kicker">Tech Core catalog</span>
              <h1>Curated technology for sharper setups.</h1>
              <p>
                Browse real products from the backend catalog, filter by category and find the right upgrade faster.
              </p>
            </div>
            <form className="catalog-filter-panel" onSubmit={handleSubmit}>
              <label htmlFor="catalog-search">Search products</label>
              <div className="catalog-search-row">
                <input
                  id="catalog-search"
                  value={draftFilters.search}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, search: event.target.value }))}
                  placeholder="Headphones, laptop, gaming..."
                />
                <button type="submit">Search</button>
              </div>
              <div className="catalog-filter-row">
                <select value={draftFilters.category} onChange={handleCategoryChange} aria-label="Filter by category">
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {(filters.search || filters.category) && (
                  <button className="catalog-clear" type="button" onClick={handleClearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="catalog-content">
        <div className="container">
          <div className="catalog-toolbar">
            <div>
              <h2>Products</h2>
              <p>{loading ? 'Loading catalog...' : `${products.length} product${products.length === 1 ? '' : 's'} found`}</p>
            </div>
            {cartMessage && <span>{cartMessage}</span>}
          </div>

          {loading && (
            <div className="catalog-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <article className="catalog-card is-loading" key={item}>
                  <div className="catalog-card-image skeleton-block" />
                  <div className="catalog-card-body">
                    <div className="skeleton-line w-50" />
                    <div className="skeleton-line w-75" />
                    <div className="skeleton-line" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="home-state-panel">
              <div className="state-orb" aria-hidden="true">
                <span />
              </div>
              <div className="state-copy">
                <p className="state-eyebrow">Catalog signal interrupted</p>
                <h3>Products are unavailable</h3>
                <p>{error}</p>
              </div>
              <button className="btn state-action" type="button" onClick={() => updateFilters(filters)}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="home-state-panel">
              <div className="state-orb" aria-hidden="true">
                <span />
              </div>
              <div className="state-copy">
                <p className="state-eyebrow">No matches found</p>
                <h3>No products match these filters</h3>
                <p>Clear the current filters or try a broader search term to explore the full Tech Core catalog.</p>
              </div>
              <button className="btn state-action" type="button" onClick={handleClearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="catalog-grid">
              {products.map((product) => (
                <article className="catalog-card" key={product._id}>
                  <Link to={`/products/${product._id}`} className="catalog-card-image" aria-label={`View ${product.name}`}>
                    <img src={getProductImage(product)} alt={product.name} />
                  </Link>
                  <div className="catalog-card-body">
                    <div className="catalog-card-meta">
                      <span>{product.category || 'Tech Core'}</span>
                      <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="catalog-card-copy">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="catalog-card-actions">
                      <strong>{formatPrice(product.price)}</strong>
                      <div>
                        <Link to={`/products/${product._id}`}>Details</Link>
                        <button type="button" disabled={product.stock <= 0} onClick={() => handleAddToCart(product._id)}>
                          {product.stock <= 0 ? 'Out' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
