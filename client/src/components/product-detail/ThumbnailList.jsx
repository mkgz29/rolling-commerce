import './ProductGallery.css';

export default function ThumbnailList({ images, selectedImage, onSelectImage, productTitle }) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="product-thumbnails" aria-label="Product images">
      {images.map((image, index) => (
        <button
          className={`product-thumbnail ${selectedImage === image ? 'is-active' : ''}`}
          type="button"
          key={`${image}-${index}`}
          onClick={() => onSelectImage(image)}
          aria-label={`View image ${index + 1} of ${productTitle}`}
        >
          <img src={image} alt={`${productTitle} thumbnail ${index + 1}`} />
        </button>
      ))}
    </div>
  );
}
