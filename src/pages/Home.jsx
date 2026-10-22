import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Hammer,
  CheckCircle2,
  Check
} from 'lucide-react';

export const Home = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Join Us Newsletter State
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodList, catList, blogList, banList] = await Promise.all([
          dataService.getProducts(),
          dataService.getCategories(),
          dataService.getBlogPosts(),
          dataService.getBanners()
        ]);
        setProducts(prodList || []);
        setCategories(catList || []);
        setBlogPosts(blogList || []);
        setBanners(banList || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadHomeData();
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              minHeight: '460px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
            className="figma-split-hero"
          >
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
                New Collection
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
                Chairs &amp; Stools
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
                Uyingiz va ofisingiz uchun zamonaviy, qulay va uzoq yillik sifatga ega o‘rindiqlar to‘plami.
              </p>
              <Link to="/furniture" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                SEE DETAILS &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. FIGMA ASYMMETRIC PASTEL CATEGORY MOSAIC ("Up to 20% off")
          ============================================================== */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '3.5rem',
              alignItems: 'flex-start'
            }}
          >
            {/* Left Column: Heading & Category Navigation */}
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
                On sale
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
                Up to<br />20% off
              </h2>
              <div
                style={{
                  width: '45px',
                  height: '2px',
                  backgroundColor: 'var(--figma-coral)',
                  marginBottom: '2rem'
                }}
              />

              {/* Categories list links from Figma */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {[
                  { name: 'Chairs & Stools', query: 'stul' },
                  { name: 'Accessories', query: 'aksessuar' },
                  { name: 'Sofas and Armchairs', query: 'divan' },
                  { name: 'Tables', query: 'stol' },
                  { name: 'Outdoor', query: 'bog' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => navigate(`/furniture?search=${encodeURIComponent(item.query)}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '0.95rem',
                        fontWeight: idx === 0 ? 700 : 500,
                        color: idx === 0 ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--figma-coral)')}
                      onMouseLeave={(e) =>
                        (e.target.style.color = idx === 0 ? 'var(--text-main)' : 'var(--text-muted)')
                      }
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Asymmetric Mosaic of Pastel Furniture Cards with White Badge Tags */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridAutoRows: '190px',
                gap: '1.25rem'
              }}
            >
              {/* Card 1: Large Vertical (Accessories) */}
              <div
                onClick={() => navigate('/furniture?search=aksessuar')}
                style={{
                  gridColumn: '1 / 2',
                  gridRow: '1 / 3',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                  alt="Accessories"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.45rem 1rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignSelf: 'flex-start',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em'
                  }}
                >
                  Accessories
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Interyer aksessuarlari va dekor
                  </p>
                </div>
              </div>

              {/* Card 2: Wide Horizontal (Sofas & Armchairs) */}
              <div
                onClick={() => navigate('/furniture?search=divan')}
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '1 / 2',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
                  alt="Sofas and Armchairs"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.45rem 1rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignSelf: 'flex-start',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  Sofas and Armchairs
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Yumshoq mebellar kolleksiyasi
                  </p>
                </div>
              </div>

              {/* Card 3: Large 2x2 Block (Chairs & Stools) */}
              <div
                onClick={() => navigate('/furniture?search=stul')}
                style={{
                  gridColumn: '1 / 3',
                  gridRow: '3 / 5',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80"
                  alt="Chairs and Stools"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.45rem 1rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignSelf: 'flex-start',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  Chairs &amp; Stools
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Tabiiy eman va metall karkasli o‘rindiqlar
                  </p>
                </div>
              </div>

              {/* Card 4: Vertical Right (Pouf / Tables) */}
              <div
                onClick={() => navigate('/furniture?search=stol')}
                style={{
                  gridColumn: '3 / 4',
                  gridRow: '2 / 4',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                  alt="Pouf"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.45rem 1rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignSelf: 'flex-start',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  Pouf
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Qulay pufik va kofe stollari
                  </p>
                </div>
              </div>

              {/* Card 5: Soft Peach (Bedding / Yotoqxona) */}
              <div
                onClick={() => navigate('/furniture?search=yotoq')}
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '5 / 6',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80"
                  alt="Bedding"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  Bedding
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Yotoqxona to‘plamlari &gt;
                  </span>
                </div>
              </div>

              {/* Card 6: Furniture / Outdoor */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '3 / 4',
                  gridRow: '4 / 6',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="mosaic-card-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                  alt="Furniture"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)',
                    zIndex: 1
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignSelf: 'flex-start',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  Furniture
                </div>
                <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                    Barcha zamonaviy mebellar &gt;
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                  Aksiyalar &amp; E‘lonlar
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Maxsus Takliflar
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {banners.filter(b => b.is_active !== false).map((banner) => (
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
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p style={{ fontSize: '0.88rem', opacity: 0.92, marginBottom: '1.25rem', lineHeight: 1.4, maxWidth: '420px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        {banner.subtitle}
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
                      {banner.button_text || 'BATAFSIL'} &gt;
                    </span>
                  </div>
                </div>
              ))}
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
                Special Offer
              </span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.1 }}>
                Join Us
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.92, lineHeight: 1.6, marginBottom: '2rem' }}>
                Bizning klubimizga obuna bo‘ling va birinchi buyurtmangiz uchun eksklyuziv 10% chegirmaga ega bo‘ling.
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
                  <Check size={22} /> Tabriklaymiz! Sizga -10% promo kodi yuborildi.
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Ismingiz"
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
                    placeholder="hello@urgutmebel.uz"
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
                    {joinLoading ? 'Yuklanmoqda...' : 'SIGN UP NOW'}
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
                    Obuna orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildiraman
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
                Trending
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
                Latest News
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
                Xonadoningizni yanada shinam va zamonaviy qilish bo‘yicha tajribali usta va dizaynerlarimizdan tavsiyalar.
              </p>
              <Link to="/blog" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                READ ALL ARTICLES &gt;
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
      <FigmaCollectionCarousel title="Autumn Collection" />

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
            Maxsus Xizmat
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            O‘z O‘lchamingizda Mebel Kerakmi?
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            Urgutning usta duradgorlari sizning xonadoningiz va istagingizga mos maxsus mebellarni yasab beradi.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/custom-order" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
              MAXSUS BUYURTMA BERISH &gt;
            </Link>
            <Link to="/craftsmen" className="btn-figma-dark" style={{ textDecoration: 'none' }}>
              USTALAR RO‘YXATI &gt;
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
    </div>
  );
};
