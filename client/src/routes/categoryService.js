import { apiRequest } from './api';

const unwrapCategories = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

const assertValidCategoryId = (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('No se pudo identificar la categoria.');
  }
};

const normalizeCategoryText = (value = '') => String(value || '').trim();

export const normalizeCategoryOption = (category) => {
  if (typeof category === 'string') {
    const label = normalizeCategoryText(category);
    return label ? { id: label, value: label, label } : null;
  }

  if (!category || typeof category !== 'object') {
    return null;
  }

  const label = normalizeCategoryText(category.label || category.name || category.title || category.slug || category.value || category.categoryKey);
  const value = normalizeCategoryText(category.slug || category.value || category.categoryKey || category.key || category.name || category.title);

  if (!label || !value) {
    return null;
  }

  return {
    id: normalizeCategoryText(category._id || category.id || value),
    value,
    label,
    description: normalizeCategoryText(category.description),
    raw: category,
  };
};

export const normalizeCategoryOptions = (categories = []) => {
  const seen = new Set();

  return categories.reduce((options, category) => {
    const option = normalizeCategoryOption(category);
    if (!option) return options;

    const key = option.value.toLowerCase();
    if (seen.has(key)) return options;

    seen.add(key);
    options.push(option);
    return options;
  }, []);
};

export const getCategoriesRequest = () => {
  return apiRequest('/categories', { token: null }).then(unwrapCategories);
};

export const createCategoryRequest = (category) => {
  return apiRequest('/categories', {
    method: 'POST',
    body: category,
  });
};

export const updateCategoryRequest = (id, category) => {
  assertValidCategoryId(id);

  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: category,
  });
};

export const deleteCategoryRequest = (id) => {
  assertValidCategoryId(id);

  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
};

export { isValidObjectId as isValidCategoryId };
