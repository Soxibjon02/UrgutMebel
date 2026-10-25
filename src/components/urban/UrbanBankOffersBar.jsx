import React from 'react';
import { CreditCard, ShieldCheck, Zap } from 'lucide-react';

export const UrbanBankOffersBar = () => {
  const bankOffers = [
    {
      id: 1,
      bank: 'Anorbank & Uzum Nasiya',
      title: '500 000 so‘mgacha bir zumda chegirma',
      desc: 'Anorbank yoki Uzum Nasiya muddatli to‘lovi orqali rasmiylashtirilgan xaridlar uchun',
      badge: '0-0-12 MUDDATLI TO‘LOV',
      color: '#e11d48'
    },
    {
      id: 2,
      bank: 'Payme & Click Keshbek',
      title: '350 000 so‘mgacha keshbek & chegirma',
      desc: 'Payme yoki Click ilovalari orqali to‘liq to‘lov qilinganda 5% gacha darhol keshbek',
      badge: 'BIR ZUMDA KESHBEK',
      color: '#2563eb'
    },
    {
      id: 3,
      bank: 'Humo & Uzcard',
      title: 'Kafolatlangan bepul yetkazib berish',
      desc: 'Istalgan milliy karta orqali 3 000 000 so‘mdan yuqori xaridlarda o‘rnatib berish bepul',
      badge: 'BEPUL SERVIS',
      color: '#059669'
    }
  ];

  return (
    <section className="urban-bank-offers-section" style={{ padding: '1.5rem 0 1rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Additional Discounts and Offers
          </h2>
        </div>

        <div
          className="urban-bank-offers-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}
        >
          {bankOffers.map((offer) => (
            <div
              key={offer.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="urban-bank-card"
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(250, 109, 88, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CreditCard size={22} color="var(--figma-coral, #FA6D58)" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: offer.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {offer.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                  {offer.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {offer.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .urban-bank-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }
        @media (max-width: 900px) {
          .urban-bank-offers-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            padding-bottom: 0.5rem;
          }
          .urban-bank-offers-grid::-webkit-scrollbar {
            display: none;
          }
          .urban-bank-card {
            flex: 0 0 280px !important;
            min-width: 280px !important;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};
