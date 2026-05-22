import { apiRequest } from './api';

const unwrapCategories = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
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
