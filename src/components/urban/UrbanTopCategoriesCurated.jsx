import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { dataService, getStored } from '../../services/dataService';
import { initialCategories } from '../../data/mockData';

export const UrbanTopCategoriesCurated = ({ title, subtitle }) => {
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
  const featuredCategory = activeCategories[0] || initialCategories[0];
  const otherCategories = activeCategories.slice(1, 5);

  return (
    <section className="urban-top-categories-section" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
              {title || "Top Mebel Kategoriyalari"}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {subtitle || "Urgutning eng sara duradgorlik durdonalari va zamonaviy xonadon to‘plamlari"}
            </p>
          </div>
          <Link
            to="/categories"
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              color: 'var(--figma-coral, #FA6D58)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Barcha toifalarni ko‘rish</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div
          className="urban-curated-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem'
          }}
        >
          {/* Left Large Card */}
          {featuredCategory && (
            <Link
              to={`/furniture?category=${featuredCategory.id}`}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                minHeight: '440px',
                backgroundColor: '#1f1e24',
                backgroundImage: `url(${featuredCategory.image_url || featuredCategory.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                color: '#ffffff',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              className="urban-curated-large-card"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.55rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem' }}>
                    Tanlangan To‘plam
                  </span>
                  <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 800, margin: '0 0 0.35rem', color: '#ffffff' }}>
                    {featuredCategory.name}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#e5e7eb', maxWidth: '380px' }}>
                    {featuredCategory.description || "Uyingiz uchun eng sara zamonaviy mebellar"}
                  </div>
                </div>

                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--figma-coral, #FA6D58)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(250, 109, 88, 0.4)'
                  }}
                >
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </Link>
          )}

          {/* Right 4-Pack Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem'
            }}
            className="urban-curated-subpack"
          >
            {otherCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/furniture?category=${cat.id}`}
                style={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  minHeight: '210px',
                  backgroundImage: `url(${cat.image_url || cat.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                  color: '#ffffff',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                  transition: 'transform 0.25s ease'
                }}
                className="urban-curated-subcard"
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#fbbf24', marginTop: '0.2rem', fontWeight: 700 }}>
                    Kolleksiyani ko‘rish &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .urban-curated-large-card:hover {
          transform: translateY(-3px);
        }
        .urban-curated-subcard:hover {
          transform: translateY(-3px);
        }
        @media (max-width: 900px) {
          .urban-curated-grid {
            grid-template-columns: 1fr !important;
          }
          .urban-curated-large-card {
            min-height: 280px !important;
          }
          .urban-curated-subpack {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .urban-curated-subpack {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
