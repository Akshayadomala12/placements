import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentJobs from './pages/StudentJobs';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';

import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterPostJob from './pages/RecruiterPostJob';
import RecruiterApplicants from './pages/RecruiterApplicants';
import RecruiterCompanyProfile from './pages/RecruiterCompanyProfile';

import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AnnouncementsPage from './pages/AnnouncementsPage';

export function App() {
  const { user, role, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJobToManage, setSelectedJobToManage] = useState(null);

  // Synchronize default tab on auth state change
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('jobs');
    } else {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, role]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: 'var(--accent-primary)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading PlacementPro...</div>
        </div>
      </div>
    );
  }

  const renderActivePage = () => {
    // Unauthenticated user attempting to view login page or public pages
    if (activeTab === 'login') {
      return <Login onLoginSuccess={() => setActiveTab('dashboard')} />;
    }

    if (activeTab === 'announcements') {
      return <AnnouncementsPage />;
    }

    if (!isAuthenticated) {
      if (activeTab === 'jobs') return <StudentJobs />;
      return <Login onLoginSuccess={() => setActiveTab('dashboard')} />;
    }

    // Role: STUDENT
    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard setActiveTab={setActiveTab} />;
        case 'jobs':
          return <StudentJobs />;
        case 'applications':
          return <StudentApplications />;
        case 'profile':
          return <StudentProfile />;
        default:
          return <StudentDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Role: RECRUITER
    if (role === 'RECRUITER') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <RecruiterDashboard
              setActiveTab={setActiveTab}
              onSelectJobToManage={(job) => setSelectedJobToManage(job)}
            />
          );
        case 'post-job':
          return <RecruiterPostJob setActiveTab={setActiveTab} />;
        case 'jobs':
          return (
            <RecruiterDashboard
              setActiveTab={setActiveTab}
              onSelectJobToManage={(job) => setSelectedJobToManage(job)}
            />
          );
        case 'applicants':
          return <RecruiterApplicants selectedJobFilter={selectedJobToManage} />;
        case 'profile':
          return <RecruiterCompanyProfile />;
        default:
          return <RecruiterDashboard setActiveTab={setActiveTab} />;
      }
    }

    // Role: ADMIN
    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard setActiveTab={setActiveTab} />;
        case 'users':
        case 'students':
        case 'recruiters':
          return <AdminUserManagement />;
        default:
          return <AdminDashboard setActiveTab={setActiveTab} />;
      }
    }

    return <StudentJobs />;
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {renderActivePage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
