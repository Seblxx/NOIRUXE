import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative overflow-hidden px-3 py-1.5 text-white/60 hover:text-white transition-colors"
      style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.1em' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="block text-sm font-bold tracking-widest"
        >
          {language.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
