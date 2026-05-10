const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_STORAGE_KEY = 'rolling-commerce-token';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const buildUrl = (endpoint, params) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

export const apiRequest = async (endpoint, options = {}) => {
  const { body, params, token = getStoredToken(), headers = {}, ...requestOptions } = options;
  const url = buildUrl(endpoint, params);

  let response;

  try {
    response = await fetch(url, {
      ...requestOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(`Could not reach API at ${API_BASE_URL}. Check that the backend is running.`, 0, {
      cause: error.message,
      url,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed', response.status, data);
  }

  return data;
};

export { API_BASE_URL, TOKEN_STORAGE_KEY };
