import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByIdRequest } from '../routes/productService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductByIdRequest(id);
        if (active) {
          setProduct(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
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

  return (
    <div className="page product-detail-page">
      <h1>Product Detail</h1>
      {loading && <p>Loading product...</p>}
      {error && <p className="text-danger">{error}</p>}
      {product && (
        <article className="row g-4">
          <div className="col-md-5">
            <div className="ratio ratio-4x3 bg-light">
              {product.image && <img src={product.image} alt={product.name} className="object-fit-cover" />}
            </div>
          </div>
          <div className="col-md-7">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="fw-bold">{formatPrice(product.price)}</p>
            <p className="text-muted">Stock: {product.stock}</p>
            <button
              className="btn btn-success"
              type="button"
              disabled={!isAuthenticated || product.stock <= 0}
              onClick={() => addItem(product._id)}
            >
              Add to cart
            </button>
            {!isAuthenticated && <p className="text-muted mt-2">Log in to add this product to your cart.</p>}
          </div>
        </article>
      )}
    </div>
  );
}
