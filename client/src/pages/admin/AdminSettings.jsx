import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Reveal from '../../components/motion/Reveal.jsx';
import {
  apiRequest,
  clearAuthToken,
  getAuthHeaders,
  isUnauthorizedError,
} from '../../config.js';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    donationBankDetails: '',
    donationQrImageUrls: '',
    externalDonateUrl: '',
  });
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate('/admin/login', { replace: true, state: { reason: 'expired' } });
  };

  const loadSettings = async () => {
    try {
      const response = await apiRequest('/admin/settings', {
        headers: getAuthHeaders(),
      });

      setForm({
        donationBankDetails: response.data?.donationBankDetails || '',
        donationQrImageUrls: (response.data?.donationQrImageUrls || []).join('\n'),
        externalDonateUrl: response.data?.externalDonateUrl || '',
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to load settings.' });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });

    try {
      const payload = {
        donationBankDetails: form.donationBankDetails,
        donationQrImageUrls: form.donationQrImageUrls
          .split('\n')
          .map((entry) => entry.trim())
          .filter(Boolean),
        externalDonateUrl: form.externalDonateUrl,
      };

      await apiRequest('/admin/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      setStatus({ type: 'success', text: 'Settings saved.' });
      loadSettings();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to save settings.' });
    }
  };

  return (
    <div className="page page-admin">
      <section className="section section--tight">
        <div className="container-wide admin-shell">
          <Reveal>
            <div className="admin-topbar">
              <div>
                <p className="kicker">Admin</p>
                <h1 className="headline-md">Donation settings</h1>
                <p className="muted-text">Update bank details, QR links, and external donation URL.</p>
              </div>
              <nav className="admin-nav">
                <Link className="pill-btn btn-ghost" to="/admin">Dashboard</Link>
                <Link className="pill-btn btn-ghost" to="/admin/posts">Posts</Link>
                <Link className="pill-btn btn-ghost" to="/admin/projects">Projects</Link>
              </nav>
            </div>
          </Reveal>

          {status.text && (
            <p className={`status ${status.type === 'success' ? 'success' : 'error'}`}>{status.text}</p>
          )}

          <Reveal className="card" delay={0.04}>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="bank-details">Bank details</label>
                <textarea
                  id="bank-details"
                  name="donationBankDetails"
                  value={form.donationBankDetails}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="qr-urls">QR image URLs (one URL per line)</label>
                <textarea
                  id="qr-urls"
                  name="donationQrImageUrls"
                  value={form.donationQrImageUrls}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="external-url">External donate URL</label>
                <input
                  id="external-url"
                  name="externalDonateUrl"
                  value={form.externalDonateUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <button type="submit" className="pill-btn btn-primary">Save settings</button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
