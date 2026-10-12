import React, { useState, useEffect } from 'react';
import { profileService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Building2, Globe, MapPin, Mail, Phone, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const RecruiterCompanyProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getRecruiterProfile();
      if (data) {
        setProfile(data);
        setCompanyName(data.companyName || '');
        setIndustry(data.industry || '');
        setWebsite(data.website || '');
        setLocation(data.location || '');
        setDescription(data.description || '');
        setName(data.name || '');
        setPhone(data.phone || '');
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
        companyName,
        industry,
        website,
        location,
        description
      };

      const updated = await profileService.updateRecruiterProfile(payload);
      setProfile(updated);
      updateUser({ name: updated.name, profileIdentifier: updated.companyName });
      setMessage({ text: 'Company profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update company profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Company Information & HR Contact</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Information visible to students browsing your job drives.
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
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--accent-primary)" /> Corporate Profile
          </h3>

          <div className="form-group">
            <label className="form-label">Enterprise / Company Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Cloud & AI"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Offices / Locations</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bengaluru, Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Overview / Description</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* HR Lead Contact */}
        <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>University Relations / HR Contact Lead</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official Work Email</label>
              <input
                type="text"
                disabled
                className="form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                value={profile?.email || ''}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

export default RecruiterCompanyProfile;
