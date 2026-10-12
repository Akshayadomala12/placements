import React from 'react';
import {
  Building2,
  MapPin,
  Banknote,
  GraduationCap,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock
} from 'lucide-react';

export const JobCard = ({ job, onApply, onViewDetails, isStudent, isRecruiter, onManage }) => {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '18px',
      transition: 'var(--transition)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-highlight)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.transform = 'none';
    }}
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {job.companyName ? job.companyName.charAt(0) : <Building2 size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.3 }}>
                {job.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span>{job.companyName}</span>
                {job.companyIndustry && <span>• {job.companyIndustry}</span>}
              </div>
            </div>
          </div>

          <span className="badge" style={{
            background: job.jobType === 'INTERNSHIP' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            color: job.jobType === 'INTERNSHIP' ? '#38bdf8' : '#818cf8',
            borderColor: job.jobType === 'INTERNSHIP' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(99, 102, 241, 0.3)'
          }}>
            {job.jobType ? job.jobType.replace('_', ' ') : 'FULL TIME'}
          </span>
        </div>

        {/* Badges / Metrics Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '14px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-secondary)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Banknote size={14} color="#10b981" />
            <strong style={{ color: '#10b981' }}>{job.salaryPackage}</strong>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-secondary)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-secondary)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <GraduationCap size={14} />
            <span>Min CGPA: <strong>{job.minCgpa || 'Any'}</strong></span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-secondary)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={14} />
            <span>Deadline: {job.deadline}</span>
          </div>
        </div>

        {/* Eligibility Indicator for Students */}
        {isStudent && (
          <div style={{ marginTop: '10px' }}>
            {job.hasApplied ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.825rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} />
                <span>Status: <strong>{job.applicationStatus || 'Applied'}</strong></span>
              </div>
            ) : job.isEligible ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--success-bg)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success)',
                fontSize: '0.825rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} />
                <span>You meet all eligibility criteria for this role</span>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)',
                fontSize: '0.825rem',
                fontWeight: 600
              }}>
                <AlertTriangle size={16} />
                <span>{job.eligibilityReason || 'Not eligible for this job'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        gap: '10px'
      }}>
        <button
          onClick={() => onViewDetails(job)}
          className="btn btn-secondary btn-sm"
        >
          View Details
        </button>

        {isStudent && (
          <button
            onClick={() => onApply(job)}
            disabled={job.hasApplied || !job.isEligible}
            className="btn btn-primary btn-sm"
          >
            {job.hasApplied ? 'Already Applied' : job.isEligible ? 'Apply Now' : 'Ineligible'}
          </button>
        )}

        {isRecruiter && (
          <button
            onClick={() => onManage(job)}
            className="btn btn-primary btn-sm"
          >
            Manage Applicants ({job.applicantCount || 0})
          </button>
        )}

        {!isStudent && !isRecruiter && (
          <button
            onClick={() => onViewDetails(job)}
            className="btn btn-primary btn-sm"
          >
            Explore Role <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
