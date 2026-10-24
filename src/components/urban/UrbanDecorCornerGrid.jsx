import React from 'react';
import { Link } from 'react-router-dom';
import { decorCategories } from '../../data/urbanProductsData';

export const UrbanDecorCornerGrid = () => {
  return (
    <section className="urban-decor-corner-section" style={{ padding: '2.5rem 0 3.5rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
            Decor for Every Corner
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
            Xonadoningizning har bir burchagini nafis dekoratsiya buyumlari bilan bezating
          </p>
        </div>

        <div
          className="urban-decor-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem'
          }}
        >
          {decorCategories.map((item, idx) => (
            <Link
              key={idx}
              to="/furniture"
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                paddingTop: '130%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              className="urban-decor-card"
            >
              {/* Product Photo */}
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Discount / Price Tag Top Left Pill */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.65rem',
                  left: '0.65rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  color: '#b91c1c',
                  backdropFilter: 'blur(4px)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.18rem 0.5rem',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  zIndex: 2
                }}
              >
                {item.discount}
              </div>

              {/* Title & Price Bar Bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(20, 20, 24, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.65rem 0.75rem',
                  color: '#ffffff',
                  zIndex: 2
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600, marginTop: '2px' }}>
                  {item.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .urban-decor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.12);
        }
        @media (max-width: 992px) {
          .urban-decor-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .urban-decor-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};
