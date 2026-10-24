import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanSecondaryNav = () => {
  const { t } = useLanguage();

  const links = [
    { to: '/furniture?category=cat-living', label: t('nav.living', 'Yashash Xonasi'), icon: '🛋️' },
    { to: '/furniture?category=cat-bedroom', label: t('nav.bedroom', 'Yotoqxona'), icon: '🛏️' },
    { to: '/furniture?category=cat-dining', label: t('nav.dining', 'Oshxona & Ovqatlanish'), icon: '🍽️' },
    { to: '/furniture?category=cat-wardrobe', label: t('nav.wardrobes', 'Shkaflar & Garderob'), icon: '🚪' },
    { to: '/furniture?category=cat-office', label: t('nav.office', 'Ishxona & Ofis'), icon: '💼' },
    { to: '/furniture?category=cat-kids', label: t('nav.kids', 'Bolalar Xonasi'), icon: '👶' },
    { to: '/custom-order', label: t('nav.custom_order', 'Maxsus Buyurtma'), icon: '✨', highlight: true },
    { to: '/stores', label: t('nav.stores', 'Showroomlar'), icon: '📍' },
    { to: '/furniture?filter=discount', label: t('nav.deals', 'Aksiyalar'), icon: '🔥', badge: 'Chegirma' }
  ];

  return (
    <nav
      className="urban-secondary-nav"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          padding: '0.65rem 1.25rem'
        }}
      >
        {links.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              color: isActive || item.highlight
                ? 'var(--figma-coral, #FA6D58)'
                : 'var(--text-main)',
              padding: '0.35rem 0',
              position: 'relative',
              transition: 'color 0.2s ease',
              flexShrink: 0
            })}
            className="urban-sec-link"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>

            {item.badge && (
              <span
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  marginLeft: '0.2rem'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <style>{`
        .urban-secondary-nav::-webkit-scrollbar {
          display: none;
        }
        .urban-sec-link:hover {
          color: var(--figma-coral, #FA6D58) !important;
        }
        .urban-sec-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--figma-coral, #FA6D58);
          transition: width 0.25s ease;
        }
        .urban-sec-link:hover::after,
        .urban-sec-link.active::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
};
