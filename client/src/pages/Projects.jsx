import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import ScrollReveal from '../components/Reveal.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';

const statuses = ['all', 'ongoing', 'completed', 'upcoming'];

const Projects = () => {
  const copy = siteCopy.projects;
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeStatus = useMemo(() => {
    const raw = searchParams.get('status') || 'all';
    return statuses.includes(raw) ? raw : 'all';
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      setLoading(true);
      setError('');

      try {
        const query = new URLSearchParams({ page: '1', limit: '12' });

        if (activeStatus !== 'all') {
          query.set('status', activeStatus);
        }

        const response = await apiRequest(`/projects?${query.toString()}`);

        if (!mounted) {
          return;
        }

        setProjects(Array.isArray(response.data?.items) ? response.data.items : []);
      } catch (_loadError) {
        if (!mounted) {
          return;
        }

        setProjects([]);
        setError(copy.loadError);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, [activeStatus, copy.loadError]);

  return (
    <div className="page page-premium">
      <section className="section section--tight">
        <div className="container-wide">
          <ScrollReveal direction="up" distance={16} threshold={0.2}>
            <p className="kicker">{copy.header.kicker}</p>
            <h1 className="headline-lg">{copy.header.title}</h1>
            <p className="lead">{copy.header.description}</p>
          </ScrollReveal>

          <Reveal className="filter-row" delay={0.05}>
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                className={activeStatus === status ? 'pill-btn btn-primary' : 'pill-btn btn-ghost'}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);

                  if (status === 'all') {
                    next.delete('status');
                  } else {
                    next.set('status', status);
                  }

                  setSearchParams(next);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {loading && <p className="muted-text">{copy.loading}</p>}
          {!loading && error && <p className="status error">{error}</p>}
          {!loading && !error && projects.length === 0 && <p className="muted-text">{copy.empty}</p>}

          {!loading && !error && projects.length > 0 && (
            <ScrollReveal threshold={0.15} retractOnScrollUp={false}>
              <Stagger className="content-grid content-grid--three">
                {projects.map((project) => (
                  <article className="card project-card" key={project._id}>
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.title} loading="lazy" />
                    ) : (
                      <div className="media-placeholder media-placeholder--mint" aria-hidden="true" />
                    )}

                    <div className="project-card__body">
                      <p className="kicker">{project.status}</p>
                      <h2>{project.title}</h2>
                      <p>{project.shortDescription}</p>
                      <Link className="pill-btn btn-ghost" to={`/projects/${project.slug}`}>
                        {copy.viewDetailsLabel}
                      </Link>
                    </div>
                  </article>
                ))}
              </Stagger>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
