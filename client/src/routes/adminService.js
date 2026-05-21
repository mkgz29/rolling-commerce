import { apiRequest } from './api';

export const getAdminStatsRequest = () => {
  return apiRequest('/orders/admin/stats');
};
