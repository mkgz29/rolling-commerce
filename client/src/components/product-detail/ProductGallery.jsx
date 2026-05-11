import { useState } from 'react';
import ThumbnailList from './ThumbnailList';
import { PRODUCT_IMAGE_FALLBACK, getProductImages } from '../../utils/productImage';
import './ProductGallery.css';

const fallbackLabel = 'Tech Core';

export default function ProductGallery({ images = [], title, fallbackImage = PRODUCT_IMAGE_FALLBACK }) {
  const validImages = getProductImages({ images });
  const [selectedImage, setSelectedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const activeImage = validImages.includes(selectedImage) ? selectedImage : validImages[0] || '';
  const imageSrc = failedImage === activeImage ? fallbackImage : activeImage;

  return (
    <section className="product-gallery-card" aria-label={`Galería de ${title}`}>
      <div className="product-main-image">
        {!imageSrc ? (
          <div className="product-image-fallback">
            <span>{fallbackLabel}</span>
            <strong>{title}</strong>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={title}
            onError={() => {
              if (imageSrc !== fallbackImage) {
                setFailedImage(activeImage);
              }
            }}
          />
        )}
      </div>
      <ThumbnailList
        images={validImages}
        selectedImage={activeImage}
        onSelectImage={(image) => {
          setSelectedImage(image);
        }}
        productTitle={title}
      />
    </section>
  );
}
