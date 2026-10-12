const RAW_BASE = import.meta.env.VITE_API_URL || '';
const BASE_URL = RAW_BASE ? (RAW_BASE.endsWith('/') ? RAW_BASE.slice(0, -1) : RAW_BASE) + '/api' : '/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('placement_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // If token expired or invalid, clear token
    if (token && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('placement_token');
      localStorage.removeItem('placement_user');
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) || (data && data.message) || response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
};

export default api;
