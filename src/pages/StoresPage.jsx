import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, MapPin, Phone, Clock, ShieldCheck, Search, ChevronRight, Package, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';

export const StoresPage = () => {
  const { t, getLocalized } = useLanguage();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'TOP', 'VERIFIED'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storesData, productsData] = await Promise.all([
          dataService.getStores(),
          dataService.getProducts()
        ]);
        setStores(storesData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error('Error loading stores:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterType === 'TOP') return s.is_top || s.rating >= 4.8;
      if (filterType === 'VERIFIED') return s.verified;
      return true;
    });
  }, [stores, searchQuery, filterType]);

  const getStoreProductCount = (storeId) => {
    return products.filter((p) => p.store_id === storeId).length;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '90vh' }}>
      {/* Hero Section */}
      <section className="stores-hero-section">
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(250, 109, 88, 0.12)',
              color: 'var(--figma-coral, #FA6D58)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.85rem'
            }}
          >
            <Store size={16} /> {t('stores.badge', 'Rasmiy Savdo Do‘konlari')}
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.85rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              marginBottom: '0.65rem'
            }}
          >
            {t('stores.title', 'Urgutning Eng Sara Mebel Do‘konlari')}
          </h1>
          <p
            style={{
              fontSize: '0.98rem',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              margin: '0 auto 1.75rem',
              lineHeight: 1.6
            }}
          >
            {t('stores.subtitle', 'Har bir e‘lon o‘zining rasmiy do‘koniga ega. Ishlab chiqaruvchi do‘konlar bilan to‘g‘ridan-to‘g‘ri bog‘laning va eng yaxshi narxlarda xarid qiling.')}
          </p>

          {/* Search and Filters Bar */}
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '1.1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                placeholder={t('stores.search_placeholder', 'Do‘kon nomi, manzili yoki mahsulotlar bo‘yicha qidiring...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  padding: '0.85rem 1.25rem 0.85rem 2.85rem',
                  fontSize: '0.92rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>

            {/* Quick Pills - Horizontal scroll on mobile */}
            <div className="stores-filter-pills">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className="stores-filter-pill-btn"
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'ALL' ? 'var(--figma-coral, #FA6D58)' : 'var(--bg-card)',
                  color: filterType === 'ALL' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'ALL' ? '1px solid var(--figma-coral, #FA6D58)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('stores.filter_all', 'Barcha Do‘konlar')} ({stores.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('TOP')}
                className="stores-filter-pill-btn"
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'TOP' ? 'var(--figma-coral, #FA6D58)' : 'var(--bg-card)',
                  color: filterType === 'TOP' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'TOP' ? '1px solid var(--figma-coral, #FA6D58)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ⭐ {t('stores.filter_top', 'Top Reytingli')}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('VERIFIED')}
                className="stores-filter-pill-btn"
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'VERIFIED' ? 'var(--figma-coral, #FA6D58)' : 'var(--bg-card)',
                  color: filterType === 'VERIFIED' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'VERIFIED' ? '1px solid var(--figma-coral, #FA6D58)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} />
                  <span>{t('stores.filter_verified', 'Tasdiqlangan')}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Directory Grid */}
      <section className="stores-grid-section">
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Yuklanmoqda...
            </div>
          ) : filteredStores.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Store size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {t('stores.not_found', 'Hech qanday mebel do‘koni topilmadi')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Boshqa kalit so‘z bilan qidirib ko‘ring yoki filtrlarni tozalang.
              </p>
            </div>
          ) : (
            <div className="stores-grid-container">
              {filteredStores.map((store) => {
                const count = getStoreProductCount(store.id);
                return (
                  <div
                    key={store.id}
                    className="store-card glass-card"
                  >
                    {/* Cover Banner */}
                    <div
                      className="store-card-banner"
                      style={{
                        backgroundImage: `url(${store.banner_image})`
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)'
                        }}
                      />

                      {/* Top Badges */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          display: 'flex',
                          gap: '0.4rem',
                          zIndex: 3
                        }}
                      >
                        {store.verified && (
                          <span
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.95)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                          >
                            <ShieldCheck size={13} /> {t('stores.verified', 'Tasdiqlangan')}
                          </span>
                        )}
                        {store.is_top && (
                          <span
                            style={{
                              backgroundColor: 'var(--figma-coral, #FA6D58)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                          >
                            TOP
                          </span>
                        )}
                      </div>

                      {/* Store Logo overlapping banner */}
                      <div className="store-card-avatar">
                        <img
                          src={store.logo}
                          alt={store.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Store Info Content */}
                    <div className="store-card-body">
                      <div className="store-card-title-row">
                        <h3 className="store-card-title">
                          <Link to={`/stores/${store.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {store.name}
                          </Link>
                        </h3>
                        <div className="store-rating-pill">
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span>{store.rating}</span>
                          <span style={{ opacity: 0.75, fontSize: '0.72rem', fontWeight: 500 }}>
                            ({store.reviews_count})
                          </span>
                        </div>
                      </div>

                      <p className="store-card-desc">
                        {store.description}
                      </p>

                      {/* Store Meta Details */}
                      <div className="store-card-meta">
                        <div className="store-card-meta-row" title={store.address}>
                          <MapPin size={14} style={{ color: 'var(--figma-coral, #FA6D58)', flexShrink: 0 }} />
                          <span>{store.address}</span>
                        </div>
                        <div className="store-card-meta-row">
                          <Phone size={14} style={{ color: 'var(--figma-coral, #FA6D58)', flexShrink: 0 }} />
                          <a href={`tel:${store.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {store.phone}
                          </a>
                        </div>
                        <div className="store-card-meta-row">
                          <Clock size={14} style={{ color: 'var(--figma-coral, #FA6D58)', flexShrink: 0 }} />
                          <span>{store.working_hours}</span>
                        </div>
                      </div>

                      {/* Store Bottom Bar */}
                      <div className="store-card-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <Package size={15} style={{ color: 'var(--figma-coral, #FA6D58)' }} />
                          <span><strong>{count}</strong> {t('stores.items_count', 'ta mebel')}</span>
                        </div>

                        <Link
                          to={`/stores/${store.id}`}
                          className="btn btn-figma-primary btn-sm store-card-btn"
                          style={{
                            padding: '0.55rem 1.15rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-md)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <span>{t('stores.view_store', 'Do‘konga Kirish')}</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .stores-hero-section {
          background: linear-gradient(135deg, rgba(250, 109, 88, 0.08) 0%, rgba(24, 25, 29, 0.04) 100%);
          padding: 3.5rem 1.5rem 3rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .stores-filter-pills {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .stores-grid-section {
          padding: 3rem 1.5rem 5rem;
        }
        .stores-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }
        .store-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl, 20px);
          border: 1px solid var(--border-subtle);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
        }
        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
          border-color: rgba(250, 109, 88, 0.35);
        }
        .store-card-banner {
          position: relative;
          height: 155px;
          background-size: cover;
          background-position: center;
          background-color: var(--bg-secondary);
        }
        .store-card-avatar {
          position: absolute;
          bottom: -22px;
          left: 1.25rem;
          width: 62px;
          height: 62px;
          border-radius: 14px;
          border: 3px solid var(--bg-card);
          overflow: hidden;
          background-color: var(--bg-card);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          z-index: 2;
        }
        .store-card-body {
          padding: 2.1rem 1.35rem 1.35rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .store-card-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .store-card-title {
          font-size: 1.18rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-main);
          line-height: 1.35;
          flex: 1;
        }
        .store-rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          padding: 0.22rem 0.55rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .store-card-desc {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .store-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          background: var(--bg-secondary);
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-md, 10px);
        }
        .store-card-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }
        .store-card-meta-row span, .store-card-meta-row a {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .store-card-footer {
          margin-top: auto;
          padding-top: 0.95rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        @media (max-width: 640px) {
          .stores-hero-section {
            padding: 2.25rem 1rem 1.75rem !important;
          }
          .stores-filter-pills {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            padding: 0.2rem 0.25rem 0.5rem !important;
            flex-wrap: nowrap !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .stores-filter-pills::-webkit-scrollbar {
            display: none;
          }
          .stores-filter-pill-btn {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
          .stores-grid-section {
            padding: 1.25rem 0.85rem 4.5rem !important;
          }
          .stores-grid-container {
            grid-template-columns: 1fr !important;
            gap: 1.15rem !important;
          }
          .store-card-banner {
            height: 135px !important;
          }
          .store-card-avatar {
            width: 52px !important;
            height: 52px !important;
            bottom: -16px !important;
            left: 1rem !important;
            border-radius: 12px !important;
          }
          .store-card-body {
            padding: 1.65rem 1rem 1rem !important;
          }
          .store-card-title {
            font-size: 1.05rem !important;
          }
          .store-card-meta {
            padding: 0.65rem 0.75rem !important;
            font-size: 0.78rem !important;
            gap: 0.4rem !important;
          }
          .store-card-footer {
            padding-top: 0.75rem !important;
          }
          .store-card-btn {
            padding: 0.55rem 0.95rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};
