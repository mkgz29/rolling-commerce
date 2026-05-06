import { apiRequest } from './api';

export const getProductsRequest = (params = {}) => {
  return apiRequest('/products', { params, token: null });
};

export const getProductByIdRequest = (id) => {
  return apiRequest(`/products/${id}`, { token: null });
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
