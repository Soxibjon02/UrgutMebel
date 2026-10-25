import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Play,
  Share2,
  Heart,
  Eye,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
  Star,
  Film,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
  User,
  Lock
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { QuickBuyModal } from '../components/QuickBuyModal';
import { CustomVideoPlayer } from '../components/video/CustomVideoPlayer';

export const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isGuest, openAuthModal, isAdmin } = useAuth();
  const { addToast } = useNotification();

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [connectedProduct, setConnectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(128);
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const playerContainerRef = useRef(null);

  // Load all video reels
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const list = await dataService.getVideoReels();
        const activeList = list.filter((v) => v.is_active !== false);
        setVideos(activeList);

        // Determine which video to play
        const targetId = id || searchParams.get('v');
        let selected = null;
        if (targetId) {
          selected = activeList.find((v) => v.id === targetId || v.youtube_id === targetId);
        }
        if (!selected && activeList.length > 0) {
          selected = activeList[0];
        }
        setActiveVideo(selected || null);
      } catch (err) {
        console.error('Error loading video reels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Listen to admin video updates
    const handleVideosUpdate = () => {
      fetchVideos();
    };
    window.addEventListener('urgut_store_videos_updated', handleVideosUpdate);
    return () => {
      window.removeEventListener('urgut_store_videos_updated', handleVideosUpdate);
    };
  }, [id, searchParams]);

  // Load connected product whenever activeVideo changes
  useEffect(() => {
    if (!activeVideo) {
      setConnectedProduct(null);
      return;
    }

    const loadProduct = async () => {
      if (activeVideo.product_id) {
        try {
          const prod = await dataService.getProductById(activeVideo.product_id);
          if (prod) {
            setConnectedProduct(prod);
            return;
          }
        } catch (e) {
          console.warn('Could not load connected product:', e);
        }
      }
      // Fallback: pick matching product or first available
      const allProds = await dataService.getProducts();
      if (allProds && allProds.length > 0) {
        setConnectedProduct(allProds[0]);
      }
    };

    loadProduct();
    setIsLiked(false);
    setLikesCount(Math.floor(Math.random() * 200) + 75);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeVideo]);

  const handleSelectVideo = (video) => {
    if (!video) return;
    setActiveVideo(video);
    navigate(`/watch/${video.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast('Video havolasi nusxalandi!', 'success');
    } else {
      addToast(url, 'info');
    }
  };

  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      if (next) {
        addToast('Videoga yoqdi belgisi qo‘yildi!', 'success');
      }
      return next;
    });
  };

  // Load and listen to video comments
  useEffect(() => {
    if (!activeVideo?.id) return;
    const loadComments = async () => {
      const list = await dataService.getVideoComments(activeVideo.id);
      setComments(list);
    };
    loadComments();

    const handleCommentsUpdate = () => {
      loadComments();
    };
    window.addEventListener('urgut_video_comments_updated', handleCommentsUpdate);
    return () => window.removeEventListener('urgut_video_comments_updated', handleCommentsUpdate);
  }, [activeVideo?.id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user || isGuest) {
      openAuthModal('login');
      addToast('Fikr qoldirish uchun avval tizimga kiring', 'info');
      return;
    }

    setSubmittingComment(true);
    try {
      const newComment = await dataService.addVideoComment({
        video_id: activeVideo.id,
        user_id: user.id || 'usr-custom',
        user_name: user.name || user.full_name || 'Foydalanuvchi',
        user_avatar: user.avatar || '',
        comment: commentText.trim()
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      addToast('Izohingiz muvaffaqiyatli qoldirildi!', 'success');
    } catch (err) {
      console.error('Error adding comment:', err);
      addToast('Izoh yozishda xatolik yuz berdi', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    await dataService.toggleLikeVideoComment(commentId);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Haqiqatan ham bu izohni o‘chirmoqchimisiz?')) return;
    await dataService.deleteVideoComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    addToast('Izoh o‘chirildi', 'info');
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product, 1);
    addToast(`"${product.name}" savatga qo‘shildi!`, 'success');
  };

  const handleOpenQuickBuy = (product) => {
    setQuickBuyProduct(product);
    setIsQuickBuyOpen(true);
  };

  const handleFullscreen = () => {
    const el = document.querySelector('.custom-video-player-root');
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch((err) => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Mebel videolari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!activeVideo) {
    return (
      <div className="container" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <Film size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontWeight: 800 }}>Hozircha videolar mavjud emas</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Tez orada bu yerda yangi mebel videolari taqdim etiladi.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Bosh Sahifaga Qaytish
        </Link>
      </div>
    );
  }

  const otherVideos = videos.filter((v) => v.id !== activeVideo.id);
  const nextVideo = otherVideos.length > 0 ? otherVideos[0] : null;

  return (
    <div className="watch-page-container" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div className="container watch-page-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Top Breadcrumb Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link
              to="/"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
            >
              <ArrowLeft size={15} /> Asosiy Sahifa
            </Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={14} /> Watch & Shop Video
            </span>
          </div>

          <div className="watch-official-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>Urgut Mebel Markazi • Rasmiy Video Player</span>
          </div>
        </div>

        {/* Main Grid: Player + Sidebar */}
        <div className="watch-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT: Video Player and Details */}
          <div>
            {/* Custom Modern Video Player */}
            <CustomVideoPlayer
              video={activeVideo}
              nextVideo={nextVideo}
              onNext={() => nextVideo && handleSelectVideo(nextVideo)}
              autoPlay={true}
            />

            {/* Video Header & Actions */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    {activeVideo.title}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <Eye size={15} color="var(--figma-coral)" /> {activeVideo.views || '16k'} ko‘rildi
                    </span>
                    <span>•</span>
                    <span>Jonli mahsulot taqdimoti</span>
                    <span>•</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>Haqiqiy Mebel Video</span>
                  </div>
                </div>

                {/* Like, Share & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleLike}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      color: isLiked ? '#ef4444' : 'inherit',
                      borderColor: isLiked ? 'rgba(239, 68, 68, 0.3)' : undefined,
                      backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.08)' : undefined
                    }}
                  >
                    <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                    <span>{likesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
                    title="Ulashish va havolani nusxalash"
                  >
                    <Share2 size={16} /> Ulashish
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
                    title="Butun ekranga ochish"
                  >
                    <Maximize2 size={15} /> Katta ekran
                  </button>
                </div>
              </div>

              {/* Description Box */}
              {activeVideo.desc && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '1.1rem 1.25rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--text-main)'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Tavsif va Mahsulot Xususiyatlari
                  </div>
                  {activeVideo.desc}
                </div>
              )}

              {/* CONNECTED FURNITURE CARD ("Ushbu Videodagi Mebel") */}
              {connectedProduct && (
                <div
                  style={{
                    marginTop: '1.75rem',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(250, 109, 88, 0.06), rgba(245, 158, 11, 0.08))',
                    border: '1.5px solid rgba(250, 109, 88, 0.25)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)' }}>
                      <ShoppingBag size={18} /> USHBU VIDEODA KO‘RSATILGAN MEBEL
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, background: 'rgba(34, 197, 94, 0.12)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                      ✓ Omborda mavjud • Yetkazib beriladi
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '260px' }}>
                      <img
                        src={connectedProduct.images?.[0] || connectedProduct.image_url || activeVideo.videoThumb}
                        alt={connectedProduct.name}
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text-main)' }}>
                          {connectedProduct.name}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Do‘kon: <strong style={{ color: 'var(--text-main)' }}>{connectedProduct.store_name || "Urgut Mebel Markazi"}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                          <Star size={14} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ fontWeight: 800 }}>{Number(connectedProduct.rating || 5.0).toFixed(1)}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({connectedProduct.reviews_count || 18} sharh)</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--figma-coral, #FA6D58)' }}>
                          {Number(connectedProduct.discount_price || connectedProduct.price).toLocaleString()} so‘m
                        </div>
                        {connectedProduct.discount_price && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {Number(connectedProduct.price).toLocaleString()} so‘m
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenQuickBuy(connectedProduct)}
                          className="btn btn-primary btn-sm"
                          style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
                        >
                          <Sparkles size={15} /> Tezkor Xarid Qilish
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(connectedProduct)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem' }}
                        >
                          <ShoppingBag size={15} /> Savatga
                        </button>
                        <Link
                          to={`/furniture/${connectedProduct.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontWeight: 700, padding: '0.55rem 0.75rem' }}
                          title="Batafsil ko'rish"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* VIDEO COMMENTS SECTION */}
            <div
              className="watch-comments-card"
              style={{
                marginTop: '1.75rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <MessageSquare size={20} color="var(--figma-coral, #FA6D58)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Fikr va Izohlar ({comments.length})
                  </h3>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Haqiqiy xaridorlar fikri
                </span>
              </div>

              {/* Comment submission form or login prompt */}
              {!user || isGuest ? (
                <div
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1.35rem',
                    textAlign: 'center',
                    border: '1px dashed var(--border-subtle)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(250, 109, 88, 0.12)', color: 'var(--figma-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.65rem' }}>
                    <Lock size={20} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text-main)' }}>
                    Izoh qoldirish uchun tizimga kiring
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 1rem', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.4 }}>
                    Faqat ro‘yxatdan o‘tgan foydalanuvchilar o‘z nomidan mahsulot haqida fikr yoki savol qoldirishlari mumkin.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 800, borderRadius: 'var(--radius-full)', padding: '0.55rem 1.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <User size={15} /> Tizimga Kirish / Ro‘yxatdan O‘tish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddComment} style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--figma-coral, #FA6D58)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        (user.name || user.full_name || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {user.name || user.full_name || 'Mijoz'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--figma-coral)', fontWeight: 700, marginLeft: '0.5rem' }}>
                        (Siz)
                      </span>
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Ushbu mebel sifati, yetkazib berish yoki o‘lchamlari haqida fikringiz yoki savolingizni yozing..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--figma-coral)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                        className="btn btn-primary btn-sm"
                        style={{
                          fontWeight: 800,
                          borderRadius: 'var(--radius-full)',
                          padding: '0.5rem 1.25rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          opacity: !commentText.trim() ? 0.6 : 1,
                          cursor: !commentText.trim() ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Send size={14} />
                        <span>{submittingComment ? 'Yuborilmoqda...' : 'Izoh qoldirish'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Hozircha izohlar mavjud emas. Birinchi bo‘lib o‘z fikringizni bildiring!
                  </div>
                ) : (
                  comments.map((comm) => {
                    const isOwn = user && (comm.user_id === user.id || comm.user_name === user.name);
                    const canDelete = isOwn || isAdmin;

                    return (
                      <div
                        key={comm.id}
                        style={{
                          display: 'flex',
                          gap: '0.85rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(250, 109, 88, 0.15)',
                            color: 'var(--figma-coral)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            flexShrink: 0
                          }}
                        >
                          {comm.user_avatar ? (
                            <img src={comm.user_avatar} alt={comm.user_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            (comm.user_name || 'X').charAt(0).toUpperCase()
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {comm.user_name}
                              </span>
                              <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                Xaridor
                              </span>
                            </div>

                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {comm.created_at ? new Date(comm.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : 'Yaqinda'}
                            </span>
                          </div>

                          <p style={{ margin: '0 0 0.65rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                            {comm.comment}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
                            <button
                              type="button"
                              onClick={() => handleLikeComment(comm.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: 0
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--figma-coral)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <ThumbsUp size={13} />
                              <span>{comm.likes || 0} ta yoqdi</span>
                            </button>

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comm.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: 0,
                                  fontSize: '0.76rem'
                                }}
                              >
                                <Trash2 size={13} />
                                <span>O‘chirish</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

          {/* RIGHT: Next / Recommended Videos (YouTube-style sidebar) */}
          <div className="watch-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Film size={18} color="var(--figma-coral)" />
                <span>Keyingi Videolar</span>
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {otherVideos.length + 1} ta mebel videosi
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Other Video Reels */}
              {otherVideos.map((video, idx) => {
                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      padding: '0.65rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    className="watch-recommendation-card"
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        position: 'relative',
                        width: '120px',
                        height: '75px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#1f2937'
                      }}
                    >
                      <img
                        src={video.videoThumb || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}
                        alt={video.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0,0,0,0.75)',
                          color: '#ffffff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <Play size={9} fill="#ffffff" />
                        <span>Reel</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h4
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          margin: '0 0 0.3rem',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {video.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{video.views || '20k'} ko‘rish</span>
                        <span>•</span>
                        <span style={{ color: 'var(--figma-coral)', fontWeight: 700 }}>Ko‘rish</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Back to Home Link Card */}
              <Link
                to="/"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px dashed var(--border-subtle)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  marginTop: '0.5rem'
                }}
              >
                <span>Boshqa barcha mebellarni ko‘rish</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Buy Modal for Instant Purchase from Video */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        product={quickBuyProduct}
      />

      <style>{`
        .watch-recommendation-card:hover {
          transform: translateY(-2px);
          border-color: var(--figma-coral, #FA6D58) !important;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }
        @media (max-width: 1024px) {
          .watch-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 640px) {
          .watch-page-container {
            padding: 0.75rem 0 3rem !important;
          }
          .watch-page-inner {
            padding: 0 0.5rem !important;
          }
          .watch-official-badge {
            display: none !important;
          }
          .watch-layout-grid {
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};
