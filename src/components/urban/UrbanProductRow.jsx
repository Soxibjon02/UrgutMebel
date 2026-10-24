import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';

export const UrbanProductRow = ({ title, viewAllLink = '/furniture', products = [], onQuickBuy }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="urban-product-row-section" style={{ padding: '2.5rem 0 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
              fontWeight: 700,
              color: 'var(--text-main)',
              margin: 0,
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </h2>

          <Link
            to={viewAllLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--figma-coral, #FA6D58)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease'
            }}
            className="urban-view-all-link"
          >
            <span>View All</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 4-Item Grid / Mobile Scroll */}
        <div
          className="urban-product-carousel-track"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem'
          }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="urban-product-card"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Image Box */}
              <div
                style={{
                  position: 'relative',
                  paddingTop: '80%',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  className="urban-card-img"
                />

                {item.discount && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.6rem',
                      left: '0.6rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.95)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.18rem 0.5rem',
                      borderRadius: '4px',
                      zIndex: 2,
                      letterSpacing: '0.02em'
                    }}
                  >
                    {item.discount}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-light)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    marginBottom: '0.25rem'
                  }}
                >
                  {item.brand || 'Urgut Mebel'}
                </div>

                <h3
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: 'var(--text-main)',
                    margin: '0 0 0.6rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '2.4em'
                  }}
                  title={item.name}
                >
                  <Link to={`/furniture`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.name}
                  </Link>
                </h3>

                {/* Price block */}
                <div style={{ marginTop: 'auto', paddingTop: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--text-main)'
                      }}
                    >
                      {Number(item.price).toLocaleString()} so‘m
                    </span>
                    {item.original_price && (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-light)',
                          textDecoration: 'line-through'
                        }}
                      >
                        {Number(item.original_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action */}
                <div style={{ marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onQuickBuy) onQuickBuy(item);
                      else window.location.href = '/furniture';
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      padding: '0.38rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Zap size={13} />
                    <span>Tezkor Xarid</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .urban-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        .urban-product-card:hover .urban-card-img {
          transform: scale(1.05);
        }
        @media (max-width: 992px) {
          .urban-product-carousel-track {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem !important;
          }
        }
        @media (max-width: 600px) {
          .urban-product-carousel-track {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            padding-bottom: 0.5rem;
          }
          .urban-product-carousel-track::-webkit-scrollbar {
            display: none;
          }
          .urban-product-card {
            flex: 0 0 210px !important;
            min-width: 210px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
