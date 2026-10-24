import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const UrbanTopCategoriesCurated = () => {
  return (
    <section className="urban-top-categories-section" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          Top Categories
        </h2>

        <div
          className="urban-curated-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem'
          }}
        >
          {/* Left Large Card: Hydraulic Storage Beds */}
          <Link
            to="/furniture?category=cat-bedroom"
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              minHeight: '440px',
              backgroundColor: '#1f1e24',
              backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
            }}
            className="urban-curated-large-card"
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 800, margin: '0 0 0.35rem', color: '#ffffff' }}>
                  Hydraulic Storage Beds | 140+ Options
                </h3>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6' }}>
                  from <span style={{ color: '#fbbf24', fontWeight: 900 }}>2,699,000 so‘m</span>
                </div>
              </div>

              {/* Circular arrow button */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#4a1525',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <ArrowUpRight size={22} />
              </div>
            </div>
          </Link>

          {/* Right 4-Pack Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem'
            }}
            className="urban-curated-subpack"
          >
            {/* 1. 3-Seater Sofas */}
            <Link
              to="/furniture?category=cat-living"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                color: '#ffffff'
              }}
              className="urban-curated-subcard"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>3-Seater Sofas | 1200+ Options</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>from 1,399,000 so‘m</div>
              </div>
            </Link>

            {/* 2. Shoe Racks */}
            <Link
              to="/furniture?category=cat-wardrobe"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                color: '#ffffff'
              }}
              className="urban-curated-subcard"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Shoe Racks | 150+ Options</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>from 299,000 so‘m</div>
              </div>
            </Link>

            {/* 3. Coffee Tables */}
            <Link
              to="/furniture?category=cat-living"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                color: '#ffffff'
              }}
              className="urban-curated-subcard"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Coffee Tables | 550+ Options</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>from 249,000 so‘m</div>
              </div>
            </Link>

            {/* 4. Dining Sets */}
            <Link
              to="/furniture?category=cat-dining"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '210px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                color: '#ffffff'
              }}
              className="urban-curated-subcard"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Dining Sets | 750+ Options</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>from 1,699,000 so‘m</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .urban-curated-large-card:hover, .urban-curated-subcard:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.14);
        }
        @media (max-width: 900px) {
          .urban-curated-grid {
            grid-template-columns: 1fr !important;
          }
          .urban-curated-large-card {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
