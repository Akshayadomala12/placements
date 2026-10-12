import React from 'react';

export const StatCard = ({ title, value, icon: Icon, change, subtitle, color = '#6366f1' }) => {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
      transition: 'var(--transition)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: `${color}18`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color}30`
        }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value}
        </div>
        {(change || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.8rem' }}>
            {change && (
              <span style={{
                color: change.startsWith('+') ? 'var(--success)' : 'var(--accent-primary)',
                fontWeight: 700,
                background: change.startsWith('+') ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {change}
              </span>
            )}
            {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        opacity: 0.7
      }} />
    </div>
  );
};

export default StatCard;
