import { apiRequest } from './api';

export const getAdminStatsRequest = () => {
  return apiRequest('/admin/stats');
};
