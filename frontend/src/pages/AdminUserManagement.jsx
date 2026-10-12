import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import {
  Users,
  Building2,
  GraduationCap,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

export const AdminUserManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('ALL_USERS'); // ALL_USERS, STUDENTS, COMPANIES
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, studentsData, companiesData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllStudents(),
        adminService.getAllCompanies()
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (err) {
      console.warn('AdminUserManagement load error:', err);
      setUsers([]);
      setStudents([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      setActionNotice('Account status successfully updated');
      loadData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>User & Corporate Governance</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage system access, approve corporate recruiter credentials, and verify student registrations.
        </p>
      </div>

      {actionNotice && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--success-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--success)',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {actionNotice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveSubTab('ALL_USERS')}
          className={`btn ${activeSubTab === 'ALL_USERS' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} /> All Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveSubTab('STUDENTS')}
          className={`btn ${activeSubTab === 'STUDENTS' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <GraduationCap size={16} /> Students Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('COMPANIES')}
          className={`btn ${activeSubTab === 'COMPANIES' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={16} /> Companies Directory ({companies.length})
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="form-input"
          style={{ border: 'none', background: 'transparent', padding: '6px' }}
          placeholder="Search by name, email, roll number, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table based on active tab */}
      {activeSubTab === 'ALL_USERS' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Account Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(users) ? users : [])
                .filter(u => (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()))
                .map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge" style={{
                        background: user.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.15)' : user.role === 'RECRUITER' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: user.role === 'ADMIN' ? '#ec4899' : user.role === 'RECRUITER' ? '#38bdf8' : '#818cf8'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge" style={{
                        background: user.status === 'ACTIVE' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: user.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'STUDENTS' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Roll No</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Batch</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>CGPA</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Backlogs</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(students) ? students : [])
                .filter(s => (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.rollNumber || '').toLowerCase().includes(search.toLowerCase()))
                .map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                      <div>{student.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{student.email}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: 600 }}>{student.rollNumber}</td>
                    <td style={{ padding: '16px 20px' }}>{student.department}</td>
                    <td style={{ padding: '16px 20px' }}>{student.batchYear}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--success)' }}>{student.cgpa}</td>
                    <td style={{ padding: '16px 20px' }}>{student.activeBacklogs || 0}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'COMPANIES' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Industry</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Recruiter Contact</th>
                <th style={{ padding: '16px 20px', textAlign: 'left' }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(companies) ? companies : [])
                .filter(c => (c.companyName || '').toLowerCase().includes(search.toLowerCase()) || (c.industry || '').toLowerCase().includes(search.toLowerCase()))
                .map(comp => (
                  <tr key={comp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {comp.companyName}
                    </td>
                    <td style={{ padding: '16px 20px' }}>{comp.industry}</td>
                    <td style={{ padding: '16px 20px' }}>{comp.location}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div>{comp.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{comp.email}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                        Verified Partner
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
