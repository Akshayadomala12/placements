import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import StatCard from '../components/StatCard';
import AnnouncementCard from '../components/AnnouncementCard';
import Modal from '../components/Modal';
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Award,
  Megaphone,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('DRIVE_ALERT');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, noticesData] = await Promise.all([
        adminService.getStats(),
        adminService.getAnnouncements()
      ]);
      setStats(statsData);
      setAnnouncements(noticesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await adminService.createAnnouncement({
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory
      });
      setIsModalOpen(false);
      setNoticeTitle('');
      setNoticeContent('');
      setFeedback('Campus announcement successfully broadcasted!');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await adminService.deleteAnnouncement(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Title & Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Campus Placement Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Institution-wide recruitment performance, package benchmarks, and corporate partnership oversight.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={18} /> Broadcast Notice
          </button>
          <button onClick={() => setActiveTab('users')} className="btn btn-secondary">
            <ShieldCheck size={18} /> Manage Users
          </button>
        </div>
      </div>

      {feedback && (
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
          <span>{feedback}</span>
        </div>
      )}

      {/* Main KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          title="Placement Success Rate"
          value={`${stats?.placementPercentage || 0}%`}
          icon={TrendingUp}
          change="+8.4% vs last year"
          color="#10b981"
        />
        <StatCard
          title="Average CTC Package"
          value={stats?.averagePackage || '18.5 LPA'}
          icon={Award}
          subtitle="Top Tier Engineering"
          color="#6366f1"
        />
        <StatCard
          title="Highest CTC Package"
          value={stats?.highestPackage || '28.5 LPA'}
          icon={Award}
          subtitle="Offered by Google India"
          color="#ec4899"
        />
        <StatCard
          title="Students Registered"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          subtitle={`${stats?.placedStudents || 0} Offers Confirmed`}
          color="#38bdf8"
        />
        <StatCard
          title="Partner Companies"
          value={stats?.totalCompanies || 0}
          icon={Building2}
          subtitle={`${stats?.activeJobs || 0} Live Openings`}
          color="#a855f7"
        />
      </div>

      {/* Announcements and Quick Directory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        {/* Notices */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Megaphone size={20} color="var(--accent-primary)" /> Campus Placement Notices
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              + New Notice
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.map(a => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isAdmin={true}
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        </div>

        {/* Department Statistics Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '20px' }}>Batch 2026 Department Placement Health</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Computer Science & Engineering</span>
                <strong>92% Placed</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Information Technology</span>
                <strong>86% Placed</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '86%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Electronics & Communication</span>
                <strong>74% Placed</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #f59e0b)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                <span>Mechanical Engineering</span>
                <strong>65% Placed</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>H2 Database Console</span>
            <a
              href="http://localhost:8080/h2-console"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Open SQL Console
            </a>
          </div>
        </div>
      </div>

      {/* Broadcast Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Campus Placement Notice"
      >
        <form onSubmit={handleCreateNotice}>
          <div className="form-group">
            <label className="form-label">Notice Category</label>
            <select
              className="form-select"
              value={noticeCategory}
              onChange={(e) => setNoticeCategory(e.target.value)}
            >
              <option value="DRIVE_ALERT">Drive Alert / New Company</option>
              <option value="SCHEDULE">Interview Schedule / PPT</option>
              <option value="GENERAL">General Policy / Instruction</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title / Subject</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Google India PPT & Technical Assessment"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Content</label>
            <textarea
              className="form-textarea"
              rows="5"
              required
              placeholder="Write the detailed notice message to appear on all student dashboards..."
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Post Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
