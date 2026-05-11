import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { getProductImage, getProductImageFallback } from '../utils/productImage';

const ProductBuildCard = ({ product, isSelected = false, onAddToBuild }) => {
  const productId = product?._id || product?.id;
  const name = product?.name || product?.title || 'Producto sin nombre';
  const category =
    typeof product?.category === 'object'
      ? product.category?.name || product.category?.title || product.category?.slug || 'Tech Core'
      : product?.category || 'Tech Core';
  const description = product?.desc || product?.description || category || 'Sin descripcion disponible';
  const stock = Number(product?.stock || 0);
  const productImage = getProductImage(product);
  const fallbackImage = getProductImageFallback(product);
  const [failedImage, setFailedImage] = useState('');
  const imageSrc = failedImage === productImage ? fallbackImage : productImage;

  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className={`product-build-card p-3 ${isSelected ? 'selected' : ''}`}>
        <div className="product-img-placeholder mb-3">
          <img
            src={imageSrc}
            alt={name}
            className="product-build-image"
            loading="lazy"
            onError={() => {
              if (imageSrc !== fallbackImage) {
                setFailedImage(productImage);
              }
            }}
          />
        </div>

        <div className="product-build-heading d-flex justify-content-between align-items-start gap-2 mb-1">
          <h6 className="fw-bold mb-0">{name}</h6>
          {productId && <span className="text-secondary extra-small">#{String(productId).slice(-6)}</span>}
        </div>

        <p className="product-build-description text-secondary extra-small mb-2">{description}</p>

        <div className="product-build-meta d-flex justify-content-between align-items-center mb-3">
          <span className="text-secondary extra-small text-uppercase">{category}</span>
          <span className="text-secondary extra-small">{stock > 0 ? `${stock} en stock` : 'Sin stock'}</span>
        </div>

        <div className="mt-auto pt-3 border-top border-secondary border-opacity-10">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-secondary small">PRECIO</span>
            <span className="fs-5 fw-bold text-white">{formatPrice(product?.price)}</span>
          </div>
          <button
            className={`btn w-100 py-2 fw-bold text-uppercase ${
              isSelected ? 'btn-build-selected' : 'btn-primary-gradient'
            }`}
            style={{ fontSize: '0.8rem' }}
            disabled={!productId || stock <= 0}
            onClick={() => onAddToBuild?.(product)}
          >
            {isSelected ? 'Seleccionado' : 'Agregar al ensamble'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductBuildCard;
