import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('legal_ai_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('legal_ai_user');
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('legal_ai_user');
          localStorage.removeItem('legal_ai_token');
        }
      } else {
        // Auto-initialize guest session if no active login
        try {
          const res = await axios.post(`${API_BASE}/auth/guest`);
          setUser(res.data.user);
          setToken(res.data.token);
          localStorage.setItem('legal_ai_token', res.data.token);
          localStorage.setItem('legal_ai_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Guest session init warning:', err.message);
          setUser({ id: 'guest_local', name: 'Guest Citizen', isGuest: true });
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('legal_ai_token', res.data.token);
    localStorage.setItem('legal_ai_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_BASE}/auth/register`, userData);
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('legal_ai_token', res.data.token);
    localStorage.setItem('legal_ai_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = () => {
    setUser({ id: 'guest_local', name: 'Guest Citizen', isGuest: true });
    setToken(null);
    localStorage.removeItem('legal_ai_token');
    localStorage.removeItem('legal_ai_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
