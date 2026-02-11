const normalizeApiBaseUrl = (rawValue) => {
  const fallback = '/api';

  if (!rawValue || typeof rawValue !== 'string') {
    return fallback;
  }

  const trimmed = rawValue.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return fallback;
  }

  // Keep relative /api usage for same-origin deployments.
  if (trimmed.startsWith('/')) {
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // If a full URL is provided without /api, append it to prevent frontend HTML fetches.
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
