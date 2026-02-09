import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Reveal from '../../components/motion/Reveal.jsx';
import Stagger from '../../components/motion/Stagger.jsx';
import {
  apiRequest,
  clearAuthToken,
  getAuthHeaders,
  isUnauthorizedError,
} from '../../config.js';
import { toKebabCase } from '../../utils/slugify.js';

const statuses = ['ongoing', 'completed', 'upcoming'];

const initialForm = {
  title: '',
  slug: '',
  shortDescription: '',
  longDescription: '',
  status: 'ongoing',
};

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });

  const queryString = useMemo(() => {
    const query = new URLSearchParams();

    if (search.trim()) {
      query.set('search', search.trim());
    }

    if (statusFilter !== 'all') {
      query.set('status', statusFilter);
    }

    return query.toString();
  }, [search, statusFilter]);

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate('/admin/login', { replace: true, state: { reason: 'expired' } });
  };

  const loadProjects = async () => {
    try {
      const endpoint = queryString ? `/admin/projects?${queryString}` : '/admin/projects';
      const response = await apiRequest(endpoint, {
        headers: getAuthHeaders(),
      });

      setProjects(Array.isArray(response.data?.items) ? response.data.items : []);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to load projects.' });
    }
  };

  useEffect(() => {
    loadProjects();
  }, [queryString]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const resetForm = () => {
    setEditingId('');
    setFieldErrors({});
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setStatus({ type: '', text: '' });

    try {
      const resolvedSlug = form.slug.trim() || toKebabCase(form.title);
      const payload = {
        ...form,
        slug: resolvedSlug,
      };

      if (editingId) {
        await apiRequest(`/admin/projects/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        setStatus({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await apiRequest('/admin/projects', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        setStatus({ type: 'success', text: 'Project created successfully.' });
        resetForm();
      }

      loadProjects();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      if (error.details && typeof error.details === 'object') {
        setFieldErrors(error.details);
      }

      setStatus({ type: 'error', text: error.message || 'Unable to save project.' });
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFieldErrors({});
    setStatus({ type: '', text: '' });
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      shortDescription: project.shortDescription || '',
      longDescription: project.longDescription || '',
      status: project.status || 'ongoing',
    });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project permanently?')) {
      return;
    }

    try {
      await apiRequest(`/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (editingId === projectId) {
        resetForm();
      }

      setStatus({ type: 'success', text: 'Project deleted successfully.' });
      loadProjects();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to delete project.' });
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
                <h1 className="headline-md">Manage projects</h1>
                <p className="muted-text">Update campaign descriptions, status, and details.</p>
              </div>
              <nav className="admin-nav">
                <Link className="pill-btn btn-ghost" to="/admin">Dashboard</Link>
                <Link className="pill-btn btn-ghost" to="/admin/posts">Posts</Link>
                <Link className="pill-btn btn-ghost" to="/admin/settings">Settings</Link>
              </nav>
            </div>
          </Reveal>

          {status.text && (
            <p className={`status ${status.type === 'success' ? 'success' : 'error'}`}>{status.text}</p>
          )}

          <div className="content-grid content-grid--two admin-form-grid">
            <Reveal className="card">
              <h2>{editingId ? 'Edit project' : 'Create project'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="project-title">Title</label>
                  <input
                    id="project-title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Project title"
                    required
                  />
                  {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="project-slug">Slug</label>
                  <input
                    id="project-slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="Auto-generated if blank"
                  />
                  {fieldErrors.slug && <p className="field-error">{fieldErrors.slug}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="project-short">Short description</label>
                  <input
                    id="project-short"
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleFormChange}
                    placeholder="One-line summary"
                    required
                  />
                  {fieldErrors.shortDescription && <p className="field-error">{fieldErrors.shortDescription}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="project-long">Long description</label>
                  <textarea
                    id="project-long"
                    name="longDescription"
                    value={form.longDescription}
                    onChange={handleFormChange}
                    placeholder="Detailed information"
                  />
                  {fieldErrors.longDescription && <p className="field-error">{fieldErrors.longDescription}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="project-status">Status</label>
                  <select id="project-status" name="status" value={form.status} onChange={handleFormChange}>
                    {statuses.map((entry) => (
                      <option key={entry} value={entry}>{entry}</option>
                    ))}
                  </select>
                  {fieldErrors.status && <p className="field-error">{fieldErrors.status}</p>}
                </div>

                <div className="action-row">
                  <button type="submit" className="pill-btn btn-primary">
                    {editingId ? 'Update project' : 'Create project'}
                  </button>
                  {editingId && (
                    <button type="button" className="pill-btn btn-ghost" onClick={resetForm}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </Reveal>

            <Reveal className="card" delay={0.04}>
              <h2>Project list</h2>

              <div className="filter-row admin-filter-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title"
                />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  {statuses.map((entry) => (
                    <option key={entry} value={entry}>{entry}</option>
                  ))}
                </select>
              </div>

              <Stagger className="admin-list" delayChildren={0.03}>
                {projects.map((project) => (
                  <article className="admin-list__item" key={project._id}>
                    <div>
                      <h3>{project.title}</h3>
                      <p className="meta">{project.status}</p>
                      <p className="meta">/{project.slug}</p>
                    </div>
                    <div className="action-row">
                      <button type="button" className="pill-btn btn-ghost" onClick={() => handleEdit(project)}>
                        Edit
                      </button>
                      <button type="button" className="pill-btn btn-danger" onClick={() => handleDelete(project._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProjects;
