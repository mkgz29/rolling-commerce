import { apiRequest } from './api';

export const getOrdersRequest = () => {
  return apiRequest('/orders');
};

export const getOrderByIdRequest = (id) => {
  return apiRequest(`/orders/${id}`);
};

export const createOrderRequest = () => {
  return apiRequest('/orders', {
    method: 'POST',
  });
};
