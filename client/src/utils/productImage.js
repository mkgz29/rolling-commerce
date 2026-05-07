export const PRODUCT_IMAGE_FALLBACK =
  'https://placehold.co/800x600/081123/b7e4ff?text=Tech+Core';

const getImageUrl = (image) => {
  if (typeof image === 'string') {
    return image.trim();
  }

  if (image?.url && typeof image.url === 'string') {
    return image.url.trim();
  }

  return '';
};

export const getProductImages = (product) => {
  const imageCandidates = [
    getImageUrl(product?.image),
    ...(Array.isArray(product?.images) ? product.images.map(getImageUrl) : []),
  ].filter(Boolean);

  const uniqueImages = [...new Set(imageCandidates)];

  return uniqueImages.length > 0 ? uniqueImages : [PRODUCT_IMAGE_FALLBACK];
};

export const getProductImage = (product) => getProductImages(product)[0];
