import api from './api';

export const applicationService = {
  // Student actions
  applyToJob: async (jobId) => {
    return await api('/student/applications', {
      method: 'POST',
      body: { jobId },
    });
  },

  getMyApplications: async () => {
    return await api('/student/applications');
  },

  withdrawApplication: async (id) => {
    return await api(`/student/applications/${id}`, {
      method: 'DELETE',
    });
  },

  // Recruiter actions
  getCompanyApplications: async () => {
    return await api('/recruiter/applications');
  },

  getApplicationsByJob: async (jobId) => {
    return await api(`/recruiter/jobs/${jobId}/applications`);
  },

  updateStatus: async (applicationId, status, feedback) => {
    return await api(`/recruiter/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: { status, feedback },
    });
  }
};

export default applicationService;
