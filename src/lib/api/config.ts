// API Configuration
// This file centralizes all API configuration including base URL, headers, and request/response interceptors

export interface ApiConfig {
  baseURL: string;
  headers: Record<string, string>;
  timeout?: number;
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
};

// Get current API configuration
export const getApiConfig = (): ApiConfig => {
  // In the future, you can add authentication tokens here
  const config = { ...defaultConfig };

  // Example: Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
};

// Helper function to build full URL
export const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const config = getApiConfig();
  const url = new URL(endpoint, window.location.origin + config.baseURL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  return url.pathname + url.search;
};

// Generic fetch wrapper with config
export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const config = getApiConfig();
  const url = endpoint.startsWith('http') ? endpoint : `${config.baseURL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
