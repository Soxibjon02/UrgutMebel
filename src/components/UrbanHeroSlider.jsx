import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Award, Trees, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanHeroSlider = ({
  title,
  subtitle,
  badge,
  banner_image,
  primaryBtnText,
  primaryBtnLink,
  autoplay_speed
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);

  const slides = [
    {
      id: 0,
      badge: badge || 'MOST BEAUTIFUL TIME OF THE YEAR | UP TO 70% OFF',
      title: title || 'BIGGEST SALE OF THE YEAR | FullHouse Fiesta',
      desc: subtitle || 'Uy mebellari to‘plamlariga 70% gacha ulkan chegirmalar! 0-0-12 foizsiz muddatli to‘lov va bepul o‘rnatib berish xizmati.',
      img: banner_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
      pill1: '70% Gacha Chegirma',
      pill2: '0-0-12 Muddatli To‘lov',
      primaryBtnText: primaryBtnText || 'Shop Now',
      primaryBtnLink: primaryBtnLink || '/furniture?filter=discount',
      secondaryBtnText: 'Aksiyalar Zonasi',
      secondaryBtnLink: '/furniture'
    },
    {
      id: 1,
      badge: t('hero.badge_1', '2026 Yangi Premium To‘plam'),
      title: t('hero.title_1', 'Asriy Urgut Duradgorligi & Zamonaviy Yevropa Dizayni'),
      desc: t('hero.desc_1', '100% tabiiy quritilgan eman va yong‘oqdan tayyorlangan, har bir xonadonga shinamlik bag‘ishlovchi mebellar.'),
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      pill1: '100% Qattiq Eman',
      pill2: '5 Yil Kafolat',
      primaryBtnText: t('hero.btn_view_col', 'Kolleksiyani Ko‘rish'),
      primaryBtnLink: '/furniture',
      secondaryBtnText: t('hero.btn_custom', 'Maxsus Buyurtma'),
      secondaryBtnLink: '/custom-order'
    },
    {
      id: 2,
      badge: t('hero.badge_2', 'Shinam Yotoqxona To‘plami'),
      title: t('hero.title_2', 'Sog‘lom Uyqu va Tabiiy Yog‘och Uyg‘unligi'),
      desc: t('hero.desc_2', 'Ekologik toza yog‘och karkas, shovqinsiz furnitura va ortopedik qulaylikka ega karavotlar.'),
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      pill1: 'Ekologik Toza',
      pill2: 'Ortopedik Qulaylik',
      primaryBtnText: t('hero.btn_bedroom', 'Yotoqxonalarni Ko‘rish'),
      primaryBtnLink: '/furniture?category=cat-bedroom',
      secondaryBtnText: t('hero.btn_catalog', 'Katalog'),
      secondaryBtnLink: '/furniture'
    },
    {
      id: 3,
      badge: t('hero.badge_3', 'Individual Oshxona Mebellari'),
      title: t('hero.title_3', 'Uyingiz O‘lchamiga Mos Bepul 3D Loyiha'),
      desc: t('hero.desc_3', 'Nemis sifatidagi mexanizmlar, namlikka chidamli fasadlar va 10 yillik xizmat ko‘rsatish kafolati.'),
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      pill1: 'Bepul 3D Loyiha',
      pill2: 'Nemis Furnituralari',
      primaryBtnText: t('hero.btn_kitchen', '3D Loyiha Buyurtma'),
      primaryBtnLink: '/custom-order',
      secondaryBtnText: t('hero.btn_craftsmen', 'Ustalar Ro‘yxati'),
      secondaryBtnLink: '/craftsmen'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPaused) {
      const speed = Number(autoplay_speed) > 0 ? Number(autoplay_speed) : 5500;
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, speed);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isPaused, slides.length, autoplay_speed]);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <section
      className="urban-hero-slider-section"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-dark)',
        overflow: 'hidden',
        minHeight: '560px',
        display: 'flex',
        alignItems: 'center'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentSlide ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: idx === currentSlide ? 1 : 0,
            pointerEvents: idx === currentSlide ? 'auto' : 'none'
          }}
        >
          {/* Background Image with Zoom subtle effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${s.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: idx === currentSlide ? 'scale(1.04)' : 'scale(1.0)',
              transition: 'transform 7s ease-out'
            }}
          />

          {/* Luxury Multi-layer Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(15, 15, 18, 0.92) 0%, rgba(15, 15, 18, 0.75) 45%, rgba(15, 15, 18, 0.35) 100%)'
            }}
          />
        </div>
      ))}

      {/* Slide Content Layer */}
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10, padding: '4.5rem 1.5rem' }}>
        <div style={{ maxWidth: '640px', color: '#ffffff' }}>
          
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(250, 109, 88, 0.2)',
              border: '1px solid rgba(250, 109, 88, 0.45)',
              color: '#ff8a78',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={14} />
            <span>{slides[currentSlide].badge}</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              margin: '0 0 1.25rem',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)'
            }}
          >
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.12rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            {slides[currentSlide].desc}
          </p>

          {/* Trust Feature Pills */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <Trees size={13} color="#34d399" />
              <span>{slides[currentSlide].pill1}</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <ShieldCheck size={13} color="#fbbf24" />
              <span>{slides[currentSlide].pill2}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to={slides[currentSlide].primaryBtnLink}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 1.85rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 25px rgba(250, 109, 88, 0.45)',
                textDecoration: 'none'
              }}
            >
              <span>{slides[currentSlide].primaryBtnText}</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to={slides[currentSlide].secondaryBtnLink}
              style={{
                padding: '0.9rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="urban-hero-secondary-btn"
            >
              <span>{slides[currentSlide].secondaryBtnText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Prev / Next */}
      <button
        type="button"
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 24, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'all 0.2s ease'
        }}
        className="urban-hero-nav-btn"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 24, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'all 0.2s ease'
        }}
        className="urban-hero-nav-btn"
        aria-label="Next Slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Indicator Dots / Pills */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.6rem',
          zIndex: 20
        }}
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: idx === currentSlide ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: idx === currentSlide ? 'var(--figma-coral, #FA6D58)' : 'rgba(255, 255, 255, 0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style>{`
        .urban-hero-secondary-btn:hover {
          background-color: rgba(255, 255, 255, 0.25) !important;
          border-color: #ffffff !important;
        }
        .urban-hero-nav-btn:hover {
          background-color: var(--figma-coral, #FA6D58) !important;
          border-color: var(--figma-coral, #FA6D58) !important;
          transform: translateY(-50%) scale(1.08);
        }
      `}</style>
    </section>
  );
};
