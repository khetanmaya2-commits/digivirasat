/**
 * DigiVirasat 2.0 - Centralized API Client
 * Manages base URL, headers, timeouts, and error handling for AWS API Gateway integration.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export const isApiConfigured = () => {
  return Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);
};

export const getApiBaseUrl = () => API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Standard fetch request handler with timeout and error translation
 */
export async function apiRequest(endpoint, options = {}, timeoutMs = 25000) {
  if (!isApiConfigured()) {
    throw new ApiError(
      'AWS API Gateway endpoint is not configured. Please set VITE_API_BASE_URL in your environment.',
      'UNCONFIGURED'
    );
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON if possible
   // Parse JSON if possible, even when API Gateway returns text/plain
let data = null;
const contentType = response.headers.get('content-type');

if (contentType && contentType.includes('application/json')) {
  data = await response.json();
} else {
  const text = await response.text();

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
}

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.message || data.error)) ||
        `Preservation service returned HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError(
        'The request to DigiVirasat preservation service timed out. Please check your network connection and try again.',
        'TIMEOUT'
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.message || 'DigiVirasat could not connect to the preservation service. Please check your connection and try again.',
      'NETWORK_ERROR',
      error
    );
  }
}
