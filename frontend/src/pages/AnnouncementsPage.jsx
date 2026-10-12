import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import AnnouncementCard from '../components/AnnouncementCard';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Search } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await adminService.deleteAnnouncement(id);
      loadAnnouncements();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filtered = announcements.filter(a => {
    if (filter === 'ALL') return true;
    return a.category === filter;
  });

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Official Campus Placement Notices</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Stay informed on pre-placement talks (PPT), assessment schedules, company arrival notices, and institutional policies.
        </p>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['ALL', 'DRIVE_ALERT', 'SCHEDULE', 'GENERAL'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
          >
            {cat === 'ALL' ? 'All Notices' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(a => (
          <AnnouncementCard
            key={a.id}
            announcement={a}
            isAdmin={isAdmin}
            onDelete={handleDelete}
          />
        ))}

        {filtered.length === 0 && (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Megaphone size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p>No notices matching selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
