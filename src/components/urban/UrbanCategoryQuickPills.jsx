import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService, getStored } from '../../services/dataService';
import { initialCategories } from '../../data/mockData';
import { Sparkles, ArrowRight, LayoutGrid, Flame } from 'lucide-react';

export const UrbanCategoryQuickPills = ({ title }) => {
  const [categories, setCategories] = useState(() => getStored('categories', initialCategories));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await dataService.getCategories();
        if (list && list.length > 0) {
          setCategories(list);
        }
      } catch (err) {
        console.warn('Error loading categories:', err);
      }
    };
    loadCategories();

    const handleUpdate = () => loadCategories();
    window.addEventListener('urgut_store_categories_updated', handleUpdate);
    return () => {
      window.removeEventListener('urgut_store_categories_updated', handleUpdate);
    };
  }, []);

  const activeCategories = (categories || []).filter((c) => c.is_active !== false);

  return (
    <div
      className="urban-category-quickpills"
      style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.25rem 0 1rem',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--figma-coral, #FA6D58)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
              {title || "Mebel Toifalari & Kategoriyalar"}
            </h3>
          </div>
          <Link
            to="/categories"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--figma-coral, #FA6D58)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>Barcha toifalar</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Scrollable Row of Pills */}
        <div
          className="urban-quickpills-scroll no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Quick Pill: Barchasi */}
          <Link
            to="/furniture"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              width: '84px',
              transition: 'transform 0.2s ease'
            }}
            className="urban-quickpill-item"
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.16) 0%, rgba(250, 109, 88, 0.06) 100%)',
                border: '1.5px solid rgba(250, 109, 88, 0.28)',
                color: 'var(--figma-coral, #FA6D58)',
                boxShadow: '0 4px 14px rgba(250, 109, 88, 0.12)'
              }}
            >
              <LayoutGrid size={28} strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginTop: '0.45rem',
                textAlign: 'center'
              }}
            >
              Barchasi
            </span>
          </Link>

          {/* Quick Pill: Aksiyalar */}
          <Link
            to="/furniture?filter=discount"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              width: '84px',
              transition: 'transform 0.2s ease'
            }}
            className="urban-quickpill-item"
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(239, 68, 68, 0.06) 100%)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)',
                position: 'relative'
              }}
            >
              <Flame size={28} strokeWidth={2.2} />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.58rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: '980px',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                }}
              >
                AKSIYA
              </span>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#ef4444',
                marginTop: '0.45rem',
                textAlign: 'center'
              }}
            >
              Chegirmalar
            </span>
          </Link>

          {/* Dynamic Categories from Super Admin Database */}
          {activeCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/furniture?category=${cat.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                width: '84px',
                transition: 'transform 0.2s ease'
              }}
              className="urban-quickpill-item"
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                <img
                  src={cat.image_url || cat.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginTop: '0.45rem',
                  textAlign: 'center',
                  lineHeight: 1.25,
                  maxWidth: '84px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={cat.name}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .urban-quickpill-item:hover {
          transform: translateY(-3px);
        }
        .urban-quickpill-item:hover img {
          transform: scale(1.08);
        }
        .urban-quickpill-item:hover div {
          border-color: var(--figma-coral, #FA6D58) !important;
          box-shadow: 0 8px 18px rgba(250, 109, 88, 0.2) !important;
        }
      `}</style>
    </div>
  );
};
