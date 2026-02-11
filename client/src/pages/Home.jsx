import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ScrollReveal from '../components/Reveal.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';
import { getVideoEmbedData } from '../utils/videoEmbed.js';

const DEFAULT_QR_URLS = ['/assets/donate/gpay-upi-qr.png'];
const DEFAULT_UPI_LABEL = 'UPI ID: khushwant.ahluwalia-1@oksbi';

const formatDate = (value, withTime = false) => {
  if (!value) {
    return 'Date TBA';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date TBA';
  }

  if (withTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatEventRange = (event) => {
  if (!event?.eventStartDate) {
    return 'Date to be announced';
  }

  const start = formatDate(event.eventStartDate, true);

  if (!event.eventEndDate) {
    return start;
  }

  return `${start} - ${formatDate(event.eventEndDate, true)}`;
};

const getDateBadge = (value) => {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return { day: '--', month: 'TBA' };
  }

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  };
};

const ImpactPattern = () => (
  <svg
    className="impact-dot-svg"
    viewBox="0 0 900 320"
    role="img"
    aria-label="Abstract impact pattern"
  >
    <defs>
      <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.8" fill="currentColor" opacity="0.45" />
      </pattern>
      <linearGradient id="impactGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#DBF2EA" />
        <stop offset="100%" stopColor="#CFE4FF" />
      </linearGradient>
    </defs>

    <rect width="900" height="320" rx="28" fill="url(#impactGradient)" />
    <rect width="900" height="320" rx="28" fill="url(#dots)" />

    <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25">
      <path d="M58 212C146 140 250 130 342 178C440 230 548 214 624 156C694 102 778 96 842 132" />
      <path d="M72 108C158 64 238 70 312 118C392 170 506 178 598 130C670 94 756 86 838 112" />
    </g>

    <g fill="currentColor" opacity="0.95">
      <circle cx="160" cy="182" r="6" />
      <circle cx="302" cy="132" r="7" />
      <circle cx="460" cy="198" r="7" />
      <circle cx="612" cy="148" r="8" />
      <circle cx="766" cy="126" r="7" />
    </g>
  </svg>
);

