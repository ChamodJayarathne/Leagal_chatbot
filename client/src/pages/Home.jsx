import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaScaleBalanced, 
  FaComments, 
  FaBookBookmark, 
  FaFileContract, 
  FaUserGroup, 
  FaShieldHalved,
  FaArrowRight,
  FaLanguage,
  FaGavel,
  FaMagnifyingGlass
} from 'react-icons/fa6';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/chat', { state: { initialQuery: query } });
    }
  };

  const samplePrompts = [
    'What are my legal rights if detained by Sri Lanka police?',
    'මාස 3ක පඩි නොගෙවා අස්කළහොත් කළයුත්තේ කුමක්ද?',
    'வீட்டு வாடகை ஒப்பந்தத்தை சட்டப்பூர்வமாக முடிப்பது எப்படி?',
    'What is the statutory notice period for tenant eviction in Colombo?',
    'How to apply for an affidavit for lost NIC in Sri Lanka?'
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-gradient"></div>
        <div className="hero-container">
          <div className="hero-badge">
            <FaScaleBalanced /> Official Citizen AI Consultation Platform
          </div>

          <h1 className="hero-title">
            {t.heroTitle}
          </h1>

          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>

          {/* Search Query Input */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box">
            <FaMagnifyingGlass className="search-box-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary hero-search-btn">
              {t.startChat} <FaArrowRight />
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="quick-prompts-container">
            <span className="prompts-label">Try Asking:</span>
            <div className="prompt-chips">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate('/chat', { state: { initialQuery: prompt } })}
                  className="prompt-chip"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tri-lingual Banner */}
      <section className="trilingual-banner-section">
        <div className="container">
          <div className="trilingual-card">
            <FaLanguage className="trilingual-icon" />
            <div className="trilingual-content">
              <h3>Tri-Lingual Support for All Sri Lankan Citizens</h3>
              <p>සිංහල, தமிழ், සහ English යන සියලුම රාජ්‍ය භාෂාවලින් නිවැරදි නීතිමය උපදෙස් ලබාගන්න.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comprehensive Legal AI Suite</h2>
            <p className="section-subtitle">Designed specifically around the Constitution, Penal Code, and Statutory Laws of Sri Lanka</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card" onClick={() => navigate('/chat')}>
              <div className="feature-icon gold">
                <FaComments />
              </div>
              <h3>AI Legal Assistant (RAG Powered)</h3>
              <p>Real-time conversational legal advice backed by statutory citations from Sri Lankan Constitution, Shop & Office Act, and Rent Act.</p>
              <span className="card-link">{t.startChat} <FaArrowRight /></span>
            </div>

            {/* Feature 2 */}
            <div className="feature-card" onClick={() => navigate('/rights')}>
              <div className="feature-icon teal">
                <FaBookBookmark />
              </div>
              <h3>Citizen Rights & Laws Knowledge Base</h3>
              <p>Explore your fundamental rights (Articles 10-14), labor protection, police questioning guidelines, and domestic violence protection orders.</p>
              <span className="card-link">{t.exploreRights} <FaArrowRight /></span>
            </div>

            {/* Feature 3 */}
            <div className="feature-card" onClick={() => navigate('/documents')}>
              <div className="feature-icon gold">
                <FaFileContract />
              </div>
              <h3>Automated Legal Document Generator</h3>
              <p>Generate formal Affidavits, Tenancy Agreements, Debt Demand Letters, and Police Complaint drafts ready for print or Justice of Peace signature.</p>
              <span className="card-link">{t.generateDoc} <FaArrowRight /></span>
            </div>

            {/* Feature 4 */}
            <div className="feature-card" onClick={() => navigate('/lawyers')}>
              <div className="feature-icon teal">
                <FaUserGroup />
              </div>
              <h3>Verified Lawyer & Legal Aid Directory</h3>
              <p>Search qualified Attorneys-at-Law and free Legal Aid Commission centers across all Sri Lankan districts (Colombo, Kandy, Galle, Jaffna).</p>
              <span className="card-link">{t.findLawyer} <FaArrowRight /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Police Pocket Guide Callout */}
      <section className="emergency-callout-section">
        <div className="container">
          <div className="emergency-banner-card">
            <div className="emergency-banner-content">
              <div className="emergency-tag">
                <FaShieldHalved /> Immediate Protection Protocol
              </div>
              <h2>Stopped by Police or Detained in Sri Lanka?</h2>
              <p>Know your Constitutional rights under Article 13: 24-hour Magistrate production rule, right to legal counsel, and protection from arbitrary arrest.</p>
              <button onClick={() => navigate('/emergency')} className="btn btn-emergency">
                <FaShieldHalved /> Open Police Pocket Rights Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
