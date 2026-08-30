import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import RightsHub from './pages/RightsHub';
import DocumentGenerator from './pages/DocumentGenerator';
import LawyerDirectory from './pages/LawyerDirectory';
import EmergencyRights from './pages/EmergencyRights';
import Calculators from './pages/Calculators';
import LegalMap from './pages/LegalMap';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { FaXmark, FaScaleBalanced } from 'react-icons/fa6';

export const App = () => {
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', district: 'Colombo' });
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (isRegistering) {
        await register(authForm);
      } else {
        await login(authForm.email, authForm.password);
      }
      setAuthModalOpen(false);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/rights" element={<RightsHub />} />
          <Route path="/documents" element={<DocumentGenerator />} />
          <Route path="/lawyers" element={<LawyerDirectory />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/map" element={<LegalMap />} />
          <Route path="/emergency" element={<EmergencyRights />} />
        </Routes>
      </main>

      <Footer />

      {/* Login / Register Modal */}
      {authModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content auth-modal">
            <div className="modal-header">
              <h3>
                <FaScaleBalanced className="modal-icon" />
                {isRegistering ? 'Register Citizen Account' : 'Login to LegalAI'}
              </h3>
              <button onClick={() => setAuthModalOpen(false)} className="close-btn"><FaXmark /></button>
            </div>

            {authError && <div className="auth-error-banner">{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="modal-form">
              {isRegistering && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={authLoading} className="btn btn-primary btn-block">
                {authLoading ? 'Processing...' : isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="auth-modal-switch">
              {isRegistering ? (
                <p>Already have an account? <button onClick={() => setIsRegistering(false)} className="link-btn">Sign In</button></p>
              ) : (
                <p>New to LegalAI Sri Lanka? <button onClick={() => setIsRegistering(true)} className="link-btn">Create Free Account</button></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
