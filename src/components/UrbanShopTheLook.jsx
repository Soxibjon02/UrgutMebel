import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Eye, X, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanShopTheLook = ({ title, subtitle, badge, roomImage, onQuickBuy }) => {
  const { t } = useLanguage();
  const [activePin, setActivePin] = useState(null);

  const roomItems = [
    {
      id: 'pin-sofa',
      x: 48, // percent
      y: 62, // percent
      name: '“Samarqand Grand” 3 O‘rinli Divan',
      category: 'Yashash xonasi',
      price: 6400000,
      oldPrice: 7800000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'pin-table',
      x: 72,
      y: 75,
      name: 'Tabiiy Eman Jurnal Stoli',
      category: 'Stollar',
      price: 1350000,
      oldPrice: 1700000,
      rating: 4.85,
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=400&q=80',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'pin-lamp',
      x: 18,
      y: 45,
      name: 'Skandinav Stilidagi Metall Torcher',
      category: 'Yoritish & Dekor',
      price: 680000,
      oldPrice: 850000,
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'pin-armchair',
      x: 82,
      y: 55,
      name: '“Urgut Zarafshon” Qulay Kreslo',
      category: 'Kreslolar',
      price: 2400000,
      oldPrice: 2900000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1580481077195-c9233634e70e?auto=format&fit=crop&w=400&q=80',
      link: '/furniture?category=cat-living'
    }
  ];

  return (
    <section className="urban-shop-look-section" style={{ padding: '4.5rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(250, 109, 88, 0.12)',
              color: 'var(--figma-coral, #FA6D58)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={14} /> {badge || t('look.badge', 'Interyer Ilhomi')}
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem'
            }}
          >
            {title || t('look.title', 'Xonadoningiz Ko‘rinishidan Ilhomlaning')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 auto', maxWidth: '620px' }}>
            {subtitle || t('look.desc', 'Rasmdagi yashil nuqtalarni bosing va xonani to‘ldirgan har bir mebelning narxi hamda xususiyatlarini bilib oling.')}
          </p>
        </div>

        {/* Interactive Staged Room Frame */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl, 24px)',
            overflow: 'hidden',
            aspectRatio: '16/9',
            minHeight: '440px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.14)',
            border: '1px solid var(--border-subtle)'
          }}
          className="urban-look-stage"
          onClick={() => setActivePin(null)}
        >
          {/* Main Background Staged Image */}
          <img
            src={roomImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"}
            alt="Styled Living Room by Urgut Mebel"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Interactive Hotspot Pins */}
          {roomItems.map((item) => {
            const isSelected = activePin?.id === item.id;
            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: `${item.y}%`,
                  left: `${item.x}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 30 : 10
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePin(isSelected ? null : item);
                }}
              >
                {/* Pulsing Hotspot Button */}
                <button
                  type="button"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--figma-coral, #FA6D58)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--figma-coral, #FA6D58)',
                    border: '3px solid #ffffff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  className="urban-hotspot-btn"
                  title={item.name}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.7)',
                      animation: 'pulse-ring 2s infinite'
                    }}
                  />
                  <ShoppingBag size={16} />
                </button>

                {/* Hotspot Popup Card */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '48px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '260px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-lg, 16px)',
                      padding: '0.85rem',
                      boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      zIndex: 40,
                      animation: 'fadeInUp 0.25s ease'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setActivePin(null)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <X size={15} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '65px',
                          height: '65px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--figma-coral, #FA6D58)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {item.category}
                        </div>
                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#f59e0b' }}>
                          <Star size={11} fill="#f59e0b" />
                          <span style={{ fontWeight: 700 }}>{item.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {item.price.toLocaleString()} so‘m
                      </span>
                      {item.oldPrice && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                          {item.oldPrice.toLocaleString()} so‘m
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      <Link
                        to={item.link}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.4rem', justifyContent: 'center' }}
                      >
                        <Eye size={12} />
                        <span>Ko‘rish</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onQuickBuy && onQuickBuy(item)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.4rem', justifyContent: 'center' }}
                      >
                        <ShoppingBag size={12} />
                        <span>Xarid</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .urban-hotspot-btn:hover {
          transform: scale(1.15);
          background-color: var(--figma-coral, #FA6D58) !important;
          color: #ffffff !important;
        }
      `}</style>
    </section>
  );
};
