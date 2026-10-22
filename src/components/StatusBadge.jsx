import React from 'react';
import { getStatusMeta } from '../utils/statusHelper';
import { useLanguage } from '../context/LanguageContext';

export const StatusBadge = ({
  status = 'NEW',
  format = 'bilingual', // 'bilingual' | 'auto' | 'uz' | 'en'
  size = 'md',          // 'sm' | 'md' | 'lg'
  style = {},
  className = ''
}) => {
  const { language } = useLanguage();
  
  // If format is 'auto', use current app language, else use requested format (default: 'bilingual')
  const effectiveFormat = format === 'auto' ? language : format;
  const meta = getStatusMeta(status, effectiveFormat);

  const sizeStyles = {
    sm: {
      padding: '0.15rem 0.5rem',
      fontSize: '0.72rem',
      gap: '0.3rem'
    },
    md: {
      padding: '0.25rem 0.65rem',
      fontSize: '0.8rem',
      gap: '0.4rem'
    },
    lg: {
      padding: '0.4rem 0.95rem',
      fontSize: '0.9rem',
      gap: '0.5rem'
    }
  }[size] || {
    padding: '0.25rem 0.65rem',
    fontSize: '0.8rem',
    gap: '0.4rem'
  };

  const isActive = ['NEW', 'PENDING', 'REVIEWING', 'IN_PRODUCTION', 'DELIVERING', 'SHIPPED'].includes((status || '').toUpperCase());

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '6px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        backgroundColor: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.3,
        ...sizeStyles,
        ...style
      }}
      title={`Holati: ${meta.labelUz} / Status: ${meta.labelEn}`}
    >
      {/* Animated glowing dot for in-progress statuses */}
      <span
        style={{
          width: size === 'sm' ? '6px' : '7px',
          height: size === 'sm' ? '6px' : '7px',
          borderRadius: '50%',
          backgroundColor: meta.color,
          display: 'inline-block',
          boxShadow: isActive ? `0 0 6px ${meta.color}` : 'none',
          animation: isActive ? 'statusPulse 2s infinite' : 'none'
        }}
      />
      <span>{meta.displayLabel}</span>
    </span>
  );
};
