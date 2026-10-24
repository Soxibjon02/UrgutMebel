import React from 'react';
import { Star, CheckCircle2, Heart, MessageSquareQuote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const UrbanCustomerShowcase = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: 'Farrux & Nigora Alimovlar',
      city: 'Samarqand shahri, Bog‘ishamol',
      item: '“Samarqand Luks” Yotoqxona Garnituri',
      rating: 5.0,
      date: 'Oktyabr 2026',
      photo: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=500&q=80',
      comment: 'Urgut mebellari haqida juda ko‘p eshitgandik, lekin bu darajada sifatli va qulay bo‘lishini kutmagandik. Karkasi 100% baquvvat eman, yetkazib berish va o‘rnatish juda tez bo‘ldi. Rahmat!'
    },
    {
      id: 2,
      name: 'Shavkat aka Rahimov',
      city: 'Urgut tumani, Mergancha',
      item: 'Maxsus Buyurtma Modulli Oshxona',
      rating: 5.0,
      date: 'Sentyabr 2026',
      photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80',
      comment: 'Usta duradgorlar uydagi har bir santimetrni o‘lchab, 3D rasmda ko‘rsatib berishdi. Nemis furnituralari yumshoq yopiladi, xotinim juda mamnun bo‘ldi.'
    },
    {
      id: 3,
      name: 'Gulnoza Karimova',
      city: 'Toshkent shahri, Chilonzor',
      item: 'Skandinav Stilidagi Yumshoq Burchak Divan',
      rating: 5.0,
      date: 'Avgust 2026',
      photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
      comment: 'Toshkentga yetkazib berishlaridan xavotirda edim, lekin maxsus qadoqlangan holda hech qanday zararsiz yetib keldi. Matosi nihoyatda chiroyli va oson tozalanadi.'
    }
  ];

  return (
    <section className="urban-customer-showcase" style={{ padding: '4.5rem 1.5rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(250, 109, 88, 0.12)',
              color: 'var(--figma-coral, #FA6D58)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            <MessageSquareQuote size={14} /> {t('reviews.badge', 'Mijozlarimiz Xonadonlarida')}
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem'
            }}
          >
            {t('reviews.title', '15,000+ Baxtli Xonadonlar Ishonchi')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 auto', maxWidth: '600px' }}>
            {t('reviews.desc', 'Urgut mebellari O‘zbekistonning barcha viloyatlaridagi xonadonlarni bezab turibdi. Haqiqiy xaridorlarimizning fikr va fotosuratlari bilan tanishing.')}
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl, 20px)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="urban-review-card"
            >
              {/* Photo from customer home */}
              <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={rev.photo}
                  alt={rev.item}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  className="urban-review-img"
                />
                
                {/* Product tag on photo */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(20, 20, 24, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}
                >
                  {rev.item}
                </div>
              </div>

              {/* Review Text */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Star rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginLeft: '0.25rem' }}>
                    {rev.rating}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    margin: '0 0 1.25rem',
                    flex: 1,
                    fontStyle: 'italic'
                  }}
                >
                  “{rev.comment}”
                </p>

                {/* Author Info */}
                <div
                  style={{
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.15rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {rev.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rev.city}
                    </span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>Tasdiqlangan xaridor</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .urban-review-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }
        .urban-review-card:hover .urban-review-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};
