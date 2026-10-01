import React, { useState, useEffect, useRef } from 'react';
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
  FaChevronUp,
  FaWandMagicSparkles,
  FaTriangleExclamation,
  FaPhone,
  FaArrowRight,
  FaCircleCheck,
  FaGavel,
  FaXmark,
  FaLightbulb,
} from 'react-icons/fa6';

// ── Sample scenario prompts ───────────────────────────────────────────────────
const SAMPLE_SCENARIOS = [
  'My employer fired me without any notice after 3 years of service',
  'Police arrested me last night without telling me the reason',
  'My landlord is trying to evict me forcefully without a court order',
  'Shop sold me a defective phone and refuses warranty replacement',
  'Someone is blackmailing me online with private photos',
  'Vehicle hit my motorcycle and driver fled the scene',
];


export const RightsHub = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // ── Standard browse state ─────────────────────────────────────────────────
  const [rightsList, setRightsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Scenario analysis state ───────────────────────────────────────────────
  const [scenarioQuery, setScenarioQuery] = useState('');
  const [scenarioResult, setScenarioResult] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioError, setScenarioError] = useState('');
  const [activeMode, setActiveMode] = useState('browse'); // 'browse' | 'scenario'

  const resultPanelRef = useRef(null);
  const categories = [
    'All',
    'Fundamental Rights',
    'Employment Law',
    'Tenancy & Property',
    'Family Law',
    'Consumer Rights',
    'Cyber & Digital Law',
    'Traffic & Accidents',
    'Criminal & Fraud',
    'Right to Information',
  ];

  // ── Fetch rights for browse mode ──────────────────────────────────────────
  useEffect(() => {
    const fetchRights = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/rights', {
          params: { category: selectedCategory, search },
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

  const toggleExpand = (idx) => setExpandedId(expandedId === idx ? null : idx);

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

  // ── Scenario submit ───────────────────────────────────────────────────────
  const handleScenarioSubmit = async (e, overrideQuery) => {
    if (e) e.preventDefault();
    const query = overrideQuery || scenarioQuery;
    if (!query.trim()) return;

    setScenarioError('');
    setScenarioResult(null);
    setScenarioLoading(true);
    setActiveMode('scenario');

    try {
      const res = await axios.post('/api/rights/scenario', {
        scenario: query.trim(),
        language,
      });
      setScenarioResult(res.data);
      setExpandedId('sc-0');
      setTimeout(() => {
        resultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setScenarioError('Could not analyze your scenario. Please try again.');
      console.error('Scenario error:', err);
    } finally {
      setScenarioLoading(false);
    }
  };

  const clearScenario = () => {
    setScenarioResult(null);
    setScenarioQuery('');
    setScenarioError('');
    setActiveMode('browse');
  };

  // ── Which rights list to show ─────────────────────────────────────────────
  const displayRights = scenarioResult ? scenarioResult.matchedRights : rightsList;

  // Results are displayed in priority order by relevance score (no badge labels)

  return (
    <div className="rights-page container">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-badge">
          <FaBookBookmark /> Citizen Law Reference
        </div>
        <h1 className="page-title">Sri Lankan Rights &amp; Laws Knowledge Hub</h1>
        <p className="page-subtitle">
          Key statutory protections under the 1978 Constitution, Shop &amp; Office Act, Rent Act, and Penal Code of Sri Lanka.
        </p>
      </div>

      {/* ── Scenario Search Section ───────────────────────────────────────── */}
      <section className="scenario-search-section">
        <div className="scenario-search-header">
          <FaWandMagicSparkles className="scenario-search-icon" />
          <div>
            <h2 className="scenario-search-title">Describe Your Situation</h2>
            <p className="scenario-search-subtitle">
              Tell us what happened in plain language — we'll identify the relevant Sri Lankan laws that protect you.
            </p>
          </div>
        </div>

        <form onSubmit={handleScenarioSubmit} className="scenario-form">
          <div className="scenario-input-wrapper">
            <FaMagnifyingGlass className="scenario-input-icon" />
            <textarea
              className="scenario-textarea"
              value={scenarioQuery}
              onChange={(e) => setScenarioQuery(e.target.value)}
              placeholder="e.g. My employer fired me without notice after 3 years of service..."
              rows={2}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleScenarioSubmit(e); } }}
            />
            {scenarioQuery && (
              <button type="button" className="scenario-clear-btn" onClick={clearScenario} title="Clear">
                <FaXmark />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary scenario-submit-btn"
            disabled={scenarioLoading || !scenarioQuery.trim()}
          >
            {scenarioLoading
              ? <><span className="spinner-sm" /> Analyzing...</>
              : <><FaWandMagicSparkles /> Analyze My Situation</>
            }
          </button>
        </form>

        {/* Sample scenario chips */}
        <div className="scenario-chips-row">
          <span className="scenario-chips-label"><FaLightbulb /> Try:</span>
          <div className="scenario-chips">
            {SAMPLE_SCENARIOS.map((s, i) => (
              <button
                key={i}
                className="scenario-chip"
                onClick={() => {
                  setScenarioQuery(s);
                  handleScenarioSubmit(null, s);
                }}
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenario Loading Skeleton ─────────────────────────────────────── */}
      {scenarioLoading && (
        <div className="scenario-loading-panel">
          <div className="scenario-loading-content">
            <FaScaleBalanced className="scenario-loading-icon spin" />
            <div>
              <p className="scenario-loading-title">Analyzing your situation under Sri Lankan Law...</p>
              <p className="scenario-loading-sub">Matching constitutional rights, acts, and statutes</p>
            </div>
          </div>
          <div className="skeleton-row"><div className="skeleton-bar w80" /><div className="skeleton-bar w60" /></div>
          <div className="skeleton-row"><div className="skeleton-bar w90" /><div className="skeleton-bar w50" /></div>
        </div>
      )}

      {/* ── Scenario Error ────────────────────────────────────────────────── */}
      {scenarioError && (
        <div className="scenario-error-msg">
          <FaTriangleExclamation /> {scenarioError}
        </div>
      )}

      {/* ── Scenario Analysis Result Panel ───────────────────────────────── */}
      {scenarioResult && !scenarioLoading && (
        <div className="scenario-result-panel" ref={resultPanelRef}>
          {/* Panel header */}
          <div className="scenario-result-header">
            <div className="scenario-result-title-row">
              <FaGavel className="scenario-result-gavel" />
              <div>
                <h2 className="scenario-result-title">Scenario Analysis Result</h2>
                <p className="scenario-result-query">"{scenarioResult.scenario}"</p>
              </div>
            </div>
            <button className="scenario-close-btn" onClick={clearScenario} title="Clear results">
              <FaXmark /> Clear
            </button>
          </div>

          {/* Situation + Advice */}
          {(() => {
            const analysis = scenarioResult.analysis || {};
            return (
              <div className="scenario-analysis-body">
                {/* Situation */}
                <div className="scenario-situation-row">
                  <h3 className="scenario-situation-title">{analysis.situation || 'Legal Matter Identified'}</h3>
                </div>

                {/* Advice box */}
                <div className="scenario-advice-box">
                  <FaScaleBalanced className="scenario-advice-icon" />
                  <p>{analysis.advice}</p>
                </div>

                {/* Two-col: Immediate Steps + Hotlines */}
                <div className="scenario-two-col">
                  {/* Immediate Steps */}
                  {(analysis.immediateSteps || []).length > 0 && (
                    <div className="scenario-steps-card">
                      <h4 className="scenario-card-heading"><FaCircleCheck /> Immediate Steps</h4>
                      <ol className="scenario-steps-list">
                        {analysis.immediateSteps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Hotlines */}
                  {(analysis.hotlines || []).length > 0 && (
                    <div className="scenario-hotlines-card">
                      <h4 className="scenario-card-heading"><FaPhone /> Emergency Contacts</h4>
                      <ul className="scenario-hotlines-list">
                        {analysis.hotlines.map((h, i) => (
                          <li key={i}>
                            <span className="hotline-name">{h.name}</span>
                            <a href={`tel:${h.number}`} className="hotline-number">{h.number}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ── Applicable Laws & Citizen Rights in Detail ── */}
                {(analysis.detailedLaws || []).length > 0 && (
                  <div className="scenario-detailed-laws-section">
                    <div className="scenario-detailed-laws-header">
                      <FaScaleBalanced className="detailed-laws-icon" />
                      <div>
                        <h4 className="detailed-laws-title">Relevant Sri Lankan Laws &amp; Citizen Protections in Detail</h4>
                        <p className="detailed-laws-subtitle">
                          Statutory provisions, specific citizen rights, actionable legal remedies, and court procedures governing your situation.
                        </p>
                      </div>
                    </div>

                    <div className="scenario-detailed-laws-list">
                      {analysis.detailedLaws.map((law, idx) => (
                        <div key={idx} className="scenario-detailed-law-card">
                          <div className="detailed-law-top">
                            <div className="detailed-law-tags">
                              <span className="detailed-law-act-badge">📜 {law.act}</span>
                              {law.section && <span className="detailed-law-section-badge">§ {law.section}</span>}
                            </div>
                            <h5 className="detailed-law-right-title">{law.citizenRight}</h5>
                          </div>

                          {law.howItApplies && (
                            <div className="detailed-law-applies-block">
                              <span className="detailed-law-field-label">How This Law Applies to Your Situation</span>
                              <p>{law.howItApplies}</p>
                            </div>
                          )}

                          {law.legalRemedy && (
                            <div className="detailed-law-remedy-box">
                              <div className="detailed-remedy-header">
                                <FaGavel />
                                <span>Actionable Legal Remedy &amp; Recourse</span>
                              </div>
                              <p>{law.legalRemedy}</p>
                            </div>
                          )}

                          {Array.isArray(law.keyPoints) && law.keyPoints.length > 0 && (
                            <div className="detailed-law-keypoints">
                              <span className="detailed-law-field-label">Key Statutory Protections &amp; Citizen Checklist</span>
                              <ul className="detailed-keypoints-list">
                                {law.keyPoints.map((pt, pIdx) => (
                                  <li key={pIdx}>
                                    <FaCircleCheck className="keypoint-check-icon" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Acts Chips (if detailedLaws empty) */}
                {(!analysis.detailedLaws || analysis.detailedLaws.length === 0) && (analysis.relevantActs || analysis.matchedLaws || []).length > 0 && (
                  <div className="scenario-acts-row">
                    <span className="scenario-acts-label">Relevant Acts:</span>
                    {(analysis.relevantActs || analysis.matchedLaws?.map(l => l.actName) || []).map((act, i) => (
                      <span key={i} className="scenario-act-chip">{act}</span>
                    ))}
                  </div>
                )}

                {/* Ask AI CTA */}
                <button
                  className="btn btn-primary scenario-ask-ai-btn"
                  onClick={() => navigate('/chat', { state: { initialQuery: `${scenarioResult.scenario}` } })}
                >
                  <FaComments /> Get Detailed AI Legal Advice <FaArrowRight />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Mode toggle + Filter Bar ──────────────────────────────────────── */}
      <div className="rights-filter-bar">
        {scenarioResult && (
          <div className="mode-toggle-row">
            {/* <button
              className={`mode-toggle-btn ${activeMode === 'scenario' ? 'active' : ''}`}
              onClick={() => setActiveMode('scenario')}
            >
              <FaWandMagicSparkles /> Scenario Results ({scenarioResult.matchedRights?.length || 0})
            </button> */}
            <button
              className={`mode-toggle-btn ${activeMode === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveMode('browse')}
            >
              <FaBookBookmark /> All Laws
            </button>
          </div>
        )}

        {/* Search Input (browse mode) */}
        {activeMode === 'browse' && (
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
        )}

        {/* Category Pills */}
        {activeMode === 'browse' && (
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
        )}
      </div>

      {/* ── Rights Cards Grid ─────────────────────────────────────────────── */}
      {activeMode === 'browse' ? (
        loading ? (
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

        )
      ) : (
        /* Scenario matched rights */
        scenarioResult?.matchedRights?.length === 0 ? (
          <div className="empty-state">No specific laws matched your scenario. Try rephrasing or use the browse tab.</div>
        ) : (
          <div className="scenario-matched-section">
            {/* <div className="scenario-matched-section-header">
              <FaBookBookmark className="scenario-matched-icon" />
              <div>
                <h3 className="scenario-matched-title">Statutory Guides &amp; Full Legal Sections</h3>
                <h3 className="scenario-matched-title">Full Legal Sections</h3>
                <p className="scenario-matched-subtitle">
                  Explore complete statutory articles, key takeaways, and citizen reference guides below.
                </p>
              </div>
            </div> */}
            {/* <div className="rights-cards-grid">
              {(scenarioResult?.matchedRights || []).map((item, idx) => {
                const isExpanded = expandedId === `sc-${idx}`;
                return (
                  <div key={idx} className={`rights-card scenario-matched-card ${isExpanded ? 'expanded' : ''}`}>
                    <div className="rights-card-header" onClick={() => toggleExpand(`sc-${idx}`)}>
                      <div className="rights-header-text">
                        <span className="rights-category-badge">{item.category}</span>
                        <h3 className="rights-card-title">{getTitle(item)}</h3>
                        <p className="rights-card-summary">{getSummary(item)}</p>
                        {item._matchedKeywords?.length > 0 && (
                          <div className="matched-keywords-row">
                            {item._matchedKeywords.slice(0, 4).map((kw, ki) => (
                              <span key={ki} className="matched-keyword-chip">{kw}</span>
                            ))}
                          </div>
                        )}
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
                            onClick={() => navigate('/chat', { state: { initialQuery: `${scenarioResult.scenario} — please explain my rights regarding: ${item.title}` } })}
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
            </div> */}
          </div>
        )
      )}
    </div>
  );
};

export default RightsHub;
