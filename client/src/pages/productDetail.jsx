import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductByIdRequest } from '../routes/productService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { getProductImages } from '../utils/productImage';
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
    product.category ? `Category: ${product.category}` : null,
    Number.isFinite(Number(product.rating)) && Number(product.rating) > 0 ? `Rating: ${product.rating}/5` : null,
    Number.isFinite(Number(product.numReviews)) && Number(product.numReviews) > 0
      ? `${product.numReviews} customer reviews`
      : null,
  ].filter(Boolean);

  return {
    id: getProductId(product),
    title: product.title || product.name || 'Untitled product',
    subtitle: product.subtitle || product.shortDescription || '',
    description: product.description || 'No description available yet.',
    category: product.category || 'Tech Core',
    stock: Number(product.stock || 0),
    price: Number(product.price || 0),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    discount: product.discount || null,
    images,
    specs: product.specs?.length ? product.specs : generatedSpecs,
  };
};

function ProductDetailLoading() {
  return (
    <div className="product-detail-skeleton" aria-label="Loading product">
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
          setError(requestError.message || 'Product not found');
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
      setCartMessage('Product added to cart.');
    } catch (requestError) {
      setCartMessage(requestError.message || 'Could not add product to cart.');
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
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product?.title || 'Product detail'}</span>
        </nav>

        {loading ? <ProductDetailLoading /> : null}

        {!loading && error ? (
          <div className="product-detail-state">
            <div className="home-state-panel">
              <div className="state-orb" aria-hidden="true">
                <span />
              </div>
              <div className="state-copy">
                <p className="state-eyebrow">Product unavailable</p>
                <h1>We could not find this product</h1>
                <p>{error}</p>
              </div>
              <Link className="btn state-action" to="/products">
                Back to products
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && !error && product ? (
          <article className="product-detail-layout">
            <ProductGallery images={product.images} title={product.title} />
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
