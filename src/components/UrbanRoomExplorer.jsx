import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanRoomExplorer = () => {
  const { t } = useLanguage();

  const rooms = [
    {
      id: 'living',
      name: t('rooms.living', 'Yashash Xonasi'),
      sub: 'Divanlar, jurnal stollari, TV-tumba',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      badge: '140+ model',
      link: '/furniture?category=cat-living'
    },
    {
      id: 'bedroom',
      name: t('rooms.bedroom', 'Yotoqxona'),
      sub: 'Karavotlar, matras, komod va tumba',
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      badge: '95+ model',
      link: '/furniture?category=cat-bedroom'
    },
    {
      id: 'dining',
      name: t('rooms.dining', 'Oshxona & Ovqatlanish'),
      sub: 'Oshxona garniturlari, stol-stullar',
      img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
      badge: '80+ model',
      link: '/furniture?category=cat-dining'
    },
    {
      id: 'storage',
      name: t('rooms.storage', 'Shkaflar & Garderob'),
      sub: 'Kupe shkaflar, kiyim javonlari',
      img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
      badge: '60+ model',
      link: '/furniture?category=cat-wardrobe'
    },
    {
      id: 'office',
      name: t('rooms.office', 'Ishxona & Kabinet'),
      sub: 'Yozuv stollari, ergonomik kreslolar',
      img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
      badge: '45+ model',
      link: '/furniture?category=cat-office'
    },
    {
      id: 'kids',
      name: t('rooms.kids', 'Bolalar Xonasi'),
      sub: 'Ikki qavatli krovatlar, dars stollari',
      img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
      badge: '35+ model',
      link: '/furniture?category=cat-kids'
    }
  ];

  return (
    <section className="urban-room-explorer" style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
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
              <Compass size={14} /> {t('rooms.badge', 'Xonalar Bo‘yicha Saralash')}
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              {t('rooms.title', 'Har Bir Xonangiz Uchun Shinamlik')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.5rem 0 0', maxWidth: '600px' }}>
              {t('rooms.desc', 'Uyingizning har bir burchagiga mos keluvchi estetik va sifatli mebel kolleksiyalarini kashf eting.')}
            </p>
          </div>

          <Link
            to="/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--figma-coral, #FA6D58)',
              fontWeight: 700,
              fontSize: '0.92rem',
              textDecoration: 'none'
            }}
          >
            <span>{t('rooms.all_rooms', 'Barcha xonalarni ko‘rish')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Circular / Rounded Room Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {rooms.map((room) => (
            <Link
              key={room.id}
              to={room.link}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                textAlign: 'center',
                group: 'room-card'
              }}
              className="urban-room-card"
            >
              {/* Circular Image Container with Hover Zoom & Border */}
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '3px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginBottom: '1rem'
                }}
                className="urban-room-circle"
              >
                <img
                  src={room.img}
                  alt={room.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  className="urban-room-img"
                />
                
                {/* Floating Count Badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(20, 20, 22, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {room.badge}
                </span>
              </div>

              {/* Title & Sub */}
              <h3
                style={{
                  margin: '0 0 0.25rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  transition: 'color 0.2s ease'
                }}
                className="urban-room-name"
              >
                {room.name}
              </h3>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.35,
                  maxWidth: '160px',
                  display: 'inline-block'
                }}
              >
                {room.sub}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .urban-room-card:hover .urban-room-circle {
          border-color: var(--figma-coral, #FA6D58) !important;
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 16px 36px rgba(250, 109, 88, 0.22) !important;
        }
        .urban-room-card:hover .urban-room-img {
          transform: scale(1.1);
        }
        .urban-room-card:hover .urban-room-name {
          color: var(--figma-coral, #FA6D58) !important;
        }
      `}</style>
    </section>
  );
};
