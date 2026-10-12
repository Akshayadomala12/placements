import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  XCircle,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const ApplicationTable = ({
  applications,
  isRecruiter = false,
  onUpdateStatus,
  onWithdraw,
  loading = false
}) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [savingId, setSavingId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="badge badge-applied"><Clock size={12} /> Applied</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-shortlisted"><CheckCircle size={12} /> Shortlisted</span>;
      case 'TECHNICAL_ROUND':
        return <span className="badge badge-round"><AlertCircle size={12} /> Tech Round</span>;
      case 'HR_ROUND':
        return <span className="badge badge-round"><UserCheck size={12} /> HR Round</span>;
      case 'SELECTED':
        return <span className="badge badge-selected"><CheckCircle size={12} /> Selected / Offered</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-applied">{status}</span>;
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setFeedbackText(app.feedback || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedApp) return;
    setSavingId(selectedApp.id);
    try {
      await onUpdateStatus(selectedApp.id, newStatus, feedbackText);
      setSelectedApp(null);
    } finally {
      setSavingId(null);
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
        <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No Applications Found</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isRecruiter ? 'No candidates have applied to this posting yet.' : 'You have not submitted any job applications yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {isRecruiter ? (
              <>
                <th style={{ padding: '16px 20px' }}>Candidate Details</th>
                <th style={{ padding: '16px 20px' }}>Academics</th>
                <th style={{ padding: '16px 20px' }}>Applied Role</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px' }}>Feedback</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </>
            ) : (
              <>
                <th style={{ padding: '16px 20px' }}>Job & Company</th>
                <th style={{ padding: '16px 20px' }}>Type & Package</th>
                <th style={{ padding: '16px 20px' }}>Applied Date</th>
                <th style={{ padding: '16px 20px' }}>Current Status</th>
                <th style={{ padding: '16px 20px' }}>Notes / Feedback</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Action</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} style={{
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'var(--transition)'
            }}>
              {isRecruiter ? (
                <>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {app.student?.user?.name || 'Candidate'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {app.student?.rollNumber} • {app.student?.user?.email}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>{app.student?.department}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      CGPA: <strong style={{ color: 'var(--accent-primary)' }}>{app.student?.cgpa}</strong> • Backlogs: {app.student?.activeBacklogs || 0}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600 }}>{app.job?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.job?.salaryPackage}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: '220px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {app.feedback ? (
                      <span title={app.feedback}>{app.feedback}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None yet</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="btn btn-secondary btn-sm"
                    >
                      Update Status
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {app.job?.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {app.job?.company?.companyName} • {app.job?.location}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ color: '#10b981', fontWeight: 600 }}>{app.job?.salaryPackage}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.job?.jobType}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: '240px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {app.feedback || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending review</span>}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {app.status === 'APPLIED' && (
                      <button
                        onClick={() => onWithdraw(app.id)}
                        className="btn btn-danger btn-sm"
                        title="Withdraw your application"
                      >
                        Withdraw
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Recruiter Status Update Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
              Update Application Status
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Candidate: <strong>{selectedApp.student?.user?.name}</strong> ({selectedApp.student?.rollNumber}) for <strong>{selectedApp.job?.title}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">New Recruitment Stage</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted for Assessment</option>
                <option value="TECHNICAL_ROUND">Technical Interview</option>
                <option value="HR_ROUND">HR Interview</option>
                <option value="SELECTED">Selected / Job Offer Given</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Candidate Feedback / Interview Notes</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="e.g., Cleared DSA round with 90%. System design interview scheduled for Friday 3 PM."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={savingId === selectedApp.id}
                className="btn btn-primary"
              >
                {savingId === selectedApp.id ? 'Updating...' : 'Save & Notify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTable;
