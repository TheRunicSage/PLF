import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Reveal from '../../components/motion/Reveal.jsx';
import { TOKEN_KEY, apiRequest, hasValidAuthToken } from '../../config.js';
import { siteCopy } from '../../content/siteCopy.js';

const getInitialMessage = (reason) => {
  if (reason === 'expired') {
    return 'Your session expired. Please log in again.';
  }

  if (reason === 'missing') {
    return 'Please log in to access admin pages.';
  }

  return '';
};

const AdminLogin = () => {
  const loginCopy = siteCopy.admin.login;
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(getInitialMessage(location.state?.reason));

  useEffect(() => {
    if (hasValidAuthToken()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      localStorage.setItem(TOKEN_KEY, response.data.token);
      const nextPath = location.state?.from?.pathname || '/admin';
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Unable to login.');
    }
  };

  return (
    <div className="page page-admin auth-page">
      <section className="section section--tight">
        <div className="container">
          <Reveal className="card auth-card">
            <p className="kicker">Admin</p>
            <h1 className="headline-md">{loginCopy.title}</h1>
            <p className="muted-text">{loginCopy.description}</p>

            {error && <p className="status error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Admin email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="pill-btn btn-primary">{loginCopy.loginButtonLabel}</button>
            </form>

            <Link className="pill-btn btn-ghost" to="/">{loginCopy.backToSiteLabel}</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
