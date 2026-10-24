import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Truck,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  MapPin,
  Layers,
  Flame,
  Grid,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const UrbanHeaderMegaMenu = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useWishlist();
  const { user, isGuest, isAdmin, isManager, isCraftsman, openAuthModal } = useAuth();
  const profilePath = isAdmin ? '/admin' : isManager ? '/manager' : isCraftsman ? '/craftsman-dashboard' : '/account';
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMegamenu, setActiveMegamenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/furniture?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Nav categories in top bar
  const navCategories = [
    { id: 'custom-order', label: 'Maxsus Buyurtma', badge: '✨ Buyurtma', link: '/custom-order' },
    { id: 'craftsmen', label: 'Ustalar', badge: '🔨 Ustalar', link: '/craftsmen' },
    { id: 'deal-zone', label: 'Aksiya & Chegirmalar', badge: 'Chegirma', link: '/furniture?filter=discount' },
    { id: 'sections', label: 'Bo‘limlar', badge: 'Barchasi', hasMegamenu: true },
    { id: 'sofas', label: 'Divanlar', link: '/furniture?category=cat-6' },
    { id: 'living', label: 'Mehmonxona', link: '/furniture?category=cat-1' },
    { id: 'bedroom', label: 'Yotoqxona', link: '/furniture?category=cat-2' },
    { id: 'dining', label: 'Oshxona & Stol', link: '/furniture?category=cat-3' },
    { id: 'mattresses', label: 'Matras', link: '/furniture?category=cat-2&sub=matras' }
  ];

  // All 37 Homepage Sections Logically Categorized for Instant Smooth Jumps
  const homepageSectionGroups = [
    {
      group: '👟 Dahliz & Poyabzal',
      items: [
        { id: 'shoe_racks', label: 'Poyabzal Javonlari (Shoe Racks)', badge: 'Trend' },
        { id: 'wardrobes', label: 'Kiyim Shkaflari (Wardrobes)', badge: 'Keng' },
        { id: 'chest_of_drawers', label: 'Komodlar (Chest of Drawers)' },
        { id: 'shoe_racks_banner', label: 'Dahliz Mebellari Banneri' }
      ]
    },
    {
      group: '🔥 Aksiya & Chegirmalar',
      items: [
        { id: 'deal_zone', label: 'Aksiya Maydoni (Deal Zone)', badge: 'Aksiya' },
        { id: 'new_arrivals', label: 'Yangi Kelganlar (New Arrivals)', badge: 'Yangi' },
        { id: 'celebrations_banner', label: 'Bayram Chegirmalari (-40%)' },
        { id: 'bank_offers', label: 'Bank Takliflari & Keshbek' },
        { id: 'gift_card', label: 'Sovg‘a Sertifikatlari' }
      ]
    },
    {
      group: '✨ Toifalar & Ilhom',
      items: [
        { id: 'category_pills', label: 'Tezkor Mebel Toifalari' },
        { id: 'top_categories', label: 'Asosiy Top Kategoriyalar', badge: 'Sara' },
        { id: 'video_reels', label: 'Video Lavhalar (Watch & Shop)' },
        { id: 'shop_the_look', label: 'Xonalar Bo‘yicha Ilhom' },
        { id: 'decor_corner', label: 'Dekor va Chiroqlar Burchagi' }
      ]
    },
    {
      group: '🛋️ Yumshoq Mebellar',
      items: [
        { id: 'lounge_chairs', label: 'Dam Olish Kreslolari (Lounge Chairs)' },
        { id: 'sofa_beds', label: 'Transformatsiya Divanlar (Sofa Beds)' },
        { id: 'recliners', label: 'Qulay Recliner Kreslolar' },
        { id: 'coffee_tables', label: 'Kofe Stollari (Coffee Tables)' },
        { id: 'tv_units', label: 'TV Jihozlari & Podstavkalar' },
        { id: 'c_tables', label: 'C-Shaklli Qulay Stollar' }
      ]
    },
    {
      group: '🛏️ Yotoqxona (Bedroom)',
      items: [
        { id: 'bedroom_banner', label: 'To‘liq Yotoqxona To‘plami' },
        { id: 'hydraulic_beds', label: 'Gidravlik Karavotlar (Storage)', badge: 'Top' },
        { id: 'non_storage_beds', label: 'Ixcham Karavotlar (Non-Storage)' },
        { id: 'mattresses', label: 'Ortopedik Matraslar' },
        { id: 'toledo_collection', label: 'Toledo Premium Kolleksiyasi' }
      ]
    },
    {
      group: '🍽️ Oshxona & Ofis',
      items: [
        { id: 'modular_kitchen', label: 'Modulli Oshxona Garniturlari', badge: 'Loyiha' },
        { id: 'sideboards', label: 'Idish Javonlari & Bufetlar' },
        { id: 'study_tables', label: 'Yozuv & Kompyuter Stollari' },
        { id: 'study_tables_feature', label: 'Ofis Stollari To‘plami' },
        { id: 'bookshelves', label: 'Kitob Javonlari (Bookshelves)' }
      ]
    },
    {
      group: '🏪 Do‘konlar & Kafolat',
      items: [
        { id: 'explore_stores', label: 'Urgut Mebel Showroomlari' },
        { id: 'nearest_store', label: 'Eng Yaqin Do‘konni Topish' },
        { id: 'trust_badges', label: 'Sifat va Rasmiy Kafolat' },
        { id: 'partner_brands_banner', label: 'Hamkor Ishlab Chiqaruvchilar' },
        { id: 'solid_wood_products', label: 'Tabiiy Massiv Yog‘och Mebellar' }
      ]
    }
  ];

  // Smooth jump to homepage section with visual highlight pulse
  const handleJumpToSection = (sectionId) => {
    setActiveMegamenu(null);
    setMobileMenuOpen(false);
    setMobileSectionsOpen(false);

    if (window.location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('section-highlight-pulse');
        setTimeout(() => el.classList.remove('section-highlight-pulse'), 2500);
      }
    } else {
      navigate(`/?section=${sectionId}`);
    }
  };

  return (
    <div
      className="urban-main-header"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 900
      }}
    >
      {/* Upper Main Bar: Logo, Search, Action Icons */}
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--figma-coral, #FA6D58)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(250, 109, 88, 0.3)'
            }}
          >
            U
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              Urgut Mebel
            </div>
            <div
              style={{
                fontSize: '0.62rem',
                color: 'var(--figma-coral, #FA6D58)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Markazi & Dizayn
            </div>
          </div>
        </Link>

        {/* Large Urban Search Bar */}
        <form
          onSubmit={handleSearch}
          className="urban-desktop-search"
          style={{
            flex: 1,
            maxWidth: '620px',
            position: 'relative'
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qanday mebel yoki to‘plam qidiryapsiz? (Masalan: Divan, Yotoqxona, Karavot...)"
            style={{
              width: '100%',
              padding: '0.65rem 3rem 0.65rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            className="urban-search-input"
          />
          <button
            type="submit"
            aria-label="Qidirish"
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'var(--figma-coral, #FA6D58)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Search size={15} />
          </button>
        </form>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {/* Language Switcher */}
          <div className="urban-desktop-only">
            <LanguageSwitcher />
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? '#fbbf24' : 'var(--text-main)',
              cursor: 'pointer'
            }}
            title={isDark ? "Yorug' rejim" : "Tungi rejim"}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Track order */}
          <Link
            to="/account?tab=orders"
            className="urban-header-icon-link"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)' }}
          >
            <Truck size={19} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>Buyurtma</span>
          </Link>

          {/* Mobile Store Locator Icon */}
          <Link
            to="/stores"
            className="urban-mobile-store-icon"
            style={{ display: 'none', color: 'var(--text-main)', textDecoration: 'none' }}
            aria-label="Do'konlar"
          >
            <MapPin size={21} />
          </Link>

          {/* Wishlist */}
          <Link
            to="/account?tab=wishlist"
            className="urban-header-icon-link"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)', position: 'relative' }}
          >
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {favoritesCount}
              </span>
            )}
            <span className="urban-icon-label" style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>Tanlangan</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="urban-header-icon-link"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)', position: 'relative' }}
          >
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--figma-coral, #FA6D58)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalItemsCount}
              </span>
            )}
            <span className="urban-icon-label" style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>Savat</span>
          </Link>

          {/* User profile */}
          <div style={{ position: 'relative' }}>
            {isGuest ? (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <User size={20} />
                <span className="urban-icon-label" style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>Kirish</span>
              </button>
            ) : (
              <Link
                to={profilePath}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)' }}
              >
                <User size={20} color="var(--figma-coral, #FA6D58)" />
                <span className="urban-icon-label" style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.full_name?.split(' ')[0] || 'Profil'}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="urban-mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search input bar */}
      <div
        className="urban-mobile-search-row"
        style={{
          display: 'none',
          padding: '0 1rem 0.85rem'
        }}
      >
        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mebel yoki to‘plam qidirish..."
            className="urban-search-input"
            style={{
              width: '100%',
              padding: '0.6rem 2.5rem 0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.86rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Megamenu Category Navigation Bar (Visible on Desktop & Mobile Scrollable Bar) */}
      <div
        className="urban-megamenu-nav-row"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
          position: 'relative'
        }}
      >
        <div
          className="container no-scrollbar"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {navCategories.map((cat) => {
            const isSections = cat.id === 'sections';

            return (
              <div
                key={cat.id}
                onMouseEnter={() => cat.hasMegamenu && setActiveMegamenu(cat.id)}
                onMouseLeave={() => cat.hasMegamenu && setActiveMegamenu(null)}
                style={{ position: 'static' }}
              >
                {isSections ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.innerWidth <= 992) {
                        setMobileSectionsOpen(!mobileSectionsOpen);
                      } else {
                        setActiveMegamenu(activeMegamenu === 'sections' ? null : 'sections');
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.75rem 0.5rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: activeMegamenu === 'sections' || mobileSectionsOpen ? 'var(--figma-coral, #FA6D58)' : 'var(--text-main)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    className="urban-megamenu-item"
                  >
                    <span>{cat.label}</span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor: '#0071e3',
                        color: '#ffffff',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '980px'
                      }}
                    >
                      {cat.badge}
                    </span>
                    <ChevronDown size={13} color="var(--text-muted)" />
                  </button>
                ) : (
                  <Link
                    to={cat.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.75rem 0.5rem',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    className="urban-megamenu-item"
                  >
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          backgroundColor: cat.id === 'deal-zone' ? '#ef4444' : cat.id === 'craftsmen' ? '#0071e3' : 'var(--figma-coral, #FA6D58)',
                          color: '#ffffff',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '980px'
                        }}
                      >
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FLYOUT MEGAMENU FOR "BO‘LIMLAR" (Grouped by Category with Direct Section Anchors) */}
      {activeMegamenu === 'sections' && (
        <div
          onMouseEnter={() => setActiveMegamenu('sections')}
          onMouseLeave={() => setActiveMegamenu(null)}
          className="urban-megamenu-flyout apple-card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
            borderTop: '2px solid var(--figma-coral, #FA6D58)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '2rem 1.5rem',
            zIndex: 999,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {homepageSectionGroups.map((group, idx) => (
              <div key={idx}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.35rem',
                    borderBottom: '1.5px solid var(--border-subtle)'
                  }}
                >
                  {group.group}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleJumpToSection(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '0.2rem 0',
                          color: 'var(--text-muted)',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          width: '100%'
                        }}
                        className="urban-section-jump-btn"
                      >
                        <span style={{ lineHeight: 1.3 }}>{item.label}</span>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              backgroundColor: item.badge === 'Aksiya' ? '#fee2e2' : item.badge === 'Yangi' ? '#dbeafe' : 'var(--bg-secondary)',
                              color: item.badge === 'Aksiya' ? '#dc2626' : item.badge === 'Yangi' ? '#1d4ed8' : 'var(--text-main)',
                              padding: '0.05rem 0.35rem',
                              borderRadius: '4px',
                              marginLeft: 'auto',
                              flexShrink: 0
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              maxWidth: '1280px',
              margin: '1.5rem auto 0',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-light)'
            }}
          >
            <span>💡 Bosh sahifadagi istalgan bo‘lim ustiga bossangiz, sahifa o‘sha qismga ravon o‘tadi.</span>
            <button
              type="button"
              onClick={() => setActiveMegamenu(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--figma-coral, #FA6D58)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}
            >
              Yopish &times;
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer For "Bo‘limlar" Categories */}
      {mobileSectionsOpen && (
        <div
          onClick={() => setMobileSectionsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '1.5rem 1.25rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={18} color="var(--figma-coral, #FA6D58)" />
                <span>Barcha Sayt Bo‘limlari</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSectionsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {homepageSectionGroups.map((group, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--figma-coral, #FA6D58)', marginBottom: '0.5rem' }}>
                    {group.group}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.45rem' }}>
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleJumpToSection(item.id)}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '0.55rem 0.65rem',
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regular Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link || `/furniture?category=${cat.id}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '0.4rem 0'
              }}
            >
              <span>{cat.label}</span>
              {cat.badge && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--figma-coral, #FA6D58)',
                    color: '#ffffff',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {cat.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .urban-search-input:focus {
          border-color: var(--figma-coral, #FA6D58) !important;
          box-shadow: 0 0 0 3px rgba(250, 109, 88, 0.15) !important;
        }
        .urban-megamenu-item {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          border-radius: 8px !important;
        }
        .urban-megamenu-item:hover {
          color: var(--figma-coral, #FA6D58) !important;
          background-color: rgba(250, 109, 88, 0.08) !important;
          transform: translateY(-1px);
        }
        .urban-section-jump-btn:hover {
          color: var(--figma-coral, #FA6D58) !important;
          transform: translateX(4px);
        }
        @media (max-width: 992px) {
          .urban-desktop-search, .urban-desktop-only, .urban-icon-label {
            display: none !important;
          }
          .urban-mobile-search-row, .urban-mobile-store-icon, .urban-mobile-menu-btn {
            display: block !important;
          }
          .urban-megamenu-nav-row {
            display: block !important;
            padding: 0.15rem 0;
          }
        }
      `}</style>
    </div>
  );
};
