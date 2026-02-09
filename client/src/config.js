import { API_BASE_URL } from './config/api.js';

export const TOKEN_KEY = 'plf_admin_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);
export const isUnauthorizedError = (error) => error?.status === 401;

const decodeJwtPayload = (token) => {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch (_error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const hasValidAuthToken = () => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAuthToken();
    return false;
  }

  return true;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();

  if (!token || isTokenExpired(token)) {
    clearAuthToken();
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const apiRequest = async (path, options = {}) => {
  const { headers = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  });

  const payload = await response.json().catch(() => ({
    data: null,
    error: {
      message: 'Invalid server response.',
    },
  }));

  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || 'Request failed.';
    const requestError = new Error(message);

    if (payload?.error?.details && typeof payload.error.details === 'object') {
      requestError.details = payload.error.details;
    } else if (payload?.details && typeof payload.details === 'object') {
      requestError.details = payload.details;
    }

    requestError.status = response.status;
    throw requestError;
  }

  return payload;
};
