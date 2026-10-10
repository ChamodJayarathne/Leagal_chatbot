import React, { useState, useEffect, useRef } from 'react';
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
  FaBuildingShield,
  FaChevronDown,
  FaChevronUp,
  FaLocationDot,
  FaMicrophone,
  FaLocationCrosshairs,
  FaCarSide,
  FaHandcuffs,
  FaHouseUser,
  FaStopwatch,
  FaEyeSlash,
  FaShareNodes,
  FaCircleStop,
  FaPlay,
  FaDownload,
  FaCalculator,
  FaBell,
  FaBellSlash,
  FaUserPlus,
  FaTrash,
  FaClipboardCheck,
  FaCopy,
  FaCheck,
  FaFileLines
} from 'react-icons/fa6';

export const EmergencyRights = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [guideData, setGuideData] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [expandedRule, setExpandedRule] = useState(0);
  const [sosMode, setSosMode] = useState(false);
  const [situation, setSituation] = useState(null);

  // Active Tool Tab
  const [activeTool, setActiveTool] = useState('recorder'); // 'recorder', 'timer', 'scripts', 'logger', 'contacts'

  // Camouflage / Calculator Disguise
  const [disguiseMode, setDisguiseMode] = useState(false);
  const [calcInput, setCalcInput] = useState('0');

  // Siren State (Web Audio API)
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Real Audio Evidence Recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // GPS & Live Location
  const [locationState, setLocationState] = useState({ status: 'idle', coords: null, address: '' });

  // Detention 24h Timer
  const [isDetained, setIsDetained] = useState(false);
  const [detentionSeconds, setDetentionSeconds] = useState(0);

  // Teleprompter / Legal Scripts
  const [copiedScriptIndex, setCopiedScriptIndex] = useState(null);

  // Incident Logger Form & Checklist
  const [incidentData, setIncidentData] = useState({
    officerName: '',
    badgeNumber: '',
    station: '',
    vehiclePlate: '',
    notes: ''
  });
  const [checklist, setChecklist] = useState({
    reasonGiven: false,
    phoneCallAllowed: false,
    warrantShown: false,
    badgeVisible: false,
    receiptIssued: false,
    forceUsed: false
  });
  const [reportExported, setReportExported] = useState(false);

  // Custom Emergency Contacts (LocalStorage)
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('legal_emergency_contacts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 1, name: 'Legal Aid Commission (LAC)', phone: '+94112433618', role: 'Legal Defense' },
      { id: 2, name: 'Human Rights Commission', phone: '+94112505580', role: 'Human Rights' }
    ];
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '', role: 'Lawyer' });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    localStorage.setItem('legal_emergency_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Fetch Guide from Backend
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

  // Timer Effects
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(prev => prev + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let interval;
    if (isDetained) {
      interval = setInterval(() => setDetentionSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isDetained]);

  // Cleanup Web Audio & Media on unmount
  useEffect(() => {
    return () => {
      stopSiren();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Web Audio SOS Siren Synthesizer
  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sirenOscRef.current = osc;

      let high = false;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || !sirenOscRef.current) return;
        high = !high;
        const targetFreq = high ? 1200 : 700;
        sirenOscRef.current.frequency.exponentialRampToValueAtTime(targetFreq, audioCtxRef.current.currentTime + 0.3);
      }, 350);

      setSirenPlaying(true);
    } catch (err) {
      console.error('Siren error:', err);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
      } catch (e) {}
      sirenOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setSirenPlaying(false);
  };

  // Real Audio Evidence Recorder
  const startRecordingAudio = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // GPS Location Handler
  const handleFetchLocation = () => {
    setLocationState({ status: 'loading', coords: null, address: '' });
    if (!navigator.geolocation) {
      setLocationState({ status: 'error', coords: null, address: 'Geolocation unsupported' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({ 
          status: 'success', 
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          address: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        });
      },
      (error) => {
        console.error(error);
        setLocationState({ status: 'error', coords: null, address: 'Location permission denied' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Text to Speech
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

  const speakPhrase = (phraseText, langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phraseText);
      if (langCode === 'si') utterance.lang = 'si-LK';
      else if (langCode === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(idx);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  // Time Formatter
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick Stealth Exit to Google
  const stealthExit = () => {
    stopSiren();
    window.location.replace('https://www.google.com');
  };

  // Calculator Disguise Keypad Logic
  const handleCalcPress = (val) => {
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      // Secret unlock passcode: 999
      if (calcInput === '999') {
        setDisguiseMode(false);
        setCalcInput('0');
        return;
      }
      try {
        // Safe evaluation of basic math
        // eslint-disable-next-line no-eval
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch (e) {
        setCalcInput('Error');
      }
    } else {
      if (calcInput === '0' || calcInput === 'Error') {
        setCalcInput(val);
      } else {
        setCalcInput(calcInput + val);
      }
    }
  };

  // Export Incident Report
  const exportIncidentReport = () => {
    const now = new Date().toLocaleString();
    const loc = locationState.coords ? `Lat: ${locationState.coords.lat}, Lng: ${locationState.coords.lng}` : 'Not recorded';
    const reportText = `================================================
POLICE INTERACTION INCIDENT REPORT
Generated by LegalAI Sri Lanka Emergency Rights System
Timestamp: ${now}
GPS Location: ${loc}
================================================
OFFICER DETAILS:
- Officer Name: ${incidentData.officerName || 'Not stated'}
- Badge / Service No: ${incidentData.badgeNumber || 'Not stated'}
- Police Station: ${incidentData.station || 'Not stated'}
- Patrol Vehicle Plate: ${incidentData.vehiclePlate || 'Not stated'}

CONSTITUTIONAL & PROCEDURAL CHECKLIST:
- Informed of Reason for Arrest: ${checklist.reasonGiven ? 'YES' : 'NO [VIOLATION]'}
- Permitted Call to Lawyer / Family: ${checklist.phoneCallAllowed ? 'YES' : 'NO [VIOLATION]'}
- Valid Search Warrant Presented: ${checklist.warrantShown ? 'YES' : 'NO'}
- Officer Wore Uniform with Visible Name Badge: ${checklist.badgeVisible ? 'YES' : 'NO'}
- Signed Inventory Receipt for Seized Items: ${checklist.receiptIssued ? 'YES' : 'NO'}
- Physical Coercion / Force Used: ${checklist.forceUsed ? 'YES [SERIOUS VIOLATION]' : 'NO'}

NOTES & TIMELINE:
${incidentData.notes || 'No additional notes recorded.'}
================================================
LEGAL BASIS:
Article 13(1) & 13(2) - 1978 Constitution of the Democratic Socialist Republic of Sri Lanka.
================================================`;

    navigator.clipboard.writeText(reportText);
    
    // Also trigger instant file download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `Legal_Incident_Report_${Date.now()}.txt`;
    downloadLink.click();

    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  // Contacts Handlers
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const added = { ...newContact, id: Date.now() };
    setContacts(prev => [...prev, added]);
    setNewContact({ name: '', phone: '', role: 'Lawyer' });
    setShowAddContact(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Broadcast WhatsApp Link to a contact
  const getWhatsAppAlertUrl = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const locText = locationState.coords 
      ? `My live GPS location is: https://maps.google.com/?q=${locationState.coords.lat},${locationState.coords.lng}`
      : 'Location GPS could not be attached.';
    const msg = encodeURIComponent(`🚨 EMERGENCY LEGAL ALERT!
I have been stopped / detained by police in Sri Lanka.
${locText}
Please contact my legal representative or follow up at the nearest police station immediately under Article 13 of the Constitution.`);
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  // Title string
  const getTitle = () => {
    if (!guideData) return 'Emergency Police Pocket Guide';
    if (language === 'si') return guideData.titleSi;
    if (language === 'ta') return guideData.titleTa;
    return guideData.title;
  };

  // Teleprompter Legal Scripts Data
  const legalScripts = [
    {
      title: 'Right to Know Grounds of Arrest (Art. 13(1))',
      en: 'Officer, am I under arrest? If so, under what specific law and charge am I being detained?',
      si: 'නිලධාරීතුමනි, මාව අත්අඩංගුවට ගෙන තිබේද? එසේ නම්, කුමන චෝදනාව යටතේද?',
      ta: 'அதிகாரி அவர்களே, நான் கைது செய்யப்பட்டுள்ளேனா? அப்படியாயின் எந்த குற்றச்சாட்டின் கீழ்?'
    },
    {
      title: 'Right to Legal Counsel & Phone Call',
      en: 'I wish to exercise my right to contact my attorney and inform my family of my whereabouts immediately.',
      si: 'මගේ නීතිඥවරයා ඇමතීමට සහ මගේ පවුලේ අයට මා සිටින තැන දැනුම් දීමට මට අවස්ථාව ලබා දෙන්න.',
      ta: 'எனது சட்டத்தரணியைத் தொடர்புகொள்ளவும், எனது குடும்பத்தினருக்கு தெரிவிக்கவும் எனக்கு அனுமதி வேண்டும்.'
    },
    {
      title: 'Right to Remain Silent (No Self-Incrimination)',
      en: 'I am exercising my legal right to remain silent until I have consulted with my attorney.',
      si: 'මගේ නීතිඥවරයා හමුවන තුරු නිහඬව සිටීමේ මගේ නීත්‍යානුකූල අයිතිය මම භාවිත කරමි.',
      ta: 'எனது வழக்கறிஞரிடம் ஆலோசனை பெறும் வரை மௌனமாக இருக்கும் எனது சட்டப்பூர்வ உரிமையை நான் பயன்படுத்துகிறேன்.'
    },
    {
      title: 'Search Warrant Requirement',
      en: 'Please produce a valid Search Warrant signed by a Magistrate before searching my premises or property.',
      si: 'මගේ නිවස හෝ දේපළ සෝදිසි කිරීමට පෙර කරුණාකර මහේස්ත්‍රාත්වරයෙකු විසින් අත්සන් කරන ලද සෝදිසි වරෙන්තුව පෙන්වන්න.',
      ta: 'எனது இடத்தை சோதனை செய்வதற்கு முன் நீதிபதியால் கையொப்பமிடப்பட்ட பிடியாணையை காட்டவும்.'
    },
    {
      title: 'Receipt for Confiscated Items',
      en: 'Please provide me with an official signed inventory receipt for any property or mobile devices being seized.',
      si: 'මා සතු කිසියම් දේපලක් හෝ ජංගම දුරකථනයක් අත්අඩංගුවට ගන්නේ නම්, ඒ සඳහා නිල අත්සන් කළ ලදුපතක් ලබා දෙන්න.',
      ta: 'கைப்பற்றப்படும் எந்தவொரு பொருளுக்கும் அதிகாரப்பூர்வமாக கையொப்பமிடப்பட்ட ரசீதை எனக்கு வழங்கவும்.'
    }
  ];

  // -------------------------------------------------------------
  // CAMOUFLAGE CALCULATOR VIEW
  // -------------------------------------------------------------
  if (disguiseMode) {
    return (
      <div style={{ maxWidth: '360px', margin: '40px auto', background: '#0f172a', borderRadius: '24px', padding: '24px', border: '2px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Standard Calculator</span>
          <button 
            onClick={() => setDisguiseMode(false)}
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.75rem', cursor: 'pointer' }}
            title="Unlock Secretly"
          >
            [exit disguise]
          </button>
        </div>
        
        {/* Screen */}
        <div style={{ background: '#020617', color: '#38bdf8', fontSize: '2.4rem', textAlign: 'right', padding: '16px', borderRadius: '12px', marginBottom: '20px', minHeight: '64px', overflowX: 'auto' }}>
          {calcInput}
        </div>

        {/* Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '00', '='].map((btn) => (
            <button
              key={btn}
              onClick={() => handleCalcPress(btn)}
              style={{
                background: btn === '=' ? '#3b82f6' : btn === 'C' ? '#ef4444' : '#1e293b',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '16px 0',
                borderRadius: '12px',
                border: '1px solid #334155',
                cursor: 'pointer'
              }}
            >
              {btn}
            </button>
          ))}
        </div>
        <p style={{ color: '#475569', fontSize: '0.7rem', textAlign: 'center', marginTop: '16px' }}>
          Tip: Enter 999 and press = to return to defense mode.
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN EMERGENCY DEFENSE VIEW
  // -------------------------------------------------------------
  return (
    <div className={`emergency-page container ${sosMode ? 'sos-active' : ''}`}>
      
      {/* Top Action & Utility Bar (Inside page layout, completely below navbar) */}
      <div className="sos-toggle-bar" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          className={`btn-sos-toggle ${sosMode ? 'active emergency-pulse' : ''}`}
          onClick={() => {
            const nextMode = !sosMode;
            setSosMode(nextMode);
            if (!nextMode) {
              setSituation(null);
              setIsRecording(false);
              stopSiren();
            }
          }}
        >
          <FaTriangleExclamation /> {sosMode ? 'SOS RED DEFENSE ACTIVE' : 'ACTIVATE SOS RED DEFENSE'}
        </button>

        {/* Camouflage Mode Button */}
        <button 
          onClick={() => setDisguiseMode(true)}
          title="Disguise as Calculator"
          style={{ 
            background: 'var(--bg-card)', 
            color: 'var(--text-secondary)', 
            border: '1.5px solid var(--border-color)', 
            borderRadius: '12px', 
            padding: '12px 18px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer', 
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          <FaCalculator /> Camouflage Disguise
        </button>

        {/* Stealth Quick Exit Button */}
        <button 
          onClick={stealthExit}
          title="Instant Exit to Google"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            border: '1.5px solid rgba(239, 68, 68, 0.4)', 
            borderRadius: '12px', 
            padding: '12px 18px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer', 
            fontSize: '0.95rem', 
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          <FaEyeSlash /> Stealth Exit
        </button>
      </div>

      {/* Header Alert Card */}
      <div className={`emergency-header-card ${sosMode ? 'critical-header' : ''}`}>
        <div className="header-badge-row">
          <span className={`urgent-tag ${sosMode ? 'emergency-pulse' : ''}`}>
            <FaTriangleExclamation /> IMMEDIATE CONSTITUTIONAL PROTECTION
          </span>
          <div className="lang-buttons">
            <button onClick={() => setLanguage('en')} className={`lang-btn ${language === 'en' ? 'active' : ''}`}>English</button>
            <button onClick={() => setLanguage('si')} className={`lang-btn ${language === 'si' ? 'active' : ''}`}>සිංහල</button>
            <button onClick={() => setLanguage('ta')} className={`lang-btn ${language === 'ta' ? 'active' : ''}`}>தமிழ்</button>
          </div>
        </div>

        <h1 className="emergency-title">{getTitle()}</h1>
        <p className="emergency-ref">📜 {guideData?.constitutionRef || 'Fundamental Rights - Articles 13(1), 13(2) & 13(3) of Sri Lanka Constitution'}</p>

        {/* Global Action Bar */}
        <div className="header-actions-row" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button onClick={handleSpeech} className="btn btn-audio-read">
            {speaking ? <FaVolumeXmark /> : <FaVolumeHigh />}
            <span>{speaking ? t.stopAudio : 'Read Rules Aloud'}</span>
          </button>

          <button 
            onClick={toggleSiren} 
            className="btn btn-audio-read" 
            style={{ 
              background: sirenPlaying ? '#ef4444' : 'rgba(239, 68, 68, 0.15)', 
              borderColor: '#ef4444', 
              color: sirenPlaying ? '#fff' : '#ef4444' 
            }}
          >
            {sirenPlaying ? <FaBellSlash className="emergency-pulse" /> : <FaBell />}
            <span>{sirenPlaying ? 'Stop Deterrent Siren' : 'Trigger SOS Siren'}</span>
          </button>

          <button onClick={() => navigate('/map')} className="btn btn-audio-read" style={{ background: 'rgba(56, 189, 248, 0.2)', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            <FaLocationDot />
            <span>Find Nearest Police / Legal Aid</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC EMERGENCY TOOLKIT DOCK */}
      <div style={{ margin: '30px 0', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <FaShieldHalved style={{ color: 'var(--accent-teal)' }} /> Dynamic Legal Toolkit
          </h3>
          {/* Toolkit Navigation Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'recorder', label: 'Audio Recorder', icon: <FaMicrophone /> },
              { id: 'timer', label: '24h Timer', icon: <FaStopwatch /> },
              { id: 'scripts', label: 'Legal Scripts', icon: <FaComments /> },
              { id: 'logger', label: 'Evidence Log', icon: <FaClipboardCheck /> },
              { id: 'contacts', label: 'SOS Contacts', icon: <FaUserPlus /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id)}
                style={{
                  background: activeTool === tab.id ? 'var(--accent-teal)' : 'rgba(255,255,255,0.05)',
                  color: activeTool === tab.id ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. AUDIO EVIDENCE RECORDER TAB */}
        {activeTool === 'recorder' && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Live Audio Evidence Recorder</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Lawfully capture interactions with law enforcement. Audio recordings are legally admissible evidence in Sri Lankan courts.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {!isRecording ? (
                <button
                  onClick={startRecordingAudio}
                  className="btn btn-primary"
                  style={{ background: '#ef4444', borderColor: '#ef4444', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  <FaMicrophone /> Start Live Recording
                </button>
              ) : (
                <button
                  onClick={stopRecordingAudio}
                  className="btn btn-danger emergency-pulse"
                  style={{ background: '#0f172a', borderColor: '#ef4444', color: '#ef4444', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  <FaCircleStop /> Stop Recording ({formatTime(recordTime)})
                </button>
              )}

              <button
                onClick={handleFetchLocation}
                className="btn btn-secondary"
                style={{ borderRadius: '50px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaLocationCrosshairs /> {locationState.status === 'loading' ? 'Pinpointing GPS...' : 'Get GPS Pin'}
              </button>
            </div>

            {/* GPS Result */}
            {locationState.status === 'success' && locationState.coords && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#93c5fd' }}>
                <span>📍 Lat: {locationState.coords.lat.toFixed(5)}, Lng: {locationState.coords.lng.toFixed(5)}</span>
                <a 
                  href={`https://wa.me/?text=LEGAL EMERGENCY! My GPS location is: https://maps.google.com/?q=${locationState.coords.lat},${locationState.coords.lng}`}
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ background: '#22c55e', color: '#fff', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaShareNodes /> WhatsApp Coordinates
                </a>
              </div>
            )}

            {/* Playable Recorded Audio Evidence */}
            {audioUrl && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  ✓ Evidence File Ready for Playback & Download
                </span>
                <audio controls src={audioUrl} style={{ width: '100%', maxWidth: '400px' }} />
                <a
                  href={audioUrl}
                  download={`legal_police_evidence_${Date.now()}.webm`}
                  className="btn btn-sm"
                  style={{ background: '#22c55e', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold' }}
                >
                  <FaDownload /> Download Audio Evidence (.webm)
                </a>
              </div>
            )}
          </div>
        )}

        {/* 2. DETENTION 24-HOUR COUNTDOWN TIMER */}
        {activeTool === 'timer' && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Constitutional 24-Hour Detention Clock</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Under <strong>Article 13(2) of the Sri Lankan Constitution</strong>, every detained person must be brought before a Magistrate within 24 hours. Failure to do so constitutes unlawful detention.
                </p>
              </div>
              <button
                onClick={() => setIsDetained(!isDetained)}
                style={{
                  background: isDetained ? '#ef4444' : 'var(--accent-gold)',
                  color: isDetained ? '#fff' : '#000',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaStopwatch /> {isDetained ? 'Stop Detention Clock' : 'Start Detention Clock'}
              </button>
            </div>

            {/* Visual 24h Progress */}
            <div style={{ marginTop: '20px', background: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {formatTime(detentionSeconds)}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Statutory Limit: 24:00:00 (Hours)
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '12px', background: '#1e293b', borderRadius: '6px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min(100, (detentionSeconds / (24 * 3600)) * 100)}%`, 
                    background: detentionSeconds > 24 * 3600 ? '#ef4444' : 'linear-gradient(90deg, var(--accent-gold), #f59e0b)',
                    transition: 'width 1s linear'
                  }}
                />
              </div>

              {detentionSeconds > 24 * 3600 && (
                <div style={{ marginTop: '12px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTriangleExclamation /> VIOLATION: Detention exceeds 24 statutory hours without judicial oversight. Immediate Habeas Corpus grounds.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. LEGAL SCRIPTS TELEPROMPTER */}
        {activeTool === 'scripts' && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Legal Scripts: What to Say to Police</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Use these legally validated phrases. You can press <strong>"Speak for Me"</strong> to have your phone speak the statement aloud.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {legalScripts.map((script, idx) => {
                const phraseInCurrentLang = language === 'si' ? script.si : language === 'ta' ? script.ta : script.en;
                return (
                  <div 
                    key={idx}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent-teal)', fontSize: '0.9rem' }}>{script.title}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => speakPhrase(phraseInCurrentLang, language)}
                          style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Speak phrase aloud"
                        >
                          <FaVolumeHigh /> Speak
                        </button>
                        <button
                          onClick={() => copyToClipboard(phraseInCurrentLang, idx)}
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedScriptIndex === idx ? <><FaCheck style={{ color: '#22c55e' }} /> Copied</> : <><FaCopy /> Copy</>}
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                      "{phraseInCurrentLang}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. INCIDENT EVIDENCE LOGGER & CHECKLIST */}
        {activeTool === 'logger' && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Incident Evidence Logger & Violation Checklist</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Document every detail immediately. Once completed, click <strong>"Export Incident Report"</strong> to download a formatted legal brief for your attorney.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Officer Name</label>
                <input
                  type="text"
                  placeholder="e.g. SI Perera"
                  value={incidentData.officerName}
                  onChange={(e) => setIncidentData({ ...incidentData, officerName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Badge / Service No.</label>
                <input
                  type="text"
                  placeholder="e.g. 84920"
                  value={incidentData.badgeNumber}
                  onChange={(e) => setIncidentData({ ...incidentData, badgeNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Police Station</label>
                <input
                  type="text"
                  placeholder="e.g. Kollupitiya Police"
                  value={incidentData.station}
                  onChange={(e) => setIncidentData({ ...incidentData, station: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Police Vehicle Plate</label>
                <input
                  type="text"
                  placeholder="e.g. WP NA-4921"
                  value={incidentData.vehiclePlate}
                  onChange={(e) => setIncidentData({ ...incidentData, vehiclePlate: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Violation Checklist */}
            <h5 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Procedural Rights Checklist:</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {[
                { key: 'reasonGiven', label: 'Reason for arrest explicitly stated' },
                { key: 'phoneCallAllowed', label: 'Allowed call to lawyer / family' },
                { key: 'warrantShown', label: 'Valid search warrant shown' },
                { key: 'badgeVisible', label: 'Officer wore official uniform / badge' },
                { key: 'receiptIssued', label: 'Signed receipt given for seized items' },
                { key: 'forceUsed', label: 'Physical force / assault / threats used' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                    style={{ accentColor: 'var(--accent-teal)' }}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            {/* Notes textarea */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Timeline & Description of Events</label>
              <textarea
                rows={3}
                placeholder="Describe what occurred, any witnesses present, and what was said..."
                value={incidentData.notes}
                onChange={(e) => setIncidentData({ ...incidentData, notes: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Export Button */}
            <button
              onClick={exportIncidentReport}
              className="btn btn-primary"
              style={{ background: 'var(--accent-teal)', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px' }}
            >
              <FaFileLines /> {reportExported ? '✓ Report Exported & Downloaded!' : 'Export & Download Incident Report (.txt)'}
            </button>
          </div>
        )}

        {/* 5. EMERGENCY CONTACTS & BROADCAST */}
        {activeTool === 'contacts' && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Emergency Defense Contacts</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>1-Click WhatsApp SOS Alert with live GPS coordinates.</p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                style={{ background: 'var(--accent-teal)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaUserPlus /> Add Contact
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContact} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Attorney Silva"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    required
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="e.g. +94771234567"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    required
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</label>
                  <select
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Lawyer">Lawyer</option>
                    <option value="Family">Family</option>
                    <option value="Trusted Friend">Trusted Friend</option>
                  </select>
                </div>
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Save
                </button>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {contacts.map((c) => (
                <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.phone} • {c.role}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a
                      href={`tel:${c.phone}`}
                      style={{ background: '#3b82f6', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FaPhoneVolume /> Call
                    </a>
                    <a
                      href={getWhatsAppAlertUrl(c.phone)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: '#22c55e', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FaShareNodes /> WhatsApp
                    </a>
                    {c.id > 2 && (
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Situation Wizard */}
      <div className="situation-wizard" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>What is happening right now?</h3>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className={`btn-situation ${situation === 'traffic' ? 'active' : ''}`}
            onClick={() => setSituation(situation === 'traffic' ? null : 'traffic')}
            style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: situation === 'traffic' ? 'var(--accent-gold)' : 'var(--bg-card)', color: situation === 'traffic' ? '#000' : 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <FaCarSide /> Traffic Stop
          </button>
          <button 
            className={`btn-situation ${situation === 'arrest' ? 'active' : ''}`}
            onClick={() => setSituation(situation === 'arrest' ? null : 'arrest')}
            style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: situation === 'arrest' ? '#ef4444' : 'var(--bg-card)', color: situation === 'arrest' ? '#fff' : 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <FaHandcuffs /> Arrested
          </button>
          <button 
            className={`btn-situation ${situation === 'search' ? 'active' : ''}`}
            onClick={() => setSituation(situation === 'search' ? null : 'search')}
            style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: situation === 'search' ? 'var(--accent-teal)' : 'var(--bg-card)', color: situation === 'search' ? '#000' : 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <FaHouseUser /> House / Body Search
          </button>
        </div>

        {/* Dynamic Context Box based on situation */}
        {situation && (
          <div className="situation-context-box" style={{ marginTop: '20px', padding: '20px', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', animation: 'slideDown 0.3s ease-out', textAlign: 'left' }}>
            {situation === 'traffic' && (
              <>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><FaCarSide /> Action Plan: Traffic Stop</h4>
                <p>1. Stay calm and keep your hands visible.<br/>2. Provide your Driving License and Revenue License if requested.<br/>3. You have the right to know why you were stopped.<br/>4. Do not offer bribes; it is a serious criminal offense in Sri Lanka.</p>
              </>
            )}
            {situation === 'arrest' && (
              <>
                <h4 style={{ color: '#ef4444', marginBottom: '10px' }}><FaHandcuffs /> Action Plan: Being Arrested</h4>
                <p>1. Do not resist physically.<br/>2. Ask: "Am I under arrest, and for what specific offence?"<br/>3. Demand to make an immediate phone call to your lawyer or family.<br/>4. Exercise your right to silence. Do NOT sign blank papers or confession statements.</p>
              </>
            )}
            {situation === 'search' && (
              <>
                <h4 style={{ color: 'var(--accent-teal)', marginBottom: '10px' }}><FaHouseUser /> Action Plan: House / Body Search</h4>
                <p>1. Demand to inspect the official Search Warrant signed by a Magistrate.<br/>2. If without a warrant, politely object unless conducted under specific emergency statutory powers.<br/>3. Insist on two independent neighborhood witnesses and demand an official signed seizure receipt for every item taken.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 1-Tap Emergency Hotlines Section */}
      <div className="emergency-hotlines-grid">
        <a href="tel:119" className={`hotline-card red ${sosMode ? 'emergency-pulse' : ''}`}>
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

      {/* Rights Rules Cards (Dynamic Accordion) */}
      <div className="rules-cards-stack">
        <h3 className="section-heading" style={{ color: sosMode ? '#ef4444' : 'var(--text-primary)' }}>
          {sosMode ? 'CRITICAL RIGHTS TO REMEMBER NOW:' : '4 Mandatory Rights When Stopped or Arrested:'}
        </h3>

        {guideData?.keyRules.map((ruleObj, idx) => {
          const isExpanded = expandedRule === idx || sosMode || situation !== null;
          return (
            <div 
              key={idx} 
              className={`rule-card dynamic-rule-card ${isExpanded ? 'expanded' : ''} ${sosMode ? 'sos-border' : ''}`}
              onClick={() => !sosMode && setExpandedRule(isExpanded ? null : idx)}
              style={{ cursor: sosMode ? 'default' : 'pointer' }}
            >
              <div className="rule-num" style={{ background: sosMode ? '#ef4444' : '' }}>{idx + 1}</div>
              <div className="rule-content" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>
                    {language === 'si' ? ruleObj.ruleSi : language === 'ta' ? ruleObj.ruleTa : ruleObj.rule}
                  </h4>
                  {!sosMode && (
                    <span className="expand-icon" style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>
                
                {isExpanded && (
                  <div className="rule-detail-animated" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <p>{ruleObj.detail}</p>
                    {sosMode && (
                      <div className="sos-quick-tip" style={{ marginTop: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold' }}>
                        <FaShieldHalved /> Cite this right confidently if challenged.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct AI Consultation CTA */}
      <div className={`emergency-footer-cta ${sosMode ? 'sos-cta' : ''}`} style={{ transition: 'all 0.3s ease', borderColor: sosMode ? '#ef4444' : 'var(--border-color)' }}>
        <h3 style={{ color: sosMode ? '#ef4444' : 'var(--text-primary)' }}>Need Immediate Legal Advice for Your Situation?</h3>
        <p>Ask LegalAI Assistant right now for immediate guidance tailored to Sri Lankan Law.</p>
        <button
          onClick={() => navigate('/chat', { 
            state: { 
              initialQuery: situation 
                ? `Help! I am currently experiencing a ${situation} in Sri Lanka. What should I do right now?` 
                : 'Help! I have been stopped or detained by police in Sri Lanka. What should I do right now?' 
            } 
          })}
          className="btn btn-primary btn-lg btn-emergency-pulse"
          style={{ background: sosMode ? '#ef4444' : '', boxShadow: sosMode ? '0 4px 20px rgba(239, 68, 68, 0.4)' : '' }}
        >
          <FaComments /> Ask AI Legal Assistant Now
        </button>
      </div>
    </div>
  );
};

export default EmergencyRights;
