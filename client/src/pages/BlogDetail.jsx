import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ImageCarousel from '../components/common/ImageCarousel.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';
import { mergeImageUrls } from '../utils/media.js';
import { getVideoEmbedData } from '../utils/videoEmbed.js';

const formatDate = (value) => {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BlogDetail = () => {
  const detailCopy = siteCopy.updates.detail;
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest(`/posts/${slug}`);

        if (!mounted) {
          return;
        }

        setPost(response.data || null);
      } catch (_loadError) {
        if (!mounted) {
          return;
        }

        setPost(null);
        setError(detailCopy.loadError);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [detailCopy.loadError, slug]);

  useEffect(() => {
    let mounted = true;

    const loadRelated = async () => {
      if (!post?.type) {
        setRelatedPosts([]);
        return;
      }

      try {
        const response = await apiRequest(`/posts?type=${post.type}&limit=4`);
        const items = Array.isArray(response.data?.items) ? response.data.items : [];

        if (!mounted) {
          return;
        }

        setRelatedPosts(items.filter((item) => item.slug !== post.slug).slice(0, 3));
      } catch (_error) {
        if (mounted) {
          setRelatedPosts([]);
        }
      }
    };

    loadRelated();

    return () => {
      mounted = false;
    };
  }, [post]);

  const publishedLabel = useMemo(
    () => (post?.publishedAt ? formatDate(post.publishedAt) : formatDate(post?.createdAt)),
    [post]
  );
  const postImages = useMemo(() => mergeImageUrls(post?.featuredImageUrl, post?.imageUrls), [post]);
  const videoEmbedData = useMemo(() => getVideoEmbedData(post?.videoUrl), [post?.videoUrl]);

  return (
    <div className="page page-premium">
      <section className="section section--tight">
        <div className="container-wide">
          <Reveal>
            <Link className="pill-btn btn-ghost" to="/blog">{detailCopy.backLabel}</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {loading && <p className="muted-text">{detailCopy.loading}</p>}
          {!loading && error && <p className="status error">{error}</p>}

          {!loading && !error && post && (
            <Reveal className="detail-layout">
              <article className="card detail-card">
                {postImages.length > 0 ? (
                  <ImageCarousel
                    images={postImages}
                    altBase={post.title}
                    className="detail-carousel"
                  />
                ) : (
                  <div className="media-placeholder media-placeholder--olive" aria-hidden="true" />
                )}

                <div className="detail-card__body">
                  <p className="kicker">{post.type}</p>
                  <h1 className="headline-md">{post.title}</h1>
                  <p className="meta">{publishedLabel}</p>
                  {videoEmbedData && (
                    <div className="detail-video-wrap">
                      {videoEmbedData.type === 'iframe' ? (
                        <iframe
                          src={videoEmbedData.src}
                          title={videoEmbedData.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <video controls preload="metadata" src={videoEmbedData.src}>
                          <track kind="captions" />
                        </video>
                      )}
                    </div>
                  )}
                  <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                  {post.type === 'event' && (post.eventStartDate || post.location) && (
                    <div className="event-detail-box">
                      <h2>{detailCopy.eventDetailsHeading}</h2>
                      {post.eventStartDate && <p><strong>{detailCopy.eventStartsLabel}:</strong> {formatDate(post.eventStartDate)}</p>}
                      {post.eventEndDate && <p><strong>{detailCopy.eventEndsLabel}:</strong> {formatDate(post.eventEndDate)}</p>}
                      {post.location && <p><strong>{detailCopy.eventLocationLabel}:</strong> {post.location}</p>}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <Reveal>
              <h2 className="headline-md">{detailCopy.relatedHeading}</h2>
            </Reveal>

            <Stagger className="content-grid content-grid--three">
              {relatedPosts.map((item) => (
                <article className="card" key={item._id}>
                  <p className="kicker">{item.type}</p>
                  <h3>{item.title}</h3>
                  <p className="meta">{formatDate(item.publishedAt || item.createdAt)}</p>
                  <Link className="pill-btn btn-ghost" to={`/blog/${item.slug}`}>
                    {detailCopy.openPostLabel}
                  </Link>
                </article>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
