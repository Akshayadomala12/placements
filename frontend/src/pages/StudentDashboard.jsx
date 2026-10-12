import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/adminService';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import adminService from '../services/adminService';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import AnnouncementCard from '../components/AnnouncementCard';
import Modal from '../components/Modal';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Award,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export const StudentDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileData, jobsData, appsData, noticesData] = await Promise.all([
        profileService.getStudentProfile().catch(() => null),
        jobService.getStudentJobs().catch(() => []),
        applicationService.getMyApplications().catch(() => []),
        adminService.getAnnouncements().catch(() => [])
      ]);
      setProfile(profileData && typeof profileData === 'object' ? profileData : null);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
      setAnnouncements(Array.isArray(noticesData) ? noticesData : []);
    } catch (err) {
      console.warn('Dashboard load error:', err);
      setJobs([]);
      setApplications([]);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    setApplyError('');
    setApplySuccess('');
    try {
      await applicationService.applyToJob(job.id);
      setApplySuccess(`Successfully applied to ${job.title} at ${job.companyName}!`);
      loadDashboardData();
    } catch (err) {
      setApplyError(err.message || 'Failed to apply');
    }
  };

  const safeApps = Array.isArray(applications) ? applications : [];
  const totalApplied = safeApps.length;
  const shortlistedCount = safeApps.filter(a => a.status === 'SHORTLISTED').length;
  const inRoundsCount = safeApps.filter(a => a.status === 'TECHNICAL_ROUND' || a.status === 'HR_ROUND').length;
  const offersCount = safeApps.filter(a => a.status === 'SELECTED').length;

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
            <Sparkles size={16} /> BATCH OF {profile?.batchYear || 2026} PLACEMENT SEASON
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
            Welcome back, {user?.name || 'Scholar'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Roll No: <strong>{profile?.rollNumber}</strong> • Dept: <strong>{profile?.department}</strong> • CGPA: <strong style={{ color: 'var(--success)' }}>{profile?.cgpa}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('jobs')} className="btn btn-primary">
            Explore Drives <ArrowRight size={16} />
          </button>
          <button onClick={() => setActiveTab('profile')} className="btn btn-secondary">
            Update Profile
          </button>
        </div>
      </div>

      {applySuccess && (
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
          <span>{applySuccess}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Applications Sent"
          value={totalApplied}
          icon={Briefcase}
          subtitle="Active submissions"
          color="#6366f1"
        />
        <StatCard
          title="Profiles Shortlisted"
          value={shortlistedCount}
          icon={FileCheck2}
          subtitle="Cleared resume screen"
          color="#a855f7"
        />
        <StatCard
          title="Active Interview Rounds"
          value={inRoundsCount}
          icon={Clock}
          subtitle="Technical & HR Rounds"
          color="#f59e0b"
        />
        <StatCard
          title="Offers Received"
          value={offersCount}
          icon={Award}
          subtitle="Congratulations!"
          color="#10b981"
        />
      </div>

      {/* Two Column Layout: Recommended Jobs & Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        {/* Left Column: Top Eligible Jobs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Top Eligible Job Drives</h2>
            <button
              onClick={() => setActiveTab('jobs')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
            >
              View All ({jobs.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {(Array.isArray(jobs) ? jobs : []).slice(0, 3).map(job => (
              <JobCard
                key={job.id}
                job={job}
                isStudent={true}
                onApply={handleApply}
                onViewDetails={(j) => setSelectedJob(j)}
              />
            ))}
            {(!jobs || jobs.length === 0) && (
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active placement drives found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Campus Announcements */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Campus Drive Notices</h2>
            <button
              onClick={() => setActiveTab('announcements')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
            >
              All Notices →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(Array.isArray(announcements) ? announcements : []).slice(0, 3).map(a => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isAdmin={false}
              />
            ))}
            {(!announcements || announcements.length === 0) && (
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No announcements at this time.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Overview'}
      >
        {selectedJob && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{selectedJob.companyName}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedJob.location} • {selectedJob.jobType}</p>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                {selectedJob.salaryPackage}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>
                ELIGIBILITY CRITERIA
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem' }}>
                <div>Minimum CGPA: <strong>{selectedJob.minCgpa}</strong></div>
                <div>Max Backlogs: <strong>{selectedJob.maxBacklogs}</strong></div>
                <div>Eligible Branches: <strong>{selectedJob.allowedDepartments}</strong></div>
                <div>Target Batch: <strong>{selectedJob.batchYear}</strong></div>
              </div>
            </div>

            <h5 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Job Description</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '24px' }}>
              {selectedJob.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedJob(null)} className="btn btn-secondary">
                Close
              </button>
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;
