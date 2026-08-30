import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaScaleBalanced, FaPhoneVolume, FaShieldHalved, FaGavel } from 'react-icons/fa6';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <FaScaleBalanced className="footer-logo-icon" />
              <span>LegalAI Sri Lanka</span>
            </div>
            <p className="footer-desc">
              Sri Lanka's dedicated AI Legal Assistant — providing free, accessible citizen legal consultation, constitution rights guides, and document generation in English, Sinhala, and Tamil.
            </p>
            <div className="emergency-hotline-strip">
              <FaPhoneVolume className="hotline-icon" />
              <div>
                <span className="hotline-title">Emergency Hotlines (Sri Lanka):</span>
                <span className="hotline-numbers">Police: <strong>119</strong> | Legal Aid: <strong>1970</strong> | HRCSL: <strong>1996</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><Link to="/chat">{t.navChat}</Link></li>
              <li><Link to="/rights">{t.navRights}</Link></li>
              <li><Link to="/documents">{t.navDocs}</Link></li>
              <li><Link to="/lawyers">{t.navLawyers}</Link></li>
              <li><Link to="/emergency">{t.navEmergency}</Link></li>
            </ul>
          </div>

          {/* Key Legal Statutes */}
          <div className="footer-links-col">
            <h4>Sri Lankan Law Knowledge Base</h4>
            <ul>
              <li><span>1978 Constitution (Articles 10-14)</span></li>
              <li><span>Penal Code of Sri Lanka (Cap. 19)</span></li>
              <li><span>Shop & Office Employees Act No. 19</span></li>
              <li><span>Rent Act No. 7 of 1972</span></li>
              <li><span>Prevention of Domestic Violence Act</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-disclaimer">
          <FaGavel className="disclaimer-gavel" />
          <div>
            <strong>{t.disclaimerTitle}:</strong> {t.disclaimerText}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LegalAI Sri Lanka — Smart Citizen Legal Consultation Platform. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
