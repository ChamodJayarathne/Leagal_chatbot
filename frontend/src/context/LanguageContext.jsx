import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Try to load from localStorage or default to english
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('justice-bot-lang') || 'english';
  });

  useEffect(() => {
    localStorage.setItem('justice-bot-lang', language);
    // Update document lang attribute
    const langCode = language === 'english' ? 'en' : language === 'sinhala' ? 'si' : 'ta';
    document.documentElement.lang = langCode;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
