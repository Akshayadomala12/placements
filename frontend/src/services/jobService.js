import api from './api';

export const jobService = {
  // Public or student-customized jobs
  getAllJobs: async () => {
    return await api('/jobs');
  },

  getJobById: async (id) => {
    return await api(`/jobs/${id}`);
  },

  // Student specific jobs endpoint (with eligibility checks)
  getStudentJobs: async () => {
    return await api('/student/jobs');
  },

  // Recruiter specific jobs endpoints
  getRecruiterJobs: async () => {
    return await api('/recruiter/jobs');
  },

  createJob: async (jobData) => {
    return await api('/recruiter/jobs', {
      method: 'POST',
      body: jobData,
    });
  },

  updateJob: async (id, jobData) => {
    return await api(`/recruiter/jobs/${id}`, {
      method: 'PUT',
      body: jobData,
    });
  },

  toggleJobStatus: async (id, status) => {
    return await api(`/recruiter/jobs/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
    });
  }
};

export default jobService;
