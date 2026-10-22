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
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.08) 0%, rgba(24, 25, 29, 0.04) 100%)',
          padding: '3.5rem 1.5rem 3rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(250, 109, 88, 0.12)',
              color: 'var(--primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem'
            }}
          >
            <Store size={16} /> {t('stores.badge', 'Rasmiy Savdo Do‘konlari')}
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              marginBottom: '0.85rem'
            }}
          >
            {t('stores.title', 'Urgutning Eng Sara Mebel Do‘konlari')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
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
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>

            {/* Quick Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'ALL' ? 'var(--primary)' : 'var(--bg-card)',
                  color: filterType === 'ALL' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'ALL' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t('stores.filter_all', 'Barcha Do‘konlar')} ({stores.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('TOP')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'TOP' ? 'var(--primary)' : 'var(--bg-card)',
                  color: filterType === 'TOP' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'TOP' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ⭐ {t('stores.filter_top', 'Top Reytingli')}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('VERIFIED')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: filterType === 'VERIFIED' ? 'var(--primary)' : 'var(--bg-card)',
                  color: filterType === 'VERIFIED' ? '#ffffff' : 'var(--text-main)',
                  border: filterType === 'VERIFIED' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🛡️ {t('stores.filter_verified', 'Tasdiqlangan')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Directory Grid */}
      <section style={{ padding: '3.5rem 1.5rem 5rem' }}>
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {filteredStores.map((store) => {
                const count = getStoreProductCount(store.id);
                return (
                  <div
                    key={store.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-subtle)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    className="furniture-card glass-card"
                  >
                    {/* Cover Banner */}
                    <div
                      style={{
                        position: 'relative',
                        height: '140px',
                        backgroundImage: `url(${store.banner_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: 'var(--bg-secondary)'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
                        }}
                      />

                      {/* Top Badges */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.85rem',
                          right: '0.85rem',
                          display: 'flex',
                          gap: '0.4rem'
                        }}
                      >
                        {store.verified && (
                          <span
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.9)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            <ShieldCheck size={13} /> {t('stores.verified', 'Tasdiqlangan')}
                          </span>
                        )}
                        {store.is_top && (
                          <span
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            TOP
                          </span>
                        )}
                      </div>

                      {/* Store Logo overlapping banner */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-28px',
                          left: '1.5rem',
                          width: '64px',
                          height: '64px',
                          borderRadius: 'var(--radius-md)',
                          border: '3px solid var(--bg-card)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--bg-card)',
                          boxShadow: 'var(--shadow-md)'
                        }}
                      >
                        <img
                          src={store.logo}
                          alt={store.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>

                    {/* Store Info Content */}
                    <div style={{ padding: '2.25rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                          <Link to={`/stores/${store.id}`} style={{ color: 'inherit' }}>
                            {store.name}
                          </Link>
                        </h3>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#f59e0b',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{store.rating}</span>
                          <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 500 }}>
                            ({store.reviews_count})
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {store.description}
                      </p>

                      {/* Store Meta Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {store.address}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <a href={`tel:${store.phone}`} style={{ color: 'inherit' }}>
                            {store.phone}
                          </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>{store.working_hours}</span>
                        </div>
                      </div>

                      {/* Store Bottom Bar */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Package size={15} style={{ color: 'var(--primary)' }} />
                          <span><strong>{count}</strong> {t('stores.items_count', 'ta mebel')}</span>
                        </div>

                        <Link
                          to={`/stores/${store.id}`}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          {t('stores.view_store', 'Do‘konga Kirish')}
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
    </div>
  );
};
