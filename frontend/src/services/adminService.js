import api from './api';

export const adminService = {
  getStats: async () => {
    return await api('/admin/stats');
  },

  getAllUsers: async () => {
    return await api('/admin/users');
  },

  toggleUserStatus: async (userId) => {
    return await api(`/admin/users/${userId}/toggle-status`, {
      method: 'PATCH',
    });
  },

  getAllStudents: async () => {
    return await api('/admin/students');
  },

  getAllCompanies: async () => {
    return await api('/admin/companies');
  },

  getAnnouncements: async () => {
    return await api('/announcements');
  },

  createAnnouncement: async (announcementData) => {
    return await api('/admin/announcements', {
      method: 'POST',
      body: announcementData,
    });
  },

  deleteAnnouncement: async (id) => {
    return await api(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  }
};

export const profileService = {
  getStudentProfile: async () => {
    return await api('/student/profile');
  },

  updateStudentProfile: async (profileData) => {
    return await api('/student/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  getRecruiterProfile: async () => {
    return await api('/recruiter/profile');
  },

  updateRecruiterProfile: async (profileData) => {
    return await api('/recruiter/profile', {
      method: 'PUT',
      body: profileData,
    });
  }
};

export default adminService;
