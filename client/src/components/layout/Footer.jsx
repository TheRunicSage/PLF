import { Link } from 'react-router-dom';

import { siteCopy } from '../../content/siteCopy.js';

const Footer = () => {
  const { footer, global } = siteCopy;

  return (
    <footer className="site-footer">
      <div className="container-wide footer-columns">
        <section>
          <p className="kicker">{global.siteName}</p>
          <h3>{footer.heading}</h3>
          <p className="muted-text">{footer.description}</p>
        </section>

        <section>
          <h4>{footer.quickLinksTitle}</h4>
          <ul className="footer-link-list">
            {footer.quickLinks.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a href={link.to} target="_blank" rel="noreferrer">{link.label}</a>
                ) : (
                  <Link to={link.to}>{link.label}</Link>
                )}
              </li>
            ))}
            <li><Link to={global.policies.privacy.to}>{global.policies.privacy.label}</Link></li>
            <li><Link to={global.policies.terms.to}>{global.policies.terms.label}</Link></li>
            <li><Link to={global.policies.refund.to}>{global.policies.refund.label}</Link></li>
          </ul>
        </section>

        <section>
          <h4>{footer.contactTitle}</h4>
          <ul className="footer-link-list">
            <li><a href={`mailto:${global.contact.email}`}>{global.contact.email}</a></li>
            <li><a href={`tel:${global.contact.phoneHref}`}>{global.contact.phoneDisplay}</a></li>
            <li><a href={global.social.instagramUrl} target="_blank" rel="noreferrer">{global.social.instagramLabel}</a></li>
          </ul>
        </section>
      </div>

      <div className="container-wide footer-bottom">
        <small>(c) {new Date().getFullYear()} {global.siteName}. {footer.copyrightSuffix}</small>
      </div>
    </footer>
  );
};

export default Footer;
