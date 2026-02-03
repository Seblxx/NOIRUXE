import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, enText: string, frText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, enText: string, frText: string): string => {
    return language === 'fr' ? frText : enText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook to get translated field
export const useTranslatedField = <T extends Record<string, any>>(
  obj: T | undefined,
  fieldPrefix: string
): string => {
  const { language } = useLanguage();
  if (!obj) return '';
  
  const enField = `${fieldPrefix}_en` as keyof T;
  const frField = `${fieldPrefix}_fr` as keyof T;
  
  return language === 'fr' && obj[frField] 
    ? String(obj[frField]) 
    : String(obj[enField] || '');
};
