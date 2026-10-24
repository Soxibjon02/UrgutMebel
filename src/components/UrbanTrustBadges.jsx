import React from 'react';
import { ShieldCheck, Trees, Ruler, Truck, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanTrustBadges = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Trees,
      title: t('trust.wood_title', '100% Tabiiy Yog‘och'),
      desc: t('trust.wood_desc', 'Quritilgan eman, yong‘oq va E1 ekologik toza xavfsiz materiallar'),
      tag: 'Ekologik'
    },
    {
      icon: ShieldCheck,
      title: t('trust.warranty_title', '5 Yillik Rasmiy Kafolat'),
      desc: t('trust.warranty_desc', 'Barcha karkas, bo‘g‘in va furnituralarga to‘liq kafolat beriladi'),
      tag: 'Kafolatlangan'
    },
    {
      icon: Ruler,
      title: t('trust.measure_title', 'Bepul O‘lchash & 3D Dizayn'),
      desc: t('trust.measure_desc', 'Mutaxassisimiz uyingizga borib o‘lchaydi va 3D modelda ko‘rsatadi'),
      tag: 'Bepul xizmat'
    },
    {
      icon: Truck,
      title: t('trust.delivery_title', 'Xavfsiz Yetkazish & Yig‘ish'),
      desc: t('trust.delivery_desc', 'O‘zbekiston bo‘ylab ehtiyotkor yetkazish va joyida professional o‘rnatish'),
      tag: 'O‘rnatish bilan'
    }
  ];

  return (
    <section className="urban-trust-section" style={{ padding: '2.5rem 1.5rem', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {badges.map((b, idx) => {
            const IconComp = b.icon;
            return (
              <div
                key={idx}
                className="urban-trust-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem 1.35rem',
                  borderRadius: 'var(--radius-lg, 16px)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(250, 109, 88, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--figma-coral, #FA6D58)',
                    flexShrink: 0
                  }}
                  className="urban-trust-icon"
                >
                  <IconComp size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {b.title}
                    </h4>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .urban-trust-card:hover {
          transform: translateY(-4px);
          border-color: var(--figma-coral, #FA6D58) !important;
          box-shadow: 0 12px 28px rgba(250, 109, 88, 0.12);
        }
        .urban-trust-card:hover .urban-trust-icon {
          background-color: var(--figma-coral, #FA6D58) !important;
          color: #ffffff !important;
        }
      `}</style>
    </section>
  );
};
