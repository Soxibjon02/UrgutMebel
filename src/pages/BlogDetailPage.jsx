import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ChevronRight,
  Search,
  User
} from 'lucide-react';

export const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const current = await dataService.getBlogPostById(id);
        setPost(current);
      } catch (err) {
        console.error("Error loading blog article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Maqola yuklanmoqda...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
          Maqola topilmadi
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Siz qidirgan maqola o‘chirilgan yoki manzili o‘zgargan bo‘lishi mumkin.
        </p>
        <Link to="/blog" className="btn-figma-coral">
          <ArrowLeft size={16} /> Barcha maqolalarga qaytish
        </Link>
      </div>
    );
  }

  const author = {
    name: post.author_name || 'Sherzod Aliyev',
    avatar: post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Interyer dizayneri va mebel maslahatchisi'
  };

  const handleSidebarSearchSubmit = (e) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      navigate(`/blog?search=${encodeURIComponent(sidebarSearch.trim())}`);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* ==============================================================
          1. ARTICLE HEADER (EXACT FIGMA LAYOUT: Title, Author Top-Right, Hero Image)
          ============================================================== */}
      <section style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div className="container" style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          {/* Top Title & Author Info Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.18,
                  margin: '0 0 1rem'
                }}
              >
                {post.title}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px', margin: 0 }}>
                {post.excerpt}
              </p>
            </div>

            {/* Author Top Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img
                src={author.avatar}
                alt={author.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                  {author.name}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : '12 Oct 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Full-Width Large Hero Image */}
          <div
            style={{
              width: '100%',
              height: '480px',
              backgroundColor: '#E5E7EB',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '2rem',
              backgroundImage: `url(${post.cover_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </section>

      {/* ==============================================================
          2. ARTICLE BODY + RIGHT SIDEBAR (EXACT FIGMA 2-COLUMN LAYOUT)
          ============================================================== */}
      <section style={{ padding: '2.5rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '4.5rem',
              alignItems: 'start'
            }}
            className="article-detail-layout"
          >
            {/* Main Article Content */}
            <main>
              {/* Section 1 */}
              <div style={{ marginBottom: '3.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Grouping is the basic
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Har qanday xonadon interyerida mebellarni guruhlash eng asosiy qoida hisoblanadi. Bir xil uslub, ranglar uyg‘unligi va geometrik o‘lchamlarga rioya qilish orqali xonada tartib va vizual erkinlik hissi paydo bo‘ladi.
                </p>
                <div
                  style={{
                    width: '100%',
                    height: '360px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-secondary)',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom: '3.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Wall of frames
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Devordagi kompozitsiyalar va javonlar orqali fazodan vertikal ravishda unumli foydalanish mumkin. Bo‘sh qolgan devorlarga o‘rnatilgan mebellar pol maydonini bo‘shatib, kenglik bag‘ishlaydi.
                </p>
                <div
                  style={{
                    width: '100%',
                    height: '360px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-secondary)',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1000&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>

              {/* Exact Figma Solid Coral Highlight Callout Box */}
              <div
                style={{
                  backgroundColor: 'var(--figma-coral)',
                  color: '#FFFFFF',
                  padding: '2.5rem 3rem',
                  borderRadius: '2px',
                  marginBottom: '3.5rem',
                  boxShadow: '0 15px 35px rgba(250, 109, 88, 0.25)'
                }}
              >
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  What do you want to build? The options you have to create maximum out of? Share the idea with #urgutmebel
                </p>
              </div>

              {/* Section 3 */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Wall of frames
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Urgut duradgorlari aynan sizning xonangiz me’moriy tuzilishiga moslashtirilgan shaxsiy loyihalarni tayyorlab berishga hamisha tayyor.
                </p>
                <div
                  style={{
                    width: '100%',
                    height: '360px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-secondary)',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>
            </main>

            {/* Right Sidebar: Search & Author Profile */}
            <aside>
              {/* Search Form with Underline */}
              <form onSubmit={handleSidebarSearchSubmit} style={{ marginBottom: '3.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    placeholder="QIDIRUV..."
                    className="figma-input-underline"
                    style={{
                      paddingRight: '2rem',
                      letterSpacing: '0.05em',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--figma-coral)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {/* Author Bio Card */}
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1rem'
                  }}
                />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  {author.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                  {author.role}
                </p>
                <Link
                  to="/blog"
                  style={{
                    color: 'var(--figma-coral)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textDecoration: 'none'
                  }}
                >
                  BARCHA MAQOLALARI &gt;
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. SIGNATURE WINTER COLLECTION CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title="Winter Collection" />

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 899px) {
          .article-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
