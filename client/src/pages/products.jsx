import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getProductsRequest } from '../routes/productService';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage, getProductImageFallback } from '../utils/productImage';
import '../styles/home.css';

const categories = [
  { value: 'processors', label: 'Procesadores' },
  { value: 'graphics-cards', label: 'Placas de video' },
  { value: 'ram', label: 'Memoria RAM' },
  { value: 'storage', label: 'Almacenamiento' },
  { value: 'power-supplies', label: 'Fuentes' },
  { value: 'cases', label: 'Gabinetes' },
  { value: 'Smartphones', label: 'Celulares' },
  { value: 'Laptops', label: 'Notebooks' },
  { value: 'Accessories', label: 'Accesorios' },
  { value: 'Gaming', label: 'Gaming' },
];
const getProductId = (product) => product?._id || product?.id;

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
    queueMicrotask(() => {
      setDraftFilters(filters);
    });
  }, [filters]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsRequest(filters);
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'No se pudieron cargar los productos.');
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
      setCartMessage('Producto agregado al carrito.');
    } catch (requestError) {
      setCartMessage(requestError.message || 'No se pudo agregar el producto al carrito.');
    }
  };

  return (
    <div className="page products-page catalog-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="catalog-hero-grid">
            <div>
              <span className="catalog-kicker">Catálogo Tech Core</span>
              <h1>Tecnología seleccionada para equipos más potentes.</h1>
              <p>
                Explorá productos reales del catálogo, filtrá por categoría y encontrá tu próxima mejora más rápido.
              </p>
            </div>
            <form className="catalog-filter-panel" onSubmit={handleSubmit}>
              <label htmlFor="catalog-search">Buscar productos</label>
              <div className="catalog-search-row">
                <input
                  id="catalog-search"
                  value={draftFilters.search}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, search: event.target.value }))}
                  placeholder="RTX, Ryzen, SSD, gabinete..."
                />
                <button type="submit">Buscar</button>
              </div>
              <div className="catalog-filter-row">
                <select value={draftFilters.category} onChange={handleCategoryChange} aria-label="Filtrar por categoría">
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option value={category.value} key={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {(filters.search || filters.category) && (
                  <button className="catalog-clear" type="button" onClick={handleClearFilters}>
                    Limpiar filtros
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
              <h2>Productos</h2>
              <p>{loading ? 'Cargando catálogo...' : `${products.length} producto${products.length === 1 ? '' : 's'} encontrado${products.length === 1 ? '' : 's'}`}</p>
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
                <p className="state-eyebrow">Catálogo no disponible</p>
                <h3>No pudimos cargar los productos</h3>
                <p>{error}</p>
              </div>
              <button className="btn state-action" type="button" onClick={() => updateFilters(filters)}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="home-state-panel">
              <div className="state-orb" aria-hidden="true">
                <span />
              </div>
              <div className="state-copy">
                <p className="state-eyebrow">Sin resultados</p>
                <h3>No hay productos para estos filtros</h3>
                <p>Limpiá los filtros actuales o probá una búsqueda más amplia para ver todo el catálogo.</p>
              </div>
              <button className="btn state-action" type="button" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="catalog-grid">
              {products.map((product) => (
                <article className="catalog-card" key={getProductId(product)}>
                  <Link to={`/products/${getProductId(product)}`} className="catalog-card-image" aria-label={`Ver ${product.name || 'producto'}`}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name || 'Producto'}
                      onError={(event) => {
                        const fallbackImage = getProductImageFallback(product);
                        if (event.currentTarget.src !== fallbackImage) {
                          event.currentTarget.src = fallbackImage;
                        }
                      }}
                    />
                  </Link>
                  <div className="catalog-card-body">
                    <div className="catalog-card-meta">
                      <span>{product.category || 'Tech Core'}</span>
                      <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                      </span>
                    </div>
                    <div className="catalog-card-copy">
                      <h3>{product.name || 'Producto sin nombre'}</h3>
                      <p>{product.description || 'Sin descripción disponible.'}</p>
                    </div>
                    <div className="catalog-card-actions">
                      <strong>{formatPrice(product.price)}</strong>
                      <div>
                        <Link to={`/products/${getProductId(product)}`}>Detalle</Link>
                        <button type="button" disabled={product.stock <= 0} onClick={() => handleAddToCart(getProductId(product))}>
                          {product.stock <= 0 ? 'Sin stock' : 'Agregar'}
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
