import React from 'react';
import { Link } from 'react-router-dom';

export const UrbanNewArrivalsTiles = () => {
  const tiles = [
    {
      id: 'beds',
      title: 'BEDS',
      subtitle: 'Refresh and ignite serenity',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      link: '/furniture?category=cat-beds'
    },
    {
      id: 'sofas',
      title: 'SOFAS',
      subtitle: 'Invite moments of togetherness',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      link: '/furniture?category=cat-sofas'
    },
    {
      id: 'dining',
      title: 'DINING SETS',
      subtitle: 'Where memories meet meals',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      link: '/furniture?category=cat-dining-sets'
    }
  ];

  return (
    <section className="urban-new-arrivals-section" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          New Arrivals
        </h2>

        <div
          className="urban-new-arrivals-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem'
          }}
        >
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              to={tile.link}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '280px',
                backgroundImage: `url(${tile.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '1.5rem',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="urban-arrival-card"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 1
                }}
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: 0,
                    color: '#ffffff'
                  }}
                >
                  {tile.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#e5e7eb',
                    margin: '0.3rem 0 0',
                    fontWeight: 500,
                    letterSpacing: '0.02em'
                  }}
                >
                  {tile.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .urban-arrival-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }
        @media (max-width: 768px) {
          .urban-new-arrivals-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            padding-bottom: 0.5rem;
          }
          .urban-new-arrivals-grid::-webkit-scrollbar {
            display: none;
          }
          .urban-arrival-card {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
