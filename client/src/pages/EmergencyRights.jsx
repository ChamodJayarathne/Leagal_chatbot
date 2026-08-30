import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  FaShieldHalved, 
  FaPhoneVolume, 
  FaVolumeHigh, 
  FaVolumeXmark, 
  FaComments,
  FaScaleBalanced,
  FaTriangleExclamation,
  FaUserNurse,
  FaBuildingShield
} from 'react-icons/fa6';

export const EmergencyRights = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [guideData, setGuideData] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const res = await axios.get('/api/rights/emergency');
        setGuideData(res.data);
      } catch (err) {
        console.error('Fetch emergency rights error:', err);
      }
    };
    fetchEmergencyData();
  }, []);

  const handleSpeech = () => {
    if (!guideData) return;

    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();

      const textToRead = guideData.keyRules
        .map((r) => {
          if (language === 'si') return `${r.ruleSi}: ${r.detail}`;
          if (language === 'ta') return `${r.ruleTa}: ${r.detail}`;
          return `${r.rule}: ${r.detail}`;
        })
        .join('. ');

      const utterance = new SpeechSynthesisUtterance(textToRead);
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getTitle = () => {
    if (!guideData) return 'Emergency Police Pocket Guide';
    if (language === 'si') return guideData.titleSi;
    if (language === 'ta') return guideData.titleTa;
    return guideData.title;
  };

  return (
    <div className="emergency-page container">
      {/* High-Contrast Alert Header */}
      <div className="emergency-header-card">
        <div className="header-badge-row">
          <span className="urgent-tag"><FaTriangleExclamation /> IMMEDIATE CITIZEN PROTECTION</span>
          {/* Language Toggle Quick Bar */}
          <div className="lang-buttons">
            <button onClick={() => setLanguage('en')} className={`lang-btn ${language === 'en' ? 'active' : ''}`}>English</button>
            <button onClick={() => setLanguage('si')} className={`lang-btn ${language === 'si' ? 'active' : ''}`}>සිංහල</button>
            <button onClick={() => setLanguage('ta')} className={`lang-btn ${language === 'ta' ? 'active' : ''}`}>தமிழ்</button>
          </div>
        </div>

        <h1 className="emergency-title">{getTitle()}</h1>
        <p className="emergency-ref">📜 {guideData?.constitutionRef || 'Article 13 - 1978 Constitution of Sri Lanka'}</p>

        {/* Speech Audio Button */}
        <button onClick={handleSpeech} className="btn btn-audio-read">
          {speaking ? <FaVolumeXmark /> : <FaVolumeHigh />}
          <span>{speaking ? t.stopAudio : t.readAloud}</span>
        </button>
      </div>

      {/* 1-Tap Emergency Hotlines Section */}
      <div className="emergency-hotlines-grid">
        <a href="tel:119" className="hotline-card red">
          <FaPhoneVolume className="hotline-card-icon" />
          <div className="hotline-info">
            <span className="hotline-label">Police Emergency</span>
            <span className="hotline-num">119</span>
          </div>
        </a>

        <a href="tel:1970" className="hotline-card gold">
          <FaScaleBalanced className="hotline-card-icon" />
          <div className="hotline-info">
            <span className="hotline-label">Legal Aid Commission</span>
            <span className="hotline-num">1970</span>
          </div>
        </a>

        <a href="tel:1996" className="hotline-card teal">
          <FaBuildingShield className="hotline-card-icon" />
          <div className="hotline-info">
            <span className="hotline-label">Human Rights Commission</span>
            <span className="hotline-num">1996</span>
          </div>
        </a>
      </div>

      {/* Rights Rules Cards */}
      <div className="rules-cards-stack">
        <h3 className="section-heading">4 Mandatory Rights When Stopped or Arrested:</h3>

        {guideData?.keyRules.map((ruleObj, idx) => (
          <div key={idx} className="rule-card">
            <div className="rule-num">{idx + 1}</div>
            <div className="rule-content">
              <h4>
                {language === 'si' ? ruleObj.ruleSi : language === 'ta' ? ruleObj.ruleTa : ruleObj.rule}
              </h4>
              <p>{ruleObj.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Direct AI Consultation CTA */}
      <div className="emergency-footer-cta">
        <h3>Need Immediate Legal Advice for Your Situation?</h3>
        <p>Ask LegalAI Assistant right now for immediate guidance tailored to Sri Lankan Law.</p>
        <button
          onClick={() => navigate('/chat', { state: { initialQuery: 'Help! I have been stopped or detained by police in Sri Lanka. What should I do right now?' } })}
          className="btn btn-primary btn-lg"
        >
          <FaComments /> Ask AI Legal Assistant Now
        </button>
      </div>
    </div>
  );
};

export default EmergencyRights;
