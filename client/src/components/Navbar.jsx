import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  FaScaleBalanced,
  FaComments,
  FaBookBookmark,
  FaFileContract,
  FaUserGroup,
  FaShieldHalved,
  FaCalculator,
  FaMapLocationDot,
  FaGlobe,
  FaCircleUser,
  FaRightFromBracket,
  FaBars,
  FaXmark
} from 'react-icons/fa6';

export const Navbar = ({ onOpenAuth }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <FaScaleBalanced />
          </div>
          <div className="brand-text">
            <span className="brand-title">Legal <span className="brand-badge">Sri Lanka</span></span>
            <span className="brand-sub">Legal Assistant</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <FaXmark /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            {t.navHome}
          </Link>
          <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
            <FaComments className="nav-icon" /> {t.navChat}
          </Link>
          <Link to="/rights" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/rights') ? 'active' : ''}`}>
            <FaBookBookmark className="nav-icon" /> {t.navRights}
          </Link>
          <Link to="/documents" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/documents') ? 'active' : ''}`}>
            <FaFileContract className="nav-icon" /> {t.navDocs}
          </Link>
          <Link to="/lawyers" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/lawyers') ? 'active' : ''}`}>
            <FaUserGroup className="nav-icon" /> {t.navLawyers}
          </Link>
          <Link to="/calculators" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/calculators') ? 'active' : ''}`}>
            <FaCalculator className="nav-icon" /> Calculators
          </Link>
          <Link to="/map" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${isActive('/map') ? 'active' : ''}`}>
            <FaMapLocationDot className="nav-icon" /> Legal Map
          </Link>
          <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} className={`nav-link emergency-badge-link ${isActive('/emergency') ? 'active' : ''}`}>
            <FaShieldHalved className="nav-icon emergency-pulse" /> {t.navEmergency}
          </Link>
        </nav>

        {/* Actions & Language Selector */}
        <div className="navbar-actions">
          {/* Language Switcher */}
          <div className="language-selector">
            <FaGlobe className="lang-icon" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* User Auth */}
          {user && !user.isGuest ? (
            <div className="user-profile-menu">
              <span className="user-name">
                <FaCircleUser /> {user.name}
              </span>
              <button onClick={logout} className="btn-logout" title={t.logout}>
                <FaRightFromBracket />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary btn-sm navbar-auth-btn">
              {t.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
