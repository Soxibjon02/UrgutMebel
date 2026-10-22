import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

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

export const FigmaCollectionCarousel = ({ title = 'Autumn Collection', slides: propSlides }) => {
  const { settings } = useSettings();
  const effectiveSlides = (propSlides && propSlides.length > 0)
    ? propSlides
    : (settings.collection_carousel_slides && settings.collection_carousel_slides.length > 0)
      ? settings.collection_carousel_slides
      : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? effectiveSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === effectiveSlides.length - 1 ? 0 : prev + 1));
  };

  // Continuous automatic slideshow interval (3.5 soniyada uzluksiz almashadi)
  useEffect(() => {
    if (effectiveSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === effectiveSlides.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [effectiveSlides.length]);

  const activeSlide = effectiveSlides[currentIndex] || effectiveSlides[0];
  const prevSlideItem = effectiveSlides[(currentIndex - 1 + effectiveSlides.length) % effectiveSlides.length] || activeSlide;
  const nextSlideItem = effectiveSlides[(currentIndex + 1) % effectiveSlides.length] || activeSlide;

  return (
    <section
      style={{
        padding: '5rem 0',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-secondary)',
        transition: 'background-color 0.25s ease'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'inline-block' }}>
            Avtomatik almashuvchi mavsumiy to‘plam
          </span>
        </div>

        {/* 3-Column Carousel Showcase with Navigation */}
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
              borderRadius: '4px',
              backgroundImage: `url(${prevSlideItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.55,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            title={`Oldingisi: ${prevSlideItem.title}`}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ArrowLeft size={18} />
              </div>
            </div>
          </div>

          {/* Active Center Card with Coral Number Badge */}
          <div
            style={{
              height: '420px',
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <img
              key={activeSlide.id}
              src={activeSlide.image}
              alt={activeSlide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                animation: 'fadeIn 0.5s ease'
              }}
            />

            {/* Gradient Overlay for Text */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2.5rem 3rem 2.5rem 6.5rem'
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  marginBottom: '0.25rem'
                }}
              >
                {activeSlide.category}
              </span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.85rem', fontWeight: 800, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                {activeSlide.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: '0.4rem 0 1.25rem', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                {activeSlide.subtitle}
              </p>
              <div>
                <Link
                  to="/furniture"
                  className="btn-figma-coral"
                  style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.78rem', fontWeight: 700 }}
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
                letterSpacing: '0.05em',
                zIndex: 2
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
              borderRadius: '4px',
              backgroundImage: `url(${nextSlideItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.55,
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            title={`Keyingisi: ${nextSlideItem.title}`}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
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
                width: idx === currentIndex ? '28px' : '9px',
                height: '9px',
                borderRadius: '4.5px',
                backgroundColor: idx === currentIndex ? 'var(--figma-coral)' : 'var(--border-subtle)',
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
