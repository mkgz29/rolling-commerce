import { apiRequest } from './api';

const isValidContactMessageId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

const assertValidContactMessageId = (id) => {
  if (!isValidContactMessageId(id)) {
    throw new Error('Invalid contact message ID');
  }
};

export const createContactMessageRequest = (body) => {
  return apiRequest('/contact', {
    method: 'POST',
    token: null,
    body,
  });
};

export const getAdminContactMessagesRequest = (params = {}) => {
  return apiRequest('/contact/admin', { params });
};

export const updateAdminContactMessageStatusRequest = (id, status) => {
  assertValidContactMessageId(id);

  return apiRequest(`/contact/admin/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
};

export const deleteAdminContactMessageRequest = (id) => {
  assertValidContactMessageId(id);

  return apiRequest(`/contact/admin/${id}`, {
    method: 'DELETE',
  });
};
