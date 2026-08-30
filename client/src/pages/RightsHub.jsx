import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaBookBookmark, 
  FaMagnifyingGlass, 
  FaScaleBalanced, 
  FaShieldHalved, 
  FaComments,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa6';

export const RightsHub = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [rightsList, setRightsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fundamental Rights', 'Employment Law', 'Tenancy & Property', 'Family Law'];

  useEffect(() => {
    const fetchRights = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/rights', {
          params: { category: selectedCategory, search }
        });
        setRightsList(res.data);
      } catch (err) {
        console.error('Fetch rights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRights();
  }, [selectedCategory, search]);

  const toggleExpand = (idx) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  const getTitle = (item) => {
    if (language === 'si' && item.titleSi) return item.titleSi;
    if (language === 'ta' && item.titleTa) return item.titleTa;
    return item.title;
  };

  const getSummary = (item) => {
    if (language === 'si' && item.summarySi) return item.summarySi;
    if (language === 'ta' && item.summaryTa) return item.summaryTa;
    return item.summary;
  };

  return (
    <div className="rights-page container">
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <FaBookBookmark /> Citizen Law Reference
        </div>
        <h1 className="page-title">Sri Lankan Rights & Laws Knowledge Hub</h1>
        <p className="page-subtitle">
          Key statutory protections under the 1978 Constitution, Shop & Office Act, Rent Act, and Penal Code of Sri Lanka.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="rights-filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <FaMagnifyingGlass className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rights by law, topic, or section..."
            className="filter-search-input"
          />
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rights Items List */}
      {loading ? (
        <div className="loading-state">Loading Sri Lankan Legal Statutes...</div>
      ) : rightsList.length === 0 ? (
        <div className="empty-state">No matching legal guide found. Try another search term.</div>
      ) : (
        <div className="rights-cards-grid">
          {rightsList.map((item, idx) => {
            const isExpanded = expandedId === idx;
            return (
              <div key={idx} className={`rights-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="rights-card-header" onClick={() => toggleExpand(idx)}>
                  <div className="rights-header-text">
                    <span className="rights-category-badge">{item.category}</span>
                    <h3 className="rights-card-title">{getTitle(item)}</h3>
                    <p className="rights-card-summary">{getSummary(item)}</p>
                  </div>
                  <button className="expand-toggle-btn">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="rights-card-body">
                    {item.sections && item.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="section-block">
                        <div className="section-act-tag">📜 {sec.actOrArticle}</div>
                        <h4>{sec.heading}</h4>
                        <p>{sec.description}</p>
                        
                        {sec.keyTakeaways && (
                          <div className="key-takeaways">
                            <strong>Key Points for Citizens:</strong>
                            <ul>
                              {sec.keyTakeaways.map((pt, pIdx) => (
                                <li key={pIdx}>✓ {pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="rights-card-actions">
                      <button
                        onClick={() => navigate('/chat', { state: { initialQuery: `Please explain my rights regarding: ${item.title}` } })}
                        className="btn btn-primary btn-sm"
                      >
                        <FaComments /> Ask AI About This Right
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RightsHub;
