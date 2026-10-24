import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Eye, Film, ArrowRight, Sparkles } from 'lucide-react';
import { dataService, INITIAL_VIDEO_REELS } from '../../services/dataService';

export const UrbanVideoReels = ({ title, subtitle, badge }) => {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReels = async () => {
    try {
      const data = await dataService.getVideoReels();
      const active = (data || []).filter((v) => v.is_active !== false);
      setReels(active.length > 0 ? active : INITIAL_VIDEO_REELS);
    } catch (e) {
      console.warn('Error loading video reels:', e);
      setReels(INITIAL_VIDEO_REELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels();

    const handleUpdate = () => {
      loadReels();
    };
    window.addEventListener('urgut_store_videos_updated', handleUpdate);
    return () => {
      window.removeEventListener('urgut_store_videos_updated', handleUpdate);
    };
  }, []);

  const handleOpenVideo = (reel) => {
    navigate(`/watch/${reel.id}`);
  };

  if (!loading && reels.length === 0) {
    return null;
  }

  return (
    <section id="video_reels" className="urban-video-reels-section" style={{ padding: '3rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.12), rgba(245, 158, 11, 0.14))',
                color: 'var(--figma-coral, #FA6D58)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.4rem'
              }}
            >
              <Film size={13} />
              <span>{badge || 'WATCH & SHOP'}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
              {title || 'Watch & Shop • Jonli Mebel Videolari'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, maxWidth: '600px' }}>
              {subtitle || 'Mebellarni jonli videolarda ko‘ring va bir bosishda xarid qiling'}
            </p>
          </div>

          <Link
            to="/watch"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--figma-coral, #FA6D58)',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
          >
            <span>Barcha Videolar ({reels.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 5-Column Grid / Carousel */}
        <div
          className="urban-reels-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => handleOpenVideo(reel)}
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                paddingTop: '155%',
                backgroundColor: '#111827',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="urban-reel-card"
              role="button"
              tabIndex={0}
              aria-label={`Videoni ko'rish: ${reel.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenVideo(reel);
                }
              }}
            >
              {/* Background Thumbnail */}
              <img
                src={reel.videoThumb || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80'}
                alt={reel.title}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
                className="urban-reel-thumb-img"
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.88) 100%)',
                  zIndex: 1
                }}
              />

              {/* Views badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.22rem 0.55rem',
                  borderRadius: '999px',
                  zIndex: 2,
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <Eye size={12} />
                <span>{reel.views || '15k'}</span>
              </div>

              {/* YouTube / Video Indicator Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  zIndex: 2,
                  letterSpacing: '0.04em'
                }}
              >
                HD REEL
              </div>

              {/* Play icon in center */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                  transition: 'all 0.25s ease'
                }}
                className="urban-reel-play-btn"
              >
                <Play size={20} fill="#1f2937" style={{ marginLeft: '2px' }} />
              </div>

              {/* Title & Action at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.9rem',
                  left: '0.9rem',
                  right: '0.9rem',
                  zIndex: 2,
                  color: '#ffffff'
                }}
              >
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '0.35rem'
                  }}
                >
                  {reel.title}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                  <span>Videoni tomosha qilish</span>
                  <ArrowRight size={11} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .urban-reel-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.22);
        }
        .urban-reel-card:hover .urban-reel-thumb-img {
          transform: scale(1.06);
        }
        .urban-reel-card:hover .urban-reel-play-btn {
          transform: translate(-50%, -50%) scale(1.18);
          background-color: var(--figma-coral, #FA6D58) !important;
          color: #ffffff !important;
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
            gap: 1rem !important;
          }
          .urban-reels-scroll::-webkit-scrollbar {
            display: none;
          }
          .urban-reel-card {
            flex: 0 0 170px !important;
            min-width: 170px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
