import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  User,
  Megaphone,
  PlusCircle,
  Users,
  Building2,
  ShieldCheck,
  LogIn
} from 'lucide-react';

export const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  const { role, isAuthenticated } = useAuth();

  const getMenuItems = () => {
    if (!isAuthenticated) {
      return [
        { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'login', label: 'Sign In / Register', icon: LogIn },
      ];
    }

    if (role === 'STUDENT') {
      return [
        { id: 'dashboard', label: 'Student Hub', icon: LayoutDashboard },
        { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
        { id: 'applications', label: 'My Applications', icon: FileCheck2 },
        { id: 'profile', label: 'Profile & Resume', icon: User },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
      ];
    }

    if (role === 'RECRUITER') {
      return [
        { id: 'dashboard', label: 'Recruiter Hub', icon: LayoutDashboard },
        { id: 'post-job', label: 'Post New Job', icon: PlusCircle },
        { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
        { id: 'applicants', label: 'Candidate Pipeline', icon: Users },
        { id: 'profile', label: 'Company Profile', icon: Building2 },
        { id: 'announcements', label: 'Campus Drives', icon: Megaphone },
      ];
    }

    if (role === 'ADMIN') {
      return [
        { id: 'dashboard', label: 'Placement Analytics', icon: LayoutDashboard },
        { id: 'users', label: 'User Governance', icon: ShieldCheck },
        { id: 'students', label: 'Students Directory', icon: Users },
        { id: 'recruiters', label: 'Companies Directory', icon: Building2 },
        { id: 'announcements', label: 'Manage Notices', icon: Megaphone },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside style={{
      width: isOpen ? '260px' : '0px',
      minWidth: isOpen ? '260px' : '0px',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      background: 'var(--bg-glass)',
      borderRight: isOpen ? '1px solid var(--border-subtle)' : 'none',
      backdropFilter: 'var(--backdrop-blur)',
      height: 'calc(100vh - 69px)',
      position: 'sticky',
      top: '69px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 30,
    }}>
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '6px', width: '260px' }}>
        <div style={{
          fontSize: '0.725rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 12px 10px 12px',
        }}>
          Navigation
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.925rem',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 'auto',
        padding: '20px 20px',
        borderTop: '1px solid var(--border-subtle)',
        width: '260px'
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            🎓 Placement Cell
          </div>
          <div>Batch 2026 Campus Drive Ongoing</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
