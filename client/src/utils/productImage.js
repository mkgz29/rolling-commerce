export const PRODUCT_IMAGE_FALLBACK =
  'https://placehold.co/800x600/081123/b7e4ff?text=Tech+Core';

const CATEGORY_IMAGE_FALLBACKS = {
  processors: 'https://placehold.co/800x600/081123/b7e4ff?text=CPU',
  'graphics-cards': 'https://placehold.co/800x600/081123/b7e4ff?text=GPU',
  ram: 'https://placehold.co/800x600/081123/b7e4ff?text=RAM',
  storage: 'https://placehold.co/800x600/081123/b7e4ff?text=SSD',
  'power-supplies': 'https://placehold.co/800x600/081123/b7e4ff?text=FUENTE',
  cases: 'https://placehold.co/800x600/081123/b7e4ff?text=GABINETE',
};

const CATEGORY_ALIASES = new Map([
  ['procesador', 'processors'],
  ['procesadores', 'processors'],
  ['cpu', 'processors'],
  ['processor', 'processors'],
  ['processors', 'processors'],
  ['placa de video', 'graphics-cards'],
  ['placas de video', 'graphics-cards'],
  ['gpu', 'graphics-cards'],
  ['tarjeta grafica', 'graphics-cards'],
  ['tarjetas graficas', 'graphics-cards'],
  ['graphics card', 'graphics-cards'],
  ['graphics-cards', 'graphics-cards'],
  ['ram', 'ram'],
  ['memoria ram', 'ram'],
  ['memory', 'ram'],
  ['disco', 'storage'],
  ['ssd', 'storage'],
  ['hdd', 'storage'],
  ['almacenamiento', 'storage'],
  ['storage', 'storage'],
  ['nvme', 'storage'],
  ['fuente', 'power-supplies'],
  ['fuentes', 'power-supplies'],
  ['psu', 'power-supplies'],
  ['power supply', 'power-supplies'],
  ['power-supplies', 'power-supplies'],
  ['gabinete', 'cases'],
  ['gabinetes', 'cases'],
  ['case', 'cases'],
  ['cases', 'cases'],
  ['chasis', 'cases'],
  ['chassis', 'cases'],
]);

const getImageUrl = (image) => {
  if (typeof image === 'string') {
    return image.trim();
  }

  if (image?.url && typeof image.url === 'string') {
    return image.url.trim();
  }

  return '';
};

const getCategoryValue = (product) => {
  const category = product?.category;

  if (typeof category === 'object') {
    return category?.slug || category?.key || category?.value || category?.name || category?.title || '';
  }

  return category || product?.categoryKey || product?.type || '';
};

export const normalizeProductCategory = (productOrCategory = '') => {
  const rawCategory = typeof productOrCategory === 'string' ? productOrCategory : getCategoryValue(productOrCategory);
  const normalized = String(rawCategory)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return CATEGORY_ALIASES.get(normalized) || normalized;
};

const inferCategoryFromProductText = (product) => {
  const searchableText = [
    product?.name,
    product?.title,
    product?.description,
    product?.shortDescription,
  ]
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (/\b(rtx|gtx|radeon|geforce|gpu|placa de video|tarjeta grafica)\b/.test(searchableText)) {
    return 'graphics-cards';
  }

  if (/\b(ryzen|intel|core i[3579]|cpu|procesador)\b/.test(searchableText)) {
    return 'processors';
  }

  if (/\b(ddr[345]?|memoria ram|ram)\b/.test(searchableText)) {
    return 'ram';
  }

  if (/\b(ssd|hdd|nvme|m\.2|disco|almacenamiento)\b/.test(searchableText)) {
    return 'storage';
  }

  if (/\b(psu|fuente|power supply|[0-9]{3,4}w)\b/.test(searchableText)) {
    return 'power-supplies';
  }

  if (/\b(gabinete|case|chasis|tower)\b/.test(searchableText)) {
    return 'cases';
  }

  return '';
};

export const getProductImageFallback = (product) => {
  const normalizedCategory = normalizeProductCategory(product);
  const inferredCategory = CATEGORY_IMAGE_FALLBACKS[normalizedCategory] ? normalizedCategory : inferCategoryFromProductText(product);
  return CATEGORY_IMAGE_FALLBACKS[inferredCategory] || PRODUCT_IMAGE_FALLBACK;
};

export const getProductImages = (product) => {
  const imageCandidates = [
    getImageUrl(product?.image),
    getImageUrl(product?.imageUrl),
    getImageUrl(product?.img),
    getImageUrl(product?.thumbnail),
    ...(Array.isArray(product?.images) ? product.images.map(getImageUrl) : []),
  ].filter(Boolean);

  const uniqueImages = [...new Set(imageCandidates)];
  const fallbackImage = getProductImageFallback(product);

  return uniqueImages.length > 0 ? uniqueImages : [fallbackImage];
};

export const getProductImage = (product) => getProductImages(product)[0];
