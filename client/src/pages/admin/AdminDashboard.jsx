import { Link, useNavigate } from 'react-router-dom';

import Reveal from '../../components/motion/Reveal.jsx';
import Stagger from '../../components/motion/Stagger.jsx';
import { clearAuthToken } from '../../config.js';

const adminCards = [
  {
    title: 'Posts',
    description: 'Create, edit, and publish blog/news/event posts.',
    to: '/admin/posts',
  },
  {
    title: 'Projects',
    description: 'Manage campaigns and project highlights for the public site.',
    to: '/admin/projects',
  },
  {
    title: 'Settings',
    description: 'Update donation details, QR links, and external donate URL.',
    to: '/admin/settings',
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="page page-admin">
      <section className="section section--tight">
        <div className="container-wide admin-shell">
          <Reveal>
            <div className="admin-topbar">
              <div>
                <p className="kicker">Dashboard</p>
                <h1 className="headline-md">Admin control center</h1>
                <p className="muted-text">Manage website content and donation settings.</p>
              </div>
              <button type="button" className="pill-btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </Reveal>

          <Stagger className="content-grid content-grid--three admin-grid" delayChildren={0.04}>
            {adminCards.map((item) => (
              <article className="card" key={item.to}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Link className="pill-btn btn-primary" to={item.to}>Open</Link>
              </article>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
