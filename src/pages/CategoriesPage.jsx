import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { FigmaCollectionCarousel } from '../components/FigmaCollectionCarousel';
import { HeaderAfishaSlideshow } from '../components/HeaderAfishaSlideshow';
import { CategoryCardsGrid } from '../components/CategoryCardsGrid';
import {
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';

export const CategoriesPage = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();
  const { t, language } = useLanguage();
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
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      
      {/* ==============================================================
          1. FIGMA SPLIT HERO SECTION (Chairs & Stools)
          ============================================================== */}
      <section style={{ padding: '2rem 1.5rem 3.5rem' }}>
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
                minHeight: '340px',
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
                {t('hero.new_arrival', 'Yangi To‘plam')}
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
                {t('categories.chairs', 'Stul va Kreslolar')}
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
                {t('categories.chairs_desc', 'Uyingiz va ofisingiz uchun zamonaviy, qulay va uzoq yillik sifatga ega o‘rindiqlar to‘plami.')}
              </p>
              <Link to="/furniture" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                {t('catalog.view_details', 'Batafsil')} &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. LUXURY CATEGORY SHOWCASE CARDS (Screenshot 2 / Super Admin Style)
          ============================================================== */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <CategoryCardsGrid
            categories={categories}
            showAllLink={false}
            title={t('categories.all_categories_title', 'Barcha Mebel Toifalari')}
            subtitle={t('categories.all_categories_sub', 'Uyingiz va ishxonangiz uchun saralangan sifatli to‘plamlar. Kerakli toifani tanlab, mos mebellarni ko‘ring.')}
          />
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
                {t('hero.special_offer', 'Maxsus Taklif')}
              </span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.1 }}>
                {t('hero.join_us', 'Bizga Qo‘shiling')}
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
                    placeholder={t('footer.enter_email', 'Elektron pochtangizni kiriting...')}
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
                    {joinLoading ? '...' : t('footer.subscribe_btn', 'Obuna bo‘lish')}
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
                    {t('common.privacy_consent', 'Obuna orqali shaxsiy ma’lumotlarni qayta ishlashga rozilik bildiraman')}
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
                {t('blog.title', 'Blog va Yangiliklar')}
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
                {t('blog.latest_news', 'So‘nggi Yangiliklar')}
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
                {t('blog.subtitle', 'Eng so‘nggi interyer dizayni tendensiyalari, mebel tanlash sirlari va duradgorlik san’ati haqida foydali maqolalar.')}
              </p>
              <Link to="/blog" className="btn-figma-coral" style={{ textDecoration: 'none' }}>
                {t('blog.all_articles', 'Barcha Maqolalar')} &gt;
              </Link>
            </div>

            {/* Col 2: Large Center Featured Blog Photo */}
            <div
              style={{
                height: '420px',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
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
                  color: 'var(--text-main)',
                  lineHeight: 1.35,
                  marginBottom: '1rem'
                }}
              >
                {featuredPost.title}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
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
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
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
      <FigmaCollectionCarousel title={t('hero.autumn_collection', 'Autumn Collection')} />

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
