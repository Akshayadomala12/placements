import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import ApplicationTable from '../components/ApplicationTable';
import StatCard from '../components/StatCard';
import { FileCheck, Clock, Award, XCircle, CheckCircle2 } from 'lucide-react';

export const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationService.withdrawApplication(applicationId);
      setNotice('Application successfully withdrawn');
      loadApplications();
    } catch (err) {
      alert(err.message || 'Withdrawal failed');
    }
  };

  const appliedCount = applications.filter(a => a.status === 'APPLIED').length;
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND').length;
  const selectedCount = applications.filter(a => a.status === 'SELECTED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Applications Pipeline</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor your recruitment journey, stage updates, and interviewer feedback in real time.
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
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Under Review"
          value={appliedCount}
          icon={Clock}
          color="#38bdf8"
        />
        <StatCard
          title="In Progress / Rounds"
          value={shortlistedCount}
          icon={FileCheck}
          color="#a855f7"
        />
        <StatCard
          title="Job Offers Received"
          value={selectedCount}
          icon={Award}
          color="#10b981"
        />
        <StatCard
          title="Not Progressed"
          value={rejectedCount}
          icon={XCircle}
          color="#ef4444"
        />
      </div>

      {/* Applications Table */}
      <ApplicationTable
        applications={applications}
        isRecruiter={false}
        onWithdraw={handleWithdraw}
        loading={loading}
      />
    </div>
  );
};

export default StudentApplications;
