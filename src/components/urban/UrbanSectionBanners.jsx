import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Gift, Percent, Sparkles, CheckCircle2 } from 'lucide-react';

/* 1. Full Bedroom Range Banner */
export const UrbanFullBedroomBanner = () => (
  <section style={{ padding: '2.5rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/furniture?category=cat-bedroom"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '260px',
          backgroundColor: '#26191b',
          backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(30,15,18,0.88) 0%, rgba(30,15,18,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
            Full Bedroom Range
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#e5e7eb', margin: '0 0 1rem' }}>
            Find your favourites from 1600+ options
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
            <span>Barcha Yotoqxona Mebellari</span> <ArrowRight size={15} />
          </div>
        </div>
      </Link>
    </div>
  </section>
);

/* 2. Partner Brands Discount Header Banner */
export const UrbanPartnerBrandsBanner = () => (
  <section style={{ padding: '2.5rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#f6f2ec',
          border: '1px solid #ebd9c8',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
          FABRIKA VA USTA HAMKORLAR
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 900, color: '#2b221d', margin: '0 0 0.5rem' }}>
          Enjoy up to 60% off on Partner Brands
        </h2>
        <p style={{ color: '#6e5f56', fontSize: '0.92rem', margin: 0 }}>
          Eng yaxshi mahalliy ishlab chiqaruvchilar va Urgut duradgorlaridan to‘g‘ridan-to‘g‘ri zavod narxida
        </p>
      </div>
    </div>
  </section>
);

/* 3. Study Tables from 299,000 + Subcategories */
export const UrbanStudyTablesFeature = () => {
  const subCats = [
    { title: 'Study Chairs', count: '500+ Options', price: 'from 549,000 so‘m', img: 'https://images.unsplash.com/photo-1580481077195-c9233634e70e?auto=format&fit=crop&w=400&q=80', link: '/furniture?category=cat-office' },
    { title: 'Crockery Units', count: '50+ Options', price: 'from 999,000 so‘m', img: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80', link: '/furniture?category=cat-dining' },
    { title: 'Kids Furniture', count: '250+ Options', price: 'from 120,000 so‘m', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', link: '/furniture?category=cat-kids' },
    { title: 'Outdoor', count: '150+ Options', price: 'from 307,000 so‘m', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80', link: '/furniture' }
  ];

  return (
    <section style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Main Banner */}
        <Link
          to="/furniture?category=cat-office"
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            minHeight: '260px',
            backgroundColor: '#1b1c20',
            backgroundImage: 'url(https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem',
            textDecoration: 'none',
            color: '#ffffff',
            marginBottom: '1.25rem'
          }}
          className="urban-banner-hover"
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,20,24,0.9) 0%, rgba(20,20,24,0.3) 100%)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
              Study Tables from 299,000 so‘m
            </h2>
            <div style={{ fontSize: '1rem', color: '#f3f4f6', fontWeight: 600 }}>150+ Options</div>
          </div>
        </Link>

        {/* 4-Item Subcategory Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}
          className="urban-study-subgrid"
        >
          {subCats.map((sub, i) => (
            <Link
              key={i}
              to={sub.link}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '160px',
                backgroundImage: `url(${sub.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1rem',
                color: '#ffffff'
              }}
              className="urban-banner-hover"
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{sub.title} | {sub.count}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>{sub.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .urban-study-subgrid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

/* 4. Urgut Mebel Gift Card Banner */
export const UrbanGiftCardBanner = () => (
  <section style={{ padding: '2rem 0' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#faf5f0',
          border: '1px solid #fed7aa',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
        }}
        className="urban-giftcard-grid"
      >
        <div style={{ padding: '2.5rem 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            <Gift size={15} /> Sovg‘a Sertifikatlari
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 800, color: '#292524', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
            Yaqinlaringizga Shodlik Sovg‘a Qiling
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.92rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            Yangi xonadon egalariga yoki to‘yga eng kerakli mebelni o‘zlari tanlashlari uchun sovg‘a kartasini taqdim eting.
          </p>
          <Link
            to="/custom-order"
            className="btn btn-primary"
            style={{ padding: '0.7rem 1.6rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Karta Rasmiylashtirish</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            height: '100%',
            minHeight: '240px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .urban-giftcard-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </section>
);

/* 5. The Toledo Look (Signature Editorial Room Showcase) */
export const UrbanToledoCollectionBanner = () => {
  return (
    <section style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Eksklyuziv Kolleksiya
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0 0' }}>
            Toledo Collection
          </h2>
        </div>

        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            minHeight: '440px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
          }}
          className="urban-banner-hover"
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)', zIndex: 1 }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fbbf24' }}>
              EDITORIAL SHOWCASE
            </span>
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0.3rem 0 0', letterSpacing: '-0.02em' }}>
              The Toledo Look
            </h3>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/furniture"
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.6rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Kolleksiyani Xarid Qilish</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 6. Explore All Stores (60+ Stores Across Uzbekistan) */
export const UrbanExploreStoresBanner = () => (
  <section style={{ padding: '2.5rem 0' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/stores"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '220px',
          backgroundColor: '#ea580c',
          backgroundImage: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          textDecoration: 'none',
          color: '#ffffff',
          boxShadow: '0 8px 25px rgba(234, 88, 12, 0.25)'
        }}
        className="urban-stores-grid urban-banner-hover"
      >
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, width: 'fit-content', marginBottom: '0.6rem' }}>
            <MapPin size={13} /> 60+ Do‘konlar va Showroomlar
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
            Discover designs near you
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.92)', margin: '0 0 1rem', lineHeight: 1.4 }}>
            Step in to explore the best offers and latest arrivals. Yaqin filialimizga tashrif buyuring.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem' }}>
            <span>Showroomlarni Xaritada Ko‘rish</span> <ArrowRight size={16} />
          </div>
        </div>

        <div
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px'
          }}
        />
      </Link>
    </div>
    <style>{`
      @media (max-width: 768px) {
        .urban-stores-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </section>
);

/* 7. Non-Storage Beds Banner */
export const UrbanNonStorageBedsBanner = () => (
  <section style={{ padding: '2rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/furniture?category=cat-bedroom"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '240px',
          backgroundColor: '#3b2f2f',
          backgroundImage: 'url(https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(30,20,20,0.88) 0%, rgba(30,20,20,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
            Non-Storage Beds from 699,000 so‘m
          </h2>
          <div style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 600 }}>350+ Options</div>
        </div>
      </Link>
    </div>
  </section>
);

/* 8. Modular Kitchens, Wardrobes & More */
export const UrbanModularKitchenBanner = () => (
  <section style={{ padding: '2.5rem 0' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/custom-order"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '260px',
          backgroundColor: '#1e293b',
          backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff',
          boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            MODULAR KITCHENS, WARDROBES & MORE
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
            Quality Interiors, Priced Just Right
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0284c7', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.86rem', marginTop: '0.5rem' }}>
            <span>Get Up to 35% Off</span> <ArrowRight size={15} />
          </div>
        </div>
      </Link>
    </div>
  </section>
);

/* 9. Shoe Racks Feature Banner */
export const UrbanShoeRacksBanner = () => (
  <section style={{ padding: '2rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/furniture?category=cat-wardrobe"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '220px',
          backgroundColor: '#1c1917',
          backgroundImage: 'url(https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,15,14,0.9) 0%, rgba(20,15,14,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
            Shoe Racks from 299,000 so‘m
          </h2>
          <div style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 600 }}>150+ Options</div>
        </div>
      </Link>
    </div>
  </section>
);

/* 10. Mattresses Banner */
export const UrbanMattressesBanner = () => (
  <section style={{ padding: '2rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/furniture?category=cat-bedroom"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '220px',
          backgroundColor: '#27272a',
          backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(30,30,35,0.9) 0%, rgba(30,30,35,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
            Mattresses starting from 299,000 so‘m
          </h2>
          <div style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 600 }}>Ortopedik va anatomik matraslar to‘plami</div>
        </div>
      </Link>
    </div>
  </section>
);

/* 11. Sofa Beds Banner */
export const UrbanSofaBedsBanner = () => (
  <section style={{ padding: '2rem 0 1rem' }}>
    <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
      <Link
        to="/furniture?category=cat-living"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '240px',
          backgroundColor: '#1f2937',
          backgroundImage: 'url(https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          textDecoration: 'none',
          color: '#ffffff'
        }}
        className="urban-banner-hover"
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,25,35,0.9) 0%, rgba(20,25,35,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
            Sofa Beds from 1,599,000 so‘m
          </h2>
          <div style={{ fontSize: '1rem', color: '#e5e7eb', fontWeight: 600 }}>350+ Options</div>
        </div>
      </Link>
    </div>
  </section>
);
