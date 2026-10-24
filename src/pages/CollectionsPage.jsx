import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
  Star,
  CheckCircle2,
  Layers,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { dataService, getStored } from '../services/dataService';
import { initialCollections } from '../data/mockData';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { QuickBuyModal } from '../components/QuickBuyModal';
import { useLanguage } from '../context/LanguageContext';

export const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const [collections, setCollections] = useState(() => getStored('collections', initialCollections));
  const [products, setProducts] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState('col-atmos');
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [colList, prodList] = await Promise.all([
          dataService.getCollections(),
          dataService.getProducts()
        ]);
        if (colList && colList.length > 0) {
          setCollections(colList);
          const paramCol = searchParams.get('id');
          if (paramCol && colList.some((c) => c.id === paramCol || c.slug === paramCol)) {
            const found = colList.find((c) => c.id === paramCol || c.slug === paramCol);
            setActiveCollectionId(found.id);
          } else {
            setActiveCollectionId(colList[0].id);
          }
        }
        setProducts(prodList || []);
      } catch (e) {
        console.error('Error loading collections page data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Live update when Admin edits collections
    const handleUpdate = () => {
      dataService.getCollections().then((cols) => {
        if (cols && cols.length > 0) setCollections(cols);
      });
    };
    window.addEventListener('urgut_store_collections_updated', handleUpdate);
    return () => {
      window.removeEventListener('urgut_store_collections_updated', handleUpdate);
    };
  }, [searchParams]);

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || collections[0] || {};

  // Products belonging to the active collection
  const collectionProducts = products.filter((p) =>
    Array.isArray(activeCollection.product_ids) && activeCollection.product_ids.includes(p.id)
  );

  const handleSelectCollection = (id) => {
    setActiveCollectionId(id);
    setSearchParams({ id });
    const el = document.getElementById('collection-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenQuickBuy = (prod) => {
    setQuickBuyProduct(prod);
    setIsQuickBuyOpen(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* ==============================================================
          1. LUXURY HERO BANNER: URGUT MEBEL MARKAZI COLLECTIONS
          ============================================================== */}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(35, 21, 24, 0.95) 0%, rgba(20, 15, 17, 0.98) 100%)',
          color: '#ffffff',
          padding: '4.5rem 1.25rem 3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.22,
            filter: 'blur(2px)'
          }}
        />

        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(250, 109, 88, 0.2)',
              border: '1px solid rgba(250, 109, 88, 0.4)',
              color: 'var(--figma-coral, #FA6D58)',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>Eksklyuziv Mebel Kolleksiyalari</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 1rem',
              color: '#ffffff'
            }}
          >
            Maftunkor va Zamonaviy Kolleksiyalar
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: '#d1d5db',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}
          >
            Urgutning asriy duradgorlik an'analari va zamonaviy Yevropa dizaynining uyg‘unlashuvi. 
            Xonadoningizga fayz bag‘ishlovchi maxsus saralangan to‘plamlar.
          </p>

          {/* Quick Collection Badges Nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem'
            }}
          >
            {collections.map((col) => {
              const isSelected = col.id === activeCollectionId;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleSelectCollection(col.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--figma-coral, #FA6D58)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: isSelected ? '1px solid var(--figma-coral, #FA6D58)' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0.6rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(8px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                  className="collection-tab-pill"
                >
                  {col.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px'
                      }}
                    >
                      {col.badge}
                    </span>
                  )}
                  <span>{col.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. AUTUMN COLLECTION INTERACTIVE SLIDESHOW (Requested by user)
          ============================================================== */}
      <section style={{ padding: '3.5rem 1.25rem 2rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
            <span
              style={{
                color: 'var(--figma-coral, #FA6D58)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em'
              }}
            >
              Mavsumiy Saralangan
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.35rem 0 0' }}>
              Autumn & Seasonal Highlights
            </h2>
          </div>
          <FigmaCollectionCarousel />
        </div>
      </section>

      {/* ==============================================================
          3. ACTIVE COLLECTION FEATURE SHOWCASE & PRODUCTS
          ============================================================== */}
      <section id="collection-showcase" style={{ padding: '2rem 1.25rem 4rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Active Collection Big Feature Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#1f1618',
              backgroundImage: `url(${activeCollection.cover_image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.5rem',
              color: '#ffffff',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              marginBottom: '3rem'
            }}
          >
            {/* Dark gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(20, 15, 17, 0.3) 0%, rgba(20, 15, 17, 0.92) 100%)',
                zIndex: 1
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
              {activeCollection.badge && (
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--figma-coral, #FA6D58)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    marginBottom: '0.6rem'
                  }}
                >
                  {activeCollection.badge}
                </div>
              )}
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 900,
                  margin: '0 0 0.65rem',
                  color: '#ffffff',
                  lineHeight: 1.15
                }}
              >
                {activeCollection.title}
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#e5e7eb',
                  lineHeight: 1.55,
                  marginBottom: '1.5rem'
                }}
              >
                {activeCollection.description || activeCollection.subtitle}
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/furniture?collection=${activeCollection.id}`}
                  style={{
                    backgroundColor: 'var(--figma-coral, #FA6D58)',
                    color: '#ffffff',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(250, 109, 88, 0.4)'
                  }}
                >
                  <span>Katalogda Ko‘rish ({collectionProducts.length})</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('collection-products-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  Mahsulotlar Ro‘yxati
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid for this Collection */}
          <div id="collection-products-grid">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.85rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {activeCollection.title} — Mebellari ({collectionProducts.length} ta)
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Super Admin tomonidan ushbu kolleksiyaga biriktirilgan maxsus mahsulotlar
                </p>
              </div>

              <Link
                to={`/furniture?collection=${activeCollection.id}`}
                style={{
                  color: 'var(--figma-coral, #FA6D58)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>Barchasini ko‘rish</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {collectionProducts.length === 0 ? (
              <div
                style={{
                  padding: '4rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Sparkles size={44} style={{ color: 'var(--wood-amber)', opacity: 0.7, margin: '0 auto 0.75rem', display: 'block' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                  Hozircha ushbu kolleksiyaga mebellar biriktirilmagan
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Super Admin tez orada ushbu kolleksiya uchun yangi mebellarni joylashtiradi.
                </p>
                <Link to="/furniture" className="btn btn-primary">
                  Barcha Mebellar Katalogi
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {collectionProducts.map((item) => {
                  const primaryImg = item.image_url || item.image || (Array.isArray(item.images) ? item.images[0] : null) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
                  const hasDiscount = item.discount_price && Number(item.discount_price) > 0 && Number(item.discount_price) < Number(item.price);

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        position: 'relative'
                      }}
                      className="collection-product-card"
                    >
                      {/* Image */}
                      <Link
                        to={`/furniture/${item.id}`}
                        style={{
                          position: 'relative',
                          display: 'block',
                          paddingTop: '80%',
                          backgroundColor: 'var(--bg-secondary)',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={primaryImg}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
                          }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.35s ease'
                          }}
                          className="collection-card-img"
                        />
                        {hasDiscount && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '0.6rem',
                              left: '0.6rem',
                              backgroundColor: '#ef4444',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            AKSIYA
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-light)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            marginBottom: '0.25rem'
                          }}
                        >
                          {item.store_name || 'Urgut Mebel'}
                        </div>

                        <h4
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            margin: '0 0 0.5rem',
                            lineHeight: 1.35,
                            height: '2.5em',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          <Link to={`/furniture/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                          <Star size={13} fill="#f59e0b" />
                          <span style={{ fontWeight: 800 }}>{Number(item.rating || 5.0).toFixed(1)}</span>
                          <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>({item.reviews_count || 12})</span>
                        </div>

                        {/* Price */}
                        <div style={{ marginTop: 'auto', paddingTop: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {(hasDiscount ? Number(item.discount_price) : Number(item.price)).toLocaleString()} so‘m
                            </span>
                            {hasDiscount && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                {Number(item.price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Buy Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenQuickBuy(item)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            marginTop: '0.75rem',
                            width: '100%',
                            padding: '0.45rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Zap size={14} />
                          <span>Tezkor Xarid</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1-Click Quick Buy Modal */}
      <QuickBuyModal
        product={quickBuyProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => {
          setIsQuickBuyOpen(false);
          setQuickBuyProduct(null);
        }}
      />

      <style>{`
        .collection-tab-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }
        .collection-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .collection-product-card:hover .collection-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
