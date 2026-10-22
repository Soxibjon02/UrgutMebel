import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'uz', name: "O‘zbekcha", short: 'UZ', flag: '🇺🇿' },
  { code: 'ru', name: "Русский", short: 'RU', flag: '🇷🇺' },
  { code: 'en', name: "English", short: 'EN', flag: '🇬🇧' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_language');
      if (saved && ['uz', 'ru', 'en'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Error reading language preference:', e);
    }
    return 'uz'; // Default language is Uzbek
  });

  const setLanguage = useCallback((langCode) => {
    if (['uz', 'ru', 'en'].includes(langCode)) {
      setLanguageState(langCode);
      try {
        localStorage.setItem('urgut_language', langCode);
        document.documentElement.lang = langCode;
      } catch (e) {
        console.warn('Error saving language preference:', e);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Translate key using dotted notation e.g. t('nav.home')
   * Fallback hierarchy: selected language -> uzbek -> key
   */
  const t = useCallback((key, fallback = '') => {
    if (!key) return '';
    const keys = key.split('.');
    
    let current = translations[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        current = null;
        break;
      }
    }

    if (current !== null && current !== undefined) {
      return current;
    }

    // Fallback to Uzbek
    let uzFallback = translations.uz;
    for (const k of keys) {
      if (uzFallback && typeof uzFallback === 'object' && k in uzFallback) {
        uzFallback = uzFallback[k];
      } else {
        uzFallback = null;
        break;
      }
    }

    if (uzFallback !== null && uzFallback !== undefined) {
      return uzFallback;
    }

    return fallback || key;
  }, [language]);

  /**
   * Helper for multi-language entities such as banners, products, categories
   * Checks entity[field_en], entity[field_ru], entity[field_uz], and entity[field]
   */
  const getLocalized = useCallback((entity, field) => {
    if (!entity || !field) return '';

    if (language === 'en') {
      return entity[`${field}_en`] || entity[`${field}_uz`] || entity[field] || '';
    }
    if (language === 'ru') {
      return entity[`${field}_ru`] || entity[`${field}_uz`] || entity[field] || '';
    }
    // Uzbek
    return entity[`${field}_uz`] || entity[field] || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized, languages: LANGUAGES }}>
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
