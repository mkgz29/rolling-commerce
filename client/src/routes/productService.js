import { apiRequest } from './api';

const unwrapProducts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const unwrapProduct = (data) => data?.product || data?.data || data;

export const getProductsRequest = (params = {}) => {
  return apiRequest('/products', { params, token: null }).then(unwrapProducts);
};

export const getProductByIdRequest = (id) => {
  return apiRequest(`/products/${id}`, { token: null }).then(unwrapProduct);
};

export const createProductRequest = (product) => {
  return apiRequest('/products', {
    method: 'POST',
    body: product,
  });
};

export const updateProductRequest = (id, product) => {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: product,
  });
};

export const deleteProductRequest = (id) => {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
};
