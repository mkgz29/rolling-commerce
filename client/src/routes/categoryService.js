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
