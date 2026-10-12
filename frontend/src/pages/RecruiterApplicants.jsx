import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import jobService from '../services/jobService';
import ApplicationTable from '../components/ApplicationTable';
import StatCard from '../components/StatCard';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  FileCheck2,
  Clock,
  Award
} from 'lucide-react';

export const RecruiterApplicants = ({ selectedJobFilter }) => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(selectedJobFilter ? selectedJobFilter.id.toString() : 'ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, jobList] = await Promise.all([
        applicationService.getCompanyApplications(),
        jobService.getRecruiterJobs()
      ]);
      setApplications(apps || []);
      setJobs(jobList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus, feedback) => {
    try {
      await applicationService.updateStatus(appId, newStatus, feedback);
      setNotice(`Applicant status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesJob = selectedJobId === 'ALL' || app.job?.id?.toString() === selectedJobId;
    const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;
    const matchesSearch = !searchTerm ||
      app.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student?.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJob && matchesStage && matchesSearch;
  });

  const total = filteredApps.length;
  const applied = filteredApps.filter(a => a.status === 'APPLIED').length;
  const inRounds = filteredApps.filter(a => a.status === 'SHORTLISTED' || a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND').length;
  const selected = filteredApps.filter(a => a.status === 'SELECTED').length;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Candidate Evaluation Pipeline</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review candidate profiles, shortlist resumes, and advance candidates through interview rounds.
        </p>
      </div>

      {notice && (
        <div style={{
          padding: '14px 20px',
          background: 'var(--success-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--success)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* Funnel Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <StatCard
          title="Total Candidates"
          value={total}
          icon={Users}
          color="#6366f1"
        />
        <StatCard
          title="New Applied"
          value={applied}
          icon={Clock}
          color="#38bdf8"
        />
        <StatCard
          title="In Interview Stages"
          value={inRounds}
          icon={FileCheck2}
          color="#f59e0b"
        />
        <StatCard
          title="Offers Made"
          value={selected}
          icon={Award}
          color="#10b981"
        />
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-input"
            style={{ border: 'none', background: 'transparent', padding: '6px' }}
            placeholder="Search by student name, roll no, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="ALL">All Job Drives</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id.toString()}>{j.title}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="ALL">All Recruitment Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="TECHNICAL_ROUND">Technical Interview</option>
            <option value="HR_ROUND">HR Interview</option>
            <option value="SELECTED">Selected / Offered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <ApplicationTable
        applications={filteredApps}
        isRecruiter={true}
        onUpdateStatus={handleUpdateStatus}
        loading={loading}
      />
    </div>
  );
};

export default RecruiterApplicants;
