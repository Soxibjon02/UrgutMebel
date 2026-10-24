import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Sparkles, Ruler, Palette, Truck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanCustomCraftBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="urban-custom-craft-section" style={{ padding: '4.5rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            borderRadius: 'var(--radius-xl, 24px)',
            background: 'linear-gradient(135deg, #18191d 0%, #24262d 100%)',
            color: '#ffffff',
            padding: '3.5rem 3rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
          }}
          className="urban-craft-box"
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250, 109, 88, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(250, 109, 88, 0.2)',
                  color: '#ff8a78',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}
              >
                <Hammer size={14} /> {t('custom.badge', 'Urgut Duradgorlik Maktabi')}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  margin: '0 0 1rem',
                  letterSpacing: '-0.02em'
                }}
              >
                {t('custom.title', 'Standart mebellar xonangizga to‘g‘ri kelmayaptimi?')}
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 2rem', maxWidth: '520px' }}>
                {t('custom.desc', 'Urgutlik mohir ustalarimiz sizning xonadoningizning aniq o‘lchamlari, siz tanlagan yog‘och va mato turlarida eksklyuziv mebel yasab beradi.')}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/custom-order"
                  className="btn btn-primary"
                  style={{
                    padding: '0.9rem 1.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(250, 109, 88, 0.4)',
                    textDecoration: 'none'
                  }}
                >
                  <span>MAXSUS BUYURTMA BERISH</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/craftsmen"
                  style={{
                    padding: '0.9rem 1.65rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>USTALAR RO‘YXATI</span>
                </Link>
              </div>
            </div>

            {/* Right: 3 Steps Process Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Step 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(250, 109, 88, 0.2)',
                    color: 'var(--figma-coral, #FA6D58)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  <Ruler size={22} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                    1. Bepul o‘lchash & 3D loyiha
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                    Mutaxassisimiz uyingizga borib o‘lchaydi yoki siz o‘lchamlarni onlayn yuborasiz.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(250, 109, 88, 0.2)',
                    color: 'var(--figma-coral, #FA6D58)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  <Palette size={22} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                    2. Material va rangni tanlash
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                    Eman, yong‘oq, MDF, Turkiya baxmali yoki charm — 100 dan ortiq rang variantlari.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(250, 109, 88, 0.2)',
                    color: 'var(--figma-coral, #FA6D58)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  <Truck size={22} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                    3. 10 kunda yetkazish & o‘rnatish
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                    Ustalarimiz mebelni ehtiyotkor yetkazib, joyida sifatli yig‘ib beradi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
