import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  Star,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Package,
  Send,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import { ProductCard } from '../components/ProductCard';
import { QuickBuyModal } from '../components/QuickBuyModal';

export const StoreDetailPage = () => {
  const { id } = useParams();
  const { t, getLocalized } = useLanguage();
  const { addToast } = useNotification();

  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [loading, setLoading] = useState(true);

  // Quick Buy state
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [foundStore, allProducts, allCats] = await Promise.all([
          dataService.getStoreById(id),
          dataService.getProducts(),
          dataService.getCategories()
        ]);
        setStore(foundStore);
        setCategories(allCats || []);

        // Filter products belonging to this store
        if (foundStore) {
          const matching = (allProducts || []).filter(
            (p) => p.store_id === foundStore.id || p.store_id === id
          );
          setStoreProducts(matching);
        }
      } catch (err) {
        console.error('Error fetching store detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...storeProducts];

    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    // Default sorting by stars (highest rating on top, lowest rating drops to the bottom)
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'rating_desc':
      default:
        result.sort((a, b) => {
          const ratingA = Number(a.rating) || 0;
          const ratingB = Number(b.rating) || 0;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return (Number(b.reviews_count) || 0) - (Number(a.reviews_count) || 0);
        });
        break;
    }

    return result;
  }, [storeProducts, selectedCategory, sortBy]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store?.name || 'Mebel Do‘koni',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(t('common.copied', 'Havola nusxalandi!'), 'info');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Do‘kon ma‘lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!store) {
    return (
      <div style={{ padding: '5rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
        <Store size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Do‘kon topilmadi
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Ushbu mebel do‘koni tizimdan o‘chirilgan yoki manzili noto‘g‘ri.
        </p>
        <Link to="/stores" className="btn btn-primary">
          <ArrowLeft size={16} /> Barcha Do‘konlarga Qaytish
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '90vh' }}>
      {/* Store Cover Banner */}
      <div
        style={{
          position: 'relative',
          height: '280px',
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
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
          }}
        />

        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', height: '100%', position: 'relative', display: 'flex', alignItems: 'flex-start', paddingTop: '1.5rem' }}>
          <Link
            to="/stores"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <ArrowLeft size={14} /> {t('stores.back_to_list', 'Barcha do‘konlar')}
          </Link>
        </div>
      </div>

      {/* Store Profile Card (Overlapping Banner) */}
      <div className="container store-detail-card-container">
        <div className="store-detail-profile-card glass-card">
          {/* Logo & Info */}
          <div className="store-detail-logo-info">
            <div className="store-detail-avatar">
              <img
                src={store.logo}
                alt={store.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)', fontWeight: 800, margin: 0 }}>
                  {store.name}
                </h1>
                {store.verified && (
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--status-success)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <ShieldCheck size={13} /> {t('stores.verified', 'Tasdiqlangan')}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={15} fill="#f59e0b" color="#f59e0b" />
                  <span>{store.rating}</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>
                    ({store.reviews_count} {t('stores.reviews', 'ta sharh')})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Package size={14} style={{ color: 'var(--figma-coral, #FA6D58)' }} />
                  <span><strong>{storeProducts.length}</strong> {t('stores.items_count', 'ta mebel')}</span>
                </div>
                {store.established_year && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} style={{ color: 'var(--figma-coral, #FA6D58)' }} />
                    <span>{store.established_year}-yildan beri</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Contact Buttons */}
          <div className="store-detail-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <a
              href={`tel:${store.phone}`}
              className="btn btn-figma-primary"
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Phone size={15} /> <span>{store.phone}</span>
            </a>

            {store.telegram && (
              <a
                href={`https://t.me/${store.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Send size={15} /> <span>Telegram</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary"
              aria-label="Ulashish"
              style={{ width: '40px', height: '40px', padding: 0 }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Store description & Location Row */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1.25rem 1.75rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ flex: '1 1 500px' }}>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {store.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} style={{ color: 'var(--primary)' }} />
              <strong>Manzil:</strong> {store.address}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} style={{ color: 'var(--primary)' }} />
              <strong>Ish vaqti:</strong> {store.working_hours}
            </div>
          </div>
        </div>
      </div>

      {/* Store Products Section */}
      <section style={{ padding: '1rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Section Heading & Sorting Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
                {store.name} mebellari katalogi
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Yulduzlar bo‘yicha tartiblangan e‘lonlar (Eng yuqori reytingli mebellar boshida)
              </span>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t('catalog.sort_label', 'Saralash')}:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', minWidth: '220px', fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
              >
                <option value="rating_desc">⭐ {t('catalog.sort_rating', 'Yulduzlar bo‘yicha (Yuqoridan pastga)')}</option>
                <option value="price_asc">{t('catalog.sort_price_asc', 'Narx: Arzondan qimmatga')}</option>
                <option value="price_desc">{t('catalog.sort_price_desc', 'Narx: Qimmatdan arzonga')}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills for this store */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                backgroundColor: selectedCategory === 'ALL' ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedCategory === 'ALL' ? '#ffffff' : 'var(--text-main)',
                border: selectedCategory === 'ALL' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {t('catalog.all', 'Barchasi')} ({storeProducts.length})
            </button>
            {categories.map((cat) => {
              const inStoreCount = storeProducts.filter((p) => p.category_id === cat.id).length;
              if (inStoreCount === 0) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--bg-card)',
                    color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-main)',
                    border: selectedCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {getLocalized(cat, 'name') || cat.name} ({inStoreCount})
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Package size={40} style={{ opacity: 0.3, marginBottom: '0.75rem', color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>
                Ushbu bo‘limda hozircha mebellar mavjud emas.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {filteredAndSortedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Buy Modal */}
      <QuickBuyModal
        product={quickBuyProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => {
          setIsQuickBuyOpen(false);
          setQuickBuyProduct(null);
        }}
      />

      <style>{`
        .store-detail-card-container {
          max-width: 1240px;
          margin: -70px auto 3rem;
          position: relative;
          z-index: 5;
          padding: 0 1.5rem;
        }
        .store-detail-profile-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl, 20px);
          border: 1px solid var(--border-subtle);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-wrap: wrap;
          gap: 1.75rem;
          align-items: center;
          justify-content: space-between;
        }
        .store-detail-logo-info {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex: 1 1 450px;
          min-width: 0;
        }
        .store-detail-avatar {
          width: 86px;
          height: 86px;
          border-radius: var(--radius-lg, 16px);
          border: 3px solid var(--bg-card);
          overflow: hidden;
          background-color: var(--bg-secondary);
          box-shadow: var(--shadow-md);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .store-detail-card-container {
            margin: -45px auto 1.75rem !important;
            padding: 0 1rem !important;
          }
          .store-detail-profile-card {
            padding: 1.25rem 1rem !important;
            gap: 1.25rem !important;
          }
          .store-detail-logo-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.85rem !important;
            flex: 1 1 100% !important;
          }
          .store-detail-avatar {
            width: 64px !important;
            height: 64px !important;
            border-radius: 12px !important;
          }
          .store-detail-actions {
            width: 100% !important;
            justify-content: stretch !important;
          }
          .store-detail-actions > a {
            flex: 1 !important;
            text-align: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};
