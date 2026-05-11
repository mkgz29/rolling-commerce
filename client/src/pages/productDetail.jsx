import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductByIdRequest } from '../routes/productService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { getProductImageFallback, getProductImages } from '../utils/productImage';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import './ProductDetailPage.css';

const getProductId = (product) => product?._id || product?.id;

const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  const images = getProductImages(product);
  const generatedSpecs = [
    product.category ? `Categoría: ${product.category}` : null,
    Number.isFinite(Number(product.rating)) && Number(product.rating) > 0 ? `Calificación: ${product.rating}/5` : null,
    Number.isFinite(Number(product.numReviews)) && Number(product.numReviews) > 0
      ? `${product.numReviews} reseñas`
      : null,
  ].filter(Boolean);

  return {
    id: getProductId(product),
    title: product.title || product.name || 'Producto sin nombre',
    subtitle: product.subtitle || product.shortDescription || '',
    description: product.description || 'Sin descripción disponible.',
    category: product.category || 'Tech Core',
    stock: Number(product.stock || 0),
    price: Number(product.price || 0),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    discount: product.discount || null,
    images,
    fallbackImage: getProductImageFallback(product),
    specs: product.specs?.length ? product.specs : generatedSpecs,
  };
};

function ProductDetailLoading() {
  return (
    <div className="product-detail-skeleton" aria-label="Cargando producto">
      <div className="skeleton-gallery skeleton-block" />
      <div className="skeleton-panel">
        <div className="skeleton-line w-50" />
        <div className="skeleton-line tall w-75" />
        <div className="skeleton-line" />
        <div className="skeleton-line w-75" />
        <div className="skeleton-line tall w-50" />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setCartMessage('');
        const data = await getProductByIdRequest(id);
        if (active) {
          setProduct(normalizeProduct(data));
        }
      } catch (requestError) {
        if (active) {
          setProduct(null);
          setError(requestError.message || 'Producto no encontrado');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setCartMessage('');
      await addItem(product.id);
      setCartMessage('Producto agregado al carrito.');
    } catch (requestError) {
      setCartMessage(requestError.message || 'No se pudo agregar el producto al carrito.');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (isAuthenticated && product?.stock > 0) {
      navigate('/cart');
    }
  };

  return (
    <div className="page product-detail-page">
      <div className="container">
        <nav className="product-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/products">Productos</Link>
          <span>/</span>
          <span>{product?.title || 'Detalle del producto'}</span>
        </nav>

        {loading ? <ProductDetailLoading /> : null}

        {!loading && error ? (
          <div className="product-detail-state">
            <div className="home-state-panel">
              <div className="state-orb" aria-hidden="true">
                <span />
              </div>
              <div className="state-copy">
                <p className="state-eyebrow">Producto no disponible</p>
                <h1>No pudimos encontrar este producto</h1>
                <p>{error}</p>
              </div>
              <Link className="btn state-action" to="/products">
                Volver a productos
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && !error && product ? (
          <article className="product-detail-layout">
            <ProductGallery images={product.images} title={product.title} fallbackImage={product.fallbackImage} />
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              feedback={cartMessage}
              isAuthenticated={isAuthenticated}
            />
          </article>
        ) : null}
      </div>
    </div>
  );
}
