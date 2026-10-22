import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import { Search, ArrowRight, Calendar, User } from 'lucide-react';

export const BlogPage = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await dataService.getBlogPosts();
        setPosts(data || []);
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Categories list
  const categoriesList = [
    { id: 'all', name: 'Barcha Maqolalar', count: posts.length },
    { id: 'Dizayn', name: 'Interyer Dizayni', count: posts.filter(p => p.category === 'Dizayn').length },
    { id: 'Maslahatlar', name: 'Mebel Tanlash Maslahatlari', count: posts.filter(p => p.category === 'Maslahatlar').length },
    { id: 'Parvarish', name: 'Yog‘och va Mebel Parvarishi', count: posts.filter(p => p.category === 'Parvarish').length },
    { id: 'Urgut San‘ati', name: 'Urgut Duradgorlik Maktabi', count: posts.filter(p => p.category === 'Urgut San‘ati').length }
  ];

  const featuredPost = posts[0] || {
    id: 'featured-1',
    title: 'Think Big! Make the most out of your space with these tips',
    slug: 'think-big-make-the-most-out-of-your-space',
    excerpt: 'Kichik va ixcham xonalarni vizual jihatdan kengroq, havodorroq va funktsional qilish bo‘yicha interyer sirlari.',
    cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Dizayn',
    created_at: '2026-10-12'
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO: Left Image with Search & Right Featured Post
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 3.5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="figma-split-hero">
            {/* Left: Slideshow Box with Bottom Search Bar */}
            <div
              style={{
                position: 'relative',
                backgroundColor: 'var(--bg-secondary)',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem 2.5rem',
                overflow: 'hidden'
              }}
            >
              <HeaderAfishaSlideshow
                mode="background"
                images={settings.blog_hero_slides && settings.blog_hero_slides.length > 0 ? settings.blog_hero_slides : [
                  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                ]}
                alt="Blog Afishasi"
                interval={3500}
                overlay="linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)"
              />

              {/* Exact Figma Search Input embedded inside left image */}
              <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  style={{
                    width: '100%',
                    padding: '0.95rem 2.8rem 0.95rem 1.25rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--figma-coral)',
                    borderRadius: '2px',
                    fontSize: '0.85rem',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    outline: 'none',
                    color: 'var(--text-main)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                />
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--figma-coral)'
                  }}
                />
              </div>
            </div>

            {/* Right: Soft Pastel Blue Card with Featured Post */}
            <div
              style={{
                backgroundColor: 'var(--figma-pastel-blue)',
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
                  marginBottom: '0.85rem'
                }}
              >
                Featured Post
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.85rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.2,
                  margin: '0 0 1.25rem'
                }}
              >
                {featuredPost.title}
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: '380px',
                  marginBottom: '2rem'
                }}
              >
                {featuredPost.excerpt}
              </p>
              <Link
                to={`/blog/${featuredPost.id || featuredPost.slug}`}
                className="btn-figma-coral"
              >
                READ MORE &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. MAIN BLOG SECTION: Categories Sidebar + 2-Column Tall Cards
          ============================================================== */}
      <section style={{ padding: '1rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: '3.5rem',
              alignItems: 'start'
            }}
            className="blog-layout"
          >
            {/* Left Sidebar: Categories list */}
            <aside>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.01em'
                }}
              >
                Categories
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        padding: '0.35rem 0',
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--figma-coral)' : 'var(--text-muted)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right: 2-Column Tall Blog Cards */}
            <main>
              {loading ? (
                <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Maqolalar yuklanmoqda...
                </div>
              ) : displayedPosts.length === 0 ? (
                <div
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Maqolalar topilmadi
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Boshqa toifa yoki kalit so‘z bilan qidirib ko‘ring.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="btn-figma-coral"
                  >
                    Barcha Maqolalarni Ko‘rish
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '2.5rem'
                    }}
                    className="blog-posts-grid"
                  >
                    {displayedPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id || post.slug}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block'
                        }}
                      >
                        {/* Tall Card with Inset Floating Bottom Content */}
                        <div
                          style={{
                            height: '460px',
                            position: 'relative',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-card)',
                            backgroundImage: `url(${post.cover_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '1.75rem',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                          }}
                          className="figma-tall-blog-card"
                        >
                          {/* Floating Inset Card */}
                          <div
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              padding: '1.5rem 1.75rem',
                              borderRadius: '2px',
                              boxShadow: 'var(--shadow-card)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <h3
                              style={{
                                fontSize: '1.15rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                lineHeight: 1.35,
                                margin: '0 0 0.5rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {post.title}
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                              {post.created_at ? new Date(post.created_at).toLocaleDateString() : '12 Oct 2026'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Centered Load More button */}
                  {visibleCount < filteredPosts.length && (
                    <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="btn-figma-coral"
                      >
                        LOAD MORE
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. SIGNATURE AUTUMN COLLECTION CAROUSEL
          ============================================================== */}
      <FigmaCollectionCarousel title="Autumn Collection" />

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 899px) {
          .blog-layout {
            grid-template-columns: 1fr !important;
          }
          .blog-posts-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .figma-tall-blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};
