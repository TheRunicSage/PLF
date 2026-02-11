import ScrollReveal from '../components/Reveal.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { siteCopy } from '../content/siteCopy.js';

const About = () => {
  const copy = siteCopy.about;
  const missionStyle = copy.mission.backgroundImageUrl
    ? { backgroundImage: `url(${copy.mission.backgroundImageUrl})` }
    : undefined;

  return (
    <div className="page page-premium about-page">
      <section className="section section--tight">
        <div className="container-wide">
          <ScrollReveal direction="up" distance={16} threshold={0.2}>
            <p className="kicker">{copy.header.kicker}</p>
            <h1 className="headline-lg">{copy.header.title}</h1>
            <p className="lead">{copy.header.description}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal>
            <h2 className="headline-md about-section-heading">{copy.leadershipHeading}</h2>
          </Reveal>

          <Stagger className="about-founder-list">
            {copy.leaders.map((leader) => (
              <article key={leader.name} className="about-founder">
                <div className="about-founder__media">
                  {leader.imageUrl ? (
                    <img src={leader.imageUrl} alt={leader.name} loading="lazy" />
                  ) : (
                    <div className="media-placeholder media-placeholder--olive" aria-hidden="true" />
                  )}
                </div>
                <div className="about-founder__body">
                  <h3 className="about-founder__name">{leader.name}</h3>
                  <p className="about-founder__role">{leader.role}</p>
                  <p>{leader.bio}</p>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal className="about-mission-visual" style={missionStyle}>
            <div className="about-mission-visual__content">
              <h2 className="about-mission-visual__title">{copy.mission.title}</h2>
              <p>{copy.mission.text}</p>
            </div>

            {copy.mission.portraitImageUrl && (
              <div className="about-mission-visual__portrait">
                <img src={copy.mission.portraitImageUrl} alt="Punjab literary and cultural mission" loading="lazy" />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container-wide">
          <Reveal className="about-library-strip">
            {copy.libraryImageUrl ? (
              <img
                src={copy.libraryImageUrl}
                alt={copy.libraryImageAlt || 'Punjab Lit Foundation initiative'}
                loading="lazy"
              />
            ) : (
              <div className="media-placeholder media-placeholder--blue" aria-hidden="true" />
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;
