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
  MapPin
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
  const { user, isGuest, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMegamenu, setActiveMegamenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/furniture?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    { id: 'custom-order', label: 'Maxsus Buyurtma', badge: '✨ Buyurtma', link: '/custom-order' },
    { id: 'craftsmen', label: 'Ustalar', badge: '🔨 Ustalar', link: '/craftsmen' },
    { id: 'deal-zone', label: 'Aksiya & Chegirmalar', badge: 'Chegirma', link: '/furniture?filter=discount' },
    { id: 'new-arrivals', label: 'Yangi Kelganlar', badge: 'Yangi', hasMegamenu: true },
    { id: 'sofas', label: 'Divanlar', link: '/furniture?category=cat-living' },
    { id: 'living', label: 'Mehmonxona', link: '/furniture?category=cat-living' },
    { id: 'bedroom', label: 'Yotoqxona', link: '/furniture?category=cat-bedroom' },
    { id: 'dining', label: 'Oshxona & Stol', link: '/furniture?category=cat-dining' },
    { id: 'mattresses', label: 'Matraslar', link: '/furniture?category=cat-bedroom' },
    { id: 'study', label: 'Ish & Ofis', link: '/furniture?category=cat-office' },
    { id: 'storage', label: 'Shkaflar', link: '/furniture?category=cat-wardrobe' },
    { id: 'stores', label: 'Showroomlar', link: '/stores' }
  ];

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
            <span className="urban-icon-label" style={{ fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>Saralangan</span>
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
          <div style={{ position: 'relative' }} className="urban-desktop-only">
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
                to="/account"
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
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search input bar (matches IMG_20261024_095617_296.jpg) */}
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
            placeholder="What are you looking for?"
            style={{
              width: '100%',
              padding: '0.65rem 2.8rem 0.65rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
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

      {/* Megamenu Category Navigation Bar */}
      <div
        className="urban-megamenu-nav-row"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {navCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => cat.hasMegamenu && setActiveMegamenu(cat.id)}
              onMouseLeave={() => cat.hasMegamenu && setActiveMegamenu(null)}
              style={{ position: 'static' }}
            >
              <Link
                to={cat.link || `/furniture?category=${cat.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.75rem 0',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
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
                      backgroundColor: cat.id === 'new-arrivals' ? '#3b82f6' : '#ef4444',
                      color: '#ffffff',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px'
                    }}
                  >
                    {cat.badge}
                  </span>
                )}
                {cat.hasMegamenu && <ChevronDown size={12} color="var(--text-muted)" />}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FLYOUT MEGAMENU FOR NEW ARRIVALS (Matches the screenshot megamenu perfectly!) */}
      {activeMegamenu === 'new-arrivals' && (
        <div
          onMouseEnter={() => setActiveMegamenu('new-arrivals')}
          onMouseLeave={() => setActiveMegamenu(null)}
          className="urban-megamenu-flyout"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.14)',
            borderTop: '2px solid var(--figma-coral, #FA6D58)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '2rem 1.5rem',
            zIndex: 999
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr) 260px',
              gap: '1.5rem'
            }}
          >
            {/* Col 1: Beds */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Beds (Karavotlar)
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>King Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Queen Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Single Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Hydraulic Storage Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Beds Without Storage</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Poster Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Upholstered Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Bunk Beds</Link></li>
              </ul>
            </div>

            {/* Col 2: Mattresses */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Mattresses (Matraslar)
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>King Size Mattress</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Queen Size Mattress</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Single Bed Mattress</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Memory Foam</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Latex Mattress</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Orthopedic Mattress</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Spring Mattress</Link></li>
              </ul>
            </div>

            {/* Col 3: Wardrobes */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Wardrobes (Garderob)
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>1 Door Wardrobe</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>2 Door Wardrobe</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>3 Door Wardrobe</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>4 Door Wardrobe</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Sliding Wardrobe</Link></li>
              </ul>
            </div>

            {/* Col 4: Bedroom Storage */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Bedroom Storage
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Dressing Tables</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Bedside Tables</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Chest Of Drawers</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Benches</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Storage Chests</Link></li>
              </ul>
            </div>

            {/* Col 5: Kids Room & Pet */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Kids & Others
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Bunk Beds</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Kids Wardrobes</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Kids Tables & Chairs</Link></li>
                <li><Link to="/furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Pet Beds</Link></li>
              </ul>
            </div>

            {/* Col 6: New Collections */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Kolleksiyalar
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li><Link to="/furniture" style={{ color: 'var(--figma-coral, #FA6D58)', fontWeight: 700, textDecoration: 'none' }}>Toledo Collection</Link></li>
                <li><Link to="/furniture" style={{ color: 'var(--figma-coral, #FA6D58)', fontWeight: 700, textDecoration: 'none' }}>Atmos Collection</Link></li>
                <li><Link to="/furniture" style={{ color: 'var(--figma-coral, #FA6D58)', fontWeight: 700, textDecoration: 'none' }}>Astra Collection</Link></li>
                <li><Link to="/furniture" style={{ color: 'var(--figma-coral, #FA6D58)', fontWeight: 700, textDecoration: 'none' }}>Bloom Collection</Link></li>
              </ul>
            </div>

            {/* Col 7: Promotional Graphic */}
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '220px'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 700 }}>Yangi To‘plam</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.2rem 0 0.5rem' }}>Beds from 2,699,000 so‘m</div>
                <Link
                  to="/furniture"
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.76rem', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Shop Now</span> <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
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
        .urban-megamenu-item:hover {
          color: var(--figma-coral, #FA6D58) !important;
        }
        @media (max-width: 992px) {
          .urban-desktop-search, .urban-megamenu-nav-row, .urban-desktop-only, .urban-icon-label {
            display: none !important;
          }
          .urban-mobile-search-row, .urban-mobile-store-icon {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
