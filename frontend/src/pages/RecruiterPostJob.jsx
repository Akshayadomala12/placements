import React, { useState } from 'react';
import jobService from '../services/jobService';
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  Calendar,
  Banknote,
  Send
} from 'lucide-react';

export const RecruiterPostJob = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [allowedDepartments, setAllowedDepartments] = useState('Computer Science,Information Technology,Electronics & Comm');
  const [batchYear, setBatchYear] = useState('2026');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        title,
        jobType,
        salaryPackage,
        location,
        minCgpa: parseFloat(minCgpa),
        maxBacklogs: parseInt(maxBacklogs),
        allowedDepartments,
        batchYear: parseInt(batchYear),
        deadline,
        description
      };

      await jobService.createJob(payload);
      setMessage({ text: 'Job drive successfully published to campus portal!', type: 'success' });
      setTimeout(() => {
        setActiveTab('jobs');
      }, 1500);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to create job posting', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Post New Campus Placement Drive</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Specify hiring parameters, eligibility cutoffs, and compensation for graduating batches.
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '14px 20px',
          background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: 'var(--radius-sm)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Role Specifications</h3>
          
          <div className="form-group">
            <label className="form-label">Position / Job Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Graduate Software Engineer (Backend)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Compensation / Package</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. 18.0 - 24.0 LPA"
                value={salaryPackage}
                onChange={(e) => setSalaryPackage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Location</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Bengaluru / Hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Student Eligibility Filters</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Minimum CGPA (out of 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                className="form-input"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Active Backlogs Allowed</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Batch Year</label>
              <input
                type="number"
                required
                className="form-input"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Eligible Departments (Comma separated or 'ALL')</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Computer Science,Information Technology,Electronics & Comm"
                value={allowedDepartments}
                onChange={(e) => setAllowedDepartments(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Detailed Job Description & Skills</h3>
          <div className="form-group">
            <label className="form-label">Role Overview, Responsibilities & Hiring Process</label>
            <textarea
              className="form-textarea"
              rows="6"
              required
              placeholder="Describe candidate responsibilities, tech stacks, selection rounds, and perks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <Send size={18} />
            <span>{loading ? 'Publishing Drive...' : 'Publish Drive to Students'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecruiterPostJob;
