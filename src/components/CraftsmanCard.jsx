import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Send, Phone, ArrowRight } from 'lucide-react';

export const CraftsmanCard = ({ craftsman, onRequestClick }) => {
  if (!craftsman) return null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="craftsman-card"
    >
      {/* Header with Photo & Badge */}
      <div style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
          src={craftsman.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
          alt={craftsman.name}
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--wood-light)',
            flexShrink: 0
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d97706', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            <Star size={15} fill="#d97706" />
            <span style={{ fontWeight: 700 }}>{craftsman.rating || 5.0}</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>({craftsman.reviews_count || 18} baho)</span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            <Link to={`/craftsmen/${craftsman.id}`} style={{ color: 'inherit' }}>
              {craftsman.name}
            </Link>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={14} color="var(--wood-amber)" />
              {craftsman.experience_years} yil tajriba
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} color="var(--wood-amber)" />
              {craftsman.location}
            </span>
          </div>
        </div>
      </div>

      {/* Body: Bio & Specializations */}
      <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {craftsman.bio}
          </p>

          {/* Specialization Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {craftsman.specializations?.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Portfolio thumbnail preview */}
          {craftsman.portfolio?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem' }}>
                NAMUNAVIY ISHLAR:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                {craftsman.portfolio.slice(0, 3).map((item, i) => (
                  <img
                    key={i}
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '56px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => (onRequestClick ? onRequestClick(craftsman) : null)}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.65rem 0.75rem', fontSize: '0.85rem' }}
          >
            <span>Buyurtma Berish</span>
            <ArrowRight size={15} />
          </button>

          <Link
            to={`/craftsmen/${craftsman.id}`}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
          >
            Profil
          </Link>

          {craftsman.telegram && (
            <a
              href={`https://t.me/${craftsman.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Telegram orqali bog‘lanish"
            >
              <Send size={15} color="var(--wood-amber)" />
            </a>
          )}
        </div>
      </div>

      <style>{`
        .craftsman-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(194, 109, 46, 0.3);
        }
      `}</style>
    </div>
  );
};
