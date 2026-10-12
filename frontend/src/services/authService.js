import api from './api';

export const authService = {
  login: async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('placement_token', data.token);
      localStorage.setItem('placement_user', JSON.stringify(data));
    }
    return data;
  },

  register: async (registerData) => {
    const data = await api('/auth/register', {
      method: 'POST',
      body: registerData,
    });
    if (data.token) {
      localStorage.setItem('placement_token', data.token);
      localStorage.setItem('placement_user', JSON.stringify(data));
    }
    return data;
  },

  getCurrentUser: async () => {
    return await api('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('placement_token');
    localStorage.removeItem('placement_user');
  },

  getSavedUser: () => {
    const raw = localStorage.getItem('placement_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
};

export default authService;
