import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';

export const UrbanDealZone = () => {
  return (
    <section className="urban-deal-zone-section" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          Deal Zone
        </h2>

        <div
          className="urban-deal-zone-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem'
          }}
        >
          {/* Deal 1: Best Buys Under 1,000,000 */}
          <Link
            to="/furniture?filter=under1m"
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '220px',
              backgroundColor: '#f9f5f0',
              backgroundImage: 'url(https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=700&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            className="urban-deal-card"
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,20,22,0.85) 0%, rgba(20,20,22,0.35) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Hamyonbop Tanlovlar
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0.3rem 0 0', color: '#ffffff', lineHeight: 1.2 }}>
                Best Buys <br /> Under 1,000,000 so‘m
              </h3>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Ko‘rish</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Deal 2: Clearance Sale */}
          <Link
            to="/furniture?filter=discount"
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '220px',
              backgroundColor: '#f3e8ff',
              backgroundImage: 'url(https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=700&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            className="urban-deal-card"
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,10,30,0.85) 0%, rgba(30,10,30,0.4) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Katta Qoldiq Aksiyasi
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0.3rem 0 0', color: '#ffffff', lineHeight: 1.2 }}>
                Clearance Sale <br />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f3f4f6' }}>140+ Options</span>
              </h3>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Aksiyaga O‘tish</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Deal 3: Decor Sale Up to 70% Off */}
          <Link
            to="/furniture?category=cat-decor"
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '220px',
              backgroundColor: '#ecfdf5',
              backgroundImage: 'url(https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            className="urban-deal-card"
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,30,20,0.85) 0%, rgba(10,30,20,0.4) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Uy Dekori va Yorug‘lik
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0.3rem 0 0', color: '#ffffff', lineHeight: 1.2 }}>
                Decor Sale <br />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>Up to 70% Off</span>
              </h3>
            </div>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Katalogni Ko‘rish</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .urban-deal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }
        @media (max-width: 768px) {
          .urban-deal-zone-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            padding-bottom: 0.5rem;
          }
          .urban-deal-zone-grid::-webkit-scrollbar {
            display: none;
          }
          .urban-deal-card {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
