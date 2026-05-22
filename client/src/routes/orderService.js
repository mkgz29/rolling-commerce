import { apiRequest } from './api';

const isValidOrderId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

const assertValidOrderId = (id) => {
  if (!isValidOrderId(id)) {
    throw new Error('Invalid order ID');
  }
};

export const getOrdersRequest = () => {
  return apiRequest('/orders');
};

export const getOrderByIdRequest = (id) => {
  assertValidOrderId(id);
  return apiRequest(`/orders/${id}`);
};

export const getAdminOrdersRequest = (params = {}) => {
  return apiRequest('/orders/admin', { params });
};

export const getAdminOrderByIdRequest = (id) => {
  assertValidOrderId(id);
  return apiRequest(`/orders/admin/${id}`);
};

export const updateAdminOrderStatusRequest = (id, status) => {
  assertValidOrderId(id);
  return apiRequest(`/orders/admin/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
};

export const cancelAdminOrderRequest = (id) => {
  assertValidOrderId(id);
  return apiRequest(`/orders/admin/${id}/cancel`, {
    method: 'PATCH',
  });
};

export const deleteAdminOrderRequest = (id) => {
  assertValidOrderId(id);
  return apiRequest(`/orders/admin/${id}`, {
    method: 'DELETE',
  });
};

export const createOrderRequest = () => {
  return apiRequest('/orders', {
    method: 'POST',
  });
};
