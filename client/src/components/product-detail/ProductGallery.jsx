import { useState } from 'react';
import ThumbnailList from './ThumbnailList';
import { getProductImages } from '../../utils/productImage';
import './ProductGallery.css';

const fallbackLabel = 'Tech Core';

export default function ProductGallery({ images = [], title }) {
  const validImages = getProductImages({ images });
  const [selectedImage, setSelectedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const activeImage = validImages.includes(selectedImage) ? selectedImage : validImages[0] || '';
  const showFallback = !activeImage || failedImage === activeImage;

  return (
    <section className="product-gallery-card" aria-label={`${title} gallery`}>
      <div className="product-main-image">
        {showFallback ? (
          <div className="product-image-fallback">
            <span>{fallbackLabel}</span>
            <strong>{title}</strong>
          </div>
        ) : (
          <img src={activeImage} alt={title} onError={() => setFailedImage(activeImage)} />
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
