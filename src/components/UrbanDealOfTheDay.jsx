import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Zap, Flame, Check, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanDealOfTheDay = ({ onQuickBuy, product }) => {
  const { t } = useLanguage();

  // Countdown timer state: 14 hours 35 mins from now
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 35,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProduct = product || {
    id: 'deal-spotlight-1',
    name: '“Samarqand Luks” Modulli Burchak Divani (Italiya Baxmali)',
    price: 8500000,
    discount_price: 5900000,
    material: 'Tabiiy qarag‘ay karkasi, Italiya suv o‘tkazmaydigan baxmali, ortopedik prujina',
    dimensions: '320 × 180 × 85 sm',
    rating: 4.95,
    reviews_count: 38,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    stock_sold: 84, // percentage
    stock_left: 3
  };

  const effectivePrice = Number(dealProduct.price) || 8500000;
  const effectiveDiscountPrice = dealProduct.discount_price
    ? Number(dealProduct.discount_price)
    : Math.round(effectivePrice * 0.7);

  const discountPercent = Math.round(
    ((effectivePrice - effectiveDiscountPrice) / effectivePrice) * 100
  );
  const savings = effectivePrice - effectiveDiscountPrice;

  return (
    <section className="urban-deal-section" style={{ padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Banner Card Container */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.08) 0%, rgba(24, 25, 29, 0.03) 100%)',
            border: '2px solid rgba(250, 109, 88, 0.25)',
            borderRadius: 'var(--radius-xl, 24px)',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="urban-deal-box"
        >
          {/* Floating Decorative Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250, 109, 88, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Product Image with Badges */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg, 18px)',
                  overflow: 'hidden',
                  aspectRatio: '16/11',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <img
                  src={dealProduct.image_url}
                  alt={dealProduct.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Fire Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  <Flame size={15} fill="#ffffff" />
                  <span>KUN TAKLIFI -{discountPercent}%</span>
                </div>

                {/* 5-Year Warranty Pill */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(20, 20, 22, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShieldCheck size={14} color="#10b981" />
                  <span>5 Yil Rasmiy Kafolat</span>
                </div>
              </div>
            </div>

            {/* Right: Deal Details & Live Countdown */}
            <div>
              {/* Live Countdown Ribbon */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(250, 109, 88, 0.15)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--figma-coral, #FA6D58)', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Timer size={16} />
                  <span>Aksiya tugashiga qoldi:</span>
                </div>
                
                {/* Timer Digits */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ backgroundColor: 'var(--figma-coral, #FA6D58)', color: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem', minWidth: '28px', textAlign: 'center' }}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--figma-coral, #FA6D58)' }}>:</span>
                  <span style={{ backgroundColor: 'var(--figma-coral, #FA6D58)', color: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem', minWidth: '28px', textAlign: 'center' }}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--figma-coral, #FA6D58)' }}>:</span>
                  <span style={{ backgroundColor: 'var(--figma-coral, #FA6D58)', color: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem', minWidth: '28px', textAlign: 'center' }}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.25,
                  margin: '0 0 0.75rem',
                  letterSpacing: '-0.015em'
                }}
              >
                {dealProduct.name}
              </h3>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {dealProduct.rating}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  ({dealProduct.reviews_count} ta ijobiy fikr)
                </span>
              </div>

              {/* Price Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md, 12px)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Maxsus aksiya narxi
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--figma-coral, #FA6D58)', lineHeight: 1.1 }}>
                    {effectiveDiscountPrice.toLocaleString()} so‘m
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {effectivePrice.toLocaleString()} so‘m
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 800 }}>
                    Tejashingiz: {savings.toLocaleString()} so‘m
                  </div>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Aksiya mahsuloti tugamoqda:</span>
                  <span style={{ color: '#dc2626' }}>Faqat {dealProduct.stock_left} dona qoldi!</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${dealProduct.stock_sold}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #dc2626 100%)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => onQuickBuy && onQuickBuy(dealProduct)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(250, 109, 88, 0.35)'
                  }}
                >
                  <Zap size={18} fill="#ffffff" />
                  <span>BIR BOSISHDA XARID QILISH</span>
                </button>

                <Link
                  to={`/furniture/${dealProduct.id}`}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Batafsil Ko‘rish</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
