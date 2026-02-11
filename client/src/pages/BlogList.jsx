import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import ScrollReveal from '../components/Reveal.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';
import { getPrimaryImage } from '../utils/media.js';

const POSTS_PER_PAGE = 6;

const typeFilters = [
  { label: 'All', value: 'all' },
  { label: 'News', value: 'news' },
  { label: 'Stories', value: 'story' },
  { label: 'Blog', value: 'blog' },
  { label: 'Press', value: 'press' },
  { label: 'Events', value: 'event' },
];

const formatDate = (value) => {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BlogList = () => {
  const copy = siteCopy.updates;
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedType = useMemo(() => {
    const raw = searchParams.get('type') || 'all';
    return typeFilters.some((filter) => filter.value === raw) ? raw : 'all';
  }, [searchParams]);

  const currentPage = useMemo(() => {
    const raw = Number.parseInt(searchParams.get('page') || '1', 10);
    return Number.isNaN(raw) || raw < 1 ? 1 : raw;
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(POSTS_PER_PAGE),
        });

        if (selectedType !== 'all') {
          query.set('type', selectedType);
        }

        const response = await apiRequest(`/posts?${query.toString()}`);

        if (!mounted) {
          return;
        }

        setPosts(Array.isArray(response.data?.items) ? response.data.items : []);
        setTotalPages(Math.max(response.data?.pagination?.totalPages || 1, 1));
      } catch (_loadError) {
        if (!mounted) {
          return;
        }

        setPosts([]);
        setTotalPages(1);
        setError(copy.loadError);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, [copy.loadError, currentPage, selectedType]);

  const updateParams = (nextType, nextPage = 1) => {
    const next = new URLSearchParams(searchParams);

    if (!nextType || nextType === 'all') {
      next.delete('type');
    } else {
      next.set('type', nextType);
    }

    if (nextPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(nextPage));
    }

    setSearchParams(next);
  };

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
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={selectedType === filter.value ? 'pill-btn btn-primary' : 'pill-btn btn-ghost'}
                onClick={() => updateParams(filter.value, 1)}
              >
                {filter.label}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {isLoading && <p className="muted-text">{copy.loading}</p>}
          {!isLoading && error && <p className="status error">{error}</p>}
          {!isLoading && !error && posts.length === 0 && <p className="muted-text">{copy.empty}</p>}

          {!isLoading && !error && posts.length > 0 && (
            <>
              <ScrollReveal threshold={0.15} retractOnScrollUp={false}>
                <Stagger className="content-grid content-grid--three">
                  {posts.map((post) => {
                    const postImage = getPrimaryImage(post.featuredImageUrl, post.imageUrls);

                    return (
                      <article key={post._id} className="card blog-card">
                        {postImage ? (
                          <img src={postImage} alt={post.title} loading="lazy" />
                        ) : (
                          <div className="media-placeholder media-placeholder--sun" aria-hidden="true" />
                        )}
                        <div className="blog-card__body">
                          <p className="kicker">{post.type}</p>
                          <h2>{post.title}</h2>
                          <p className="meta">{formatDate(post.publishedAt || post.createdAt)}</p>
                          <p>{post.excerpt || copy.excerptFallback}</p>
                          <Link className="pill-btn btn-ghost" to={`/blog/${post.slug}`}>
                            {copy.readMoreLabel}
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </Stagger>
              </ScrollReveal>

              <div className="pagination-row">
                <button
                  type="button"
                  className="pill-btn btn-ghost"
                  onClick={() => updateParams(selectedType, currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  {copy.previousLabel}
                </button>
                <p className="meta">{copy.pageLabel} {currentPage} {copy.ofLabel} {totalPages}</p>
                <button
                  type="button"
                  className="pill-btn btn-ghost"
                  onClick={() => updateParams(selectedType, currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                >
                  {copy.nextLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogList;
