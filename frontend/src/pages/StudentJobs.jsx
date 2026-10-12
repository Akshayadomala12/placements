import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const StudentJobs = () => {
  const { isAuthenticated, role } = useAuth();
  const isStudent = isAuthenticated && role === 'STUDENT';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    loadJobs();
  }, [isStudent]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = isStudent ? await jobService.getStudentJobs() : await jobService.getAllJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await applicationService.applyToJob(job.id);
      setFeedbackMsg({ text: `Successfully applied to ${job.title} at ${job.companyName}!`, type: 'success' });
      loadJobs();
    } catch (err) {
      setFeedbackMsg({ text: err.message || 'Application submission failed', type: 'error' });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          job.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'ALL' || job.jobType === selectedType;
    const matchesEligible = !onlyEligible || (isStudent && job.isEligible);
    return matchesSearch && matchesType && matchesEligible;
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Active Placement Drives</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse open campus roles, filter by qualification, and apply directly.
        </p>
      </div>

      {feedbackMsg.text && (
        <div style={{
          padding: '14px 20px',
          background: feedbackMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `1px solid ${feedbackMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: 'var(--radius-sm)',
          color: feedbackMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {feedbackMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{
        padding: '18px 24px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between'
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-input"
            style={{ border: 'none', background: 'transparent', padding: '6px' }}
            placeholder="Search by job title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 14px' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Employment Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>

          {isStudent && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
              />
              <span>Eligible for me only</span>
            </label>
          )}
        </div>
      </div>

      {/* Job Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            isStudent={isStudent}
            onApply={handleApply}
            onViewDetails={(j) => setSelectedJob(j)}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <Briefcase size={54} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Matching Roles Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try tweaking your search terms or clearing the eligibility filters.
          </p>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Details'}
      >
        {selectedJob && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedJob.companyName}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedJob.location} • {selectedJob.jobType}</p>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                {selectedJob.salaryPackage}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Criteria & Eligibility
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem' }}>
                <div>Min CGPA: <strong>{selectedJob.minCgpa}</strong></div>
                <div>Max Backlogs: <strong>{selectedJob.maxBacklogs}</strong></div>
                <div>Branches: <strong>{selectedJob.allowedDepartments}</strong></div>
                <div>Batch: <strong>{selectedJob.batchYear}</strong></div>
              </div>
            </div>

            <h5 style={{ fontSize: '1rem', marginBottom: '8px' }}>Description</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '24px' }}>
              {selectedJob.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedJob(null)} className="btn btn-secondary">
                Close
              </button>
              {isStudent && (
                <button
                  onClick={() => {
                    handleApply(selectedJob);
                    setSelectedJob(null);
                  }}
                  disabled={selectedJob.hasApplied || !selectedJob.isEligible}
                  className="btn btn-primary"
                >
                  {selectedJob.hasApplied ? 'Already Applied' : selectedJob.isEligible ? 'Submit Application' : 'Ineligible'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentJobs;
