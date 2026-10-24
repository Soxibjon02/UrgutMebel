import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, HelpCircle, Gift, Truck, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const UrbanTopBar = () => {
  const { t, language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('Urgut');
  const [cityDropdown, setCityDropdown] = useState(false);

  const cities = ['Urgut', 'Samarqand', 'Toshkent', 'Buxoro', 'Navoiy', 'Qarshi'];

  return (
    <div
      className="urban-topbar"
      style={{
        backgroundColor: '#18191d',
        color: '#d1d5db',
        fontSize: '0.78rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.35rem 0',
        zIndex: 901
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '1rem',
          overflow: 'hidden'
        }}
      >
        {/* Left: Store Locator & Delivery Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
          <Link
            to="/stores"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#f3f4f6',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.76rem'
            }}
          >
            <MapPin size={13} color="var(--figma-coral, #FA6D58)" />
            <span>{t('topbar.find_store', 'Do‘konlarimiz')}</span>
          </Link>

          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

          {/* Delivery location selector */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setCityDropdown(!cityDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'none',
                border: 'none',
                color: '#d1d5db',
                fontSize: '0.76rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <Truck size={13} color="#9ca3af" />
              <span>{t('topbar.deliver_to', 'Yetkazib berish:')} <strong>{selectedCity}</strong></span>
              <ChevronDown size={12} />
            </button>

            {cityDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.35rem',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  padding: '0.4rem',
                  minWidth: '150px',
                  zIndex: 999
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#6b7280', padding: '0.25rem 0.5rem', fontWeight: 700 }}>
                  Shahar yoki hududni tanlang:
                </div>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem 0.5rem',
                      fontSize: '0.78rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: selectedCity === city ? 'var(--figma-coral, #FA6D58)' : '#374151',
                      fontWeight: selectedCity === city ? 700 : 500
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check size={12} color="var(--figma-coral, #FA6D58)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Deal Ticker */}
        <div
          className="urban-topbar-center-promo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(250, 109, 88, 0.2)',
              color: 'var(--figma-coral, #FA6D58)',
              fontWeight: 800,
              fontSize: '0.68rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              letterSpacing: '0.04em'
            }}
          >
            CHEGIRMA
          </span>
          <span style={{ fontSize: '0.78rem' }}>
            500 000 so‘mgacha qo‘shimcha chegirma va bepul yetkazib berish!
          </span>
          <Link
            to="/furniture"
            style={{
              color: 'var(--figma-coral, #FA6D58)',
              fontWeight: 700,
              textDecoration: 'underline',
              marginLeft: '0.25rem'
            }}
          >
            Xarid qilish
          </Link>
        </div>

        {/* Right: Gift cards, Help, Franchise */}
        <div
          className="urban-topbar-right-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexShrink: 0
          }}
        >
          <Link
            to="/custom-order"
            style={{ color: '#d1d5db', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Gift size={12} color="#fbbf24" />
            <span>Sovg‘a Sertifikatlari</span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <Link
            to="/about"
            style={{ color: '#d1d5db', textDecoration: 'none' }}
          >
            Hamkorlik (Franshiza)
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <Link
            to="/faq"
            style={{ color: '#d1d5db', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <HelpCircle size={12} />
            <span>Yordam</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .urban-topbar-center-promo, .urban-topbar-right-links {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
