import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/furniture?category=${category.slug}`}
      style={{
        display: 'block',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '240px',
        boxShadow: 'var(--shadow-sm)',
        textDecoration: 'none'
      }}
      className="category-card"
    >
      <img
        src={category.image_url}
        alt={category.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="category-card-img"
      />

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(20,20,19,0.88) 0%, rgba(20,20,19,0.2) 60%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.5rem',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              {category.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#d6d3d1', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {category.description}
            </p>
          </div>

          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s, transform 0.2s'
            }}
            className="category-arrow-circle"
          >
            <ArrowUpRight size={18} color="#ffffff" />
          </div>
        </div>
      </div>

      <style>{`
        .category-card:hover .category-card-img {
          transform: scale(1.08);
        }
        .category-card:hover .category-arrow-circle {
          background-color: var(--wood-amber);
          transform: rotate(45deg);
        }
      `}</style>
    </Link>
  );
};