const Home = () => {
  const copy = siteCopy.home;
  const [eventsState, setEventsState] = useState({ items: [], loading: true, error: '' });
  const [projectsState, setProjectsState] = useState({ items: [], loading: true, error: '' });
  const [postsState, setPostsState] = useState({ items: [], loading: true, error: '' });
  const [settingsState, setSettingsState] = useState({
    donationBankDetails: '',
    donationQrImageUrls: [],
    externalDonateUrl: '',
    loading: true,
    error: '',
  });

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        const response = await apiRequest('/events/upcoming?limit=4');
        if (!mounted) {
          return;
        }

        setEventsState({
          items: Array.isArray(response.data?.items) ? response.data.items : [],
          loading: false,
          error: '',
        });
      } catch (_error) {
        if (!mounted) {
          return;
        }

        setEventsState({ items: [], loading: false, error: copy.errors.events });
      }
    };

    const loadProjects = async () => {
      try {
        const response = await apiRequest('/projects?highlighted=true&limit=3');
        if (!mounted) {
          return;
        }

        setProjectsState({
          items: Array.isArray(response.data?.items) ? response.data.items : [],
          loading: false,
          error: '',
        });
      } catch (_error) {
        if (!mounted) {
          return;
        }

        setProjectsState({ items: [], loading: false, error: copy.errors.projects });
      }
    };

    const loadPosts = async () => {
      try {
        const response = await apiRequest('/posts?limit=6');
        if (!mounted) {
          return;
        }

        const postItems = Array.isArray(response.data?.items) ? response.data.items : [];
        const filtered = Array.isArray(postItems)
          ? postItems.filter((post) => ['news', 'blog', 'press'].includes(post.type)).slice(0, 4)
          : [];

        setPostsState({ items: filtered, loading: false, error: '' });
      } catch (_error) {
        if (!mounted) {
          return;
        }

        setPostsState({ items: [], loading: false, error: copy.errors.posts });
      }
    };

    const loadSettings = async () => {
      try {
        const response = await apiRequest('/settings');
        if (!mounted) {
          return;
        }

        setSettingsState({
          donationBankDetails: response.data?.donationBankDetails || '',
          donationQrImageUrls: response.data?.donationQrImageUrls || [],
          externalDonateUrl: response.data?.externalDonateUrl || '',
          loading: false,
          error: '',
        });
      } catch (_error) {
        if (!mounted) {
          return;
        }

        setSettingsState((prev) => ({
          ...prev,
          loading: false,
          error: copy.errors.settings,
        }));
      }
    };

    loadEvents();
    loadProjects();
    loadPosts();
    loadSettings();

    return () => {
      mounted = false;
    };
  }, [copy.errors.events, copy.errors.posts, copy.errors.projects, copy.errors.settings]);

  const featuredProject = useMemo(() => projectsState.items[0] || null, [projectsState.items]);
  const qrUrls = settingsState.donationQrImageUrls.length === 0
    ? DEFAULT_QR_URLS
    : settingsState.donationQrImageUrls;
  const hasBankDetails = Boolean(settingsState.donationBankDetails?.trim());
  const hasQrDetails = qrUrls.length > 0;
  const hasDonateDetails = hasBankDetails || hasQrDetails;

  return (
    <div className="home-page">
      <section className="section section--flush hero-premium">
        <div className="container-wide hero-premium__inner">
          <div className="hero-content-stack">
            <ScrollReveal as="p" className="kicker" direction="up" distance={18} threshold={0.2}>
              {copy.hero.kicker}
            </ScrollReveal>
            <ScrollReveal as="h1" className="headline-xl" direction="up" distance={24} delay={80} threshold={0.2}>
              {copy.hero.title}
            </ScrollReveal>
            <ScrollReveal as="p" className="lead" direction="up" distance={20} delay={150} threshold={0.22}>
              {copy.hero.subtitle}
            </ScrollReveal>
            <ScrollReveal className="hero-actions" direction="up" distance={16} delay={210} threshold={0.22}>
              <Link className="pill-btn btn-primary" to={copy.hero.primaryCta.to}>{copy.hero.primaryCta.label}</Link>
              <Link className="pill-btn btn-ghost" to={copy.hero.secondaryCta.to}>{copy.hero.secondaryCta.label}</Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container-wide">
          <ScrollReveal direction="up" distance={16} threshold={0.25}>
            <p className="kicker">{copy.mission.kicker}</p>
            <h2 className="headline-lg">{copy.mission.title}</h2>
            <p className="lead">{copy.mission.description}</p>
            <Link className="pill-btn btn-ghost" to={copy.mission.cta.to}>{copy.mission.cta.label}</Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--tight story-split">
        <div className="container-wide story-split__grid">
          <Reveal>
            <p className="kicker">{copy.story.kicker}</p>
          </Reveal>
          <Reveal>
            <p className="headline-md">{copy.story.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="section impact-section">
        <div className="container-wide">
          <Reveal className="impact-card">
            <ImpactPattern />
            <div className="impact-card__content">
              <p className="kicker">{copy.impact.kicker}</p>
              <p className="impact-card__stat">{copy.impact.stat}</p>
              <p className="lead">{copy.impact.caption}</p>
              <Link className="pill-btn btn-primary" to={copy.impact.cta.to}>{copy.impact.cta.label}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section donate-banner">
        <div className="container-wide donate-banner__inner">
          <Reveal>
            <p className="kicker">{copy.donateBanner.kicker}</p>
            <h2 className="headline-lg">{copy.donateBanner.title}</h2>
          </Reveal>

          <Reveal className="donate-card" delay={0.08}>
            <h3>{copy.donateBanner.cardTitle}</h3>
            <p className="muted-text">{copy.donateBanner.cardSubtitle}</p>

            {settingsState.loading && <p className="muted-text">{copy.donateBanner.loading}</p>}
            {!settingsState.loading && settingsState.error && <p className="status error">{settingsState.error}</p>}

            {!settingsState.loading && !settingsState.error && (
              <>
                <div className="donate-card__actions">
                  {settingsState.externalDonateUrl ? (
                    <a className="pill-btn btn-primary" href={settingsState.externalDonateUrl} target="_blank" rel="noreferrer">
                      {copy.donateBanner.donateLinkLabel}
                    </a>
                  ) : !hasDonateDetails ? (
                    <button type="button" className="pill-btn btn-primary" disabled>
                      {copy.donateBanner.donateLinkPendingLabel}
                    </button>
                  ) : null}
                </div>

                <div className="donate-card__grid">
                  <article className="card card--soft donate-card__pane">
                    <h4>{copy.donateBanner.bankTitle}</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {settingsState.donationBankDetails || copy.donateBanner.bankFallback}
                    </p>
                  </article>

                  <article className="card card--soft donate-card__pane donate-card__pane--qr">
                    <h4>{copy.donateBanner.qrTitle}</h4>
                    {qrUrls.length === 0 && (
                      <p className="muted-text">{copy.donateBanner.qrFallback}</p>
                    )}
                    {qrUrls.length > 0 && (
                      <div className="qr-grid qr-grid--home">
                        {qrUrls.map((url) => (
                          <img key={url} src={url} alt="Donation QR code" loading="lazy" />
                        ))}
                      </div>
                    )}
                    <p className="meta donate-upi-label">{DEFAULT_UPI_LABEL}</p>
                  </article>
                </div>
              </>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section events-section">
        <div className="container-wide">
          <div className="split-head split-head--compact">
            <Reveal>
              <h2 className="headline-md">{copy.events.heading}</h2>
            </Reveal>
            <Reveal>
              <Link className="pill-btn btn-ghost" to="/blog?type=event">{copy.events.seeAllLabel}</Link>
            </Reveal>
          </div>
          <Reveal>
            <p className="lead">{copy.events.description}</p>
          </Reveal>

          {eventsState.loading && <p className="muted-text">{copy.events.loading}</p>}
          {!eventsState.loading && eventsState.error && <p className="status error">{eventsState.error}</p>}
          {!eventsState.loading && !eventsState.error && eventsState.items.length === 0 && (
            <p className="muted-text">{copy.events.empty}</p>
          )}

          {!eventsState.loading && !eventsState.error && eventsState.items.length > 0 && (
            <Stagger className="event-list" delayChildren={0.06}>
              {eventsState.items.map((event) => {
                const badge = getDateBadge(event.eventStartDate);

                return (
                  <article className="event-row" key={event._id}>
                    <div className="event-row__date" aria-label={formatDate(event.eventStartDate)}>
                      <span>{badge.day}</span>
                      <small>{badge.month}</small>
                    </div>
                    <div className="event-row__body">
                      <h3>{event.title}</h3>
                      <p className="muted-text">{formatEventRange(event)}</p>
                      <p>{event.location || copy.events.locationFallback}</p>
                    </div>
                    <div className="event-row__cta">
                      <Link className="pill-btn btn-ghost" to={`/blog/${event.slug}`}>{copy.events.detailsLabel}</Link>
                    </div>
                  </article>
                );
              })}
            </Stagger>
          )}
        </div>
      </section>

      <section className="section section--tight cta-banner">
        <div className="container-wide">
          <Reveal className="cta-banner__content">
            <h2 className="headline-md">{copy.ctaBanner.title}</h2>
            <p className="lead">{copy.ctaBanner.description}</p>
            <div className="hero-actions">
              <Link className="pill-btn btn-primary" to={copy.ctaBanner.primaryCta.to}>{copy.ctaBanner.primaryCta.label}</Link>
              <Link className="pill-btn btn-ghost" to={copy.ctaBanner.secondaryCta.to}>{copy.ctaBanner.secondaryCta.label}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section ways-section">
        <div className="container-wide">
          <div className="split-head">
            <Reveal>
              <p className="kicker">{copy.waysToHelp.kicker}</p>
              <h2 className="headline-lg">{copy.waysToHelp.title}</h2>
            </Reveal>
            <Reveal>
              <p className="lead">{copy.waysToHelp.description}</p>
            </Reveal>
          </div>

          <Stagger className="ways-grid">
            {copy.waysToHelp.cards.map((item) => (
              <article key={item.title} className="card-media">
                <div className={`media-placeholder ${item.mediaClass}`} aria-hidden="true" />
                <div className="card-media__overlay">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link className="pill-btn btn-ghost" to={item.to}>{copy.waysToHelp.exploreLabel}</Link>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section video-section">
        <div className="container-wide">
          <Reveal>
            <h2 className="headline-md">{copy.videos.heading}</h2>
          </Reveal>

          <Stagger className="video-strip">
            {copy.videos.cards.map((item) => {
              const videoEmbed = getVideoEmbedData(item.videoUrl);

              return (
                <article key={item.title} className="video-card">
                  <div className="video-card__media">
                    {videoEmbed ? (
                      videoEmbed.type === 'iframe' ? (
                        <iframe
                          src={videoEmbed.src}
                          title={item.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <video controls preload="metadata" src={videoEmbed.src}>
                          <track kind="captions" />
                        </video>
                      )
                    ) : (
                      <>
                        <div className={`media-placeholder ${item.mediaClass}`} aria-hidden="true" />
                        <div className="video-card__overlay" aria-hidden="true" />
                      </>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                </article>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="section featured-project-section">
        <div className="container-wide">
          <Reveal>
            <h2 className="headline-md">{copy.featuredProject.heading}</h2>
          </Reveal>

          {projectsState.loading && <p className="muted-text">{copy.featuredProject.loading}</p>}
          {!projectsState.loading && projectsState.error && <p className="status error">{projectsState.error}</p>}
          {!projectsState.loading && !projectsState.error && !featuredProject && (
            <p className="muted-text">{copy.featuredProject.empty}</p>
          )}

          {!projectsState.loading && !projectsState.error && featuredProject && (
            <Reveal className="featured-project-card" delay={0.08}>
              <div className="media-placeholder media-placeholder--blue" aria-hidden="true" />
              <div className="featured-project-card__content">
                <p className="kicker">{featuredProject.status}</p>
                <h3>{featuredProject.title}</h3>
                <p>{featuredProject.shortDescription}</p>
                <Link className="pill-btn btn-primary" to={`/projects/${featuredProject.slug}`}>
                  {copy.featuredProject.ctaLabel}
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="section latest-news-section">
        <div className="container-wide">
          <div className="split-head">
            <Reveal>
              <h2 className="headline-md">{copy.latestUpdates.heading}</h2>
            </Reveal>
            <Reveal>
              <p className="lead">{copy.latestUpdates.description}</p>
            </Reveal>
          </div>

          {postsState.loading && <p className="muted-text">{copy.latestUpdates.loading}</p>}
          {!postsState.loading && postsState.error && <p className="status error">{postsState.error}</p>}
          {!postsState.loading && !postsState.error && postsState.items.length === 0 && (
            <p className="muted-text">{copy.latestUpdates.empty}</p>
          )}

          {!postsState.loading && !postsState.error && postsState.items.length > 0 && (
            <ScrollReveal threshold={0.15} retractOnScrollUp={false}>
              <Stagger className="news-grid">
                {postsState.items.map((post) => (
                  <article key={post._id} className="news-card">
                    {post.featuredImageUrl ? (
                      <img src={post.featuredImageUrl} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="media-placeholder media-placeholder--mint" aria-hidden="true" />
                    )}
                    <div className="news-card__body">
                      <p className="meta">{post.type} | {formatDate(post.publishedAt || post.createdAt)}</p>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt || copy.latestUpdates.excerptFallback}</p>
                      <Link className="pill-btn btn-ghost" to={`/blog/${post.slug}`}>{copy.latestUpdates.ctaLabel}</Link>
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

export default Home;
