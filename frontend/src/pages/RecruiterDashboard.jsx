import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import { profileService } from '../services/adminService';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import {
  Briefcase,
  Users,
  UserCheck,
  Award,
  PlusCircle,
  Building2,
  ArrowRight
} from 'lucide-react';

export const RecruiterDashboard = ({ setActiveTab, onSelectJobToManage }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prof, jobList, appList] = await Promise.all([
        profileService.getRecruiterProfile().catch(() => null),
        jobService.getRecruiterJobs().catch(() => []),
        applicationService.getCompanyApplications().catch(() => [])
      ]);
      setProfile(prof);
      setJobs(jobList || []);
      setApplications(appList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND').length;
  const offersGiven = applications.filter(a => a.status === 'SELECTED').length;

  return (
    <div className="page-container animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
            <Building2 size={16} /> CORPORATE RECRUITER PORTAL
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
            {profile?.companyName || user?.name || 'Company Hub'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Industry: <strong>{profile?.industry || 'Technology'}</strong> • Location: <strong>{profile?.location || 'India'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('post-job')} className="btn btn-primary">
            <PlusCircle size={18} /> Post New Drive
          </button>
          <button onClick={() => setActiveTab('applicants')} className="btn btn-secondary">
            View Candidate Pipeline
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Active Drives"
          value={totalJobs}
          icon={Briefcase}
          subtitle="Roles open on campus"
          color="#6366f1"
        />
        <StatCard
          title="Total Applicants"
          value={totalApplicants}
          icon={Users}
          subtitle="Received across roles"
          color="#38bdf8"
        />
        <StatCard
          title="In Interview Stages"
          value={shortlisted}
          icon={UserCheck}
          subtitle="Shortlisted & Rounds"
          color="#f59e0b"
        />
        <StatCard
          title="Offers Released"
          value={offersGiven}
          icon={Award}
          subtitle="Selected candidates"
          color="#10b981"
        />
      </div>

      {/* Your Posted Drives */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.35rem' }}>Your Campus Openings</h2>
          <button
            onClick={() => setActiveTab('post-job')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            + Create New Opening
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isRecruiter={true}
              onViewDetails={() => {
                if (onSelectJobToManage) onSelectJobToManage(job);
                setActiveTab('applicants');
              }}
              onManage={() => {
                if (onSelectJobToManage) onSelectJobToManage(job);
                setActiveTab('applicants');
              }}
            />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Briefcase size={54} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Job Postings Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create your first campus recruitment drive to begin receiving student applications.
            </p>
            <button onClick={() => setActiveTab('post-job')} className="btn btn-primary">
              <PlusCircle size={18} /> Post a Job Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
