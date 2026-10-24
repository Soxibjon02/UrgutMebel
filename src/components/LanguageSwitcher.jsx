import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSwitcher = ({ isMobile = false, direction = 'down' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%' }}>
        {LANGUAGES.map((l) => {
          const isActive = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.5rem',
                borderRadius: '10px',
                border: isActive ? '1.5px solid var(--figma-coral, #FA6D58)' : '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
                backgroundColor: isActive ? 'rgba(250, 109, 88, 0.12)' : 'var(--bg-secondary, #F8F9FA)',
                color: isActive ? 'var(--figma-coral, #FA6D58)' : 'var(--text-main, #1F2937)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 6px rgba(250, 109, 88, 0.2)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{l.flag}</span>
              <span>{l.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.8rem',
          borderRadius: 'var(--radius-full, 9999px)',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        aria-label="Tilni o'zgartirish"
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentLang.flag}</span>
        <span>{currentLang.short}</span>
        <ChevronDown size={13} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            ...(direction === 'up'
              ? { bottom: 'calc(100% + 6px)', top: 'auto', boxShadow: '0 -12px 30px rgba(0, 0, 0, 0.25)' }
              : { top: 'calc(100% + 6px)', bottom: 'auto', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)' }),
            right: 0,
            minWidth: '150px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            zIndex: 1000,
            overflow: 'hidden',
            padding: '0.35rem'
          }}
        >
          {LANGUAGES.map((l) => {
            const isActive = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-light, rgba(250, 109, 88, 0.15))' : 'transparent',
                  color: isActive ? 'var(--figma-coral)' : 'var(--text-main)',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
