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
  Maximize2
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { QuickBuyModal } from '../components/QuickBuyModal';

export const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
        let selected = activeList.find((v) => v.id === targetId || v.youtube_id === targetId);
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
    setActiveVideo(video);
    setSearchParams({ v: video.id });
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
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().catch((err) => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen();
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

  // YouTube embed URL with strict parameters to eliminate related videos and branding
  const embedUrl = `https://www.youtube-nocookie.com/embed/${activeVideo.youtube_id}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&fs=1&playsinline=1&enablejsapi=1`;

  const otherVideos = videos.filter((v) => v.id !== activeVideo.id);

  return (
    <div className="watch-page-container" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.25rem' }}>
        
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

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>Urgut Mebel Markazi • Rasmiy Video Player</span>
          </div>
        </div>

        {/* Main Grid: Player + Sidebar */}
        <div className="watch-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem', alignItems: 'start' }}>
          
          {/* LEFT: Video Player and Details */}
          <div>
            {/* Cinematic Video Player Frame */}
            <div
              ref={playerContainerRef}
              className="watch-player-frame"
              style={{
                position: 'relative',
                width: '100%',
                backgroundColor: '#000000',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                aspectRatio: '16 / 9'
              }}
            >
              {/* YouTube IFrame Embed */}
              <iframe
                title={activeVideo.title}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  zIndex: 1
                }}
              />

              {/* ANTI-DISTRACTION TOP BLOCKER (Prevents clicking YouTube video title / channel / share links) */}
              <div
                className="yt-shield-top"
                title="Urgut Mebel Markazi Video Player"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '56px',
                  zIndex: 2,
                  pointerEvents: 'auto',
                  cursor: 'default',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 1rem',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                    URGUT MEBEL MARKAZI
                  </span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeVideo.title}
                </span>
              </div>

              {/* ANTI-DISTRACTION BOTTOM-RIGHT LOGO BLOCKER (Covers YouTube watermark icon so user cannot click outside) */}
              <div
                className="yt-shield-logo"
                title="Urgut Mebel Markazi"
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '48px',
                  width: '95px',
                  height: '42px',
                  zIndex: 2,
                  pointerEvents: 'auto',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {/* Visual mask so YouTube watermark is hidden and not clickable */}
                <div style={{ background: 'rgba(18, 18, 20, 0.95)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', pointerEvents: 'none' }}>
                  U.M.M 🛋️
                </div>
              </div>
            </div>

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
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};
