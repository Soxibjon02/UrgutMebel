import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'Autumn Living Room',
    subtitle: 'Zamonaviy interyer va shinamlik',
    badge: '01',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Mehmonxona'
  },
  {
    id: 2,
    title: 'Nordic Dining Set',
    subtitle: 'Tabiiy yog‘och va minimalizm',
    badge: '02',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    category: 'Oshxona'
  },
  {
    id: 3,
    title: 'Cozy Bedroom Lounge',
    subtitle: 'Premium matolar va sokinlik',
    badge: '03',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80',
    category: 'Yotoqxona'
  }
];

export const FigmaCollectionCarousel = ({ title = 'Autumn Collection', slides = DEFAULT_SLIDES }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const activeSlide = slides[currentIndex];
  const prevSlideItem = slides[(currentIndex - 1 + slides.length) % slides.length];
  const nextSlideItem = slides[(currentIndex + 1) % slides.length];

  return (
    <section style={{ padding: '5rem 0', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', transition: 'background-color 0.25s ease' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        </div>

        {/* 3-Column Carousel Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2.4fr 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Left Preview Card */}
          <div
            onClick={prevSlide}
            style={{
              height: '320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              backgroundImage: `url(${prevSlideItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.45,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
            title={prevSlideItem.title}
          />

          {/* Active Center Card with Coral Number Badge */}
          <div
            style={{
              height: '420px',
              position: 'relative',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0,0,0,0.08)'
            }}
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Gradient Overlay for Text */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2.5rem 3rem 2.5rem 6.5rem'
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}
              >
                {activeSlide.category}
              </span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                {activeSlide.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: '0.4rem 0 1rem' }}>
                {activeSlide.subtitle}
              </p>
              <div>
                <Link
                  to="/furniture"
                  className="btn-figma-coral"
                  style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
                >
                  Kolleksiyani Ko‘rish &gt;
                </Link>
              </div>
            </div>

            {/* Signature Coral Square Number Badge (Figma 01/02/03) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '70px',
                height: '70px',
                backgroundColor: 'var(--figma-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.4rem',
                letterSpacing: '0.05em'
              }}
            >
              {activeSlide.badge}
            </div>
          </div>

          {/* Right Preview Card */}
          <div
            onClick={nextSlide}
            style={{
              height: '320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              backgroundImage: `url(${nextSlideItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.45,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
            title={nextSlideItem.title}
          />
        </div>

        {/* Carousel Dots & Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '2rem'
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === currentIndex ? 'var(--figma-coral)' : '#D1D5DB',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
