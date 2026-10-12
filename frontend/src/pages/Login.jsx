import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Student extra fields
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [batchYear, setBatchYear] = useState('2026');
  const [cgpa, setCgpa] = useState('8.50');

  // Recruiter extra fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology & Cloud');
  const [location, setLocation] = useState('Bengaluru');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({
          name,
          email,
          password,
          role,
          phone,
          rollNumber: role === 'STUDENT' ? rollNumber : undefined,
          department: role === 'STUDENT' ? department : undefined,
          batchYear: role === 'STUDENT' ? parseInt(batchYear) : undefined,
          cgpa: role === 'STUDENT' ? parseFloat(cgpa) : undefined,
          companyName: role === 'RECRUITER' ? companyName : undefined,
          industry: role === 'RECRUITER' ? industry : undefined,
          location: role === 'RECRUITER' ? location : undefined,
        });
      } else {
        await login(email, password);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '540px',
      margin: '40px auto',
      width: '100%',
    }} className="animate-fade-in">
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '14px',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} /> Campus Recruitment System
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            {isRegisterMode ? 'Create Your Account' : 'Welcome to PlacementPro'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '6px' }}>
            {isRegisterMode
              ? 'Join university placement drives as a student or recruiter'
              : 'Sign in to access job drives, applicant pools, and analytics'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        {!isRegisterMode && (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              ⚡ Quick Demo Sign In (1-Click)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('aarav.sharma@college.edu', 'Password@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', flexDirection: 'column', padding: '8px 4px', gap: '2px' }}
              >
                <strong>Student</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aarav (9.25 CGPA)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter@google.com', 'Password@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', flexDirection: 'column', padding: '8px 4px', gap: '2px' }}
              >
                <strong>Recruiter</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Google India</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@placement.edu', 'Password@123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', flexDirection: 'column', padding: '8px 4px', gap: '2px' }}
              >
                <strong>Admin</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dean Placement</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <>
              {/* Role Picker */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: role === 'STUDENT' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: role === 'STUDENT' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                    color: role === 'STUDENT' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <GraduationCap size={18} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('RECRUITER')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: role === 'RECRUITER' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: role === 'RECRUITER' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                    color: role === 'RECRUITER' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Building2 size={18} />
                  <span>Recruiter</span>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {role === 'STUDENT' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="21CS205"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      className="form-input"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch Year</label>
                    <input
                      type="number"
                      className="form-input"
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {role === 'RECRUITER' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Acme Technologies"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Software / Fintech"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Headquarters</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Bengaluru"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '12px', fontSize: '1rem' }}
          >
            {loading ? 'Processing...' : isRegisterMode ? 'Complete Registration' : 'Sign In to Portal'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegisterMode ? 'Sign In' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
