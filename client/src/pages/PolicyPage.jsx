import Reveal from '../components/motion/Reveal.jsx';
import { siteCopy } from '../content/siteCopy.js';

const PolicyPage = ({ policyKey }) => {
  const policy = siteCopy.policyPages?.[policyKey];

  if (!policy) {
    return null;
  }

  return (
    <div className="page page-premium">
      <section className="section section--tight">
        <div className="container-wide">
          <Reveal>
            <p className="kicker">{policy.kicker}</p>
            <h1 className="headline-lg">{policy.title}</h1>
            <p className="lead">{policy.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container policy-stack">
          {policy.fullText ? (
            <Reveal className="card policy-card">
              <p style={{ whiteSpace: 'pre-wrap' }}>{policy.fullText}</p>
            </Reveal>
          ) : (
            policy.sections.map((section) => (
              <Reveal className="card policy-card" key={section.heading}>
                <h2>{section.heading}</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{section.body}</p>
              </Reveal>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PolicyPage;
