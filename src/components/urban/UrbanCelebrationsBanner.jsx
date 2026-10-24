import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const UrbanCelebrationsBanner = () => {
  return (
    <section className="urban-celebrations-section" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            minHeight: '340px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}
          className="urban-celebrations-card"
        >
          {/* Deep luxury brown gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(30, 20, 22, 0.72) 0%, rgba(20, 12, 14, 0.92) 100%)',
              zIndex: 1
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#fbbf24',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.75rem'
              }}
            >
              <Sparkles size={16} /> Bayram & To‘y Mavsumi
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                margin: '0 0 1rem',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}
            >
              Celebrations made special by savings.
            </h2>

            <p style={{ color: '#d1d5db', fontSize: '0.95rem', margin: '0 0 1.75rem', lineHeight: 1.5 }}>
              Yangi uy yoki to‘y uchun barcha zarur mebellarni Urgut usta duradgorlaridan 30% gacha tejab oling.
            </p>

            <Link
              to="/furniture?filter=discount"
              className="btn btn-primary"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 15px rgba(250, 109, 88, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              <span>Explore Deals</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
