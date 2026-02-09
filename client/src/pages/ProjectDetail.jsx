import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Reveal from '../components/motion/Reveal.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';

const formatDate = (value) => {
  if (!value) {
    return 'TBA';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'TBA';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ProjectDetail = () => {
  const copy = siteCopy.projectDetail;
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(`/projects/${slug}`);

        if (!mounted) {
          return;
        }

        setProject(response.data || null);
      } catch (_loadError) {
        if (!mounted) {
          return;
        }

        setProject(null);
        setError(copy.loadError);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      mounted = false;
    };
  }, [copy.loadError, slug]);

  return (
    <div className="page page-premium">
      <section className="section section--tight">
        <div className="container-wide">
          <Reveal>
            <Link className="pill-btn btn-ghost" to="/projects">{copy.backLabel}</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {loading && <p className="muted-text">{copy.loading}</p>}
          {!loading && error && <p className="status error">{error}</p>}

          {!loading && !error && project && (
            <Reveal className="detail-layout">
              <article className="card detail-card">
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.title} loading="lazy" />
                ) : (
                  <div className="media-placeholder media-placeholder--blue" aria-hidden="true" />
                )}

                <div className="detail-card__body">
                  <p className="kicker">{project.status}</p>
                  <h1 className="headline-md">{project.title}</h1>
                  <p>{project.longDescription || project.shortDescription}</p>
                  <p className="meta">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : copy.presentLabel}
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
