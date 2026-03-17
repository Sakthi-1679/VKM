import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'ta' | 'en';

type LanguageContextProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (ta: string, en?: string, replacements?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextProps>({
  language: 'ta',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (ta) => ta,
});

const STORAGE_KEY = 'vkm_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ta');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'en' || saved === 'ta') {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const translate = React.useCallback((ta: string, en?: string, replacements?: Record<string, string | number>) => {
    let value = language === 'ta' ? ta : (en ?? ta);
    if (replacements) {
      Object.entries(replacements).forEach(([key, val]) => {
        value = value.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
      });
    }
    return value;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(prev => prev === 'ta' ? 'en' : 'ta'),
    t: translate,
  }), [language, translate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
