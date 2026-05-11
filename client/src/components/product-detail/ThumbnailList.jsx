import './ProductGallery.css';

export default function ThumbnailList({ images, selectedImage, onSelectImage, productTitle }) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="product-thumbnails" aria-label="Imágenes del producto">
      {images.map((image, index) => (
        <button
          className={`product-thumbnail ${selectedImage === image ? 'is-active' : ''}`}
          type="button"
          key={`${image}-${index}`}
          onClick={() => onSelectImage(image)}
          aria-label={`Ver imagen ${index + 1} de ${productTitle}`}
        >
          <img src={image} alt={`${productTitle} miniatura ${index + 1}`} />
        </button>
      ))}
    </div>
  );
}
