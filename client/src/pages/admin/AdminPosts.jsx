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
import { filesToOptimizedDataUrls } from '../../utils/imageFiles.js';
import { mergeImageUrls, parseImageLines } from '../../utils/media.js';
import { toKebabCase } from '../../utils/slugify.js';

const postTypes = ['news', 'story', 'blog', 'press', 'event'];

const initialForm = {
  title: '',
  slug: '',
  type: 'news',
  excerpt: '',
  featuredImageUrl: '',
  imageUrlsText: '',
  videoUrl: '',
  content: '',
  published: false,
};

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const queryString = useMemo(() => {
    const query = new URLSearchParams({ page: '1', limit: '200' });

    if (search.trim()) {
      query.set('search', search.trim());
    }

    if (filterType !== 'all') {
      query.set('type', filterType);
    }

    return query.toString();
  }, [search, filterType]);

  const galleryImages = useMemo(() => {
    return mergeImageUrls(form.featuredImageUrl, parseImageLines(form.imageUrlsText));
  }, [form.featuredImageUrl, form.imageUrlsText]);

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate('/admin/login', { replace: true, state: { reason: 'expired' } });
  };

  const loadPosts = async () => {
    try {
      const response = await apiRequest(`/admin/posts?${queryString}`, {
        headers: getAuthHeaders(),
      });

      setPosts(Array.isArray(response.data?.items) ? response.data.items : []);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to load posts.' });
    }
  };

  useEffect(() => {
    loadPosts();
  }, [queryString]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setFieldErrors({});
    setEditingId('');
  };

  const handlePostImageUpload = async (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    setStatus({ type: '', text: '' });

    try {
      const existing = parseImageLines(form.imageUrlsText);
      const remainingSlots = Math.max(0, 12 - existing.length);

      if (remainingSlots === 0) {
        setStatus({ type: 'error', text: 'You can add up to 12 gallery images per post.' });
        return;
      }

      const uploaded = await filesToOptimizedDataUrls(files, { maxFiles: remainingSlots });
      const merged = mergeImageUrls(existing, uploaded).slice(0, 12);

      setForm((prev) => ({
        ...prev,
        imageUrlsText: merged.join('\n'),
        featuredImageUrl: prev.featuredImageUrl.trim() || merged[0] || '',
      }));
      setFieldErrors((prev) => ({ ...prev, imageUrls: '', featuredImageUrl: '' }));
      setStatus({ type: 'success', text: `${uploaded.length} image(s) added.` });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Unable to upload selected images.' });
    } finally {
      setIsUploadingImages(false);
      event.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    const gallery = parseImageLines(form.imageUrlsText).filter((entry) => entry !== imageUrl);

    setForm((prev) => {
      const nextFeatured = prev.featuredImageUrl.trim() === imageUrl
        ? gallery[0] || ''
        : prev.featuredImageUrl;

      return {
        ...prev,
        featuredImageUrl: nextFeatured,
        imageUrlsText: gallery.join('\n'),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setStatus({ type: '', text: '' });

    try {
      const imageUrls = parseImageLines(form.imageUrlsText);
      const resolvedSlug = form.slug.trim() || toKebabCase(form.title);
      const resolvedFeaturedImage = form.featuredImageUrl.trim() || imageUrls[0] || '';

      const payload = {
        title: form.title,
        slug: resolvedSlug,
        type: form.type,
        excerpt: form.excerpt,
        featuredImageUrl: resolvedFeaturedImage,
        imageUrls,
        videoUrl: form.videoUrl,
        content: form.content,
        published: form.published,
      };

      if (editingId) {
        await apiRequest(`/admin/posts/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        setStatus({ type: 'success', text: 'Post updated successfully.' });
      } else {
        await apiRequest('/admin/posts', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        setStatus({ type: 'success', text: 'Post created successfully.' });
        resetForm();
      }

      loadPosts();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      if (error.details && typeof error.details === 'object') {
        setFieldErrors(error.details);
      }

      setStatus({ type: 'error', text: error.message || 'Unable to save post.' });
    }
  };

  const handleEdit = (post) => {
    const resolvedType = postTypes.includes(post.type) ? post.type : 'news';

    setEditingId(post._id);
    setFieldErrors({});
    setStatus({ type: '', text: '' });
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      type: resolvedType,
      excerpt: post.excerpt || '',
      featuredImageUrl: post.featuredImageUrl || '',
      imageUrlsText: Array.isArray(post.imageUrls) ? post.imageUrls.join('\n') : '',
      videoUrl: post.videoUrl || '',
      content: post.content || '',
      published: Boolean(post.published),
    });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) {
      return;
    }

    try {
      await apiRequest(`/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (editingId === postId) {
        resetForm();
      }

      setStatus({ type: 'success', text: 'Post deleted successfully.' });
      loadPosts();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setStatus({ type: 'error', text: error.message || 'Unable to delete post.' });
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
                <h1 className="headline-md">Manage posts</h1>
                <p className="muted-text">Create and curate updates with video links and image galleries.</p>
              </div>
              <nav className="admin-nav">
                <Link className="pill-btn btn-ghost" to="/admin">Dashboard</Link>
                <Link className="pill-btn btn-ghost" to="/admin/projects">Projects</Link>
                <Link className="pill-btn btn-ghost" to="/admin/settings">Settings</Link>
              </nav>
            </div>
          </Reveal>

          {status.text && (
            <p className={`status ${status.type === 'success' ? 'success' : 'error'}`}>{status.text}</p>
          )}

          <div className="content-grid content-grid--two admin-form-grid">
            <Reveal className="card">
              <h2>{editingId ? 'Edit post' : 'Create post'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="post-title">Title</label>
                  <input
                    id="post-title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Post title"
                    required
                  />
                  {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-slug">Slug</label>
                  <input
                    id="post-slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="Auto-generated if blank"
                  />
                  {fieldErrors.slug && <p className="field-error">{fieldErrors.slug}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-type">Type</label>
                  <select id="post-type" name="type" value={form.type} onChange={handleFormChange}>
                    {postTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {fieldErrors.type && <p className="field-error">{fieldErrors.type}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-excerpt">Excerpt</label>
                  <textarea
                    id="post-excerpt"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleFormChange}
                    placeholder="Short excerpt"
                  />
                  {fieldErrors.excerpt && <p className="field-error">{fieldErrors.excerpt}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-featured-image">Primary image URL (optional)</label>
                  <input
                    id="post-featured-image"
                    name="featuredImageUrl"
                    value={form.featuredImageUrl}
                    onChange={handleFormChange}
                    placeholder="https://... (auto-filled from first gallery image if empty)"
                  />
                  {fieldErrors.featuredImageUrl && <p className="field-error">{fieldErrors.featuredImageUrl}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-images-upload">Upload post photos</label>
                  <input
                    id="post-images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePostImageUpload}
                    disabled={isUploadingImages}
                  />
                  <p className="meta">Images are optimized before save. Max 12 images per post.</p>
                </div>

                <div className="form-field">
                  <label htmlFor="post-gallery-urls">Gallery image URLs (one per line)</label>
                  <textarea
                    id="post-gallery-urls"
                    name="imageUrlsText"
                    value={form.imageUrlsText}
                    onChange={handleFormChange}
                    placeholder={'https://.../image-1.jpg\nhttps://.../image-2.jpg'}
                  />
                  {fieldErrors.imageUrls && <p className="field-error">{fieldErrors.imageUrls}</p>}
                </div>

                {galleryImages.length > 0 && (
                  <div className="admin-image-preview-grid">
                    {galleryImages.map((imageUrl, index) => (
                      <article key={`${imageUrl}-${index}`} className="admin-image-preview">
                        <img src={imageUrl} alt={`Post gallery ${index + 1}`} loading="lazy" />
                        <div className="admin-image-preview__meta">
                          {index === 0 ? <span className="meta">Primary</span> : <span className="meta">Gallery</span>}
                          <button
                            type="button"
                            className="pill-btn btn-danger"
                            onClick={() => handleRemoveGalleryImage(imageUrl)}
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="post-video-url">Video URL (optional)</label>
                  <input
                    id="post-video-url"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleFormChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {fieldErrors.videoUrl && <p className="field-error">{fieldErrors.videoUrl}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="post-content">Content</label>
                  <textarea
                    id="post-content"
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    placeholder="Post content"
                    required
                  />
                  {fieldErrors.content && <p className="field-error">{fieldErrors.content}</p>}
                </div>

                <label className="check-field">
                  <input
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleFormChange}
                  />
                  Published
                </label>
                {fieldErrors.published && <p className="field-error">{fieldErrors.published}</p>}

                <div className="action-row">
                  <button type="submit" className="pill-btn btn-primary" disabled={isUploadingImages}>
                    {editingId ? 'Update post' : 'Create post'}
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
              <h2>Post list</h2>

              <div className="filter-row admin-filter-row">
                <input
                  placeholder="Search title or excerpt"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
                  <option value="all">All types</option>
                  {postTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {posts.length === 0 && <p className="muted-text">No posts found for this filter.</p>}

              <Stagger className="admin-list" delayChildren={0.03}>
                {posts.map((post) => (
                  <article className="admin-list__item" key={post._id}>
                    <div>
                      <h3>{post.title}</h3>
                      <p className="meta">{post.type} | {post.published ? 'Published' : 'Draft'}</p>
                      <p className="meta">/{post.slug}</p>
                      {Array.isArray(post.imageUrls) && post.imageUrls.length > 0 && (
                        <p className="meta">{post.imageUrls.length} gallery image(s)</p>
                      )}
                    </div>
                    <div className="action-row">
                      <button type="button" className="pill-btn btn-ghost" onClick={() => handleEdit(post)}>
                        Edit
                      </button>
                      <button type="button" className="pill-btn btn-danger" onClick={() => handleDelete(post._id)}>
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

export default AdminPosts;
