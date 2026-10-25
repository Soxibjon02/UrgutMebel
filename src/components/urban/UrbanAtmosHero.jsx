import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const UrbanAtmosHero = () => {
  return (
    <section className="urban-atmos-section" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div
          className="urban-atmos-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '1rem',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          {/* Main Atmos Card (Left) */}
          <Link
            to="/collections"
            style={{
              position: 'relative',
              minHeight: '440px',
              backgroundColor: '#231518',
              backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2.5rem',
              textDecoration: 'none',
              color: '#ffffff'
            }}
            className="urban-atmos-main-card"
          >
            {/* Dark luxury wine vignette overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(35, 21, 24, 0.4) 0%, rgba(35, 21, 24, 0.85) 100%)',
                zIndex: 1
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  marginBottom: '0.3rem'
                }}
              >
                THE NEW
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  margin: 0,
                  lineHeight: 1,
                  color: '#ffffff',
                  textTransform: 'uppercase'
                }}
              >
                ATMOS
              </h2>
              <div
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#f3f4f6',
                  marginTop: '0.35rem'
                }}
              >
                COLLECTION
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #ffffff',
                  paddingBottom: '0.2rem'
                }}
              >
                EXPLORE OUR NEW COLLECTION
              </span>
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* 4 Category Tiles (Right 2x2 Grid) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}
            className="urban-atmos-subtiles"
          >
            {/* Tile 1: Living Room */}
            <Link
              to="/furniture?category=cat-1"
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1.25rem'
              }}
              className="urban-atmos-tile"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  LIVING ROOM
                </span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tile 2: Bedroom */}
            <Link
              to="/furniture?category=cat-2"
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1.25rem'
              }}
              className="urban-atmos-tile"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  BEDROOM
                </span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tile 3: Dining Room */}
            <Link
              to="/furniture?category=cat-3"
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1.25rem'
              }}
              className="urban-atmos-tile"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  DINING ROOM
                </span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tile 4: Explore All */}
            <Link
              to="/collections"
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundColor: '#7c2d37',
                backgroundImage: 'linear-gradient(135deg, #6b2128 0%, #a83e4a 100%)',
                textDecoration: 'none',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.25rem',
                textAlign: 'center'
              }}
              className="urban-atmos-tile"
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>EXPLORE ALL</span>
                <ArrowRight size={15} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '0.35rem', opacity: 0.9 }}>
                63+
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .urban-atmos-main-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
        }
        .urban-atmos-tile:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        @media (max-width: 900px) {
          .urban-atmos-grid {
            grid-template-columns: 1fr !important;
          }
          .urban-atmos-main-card {
            min-height: 320px !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};
