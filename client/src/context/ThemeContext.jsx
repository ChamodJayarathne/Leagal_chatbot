import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Only two modes supported: 'light' (Legal Ivory / Light Mode) and 'contrast' (Reader Mode)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('legal_app_theme');
    if (saved === 'contrast' || saved === 'light') {
      return saved;
    }
    return 'light'; // Default to Light Mode
  });

  // Reading Text Size: 'normal', 'large', 'xl'
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('legal_app_font_size') || 'normal';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('legal_app_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('legal_app_font_size', fontSize);
  }, [fontSize]);

  // Toggle exclusively between Light Mode and Reader Mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'contrast' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
