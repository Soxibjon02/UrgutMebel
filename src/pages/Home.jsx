import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import { QuickBuyModal } from '../components/QuickBuyModal';
import { CategoryCardsGrid } from '../components/CategoryCardsGrid';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Hammer,
  CheckCircle2,
  Check,
  Flame,
  Star,
  Crown,
  Store,
  ShoppingBag,
  Zap
} from 'lucide-react';

export const Home = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();
  const { language, t, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Top 10 Trending State
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  // Join Us Newsletter State
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodList, catList, blogList, banList, trendList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories(),
          dataService.getBlogPosts(),
          dataService.getBanners(),
          dataService.getTrendingTop10()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
        setBlogPosts(blogList || []);
        setBanners(banList || []);
        setTrendingProducts(trendList || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadHomeData();

    // Listen to store updates for real-time trending updates
    const handleUpdate = async () => {
      const trendList = await dataService.getTrendingTop10();
      setTrendingProducts(trendList || []);
    };
    window.addEventListener('urgut_store_products_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_products_updated', handleUpdate);
  }, []);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!joinEmail || !joinEmail.includes('@')) {
      addToast('Iltimos, haqiqiy email kiriting!', 'warning');
      return;
    }
    setJoinLoading(true);
    try {
      await dataService.subscribeNewsletter(joinEmail, joinName || 'Mijoz', 'home_join_us');
      setJoinSubmitted(true);
      setJoinEmail('');
      setJoinName('');
      addToast('Ajoyib! Sizga 10% chegirma kodi taqdim etildi.', 'success');
    } catch (err) {
      addToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setJoinLoading(false);
    }
  };

  const featuredPost = blogPosts[0] || {
    id: 'post-1',
    title: 'Living room and lighting ideas that will inspire you this Winter.',
    excerpt: 'Yashash xonangizni yorug‘lik va qulay mebellar bilan shinam qilish sirlari...',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    author: 'Soxibjon Usta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    date: '14 Jun 2026'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO SECTION (Chairs & Stools)
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="figma-split-hero">
            {/* Left Column: Soft Pastel Blue with Slideshow */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '2.5rem',
                minHeight: '360px',
                overflow: 'hidden'
              }}
            >
              <HeaderAfishaSlideshow
                images={settings.chairs_hero_slides && settings.chairs_hero_slides.length > 0 ? settings.chairs_hero_slides : [
                  "https://images.unsplash.com/photo-1580481077195-c9233634e70e?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
                ]}
                alt="Chairs & Stools"
                interval={3500}
                objectFit="contain"
              />
            </div>

            {/* Right Column: Soft Warm Cream with Text and Coral Button */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-peach)',
                padding: '4rem 3.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}
            >
              <span
                style={{
                  color: 'var(--figma-coral)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem'
                }}
              >
                {t('hero.new_collection', 'New Collection')}
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  margin: '0 0 1rem'
                }}
              >
                {t('hero.chairs_title', 'Chairs & Stools')}
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '380px',
                  marginBottom: '2rem'
                }}
              >
                {t('hero.chairs_desc', 'Uyingiz va ofisingiz uchun zamonaviy, qulay va uzoq yillik sifatga ega o‘rindiqlar to‘plami.')}
              </p>
              <Link to="/furniture" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                {t('hero.see_details', 'SEE DETAILS >')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          TOP 10 TRENDING FURNITURE (FIGMA LUXURY RANKING WITH QUICK BUY)
          Super Admin managed & 1-click Quick Buy modal
          ============================================================== */}
      {trendingProducts && trendingProducts.length > 0 && (
        <section
          style={{
            padding: '2rem 1.5rem 4rem',
            background: 'linear-gradient(180deg, rgba(250, 109, 88, 0.04) 0%, rgba(24, 25, 29, 0.02) 100%)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(250, 109, 88, 0.12)',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    marginBottom: '0.6rem'
                  }}
                >
                  <Flame size={16} fill="var(--primary)" /> {t('trending.badge', 'URGUT VA SAMARQANDDA ENG TALABGIR MEBELLAR')}
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}
                >
                  {t('trending.title', 'Top 10 Trenddagi Mebellar')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.45rem 0 0', maxWidth: '640px' }}>
                  {t('trending.subtitle', 'Mijozlar tomonidan eng ko‘p xarid qilingan va 5.0 yulduz to‘plagan eng sara 10 ta mebel kolleksiyasi. Istalgan mebelni bir bosishda tezkor xarid qiling.')}
                </p>
              </div>

              <Link
                to="/furniture"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {t('trending.view_all', 'Barcha reytingni ko‘rish')} <ArrowRight size={15} />
              </Link>
            </div>

            {/* Horizontal Scroll / Grid of Top 10 Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {trendingProducts.slice(0, 10).map((prod, index) => {
                const rank = index + 1;
                const isGold = rank === 1;
                const isSilver = rank === 2;
                const isBronze = rank === 3;
                const currentPrice = prod.discount_price || prod.price;
                const primaryImg =
                  prod.images?.[0] || prod.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-xl)',
                      border: isGold ? '2px solid rgba(245, 158, 11, 0.6)' : '1px solid var(--border-subtle)',
                      boxShadow: isGold ? '0 10px 30px rgba(245, 158, 11, 0.18)' : 'var(--shadow-sm)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    className="furniture-card glass-card"
                  >
                    {/* Image Box */}
                    <div
                      style={{
                        position: 'relative',
                        paddingTop: '68%',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-secondary)'
                      }}
                    >
                      <img
                        src={primaryImg}
                        alt={prod.name}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                      />

                      {/* Rank Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          backdropFilter: 'blur(4px)',
                          background: isGold
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : isSilver
                            ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                            : isBronze
                            ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                            : 'rgba(20, 20, 22, 0.85)',
                          zIndex: 2
                        }}
                      >
                        {isGold ? <Crown size={14} /> : null}
                        <span>#{rank} Trend</span>
                      </div>

                      {/* Discount Badge if available */}
                      {prod.discount_price && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            backgroundColor: 'var(--figma-coral)',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            zIndex: 2
                          }}
                        >
                          -{Math.round(((prod.price - prod.discount_price) / prod.price) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Store Badge */}
                      {prod.store_name && (
                        <Link
                          to={prod.store_id ? `/stores/${prod.store_id}` : '/stores'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            marginBottom: '0.4rem',
                            textDecoration: 'none'
                          }}
                        >
                          <Store size={13} />
                          <span>{prod.store_name}</span>
                        </Link>
                      )}

                      {/* Product Name */}
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          margin: '0 0 0.5rem',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        <Link to={`/furniture/${prod.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {getLocalized(prod, 'name') || prod.name}
                        </Link>
                      </h3>

                      {/* Star Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              fill={i < Math.floor(prod.rating || 5) ? '#f59e0b' : 'none'}
                              color="#f59e0b"
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                          {prod.rating || 5.0}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          ({prod.reviews_count || 10})
                        </span>
                      </div>

                      {/* Price & Buy Button */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {Number(currentPrice).toLocaleString()} {t('catalog.price_currency', 'so‘m')}
                          </div>
                          {prod.discount_price && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                              {Number(prod.price).toLocaleString()} so‘m
                            </div>
                          )}
                        </div>

                        {/* Quick Buy Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setQuickBuyProduct(prod);
                            setIsQuickBuyOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '0.5rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Zap size={14} fill="#ffffff" />
                          <span>{t('quick_buy.buy_now', 'Xarid Qilish')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          2. LUXURY CATEGORY SHOWCASE CARDS (Screenshot 2 / Super Admin Style)
          ============================================================== */}
      <section style={{ padding: '3.5rem 1.5rem 4.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <CategoryCardsGrid
            categories={categories}
            products={products}
            showAllLink={true}
          />
        </div>
      </section>

      {/* ==============================================================
          2.5. FIGMA ANNOUNCEMENTS & PROMOTIONAL BANNERS
          ============================================================== */}
      {banners.filter(b => b.is_active !== false).length > 0 && (
        <section style={{ padding: '0 1.5rem 4rem' }}>
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--figma-coral)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>
                  {t('banners.section_title', 'Aksiyalar & E‘lonlar')}
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {t('banners.section_title', 'Maxsus Takliflar')}
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {banners.filter(b => b.is_active !== false).map((banner) => {
                const localizedTitle = getLocalized(banner, 'title') || banner.title;
                const localizedSubtitle = getLocalized(banner, 'subtitle') || banner.subtitle;
                const localizedBtnText = getLocalized(banner, 'button_text') || banner.button_text || t('banners.learn_more', 'BATAFSIL');

                return (
                  <div
                    key={banner.id}
                    onClick={() => navigate(banner.link || '/furniture')}
                    style={{
                      position: 'relative',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      minHeight: '260px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '2rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-card)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    }}
                  >
                    {/* Background Image with Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${banner.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 1
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)',
                        zIndex: 2
                      }}
                    />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 3, color: '#FFFFFF' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {localizedTitle}
                      </h3>
                      {localizedSubtitle && (
                        <p style={{ fontSize: '0.88rem', opacity: 0.92, marginBottom: '1.25rem', lineHeight: 1.4, maxWidth: '420px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                          {localizedSubtitle}
                        </p>
                      )}
                      <span
                        className="btn-figma-coral"
                        style={{
                          padding: '0.5rem 1.25rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        {localizedBtnText} &gt;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          3. FIGMA SPECIAL OFFER: "JOIN US" & LIFESTYLE PHOTO
          ============================================================== */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '45% 55%',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)'
            }}
            className="join-us-split"
          >
            {/* Left: Vibrant Coral Block with Form */}
            <div
              style={{
                backgroundColor: 'var(--figma-coral)',
                padding: '4.5rem 3.5rem',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  opacity: 0.9,
                  marginBottom: '0.5rem'
                }}
              >
                {t('footer.join_newsletter_title', 'Special Offer')}
              </span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.1 }}>
                Join Us
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.92, lineHeight: 1.6, marginBottom: '2rem' }}>
                {t('footer.join_newsletter_desc', 'Bizning klubimizga obuna bo‘ling va birinchi buyurtmangiz uchun eksklyuziv 10% chegirmaga ega bo‘ling.')}
              </p>

              {joinSubmitted ? (
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '1.25rem',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  <Check size={22} /> {t('footer.subscribed_success', 'Tabriklaymiz! Sizga -10% promo kodi yuborildi.')}
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder={t('contact.your_name', 'Ismingiz')}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.22)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="email"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    placeholder={t('footer.enter_email', 'hello@urgutmebel.uz')}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.22)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#FFFFFF',
                      borderRadius: '2px',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={joinLoading}
                    className="btn-figma-dark"
                    style={{ width: '100%', marginTop: '0.4rem' }}
                  >
                    {joinLoading ? '...' : t('footer.subscribe_btn', 'SIGN UP NOW')}
                  </button>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      opacity: 0.85,
                      marginTop: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input type="checkbox" defaultChecked required />
                    {language === 'ru'
                      ? 'Согласен на обработку персональных данных'
                      : language === 'en'
                      ? 'I agree to the processing of personal data'
                      : 'Obuna orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildiraman'}
                  </label>
                </form>
              )}
            </div>

            {/* Right: Modern Interior Photography */}
            <div
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
              }}
            />
          </div>
        </div>
      </section>

      {/* ==============================================================
          4. FIGMA TRENDING: "LATEST NEWS" (Blog highlights)
          ============================================================== */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 1fr',
              gap: '2.5rem',
              alignItems: 'center'
            }}
            className="trending-news-grid"
          >
            {/* Col 1: Header & Read All Articles Button */}
            <div>
              <span
                style={{
                  color: 'var(--figma-coral)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                {t('blog.title', 'Trending')}
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.2,
                  marginBottom: '1rem'
                }}
              >
                {t('blog.subtitle', 'Latest News')}
              </h2>
              <div
                style={{
                  width: '45px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '1.5rem'
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {t('blog.subtitle', 'Xonadoningizni yanada shinam va zamonaviy qilish bo‘yicha tajribali usta va dizaynerlarimizdan tavsiyalar.')}
              </p>
              <Link to="/blog" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                {t('blog.read_article', 'READ ALL ARTICLES >')}
              </Link>
            </div>

            {/* Col 2: Large Vertical Photography Card */}
            <div
              style={{
                height: '460px',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundImage: `url(${featuredPost.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-subtle)'
              }}
            />

            {/* Col 3: Editorial Article Card */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.35,
                  marginBottom: '1rem'
                }}
              >
                {featuredPost.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {featuredPost.excerpt}
              </p>

              {/* Author bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={featuredPost.avatar}
                  alt={featuredPost.author}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {featuredPost.author}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{featuredPost.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          5. FIGMA AUTUMN COLLECTION SIGNATURE CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title={t('hero.autumn_collection', 'Autumn Collection')} />

      {/* ==============================================================
          6. QUICK CUSTOM ORDER & CRAFTSMAN LINKAGE
          ============================================================== */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              color: 'var(--figma-coral)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            {t('custom_order.title', 'Maxsus Xizmat')}
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            {t('custom_order.subtitle', 'O‘z O‘lchamingizda Mebel Kerakmi?')}
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            {t('custom_order.subtitle', 'Urgutning usta duradgorlari sizning xonadoningiz va istagingizga mos maxsus mebellarni yasab beradi.')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/custom-order" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
              {t('custom_order.send_request', 'MAXSUS BUYURTMA BERISH >')}
            </Link>
            <Link to="/craftsmen" className="btn-figma-dark" style={{ textDecoration: 'none' }}>
              {t('craftsmen.title', 'USTALAR RO‘YXATI >')}
            </Link>
          </div>
        </div>
      </section>

      {/* Craftsman Request Modal */}
      <CraftsmanRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        craftsman={selectedCraftsman}
      />

      {/* Quick Buy Modal for Top 10 Trending */}
      <QuickBuyModal
        product={quickBuyProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => {
          setIsQuickBuyOpen(false);
          setQuickBuyProduct(null);
        }}
      />
    </div>
  );
};
