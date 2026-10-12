import React from 'react';
import { Megaphone, Calendar, Tag, Trash2 } from 'lucide-react';

export const AnnouncementCard = ({ announcement, isAdmin, onDelete }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'DRIVE_ALERT':
        return { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.3)' };
      case 'SCHEDULE':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const colors = getCategoryColor(announcement.category);

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      borderLeft: `4px solid ${colors.text}`,
      transition: 'var(--transition)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {announcement.category ? announcement.category.replace('_', ' ') : 'GENERAL'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={13} />
            {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Today'}
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => onDelete(announcement.id)}
            className="btn btn-danger btn-sm"
            style={{ padding: '4px 8px' }}
            title="Delete Announcement"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {announcement.title}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
        {announcement.content}
      </p>

      {announcement.postedBy && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Posted by: <strong>{announcement.postedBy.name}</strong>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
