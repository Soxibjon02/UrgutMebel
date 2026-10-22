import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CategoryCardsGrid = ({
  categories = [],
  products = [],
  showAllLink = true,
  title,
  subtitle
}) => {
  const { t } = useLanguage();

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.25rem'
        }}
      >
        <div>
          <span
            style={{
              color: 'var(--figma-coral, #FA6D58)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.45rem'
            }}
          >
            <Sparkles size={14} />
            {t('categories.section_badge', 'Kategoriyalar')}
          </span>
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.2,
              margin: 0
            }}
          >
            {title || t('categories.popular_categories', 'Mebel Kategoriyalari')}
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              margin: '0.45rem 0 0',
              maxWidth: '560px'
            }}
          >
            {subtitle || t('categories.section_desc', 'Xonadoningiz va ishxonangiz uchun saralangan, qulay va uzoq yillar xizmat qiladigan mebellar to‘plami.')}
          </p>
        </div>

        {showAllLink && (
          <Link
            to="/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: 'var(--figma-coral, #FA6D58)',
              textDecoration: 'none'
            }}
            className="category-viewall-link"
          >
            <span>{t('categories.view_all', 'Barcha toifalar')}</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* 6 Category Luxury Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
        className="luxury-categories-grid"
      >
        {categories.map((c) => {
          const productCount = products.length > 0
            ? products.filter(p => p.category_id === c.id).length
            : null;

          return (
            <Link
              key={c.id}
              to={`/furniture?category=${c.id}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="luxury-category-card"
            >
              {/* Image Container with Dark Backdrop & Floating Count Badge */}
              <div
                style={{
                  height: '175px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}
                className="category-card-img-container"
              >
                <img
                  src={c.image_url}
                  alt={c.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.4s ease'
                  }}
                  className="category-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Badge on top right */}
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {productCount !== null && productCount > 0
                    ? `${productCount} ta mebel`
                    : 'To‘plam'}
                </span>
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  margin: '0 0 0.35rem',
                  lineHeight: 1.25
                }}
              >
                {c.name}
              </h3>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  margin: '0 0 1.15rem',
                  flex: 1
                }}
              >
                {c.description || 'Hashamatli va sifatli mebellar to‘plami.'}
              </p>

              {/* Bottom Interactive Link Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--figma-coral, #FA6D58)'
                }}
              >
                <span>Mebellarni ko‘rish</span>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(250, 109, 88, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  className="category-arrow-badge"
                >
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .luxury-category-card:hover {
          transform: translateY(-6px);
          border-color: var(--figma-coral, #FA6D58) !important;
          box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.35) !important;
        }
        .luxury-category-card:hover .category-card-img {
          transform: scale(1.05);
        }
        .luxury-category-card:hover .category-arrow-badge {
          background-color: var(--figma-coral, #FA6D58) !important;
          color: #ffffff !important;
          transform: translateX(3px);
        }
        .category-viewall-link:hover {
          gap: 0.65rem !important;
        }
      `}</style>
    </div>
  );
};
