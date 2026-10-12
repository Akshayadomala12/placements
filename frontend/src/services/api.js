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

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error(`Unable to reach backend server at ${BASE_URL || window.location.origin}. Please ensure the backend is running or set VITE_API_URL.`);
  }

  if (response.status === 401) {
    // If token expired or invalid, clear token
    if (token && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('placement_token');
      localStorage.removeItem('placement_user');
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error(`Backend API not reachable (Received HTML page from ${BASE_URL || window.location.origin}). Please connect a live Spring Boot backend or configure VITE_API_URL.`);
    }
    data = text;
  }

  if (!response.ok) {
    let errorMsg = null;
    if (data && typeof data === 'object') {
      if (data.error) errorMsg = data.error;
      else if (data.message) errorMsg = data.message;
      else if (Array.isArray(data.errors) && data.errors.length > 0) {
        errorMsg = data.errors.map(e => e.defaultMessage || e.message || JSON.stringify(e)).join(', ');
      }
    } else if (typeof data === 'string' && data.trim()) {
      errorMsg = data;
    }

    if (!errorMsg) {
      if (response.status === 405 || response.status === 404) {
        errorMsg = `Backend endpoint not found (${response.status} on ${BASE_URL || window.location.origin}). Please verify the backend is deployed on Render and VITE_API_URL is configured.`;
      } else {
        errorMsg = response.statusText || `Request failed with status ${response.status}`;
      }
    }
    throw new Error(errorMsg);
  }

  return data;
};

export default api;
