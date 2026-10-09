import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ProductCard } from '../components/ProductCard';
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
  CornerDownRight,
  ChevronRight
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleLike, isLiked, toggleFavorite, isFavorite } = useWishlist();
  const { user, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const [prodList, commList] = await Promise.all([
          dataService.getProducts(),
          dataService.getComments()
        ]);
        setAllProducts(prodList || []);
        const found = (prodList || []).find((p) => p.id === id || p.slug === id);
        if (found) {
          setProduct(found);
          setSelectedColor(found.colors?.[0] || 'Standart');
          const relatedComments = (commList || []).filter((c) => c.product_id === found.id);
          setComments(relatedComments);
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
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Mebel ma'lumotlari yuklanmoqda...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Mahsulot topilmadi</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Ushbu mahsulot mavjud emas yoki o‘chirilgan bo‘lishi mumkin.</p>
        <Link to="/furniture" className="btn btn-primary">Katalogga qaytish</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'];
  const discountPercent = product.discount_price && product.price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const effectivePrice = product.discount_price || product.price;
  const liked = isLiked(product.id);
  const favorited = isFavorite(product.id);

  // Related products from same category or tags
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.tags?.some((t) => product.tags?.includes(t))))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (isGuest) {
      openAuthModal('login', 'Sharh qoldirish uchun avval tizimga kiring!');
      return;
    }
    if (!newComment.trim()) return;

    const created = await dataService.addComment({
      product_id: product.id,
      user_id: user.id,
      user_name: user.full_name,
      rating: newRating,
      content: newComment.trim()
    });

    setComments([created, ...comments]);
    setNewComment('');
    addToast('Fikringiz uchun tashakkur! Sharhingiz e‘lon qilindi.', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Havola nusxalandi!', 'info');
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Bosh sahifa</Link>
          <ChevronRight size={14} />
          <Link to="/furniture" style={{ color: 'var(--text-muted)' }}>Mebellar</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Top Grid: Gallery & Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Left: Image Gallery */}
          <div>
            {/* Primary Large Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: '#f5f3ee',
                aspectRatio: '4 / 3',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {discountPercent && (
                <span
                  className="badge badge-discount"
                  style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', fontSize: '0.88rem', padding: '0.4rem 0.8rem' }}
                >
                  -{discountPercent}% CHEGIRMA
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2.5px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                      opacity: selectedImage === idx ? 1 : 0.65,
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', color: '#d97706' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.round(product.rating || 5) ? '#d97706' : 'none'}
                      color="#d97706"
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{product.rating || 5.0}</span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  ({product.reviews_count || comments.length || 16} ta baho)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => toggleLike(product.id)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: liked ? '#fee2e2' : 'var(--bg-secondary)',
                    color: liked ? '#ef4444' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}
                  title="Layk bosish"
                >
                  <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}
                  title="Ulashish"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Price section */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                {Number(effectivePrice).toLocaleString()} so‘m
              </div>
              {product.discount_price && (
                <div style={{ fontSize: '1.15rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  {Number(product.price).toLocaleString()} so‘m
                </div>
              )}
            </div>

            {/* Availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} color="var(--status-success)" />
              <span style={{ fontWeight: 600 }}>
                Holati: <strong style={{ color: 'var(--status-success)' }}>Omborda tayyor (Yetkazib berish 1-2 kun)</strong>
              </span>
            </div>

            {/* Color selection */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  Rangini tanlang: <span style={{ color: 'var(--wood-amber)' }}>{selectedColor}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: selectedColor === color ? '2px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedColor === color ? '#fff' : 'var(--bg-secondary)',
                        color: selectedColor === color ? 'var(--wood-amber)' : 'var(--text-main)',
                        boxShadow: selectedColor === color ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Buy Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '40px', height: '46px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '40px', height: '46px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '160px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                <ShoppingBag size={18} />
                <span>Savatga Qo‘shish</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="btn btn-dark"
                style={{ flex: 1, minWidth: '160px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                <Zap size={18} color="var(--gold-accent)" />
                <span>Hozir Xarid Qilish</span>
              </button>
            </div>

            {/* Assurance badges */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--wood-amber)" />
                <span>O‘zbekiston bo‘ylab bepul yetkazib o‘rnatish</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--wood-amber)" />
                <span>3 yillik rasmiy kafolat sertifikati</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Description Section */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '4rem'
          }}
          className="glass-card"
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Tavsif va Xususiyatlar
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.98rem' }}>
            {product.description}
          </p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Texnik Ko‘rsatkichlar:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Material:</span>
              <strong style={{ fontSize: '0.95rem' }}>{product.material || "Tabiiy daraxt massivi"}</strong>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>O‘lchamlari:</span>
              <strong style={{ fontSize: '0.95rem' }}>{product.dimensions || "Standart format"}</strong>
            </div>

            {product.specifications &&
              Object.entries(product.specifications).map(([key, val], idx) => (
                <div key={idx} style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>{key}:</span>
                  <strong style={{ fontSize: '0.95rem' }}>{val}</strong>
                </div>
              ))}
          </div>
        </div>

        {/* Reviews & Comments Section */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '4rem'
          }}
          className="glass-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mijozlar Fikrlari va Sharhlar</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Haqiqiy xaridorlarning baholari</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
              <Star size={20} fill="#d97706" color="#d97706" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{product.rating || 5.0}</span>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>/ 5.0</span>
            </div>
          </div>

          {/* New Comment / Review Form */}
          <form
            onSubmit={handleCommentSubmit}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2.5rem'
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Ushbu mebel haqida o‘z fikringizni bildiring
            </h4>

            {/* Rating selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bahoyingiz:</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    style={{ color: star <= newRating ? '#d97706' : '#d6d3d1' }}
                  >
                    <Star size={22} fill={star <= newRating ? '#d97706' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Mebel sifati, yetkazib berilishi va o‘lchamlari haqida yozing..."
              className="form-textarea"
              style={{ marginBottom: '1rem' }}
            />

            <button type="submit" className="btn btn-primary btn-sm">
              <Send size={15} />
              <span>Sharhni E'lon Qilish</span>
            </button>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                Hali sharhlar qoldirilmagan. Birinchi bo‘lib o‘z fikringizni bildiring!
              </div>
            ) : (
              comments.map((comm) => (
                <div
                  key={comm.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'var(--gold-gradient)',
                          color: '#fff',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem'
                        }}
                      >
                        {comm.user_name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{comm.user_name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--status-success)', fontWeight: 600 }}>
                          ✓ Tasdiqlangan xaridor
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', color: '#d97706' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < (comm.rating || 5) ? '#d97706' : 'none'} color="#d97706" />
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', margin: '0.5rem 0' }}>
                    {comm.content}
                  </p>

                  {/* Comment Replies */}
                  {comm.replies?.length > 0 && (
                    <div style={{ marginTop: '0.85rem', paddingLeft: '1.5rem', borderLeft: '2px solid var(--wood-light)' }}>
                      {comm.replies.map((reply) => (
                        <div key={reply.id} style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-amber)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                            <CornerDownRight size={13} />
                            <span>{reply.user_name}</span>
                          </div>
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header">
              <div>
                <span className="section-tag">O‘xshash Modellar</span>
                <h2 className="section-title">Sizga Ham Yoqishi Mumkin</h2>
              </div>
              <Link to="/furniture" className="btn btn-secondary btn-sm">
                Barcha mebellarni ko‘rish <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid-products">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
