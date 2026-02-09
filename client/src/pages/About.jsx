import ScrollReveal from '../components/Reveal.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { siteCopy } from '../content/siteCopy.js';

const About = () => {
  const copy = siteCopy.about;

  return (
    <div className="page page-premium">
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
        <div className="container-wide story-split__grid">
          <Reveal>
            <p className="kicker">{copy.mission.kicker}</p>
          </Reveal>
          <Reveal>
            <p className="headline-md">{copy.mission.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal>
            <h2 className="headline-md">{copy.leadershipHeading}</h2>
          </Reveal>

          <Stagger className="content-grid content-grid--two">
            {copy.leaders.map((leader) => (
              <article key={leader.name} className="card profile-card">
                <div className={`media-placeholder ${leader.mediaClass}`} aria-hidden="true" />
                <div className="profile-card__body">
                  <h3>{leader.name}</h3>
                  <p className="kicker">{leader.role}</p>
                  <p>{leader.bio}</p>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
};

export default About;
