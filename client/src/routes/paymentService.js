import { apiRequest } from './api';

export const createMercadoPagoPreferenceRequest = (payload) => {
  return apiRequest('/payments/mercadopago/preference', {
    method: 'POST',
    body: payload,
  });
};
