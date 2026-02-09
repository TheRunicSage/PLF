import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { siteCopy } from '../../content/siteCopy.js';

const linkClassName = ({ isActive }) => (isActive ? 'pill-nav__link is-active' : 'pill-nav__link');

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const directLinks = siteCopy.nav.directLinks;
  const dropdownGroups = siteCopy.nav.dropdownGroups;

  const allDropdownLinks = useMemo(
    () => dropdownGroups.flatMap((group) => group.links),
    [dropdownGroups]
  );

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown('');
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown('');
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenDropdown('');
    }
  };

  return (
    <header className={isScrolled ? 'site-header site-header--scrolled' : 'site-header'}>
      <div className="container-wide">
        <div className="pill-nav" aria-label="Main navigation">
          <NavLink to="/" className="pill-nav__brand">
            <span className="pill-nav__brand-mark">PLF</span>
            <span className="pill-nav__brand-text">{siteCopy.global.siteName}</span>
          </NavLink>

          <nav className="pill-nav__desktop" aria-label="Primary">
            {directLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClassName}>
                {link.label}
              </NavLink>
            ))}

            {dropdownGroups.map((group) => {
              const isOpen = openDropdown === group.key;
              const controlsId = `nav-dropdown-${group.key}`;

              return (
                <div
                  key={group.key}
                  className="pill-nav__dropdown-wrap"
                  onMouseEnter={() => setOpenDropdown(group.key)}
                  onMouseLeave={() => setOpenDropdown('')}
                  onFocus={() => setOpenDropdown(group.key)}
                  onBlur={handleBlur}
                >
                  <button
                    type="button"
                    className={isOpen ? 'pill-nav__link is-open' : 'pill-nav__link'}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls={controlsId}
                    onClick={() => setOpenDropdown((prev) => (prev === group.key ? '' : group.key))}
                  >
                    {group.label}
                  </button>

                  <ul
                    id={controlsId}
                    role="menu"
                    className={isOpen ? 'pill-nav__dropdown is-open' : 'pill-nav__dropdown'}
                  >
                    {group.links.map((link) => (
                      <li key={link.to} role="none">
                        <NavLink role="menuitem" to={link.to} className="pill-nav__dropdown-link">
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <NavLink className="pill-btn btn-primary" to="/donate">
              {siteCopy.global.ctas.donate}
            </NavLink>
          </nav>

          <button
            type="button"
            className={mobileOpen ? 'pill-nav__menu-toggle is-open' : 'pill-nav__menu-toggle'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={mobileOpen ? 'pill-mobile is-open' : 'pill-mobile'}
          aria-label="Mobile navigation"
        >
          <div className="pill-mobile__group">
            {directLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="pill-mobile__link">
                {link.label}
              </NavLink>
            ))}
          </div>

          {dropdownGroups.map((group) => (
            <div key={group.key} className="pill-mobile__group">
              <p className="pill-mobile__title">{group.label}</p>
              {group.links.map((link) => (
                <NavLink key={link.to} to={link.to} className="pill-mobile__link">
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="pill-mobile__group">
            <NavLink className="pill-btn btn-primary" to="/donate">
              {siteCopy.global.ctas.donate}
            </NavLink>
            {allDropdownLinks.length > 0 && <div className="pill-mobile__divider" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
