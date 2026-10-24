import React, { useState } from 'react';
import { Play, Eye, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { videoReelsData } from '../../data/urbanProductsData';

export const UrbanVideoReels = () => {
  const [activeReel, setActiveReel] = useState(null);

  return (
    <section className="urban-video-reels-section" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Watch & Shop
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: '0.2rem 0 0' }}>
              Mebellarni jonli videolarda ko‘ring va bir bosishda xarid qiling
            </p>
          </div>
        </div>

        {/* 5-Column Carousel */}
        <div
          className="urban-reels-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem'
          }}
        >
          {videoReelsData.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                paddingTop: '160%',
                backgroundColor: '#1f2937',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              className="urban-reel-card"
            >
              {/* Background Thumbnail */}
              <img
                src={reel.videoThumb}
                alt={reel.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.85) 100%)',
                  zIndex: 1
                }}
              />

              {/* Views count badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.65rem',
                  left: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                  zIndex: 2
                }}
              >
                <Eye size={12} />
                <span>{reel.views}</span>
              </div>

              {/* Play icon in center */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease, background-color 0.2s ease'
                }}
                className="urban-reel-play-btn"
              >
                <Play size={18} fill="#1f2937" style={{ marginLeft: '2px' }} />
              </div>

              {/* Title at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.85rem',
                  left: '0.85rem',
                  right: '0.85rem',
                  zIndex: 2,
                  color: '#ffffff'
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {reel.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for previewing reel */}
        {activeReel && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 1000
            }}
            onClick={() => setActiveReel(null)}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#18191d',
                borderRadius: '16px',
                overflow: 'hidden',
                color: '#ffffff',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'relative', paddingTop: '120%', overflow: 'hidden' }}>
                <img
                  src={activeReel.videoThumb}
                  alt={activeReel.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                    {activeReel.views} Ko‘rildi
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.3rem 0 0.5rem' }}>
                    {activeReel.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#d1d5db', margin: 0, lineHeight: 1.4 }}>
                    {activeReel.desc}
                  </p>
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveReel(null);
                    window.location.href = '/furniture';
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
                >
                  <ShoppingBag size={16} />
                  <span>Mebelni Xarid Qilish</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .urban-reel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }
        .urban-reel-card:hover .urban-reel-play-btn {
          transform: translate(-50%, -50%) scale(1.15);
          background-color: var(--figma-coral, #FA6D58);
          color: #ffffff;
        }
        .urban-reel-card:hover .urban-reel-play-btn svg {
          fill: #ffffff !important;
        }
        @media (max-width: 900px) {
          .urban-reels-scroll {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            padding-bottom: 0.5rem;
          }
          .urban-reels-scroll::-webkit-scrollbar {
            display: none;
          }
          .urban-reel-card {
            flex: 0 0 160px !important;
            min-width: 160px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
