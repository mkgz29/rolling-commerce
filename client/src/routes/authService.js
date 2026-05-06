import { apiRequest } from './api';

export const loginRequest = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
    token: null,
  });
};

export const registerRequest = (data) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: data,
    token: null,
  });
};

export const getMeRequest = () => {
  return apiRequest('/users/me');
};
