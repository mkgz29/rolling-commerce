import { apiRequest } from './api';

export const getCartRequest = () => {
  return apiRequest('/cart');
};

export const addCartItemRequest = (productId, quantity = 1) => {
  return apiRequest('/cart/add', {
    method: 'POST',
    body: { productId, quantity },
  });
};

export const updateCartItemRequest = (productId, quantity) => {
  return apiRequest(`/cart/item/${productId}`, {
    method: 'PUT',
    body: { quantity },
  });
};

export const removeCartItemRequest = (productId) => {
  return apiRequest(`/cart/item/${productId}`, {
    method: 'DELETE',
  });
};

export const clearCartRequest = () => {
  return apiRequest('/cart/clear', {
    method: 'DELETE',
  });
};
