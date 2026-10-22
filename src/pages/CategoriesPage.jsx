import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import {
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';

export const CategoriesPage = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  // Join Us Newsletter State
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catList, blogList] = await Promise.all([
          dataService.getCategories(),
          dataService.getBlogPosts()
        ]);
        setCategories(catList || []);
        setBlogPosts(blogList || []);
      } catch (err) {
        console.error('Error loading categories page data:', err);
      }
    };
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!joinEmail || !joinEmail.includes('@')) {
      addToast('Iltimos, haqiqiy email kiriting!', 'warning');
      return;
    }
    setJoinLoading(true);
    try {
      await dataService.subscribeNewsletter(joinEmail, joinName || 'Mijoz', 'categories_join_us');
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
    author: 'Sherzod Aliyev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    date: '14 Jun 2026'
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#18191D', minHeight: '100vh' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO SECTION (Chairs & Stools)
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 3.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              minHeight: '440px',
              backgroundColor: '#FAFAF8',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
            className="figma-split-hero"
          >
            {/* Left Column: Soft Pastel Blue with Furniture Image */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '2.5rem',
                minHeight: '340px'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80"
                alt="Chairs and Stools"
                style={{
                  maxWidth: '85%',
                  maxHeight: '360px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))'
                }}
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
                  color: '#18191D',
                  lineHeight: 1.15,
                  margin: '0 0 1rem'
                }}
              >
                Chairs &amp; Stools
              </h1>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '0.95rem',
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
      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '3.5rem',
              alignItems: 'flex-start'
            }}
            className="category-mosaic-layout"
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
                  color: '#18191D',
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
                        color: idx === 0 ? '#18191D' : '#6B7280',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--figma-coral)')}
                      onMouseLeave={(e) =>
                        (e.target.style.color = idx === 0 ? '#18191D' : '#6B7280')
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
              {/* Card 1: Green Sage (Accessories) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '1 / 2',
                  gridRow: '1 / 3',
                  backgroundColor: 'var(--figma-pastel-mint)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    alignSelf: 'flex-start',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#18191D',
                    letterSpacing: '0.02em'
                  }}
                >
                  Accessories
                </div>
                <img
                  src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=400&q=80"
                  alt="Accessories"
                  style={{
                    width: '90%',
                    height: '180px',
                    objectFit: 'contain',
                    alignSelf: 'center'
                  }}
                />
              </div>

              {/* Card 2: Sky Blue (Sofas & Armchairs) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '2 / 4',
                  gridRow: '1 / 2',
                  backgroundColor: 'var(--figma-pastel-blue)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '0.45rem 1rem',
                      borderRadius: '2px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                      display: 'inline-block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#18191D',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Sofas and Armchairs
                  </div>
                  <p style={{ margin: '0.25rem 0 0', color: '#6B7280', fontSize: '0.8rem' }}>
                    Yumshoq mebellar kolleksiyasi
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"
                  alt="Sofas"
                  style={{ width: '130px', height: '100px', objectFit: 'contain' }}
                />
              </div>

              {/* Card 3: Large Light Grey (Chairs & Stools) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '1 / 3',
                  gridRow: '3 / 5',
                  backgroundColor: '#ECECEC',
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '0.45rem 1rem',
                      borderRadius: '2px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                      display: 'inline-block',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#18191D',
                      marginBottom: '0.35rem'
                    }}
                  >
                    Chairs &amp; Stools
                  </div>
                  <p style={{ margin: '0.35rem 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
                    Tabiiy eman va metall karkas
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80"
                  alt="Chairs"
                  style={{ width: '150px', height: '140px', objectFit: 'contain' }}
                />
              </div>

              {/* Card 4: Soft Peach/Sand (Pouf / Tables) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '3 / 4',
                  gridRow: '2 / 4',
                  backgroundColor: 'var(--figma-pastel-sand)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    alignSelf: 'flex-start',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#18191D'
                  }}
                >
                  Pouf
                </div>
                <img
                  src="https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=400&q=80"
                  alt="Tables"
                  style={{
                    width: '90%',
                    height: '140px',
                    objectFit: 'contain',
                    alignSelf: 'center'
                  }}
                />
              </div>

              {/* Card 5: Soft Peach (Bedding / Kitchen) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '5 / 6',
                  backgroundColor: 'var(--figma-pastel-peach)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#18191D'
                  }}
                >
                  Bedding
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80"
                  alt="Bedding"
                  style={{ width: '60px', height: '50px', objectFit: 'contain' }}
                />
              </div>

              {/* Card 6: Soft Cyan (Furniture / Outdoor) */}
              <div
                onClick={() => navigate('/furniture')}
                style={{
                  gridColumn: '3 / 4',
                  gridRow: '4 / 6',
                  backgroundColor: 'var(--figma-pastel-blue)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '2px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    alignSelf: 'flex-start',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#18191D'
                  }}
                >
                  Furniture
                </div>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80"
                  alt="Outdoor"
                  style={{ width: '80%', height: '80px', objectFit: 'contain', alignSelf: 'center' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    placeholder="Name"
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
                    placeholder="hello@abcdef.com"
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
                Trending
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#18191D',
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
              <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Eng so‘nggi interyer dizayni tendensiyalari, mebel tanlash sirlari va duradgorlik san’ati haqida foydali maqolalar.
              </p>
              <Link to="/blog" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                CHECK ALL ARTICLES &gt;
              </Link>
            </div>

            {/* Col 2: Large Center Featured Blog Photo */}
            <div
              style={{
                height: '420px',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: '#E5E7EB',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
              }}
            >
              <img
                src={featuredPost.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'}
                alt={featuredPost.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Col 3: Right Article Snippet with Author */}
            <div>
              <h3
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#18191D',
                  lineHeight: 1.35,
                  marginBottom: '1rem'
                }}
              >
                {featuredPost.title}
              </h3>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}
              >
                {featuredPost.excerpt}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={featuredPost.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={featuredPost.author}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#18191D' }}>
                  {featuredPost.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          5. SIGNATURE AUTUMN COLLECTION CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title="Autumn Collection" />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 899px) {
          .category-mosaic-layout {
            grid-template-columns: 1fr !important;
          }
          .join-us-split {
            grid-template-columns: 1fr !important;
          }
          .trending-news-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
