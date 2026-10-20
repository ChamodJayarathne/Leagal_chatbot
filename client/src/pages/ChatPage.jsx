import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaComments,
  FaPlus,
  FaPaperPlane,
  FaFileImage,
  FaVolumeHigh,
  FaVolumeXmark,
  FaCopy,
  FaCheck,
  FaScaleBalanced,
  FaBookBookmark,
  FaTriangleExclamation,
  FaSpinner,
  FaSun,
  FaMoon,
  FaGlasses,
  FaFont,
  FaEye,
  FaPrint
} from 'react-icons/fa6';

export const ChatPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const location = useLocation();

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const latestQuestionRef = useRef(null);

  // Fetch chat sessions list
  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/chat/sessions', { params: { userId: user?.id || 'guest_default' } });
      setSessions(res.data);
      if (res.data.length > 0 && !currentSessionId) {
        loadSession(res.data[0]._id);
      }
    } catch (err) {
      console.error('Fetch sessions error:', err.message);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId);
      const res = await axios.get(`/api/chat/session/${sessionId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Load session error:', err.message);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  useEffect(() => {
    fetchSessions();
    if (location.state?.initialQuery) {
      handleSendMessage(location.state.initialQuery);
    }
  }, []);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;

    // Keep the question and the beginning of the legal answer visible in the upper side of the chat view
    if (latestQuestionRef.current) {
      const targetTop = latestQuestionRef.current.offsetTop - 16;
      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || loading) return;

    const userMessageObj = { sender: 'user', content: text, language, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat/message', {
        userId: user?.id || 'guest_default',
        sessionId: currentSessionId,
        message: text,
        language,
      });

      setCurrentSessionId(res.data.sessionId);
      setMessages(res.data.messages);
      fetchSessions();
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: '⚠️ Unable to connect to legal advice service. Please check server connection.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await axios.post('/api/chat/ocr', formData);
      if (res.data.success) {
        handleSendMessage(`${res.data.summaryPrompt}\n\n${res.data.extractedText}`);
      }
    } catch (err) {
      alert('Failed to upload and process document.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSpeak = (text, idx) => {
    if ('speechSynthesis' in window) {
      if (speakingIdx === idx) {
        window.speechSynthesis.cancel();
        setSpeakingIdx(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);

      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Export assistant answer as PDF using a printable window
  const handleDownloadPdf = (content) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const safeContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chat Answer PDF</title>
          <style>
            @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
            body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111; padding: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="content">${safeContent}</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="chat-layout">
      {/* Sidebar Session Drawer */}
      <aside className="chat-sidebar">
        <button onClick={startNewSession} className="btn btn-primary new-chat-btn">
          <FaPlus /> New Legal Consultation
        </button>

        <div className="session-history-list">
          <h4 className="sidebar-heading">Consultation History</h4>
          {sessions.length === 0 ? (
            <p className="no-history">No past consultations</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s._id}
                onClick={() => loadSession(s._id)}
                className={`session-item ${currentSessionId === s._id ? 'active' : ''}`}
              >
                <FaComments className="session-icon" />
                <span className="session-title">{s.title || 'Legal Consultation'}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="chat-main">
        {/* Warning Disclaimer Header */}
        <div className="chat-disclaimer-header">
          <FaTriangleExclamation className="warn-icon" />
          <span>{t.disclaimerText}</span>
        </div>

        {/* Reading Environment & Theme Control Bar */}
        <div className="chat-reading-bar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 24px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <FaEye style={{ color: 'var(--accent-teal)' }} />
            <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Reading Theme:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  background: theme === 'light' ? '#b45309' : 'var(--bg-card)',
                  color: theme === 'light' ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <FaSun /> Light Mode
              </button>
              <button
                type="button"
                onClick={() => setTheme('contrast')}
                style={{
                  background: theme === 'contrast' ? '#38bdf8' : 'var(--bg-card)',
                  color: theme === 'contrast' ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <FaGlasses /> Reader Mode
              </button>
            </div>
          </div>

          {/* Font Size Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <FaFont />
            <span style={{ fontSize: '0.8rem', marginRight: '4px' }}>Text Size:</span>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              style={{
                background: fontSize === 'normal' ? 'var(--accent-teal)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: fontSize === 'normal' ? '#000' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: fontSize === 'normal' ? '700' : '400'
              }}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              style={{
                background: fontSize === 'large' ? 'var(--accent-teal)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: fontSize === 'large' ? '#000' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: fontSize === 'large' ? '700' : '400'
              }}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xl')}
              style={{
                background: fontSize === 'xl' ? 'var(--accent-teal)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: fontSize === 'xl' ? '#000' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: fontSize === 'xl' ? '700' : '400'
              }}
            >
              A++
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-messages-container" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="chat-welcome-state">
              <FaScaleBalanced className="welcome-logo" />
              <h2>Welcome to LegalAI Sri Lanka Consultation</h2>
              <p>Ask questions in English, Sinhala, or Tamil. You can also upload contracts or notice images for analysis.</p>

              <div className="welcome-prompt-grid">
                <button 
                  onClick={() => handleSendMessage('What are my rights if arrested by police in Sri Lanka?')}
                  className="welcome-prompt-card"
                >
                  <FaBookBookmark /> "What are my rights if arrested by Sri Lanka police under Article 13?"
                </button>
                <button 
                  onClick={() => handleSendMessage('ශ්‍රී ලංකාවේ රැකියා අස්කිරීමේදී ගෙවිය යුතු පාරිතෝෂික (Gratuity) ගණනය කරන්නේ කෙසේද?')}
                  className="welcome-prompt-card"
                >
                  <FaBookBookmark /> "ශ්‍රී ලංකාවේ රැකියා අස්කිරීමේදී ගෙවිය යුතු පාරිතෝෂික ගණනය කරන්නේ කෙසේද?"
                </button>
                <button 
                  onClick={() => handleSendMessage('வீட்டு வாடகை முன்பணத்தை திரும்பப் பெற சட்டப்பூர்வ வழி என்ன?')}
                  className="welcome-prompt-card"
                >
                  <FaBookBookmark /> "வீட்டு வாடகை முன்பணத்தை திரும்பப் பெற சட்டப்பூர்வ வழி என்ன?"
                </button>
              </div>
            </div>
          ) : (
            (() => {
              const lastUserIdx = messages.map(m => m.sender).lastIndexOf('user');
              return messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  ref={idx === lastUserIdx ? latestQuestionRef : null}
                  className={`message-row ${msg.sender}`}
                >
                  <div className={`message-bubble ${msg.sender}`}>
                    <div className="message-header">
                      <span className="sender-name">
                        {msg.sender === 'user' ? 'You (Citizen)' : 'LegalAI Advisor'}
                      </span>
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="message-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Citations Badges */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="citations-block">
                        <span className="citations-label">{t.citatedLaws}</span>
                        <div className="citation-chips">
                          {msg.citations.map((c, cIdx) => (
                            <span key={cIdx} className="citation-chip">
                              📜 {c.actName} ({c.section})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    {msg.sender === 'assistant' && (
                      <div className="message-toolbar">
                        <button onClick={() => handleCopy(msg.content, idx)} className="tool-btn">
                          {copiedIdx === idx ? <FaCheck className="success-icon" /> : <FaCopy />}
                          {copiedIdx === idx ? t.copiedText : t.copyText}
                        </button>
                        <button onClick={() => handleSpeak(msg.content, idx)} className="tool-btn">
                          {speakingIdx === idx ? <FaVolumeXmark className="active-icon" /> : <FaVolumeHigh />}
                          {speakingIdx === idx ? t.stopAudio : t.readAloud}
                        </button>
                        <button onClick={() => handleDownloadPdf(msg.content)} className="tool-btn" title="Export answer as PDF">
                          <FaPrint /> Export PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ));
            })()
          )}

          {loading && (
            <div className="message-row assistant">
              <div className="message-bubble assistant loading-bubble">
                <FaSpinner className="spinner-icon" /> Consulting Sri Lankan Constitutional & Statutory Law...
              </div>
            </div>
          )}

          {ocrLoading && (
            <div className="message-row assistant">
              <div className="message-bubble assistant loading-bubble">
                <FaSpinner className="spinner-icon" /> Extracting document text via OCR...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-form"
          >
            {/* Document Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-icon-upload"
              title={t.uploadDoc}
            >
              <FaFileImage />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="chat-text-input"
            />

            {/* Send Button */}
            <button type="submit" disabled={!inputMessage.trim() || loading} className="btn btn-primary send-btn">
              <FaPaperPlane /> {t.send}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
