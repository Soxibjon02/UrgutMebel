import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, ChevronLeft, ChevronRight, Star, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

export const UrbanTop10Trending = ({ onQuickBuy }) => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const { addToCart } = useCart();
  const { addToast } = useNotification();

  const loadTrending = async () => {
    try {
      const items = await dataService.getTrendingTop10();
      setTrendingProducts(items || []);
    } catch (e) {
      console.error('Error loading top 10 trending products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();

    // Live sync when Super Admin edits Top 10 in Admin Dashboard
    const handleUpdate = () => {
      loadTrending();
    };

    window.addEventListener('urgut_store_trending_updated', handleUpdate);
    window.addEventListener('urgut_store_products_updated', handleUpdate);

    return () => {
      window.removeEventListener('urgut_store_trending_updated', handleUpdate);
      window.removeEventListener('urgut_store_products_updated', handleUpdate);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product, 1);
    }
    if (addToast) {
      addToast(`"${product.name}" savatga qo‘shildi!`, 'success');
    }
  };

  if (!loading && (!trendingProducts || trendingProducts.length === 0)) {
    return null;
  }

  return (
    <section
      id="top-10-trending"
      style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.12), rgba(245, 158, 11, 0.14))',
                color: 'var(--figma-coral, #FA6D58)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              <Flame size={14} color="#FA6D58" />
              <span>TOP 10 TREND • HAFTALIK REYTING</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 0.35rem',
                letterSpacing: '-0.02em'
              }}
            >
              Haftaning Eng Ommabop Top 10 Mebeli
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px' }}>
              Urgut mebel markazidagi eng ko‘p buyurtma qilinayotgan va xaridorlar e’tirofiga sazovor bo‘lgan yetakchi modellar
            </p>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Oldingi mebellar"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Keyingi mebellar"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth'
          }}
        >
          {trendingProducts.map((product, idx) => {
            const rank = idx + 1;
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;
            const effectivePrice = product.discount_price || product.price;
            const hasDiscount = Boolean(product.discount_price && product.discount_price < product.price);
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discount_price) / product.price) * 100)
              : null;

            return (
              <div
                key={product.id || idx}
                style={{
                  flex: '0 0 280px',
                  scrollSnapAlign: 'start',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '18px',
                  border: isGold
                    ? '2px solid rgba(245, 158, 11, 0.45)'
                    : isSilver
                    ? '2px solid rgba(148, 163, 184, 0.45)'
                    : isBronze
                    ? '2px solid rgba(180, 83, 9, 0.45)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isGold
                    ? '0 10px 30px rgba(245, 158, 11, 0.12)'
                    : 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
                className="urban-top10-card"
              >
                {/* Image & Rank Badge Container */}
                <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                  <Link to={`/furniture/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={product.images?.[0] || product.image || product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      className="urban-top10-img"
                    />
                  </Link>

                  {/* Big Stylized Rank Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      letterSpacing: '0.04em',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      background: isGold
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : isSilver
                        ? 'linear-gradient(135deg, #64748B, #475569)'
                        : isBronze
                        ? 'linear-gradient(135deg, #B45309, #78350F)'
                        : 'rgba(24, 25, 29, 0.88)'
                    }}
                  >
                    {isGold ? '🥇 #1 O‘RIN' : isSilver ? '🥈 #2 O‘RIN' : isBronze ? '🥉 #3 O‘RIN' : `#${rank} O‘RIN`}
                  </div>

                  {/* Discount percentage badge */}
                  {discountPercent && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'var(--figma-coral, #FA6D58)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}
                    >
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Rating & Category */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                      <Star size={13} fill="#fbbf24" color="#fbbf24" />
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{Number(product.rating || 5.0).toFixed(1)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({product.reviews_count || 18})</span>
                    </div>

                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {product.room_type || product.category_name || 'Mebel'}
                    </span>
                  </div>

                  {/* Product Title */}
                  <Link
                    to={`/furniture/${product.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      lineHeight: 1.4,
                      marginBottom: '0.35rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </Link>

                  {/* Store Name */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                    Do‘kon: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.store_name || "Urgut Mebel Markazi"}</span>
                  </div>

                  {/* Price & Action Row */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--figma-coral, #FA6D58)' }}>
                        {Number(effectivePrice).toLocaleString()} so‘m
                      </div>
                      {hasDiscount && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {Number(product.price).toLocaleString()} so‘m
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        if (onQuickBuy) {
                          onQuickBuy(product);
                        } else {
                          handleAddToCart(e, product);
                        }
                      }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--figma-coral, #FA6D58)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(250, 109, 88, 0.3)',
                        transition: 'transform 0.18s ease'
                      }}
                      title="Savatga qo‘shish / Tezkor xarid"
                    >
                      <ShoppingBag size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
