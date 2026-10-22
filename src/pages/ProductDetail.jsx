import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Share2,
  MessageSquare,
  Send,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useWishlist();
  const { user, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();
  const { t, language, getLocalized } = useLanguage();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Suggestions filter state
  const [suggestionCategory, setSuggestionCategory] = useState('all');

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const [prodList, catList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories()
        ]);
        setAllProducts(prodList || []);
        setCategories(catList || []);

        const found = (prodList || []).find((p) => p.id === id || p.slug === id);
        if (found) {
          setProduct(found);
          setSelectedColor(found.colors?.[0] || 'Standart');
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center', color: '#6B7280' }}>
        Mebel ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mahsulot topilmadi</h2>
        <p style={{ color: '#6B7280', margin: '1rem 0 2rem' }}>
          Ushbu mahsulot mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link to="/furniture" className="btn-figma-coral">
          Katalogga Qaytish
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [
    product.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  ];

  const effectivePrice = product.discount_price || product.price;
  const liked = isLiked(product.id);

  // Suggestions
  const suggestions = allProducts
    .filter((p) => p.id !== product.id && (suggestionCategory === 'all' || p.category_id === suggestionCategory))
    .slice(0, 4);

  const figmaColorDots = [
    { name: 'Ko‘k', color: '#3b82f6' },
    { name: 'To‘q antrasit', color: '#1f2937' },
    { name: 'Yalpiz', color: '#2dd4bf' },
    { name: 'Shaftoli', color: '#fb923c' }
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    addToast(`${product.name} savatga qo‘shildi!`, 'success');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* ==============================================================
          1. TOP PRODUCT PRESENTATION SECTION (EXACT FIGMA LAYOUT)
          ============================================================== */}
      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '4rem',
              alignItems: 'center'
            }}
            className="product-top-grid"
          >
            {/* Left: Product Images (Main Photo + Right Vertical Thumbnails) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px',
                gap: '1.5rem',
                alignItems: 'center'
              }}
              className="product-images-layout"
            >
              {/* Large Main Photo */}
              <div
                style={{
                  height: '480px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem',
                  position: 'relative'
                }}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={{
                    maxWidth: '90%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
                  }}
                />

                {/* Like Button Floating */}
                <button
                  type="button"
                  onClick={() => toggleLike(product.id)}
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: liked ? '#ef4444' : '#9CA3AF',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
                </button>
              </div>

              {/* Stacked Vertical Thumbnails */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      height: '110px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '2px',
                      border: selectedImage === idx ? '2px solid var(--figma-coral)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={img}
                      alt="Thumb"
                      style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Price, Title, Description, Color Dots, Add to Cart */}
            <div style={{ maxWidth: '440px' }}>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: 'var(--figma-coral)',
                  marginBottom: '0.65rem'
                }}
              >
                {Number(effectivePrice).toLocaleString()} {t('catalog.price_currency', 'so‘m')}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  margin: '0 0 1rem'
                }}
              >
                {getLocalized(product, 'name') || product.name}
              </h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {getLocalized(product, 'description') || product.description || "Urgut duradgorlik an'analari asosida tayyorlangan yuqori sifatli va bejirim mebel to‘plami."}
              </p>

              {/* Color Swatch Dots */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {figmaColorDots.map((dot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(dot.name)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: dot.color,
                        border: selectedColor === dot.name ? '2px solid var(--figma-coral)' : '2px solid #FFFFFF',
                        outline: selectedColor === dot.name ? '2px solid var(--figma-coral)' : '1px solid #D1D5DB',
                        cursor: 'pointer'
                      }}
                      title={dot.name}
                    />
                  ))}
                </div>
              </div>

              {/* Exact Figma Full-Width Coral Button: Add To Cart > */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-figma-coral"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1.15rem'
                }}
              >
                <span>{t('catalog.add_to_cart', 'Add To Cart')}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. MIDDLE 3-COLUMN SECTION (Description | Center Image | Mini Blog Card)
          ============================================================== */}
      <section style={{ padding: '3.5rem 1.5rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr 1fr',
              gap: '3.5rem',
              alignItems: 'center'
            }}
            className="product-mid-grid"
          >
            {/* Left: Description */}
            <div>
              <span
                style={{
                  color: 'var(--figma-coral)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                Description
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
                {product.name}
              </h2>
              <div
                style={{
                  width: '36px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '1.5rem'
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Mebelimiz tabiiy va ekologik toza materiallardan yasalgan bo‘lib, uzoq yillar davomida o‘zining jilosi va mustahkamligini yo‘qotmaydi.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                Har bir detalga alohida mehr bilan ishlov berilgan. Uy va ofis interyerida o‘zgacha qulaylik va estetika baxsh etadi.
              </p>
            </div>

            {/* Center: Vertical Lifestyle Image */}
            <div
              style={{
                height: '440px',
                borderRadius: '2px',
                backgroundColor: 'var(--bg-secondary)',
                backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Right: Mini Blog Card ("5 ideas for choosing the perfect...") */}
            <div
              style={{
                padding: '2.5rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px'
              }}
            >
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
                5 ideas for choosing the perfect furniture
              </h3>
              <div
                style={{
                  width: '32px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '1.25rem'
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Xonadon maydoni va mebel proporsiyalari o‘rtasidagi oltin qoidalarni o‘rganing va eng mos tanlovni qiling.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Author"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Sherzod Aliyev
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. OUR SUGGESTIONS: YOU MAY ALSO LIKE (Sidebar + Clean Cards)
          ============================================================== */}
      <section style={{ padding: '4rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span
              style={{
                color: 'var(--figma-coral)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.4rem'
              }}
            >
              {t('product_detail.similar_products', 'Our Suggestions')}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
              {t('product_detail.similar_products', 'You may also like')}
            </h2>
            <div
              style={{
                width: '36px',
                height: '2px',
                backgroundColor: 'var(--figma-coral)'
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: '3.5rem',
              alignItems: 'start'
            }}
            className="suggestions-layout"
          >
            {/* Left Suggestions Filter Sidebar */}
            <aside>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {t('categories.all_categories', 'Kategoriyalar')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setSuggestionCategory('all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.88rem',
                    fontWeight: suggestionCategory === 'all' ? 700 : 500,
                    color: suggestionCategory === 'all' ? 'var(--figma-coral)' : 'var(--text-muted)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {t('catalog.all', 'Barchasi')}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSuggestionCategory(c.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '0.88rem',
                      fontWeight: suggestionCategory === c.id ? 700 : 500,
                      color: suggestionCategory === c.id ? 'var(--figma-coral)' : 'var(--text-muted)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {getLocalized(c, 'name') || c.name}
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Suggestions 2-Column Grid */}
            <main>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '2rem'
                }}
                className="suggestions-products-grid"
              >
                {suggestions.map((p, idx) => {
                  const pastelColors = [
                    'var(--figma-pastel-blue)',
                    'var(--figma-pastel-peach)',
                    'var(--figma-pastel-mint)',
                    'var(--figma-pastel-sand)'
                  ];
                  const bgColor = pastelColors[idx % pastelColors.length];
                  return (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Pastel Photo Box */}
                      <div
                        style={{
                          backgroundColor: bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.5rem',
                          height: '200px'
                        }}
                      >
                        <img
                          src={p.images?.[0] || p.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80'}
                          alt={getLocalized(p, 'name') || p.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--figma-coral)', marginBottom: '0.25rem' }}>
                            {Number(p.discount_price || p.price).toLocaleString()} {t('catalog.price_currency', 'so‘m')}
                          </div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                            {getLocalized(p, 'name') || p.name}
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.material || 'Tabiiy daraxt va sifatli mato'}
                          </p>
                        </div>

                        <Link
                          to={`/furniture/${p.id}`}
                          style={{
                            color: 'var(--figma-coral)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            marginTop: '1rem'
                          }}
                        >
                          {t('catalog.view_details', 'VIEW ITEM >')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* ==============================================================
          4. SIGNATURE AUTUMN COLLECTION CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title={t('hero.autumn_collection', 'Autumn Collection')} />

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 899px) {
          .product-top-grid {
            grid-template-columns: 1fr !important;
          }
          .product-mid-grid {
            grid-template-columns: 1fr !important;
          }
          .suggestions-layout {
            grid-template-columns: 1fr !important;
          }
          .suggestions-products-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
