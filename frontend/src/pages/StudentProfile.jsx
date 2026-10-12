import React, { useState, useEffect } from 'react';
import { profileService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import {
  User,
  GraduationCap,
  Briefcase,
  Link2,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';

export const StudentProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [batchYear, setBatchYear] = useState('2026');
  const [cgpa, setCgpa] = useState('8.50');
  const [activeBacklogs, setActiveBacklogs] = useState('0');
  const [historyBacklogs, setHistoryBacklogs] = useState('0');
  const [skills, setSkills] = useState('');
  const [resumeHeadline, setResumeHeadline] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getStudentProfile();
      if (data) {
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setRollNumber(data.rollNumber || '');
        setDepartment(data.department || 'Computer Science');
        setBatchYear(data.batchYear?.toString() || '2026');
        setCgpa(data.cgpa?.toString() || '8.00');
        setActiveBacklogs(data.activeBacklogs?.toString() || '0');
        setHistoryBacklogs(data.historyBacklogs?.toString() || '0');
        setSkills(data.skills || '');
        setResumeHeadline(data.resumeHeadline || '');
        setGithubUrl(data.githubUrl || '');
        setLinkedinUrl(data.linkedinUrl || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        name,
        phone,
        rollNumber,
        department,
        batchYear: parseInt(batchYear),
        cgpa: parseFloat(cgpa),
        activeBacklogs: parseInt(activeBacklogs),
        historyBacklogs: parseInt(historyBacklogs),
        skills,
        resumeHeadline,
        githubUrl,
        linkedinUrl
      };

      const updated = await profileService.updateStudentProfile(payload);
      setProfile(updated);
      updateUser({ name: updated.name, profileIdentifier: updated.rollNumber });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Student Profile & Resume Details</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Keep your academic record and contact info accurate so corporate recruiters can evaluate your eligibility accurately.
        </p>
      </div>

      {message.text && (
        <div style={{
          padding: '14px 20px',
          background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: 'var(--radius-sm)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        {/* Personal Details */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--accent-primary)" /> Basic Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Registered)</label>
              <input
                type="text"
                disabled
                className="form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                value={profile?.email || ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">University Roll Number</label>
              <input
                type="text"
                required
                className="form-input"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="var(--accent-primary)" /> Academic Record
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department / Major</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Graduating Batch Year</label>
              <input
                type="number"
                required
                className="form-input"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cumulative GPA (CGPA out of 10.0)</label>
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
              <label className="form-label">Active Backlogs (Current standing)</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={activeBacklogs}
                onChange={(e) => setActiveBacklogs(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Professional & Social Links */}
        <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--accent-primary)" /> Skills & Resume Headline
          </h3>
          <div className="form-group">
            <label className="form-label">Resume Headline / Summary</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Full-stack engineer specialized in Spring Boot, React, and cloud native architectures"
              value={resumeHeadline}
              onChange={(e) => setResumeHeadline(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Technical Skills (Comma separated)</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Java, Spring Boot, React, Docker, Kubernetes, SQL, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">GitHub Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
