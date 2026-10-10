import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  Shield,
  Briefcase,
  Hammer,
  LogOut,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Moon,
  Sun,
  Download,
  Smartphone
} from 'lucide-react';

export const Navbar = () => {
  const { settings, theme, toggleTheme, isDark } = useSettings();
  const { user, isGuest, role, isManager, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useWishlist();
  const navigate = useNavigate();

  const isCraftsman = user && (role === 'craftsman');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(105);
  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/furniture?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      smoothScrollToTop();
    }
  };

  const navLinks = [
    { to: '/', label: 'Bosh sahifa' },
    { to: '/furniture', label: 'Mebellar' },
    { to: '/categories', label: 'Kategoriyalar' },
    { to: '/custom-order', label: 'Maxsus Buyurtma' },
    { to: '/craftsmen', label: 'Ustalar' },
    { to: '/about', label: 'Biz haqimizda' },
    { to: '/contact', label: 'Bog‘lanish' }
  ];

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 900,
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: isScrolled ? '0 6px 24px rgba(0,0,0,0.12)' : 'none',
          transition: 'box-shadow 0.3s ease'
        }}
      >
      {/* Top Announcement Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-dark)',
          color: '#e7e5e4',
          fontSize: '0.8rem',
          padding: '0.45rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            gap: '0.5rem',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, overflow: 'hidden' }}>
            <span
              style={{
                backgroundColor: 'var(--wood-amber)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                flexShrink: 0
              }}
            >
              AKSIYA
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {settings.announcement || "Bahorgi aksiya: barcha yotoqxona to‘plamlariga 15% gacha chegirma!"}
            </span>
          </div>

          <div
            className="desktop-announcement-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.82rem',
              flexShrink: 0
            }}
          >
            <a
              href={`tel:${settings.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d6d3d1', whiteSpace: 'nowrap' }}
            >
              <Phone size={13} color="var(--wood-amber)" />
              <span>{settings.phone}</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ color: '#a8a29e', whiteSpace: 'nowrap' }}>Samarqand, Urgut</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-urgut-install-modal'))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(194, 109, 46, 0.2)',
                border: '1px solid rgba(194, 109, 46, 0.45)',
                color: '#fbbf24',
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Urgut Mebel ilovasini o‘rnatish"
            >
              <Download size={12} />
              <span>Ilovani o‘rnatish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container navbar-main-container" style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%' }}>

          {/* Logo */}
          <Link
            to="/"
            onClick={smoothScrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 0
            }}
            className="navbar-brand-logo"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary)',
                border: '1.5px solid rgba(194, 109, 46, 0.35)',
                boxShadow: '0 3px 10px rgba(194, 109, 46, 0.2)',
                flexShrink: 0
              }}
            >
              <img
                src={settings.logo_url || '/pwa-icon.svg'}
                alt={settings.site_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/pwa-icon.svg';
                }}
              />
            </div>
            <div>
              <div
                className="navbar-logo-title"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.015em',
                  whiteSpace: 'nowrap'
                }}
              >
                {settings.site_name}
              </div>
              <div
                className="navbar-logo-sub"
                style={{
                  fontSize: '0.58rem',
                  color: 'var(--wood-amber)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  marginTop: '1px'
                }}
              >
                Mebel & Dizayn Markazi
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links - Fixed Single Line & Responsive */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'nowrap',
              flexShrink: 1,
              minWidth: 0
            }}
            className="desktop-nav-container"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={smoothScrollToTop}
                style={({ isActive }) => ({
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--wood-amber)' : 'var(--text-main)',
                  position: 'relative',
                  padding: '0.35rem 0.15rem',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '2px solid var(--wood-amber)' : '2px solid transparent'
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Theme Toggle, Search, Wishlist, Cart, User Account */}
          <div className="navbar-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>

            {/* Dark Mode / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? 'var(--gold-accent)' : 'var(--text-main)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              aria-label="Rejimni almashtirish"
              title={isDark ? "Yorug‘ rejimga o‘tish" : "Tungi (Dark) rejimga o‘tish"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Search Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  flexShrink: 0
                }}
                aria-label="Qidirish"
              >
                <Search size={18} />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: 'min(300px, calc(100vw - 2rem))',
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    zIndex: 100
                  }}
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Mebel nomi yoki turi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.9rem',
                      padding: '0.35rem',
                      background: 'transparent',
                      color: 'var(--text-main)'
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.75rem' }}>
                    Izlash
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist Button - Desktop & Tablet Only (Already inside mobile account) */}
            <Link
              to="/account?tab=wishlist"
              className="nav-action-desktop-only"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                position: 'relative',
                flexShrink: 0
              }}
              aria-label="Istaklar ro‘yxati"
            >
              <Heart size={18} />
              {favoritesCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Button - Desktop & Tablet Only (Already pinned permanently in MobileBottomNav) */}
            <Link
              to="/cart"
              className="nav-action-desktop-only"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                position: 'relative',
                flexShrink: 0
              }}
              aria-label="Savat"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--wood-amber)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Account / User Menu */}
            <div style={{ position: 'relative' }}>
              {isGuest ? (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="btn btn-primary btn-sm mobile-auth-btn"
                  style={{ gap: '0.35rem', padding: '0.5rem 0.9rem', whiteSpace: 'nowrap' }}
                  title="Kirish"
                >
                  <User size={15} />
                  <span className="nav-guest-text">Kirish</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.3rem 0.6rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0
                    }}
                    className="navbar-user-btn"
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--gold-gradient)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="navbar-user-name" style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} color="var(--text-muted)" className="navbar-user-chevron" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '46px',
                        right: 0,
                        width: '240px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.5rem',
                        zIndex: 100
                      }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.25rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor: role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : role === 'manager' ? 'rgba(245, 158, 11, 0.15)' : role === 'craftsman' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: role === 'admin' ? '#ef4444' : role === 'manager' ? '#f59e0b' : role === 'craftsman' ? '#818cf8' : '#10b981',
                            border: `1px solid ${role === 'admin' ? 'rgba(239, 68, 68, 0.3)' : role === 'manager' ? 'rgba(245, 158, 11, 0.3)' : role === 'craftsman' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                          }}
                        >
                          {role.toUpperCase()}
                        </span>
                      </div>

                      <Link
                        to="/account"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <User size={15} />
                        Mening Hisobim
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <ShoppingBag size={15} />
                        Buyurtmalarim
                      </Link>

                      {/* Usta paneli havolasi */}
                      {isCraftsman && (
                        <Link
                          to="/craftsman-dashboard"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#818cf8',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            border: '1px solid rgba(99, 102, 241, 0.25)'
                          }}
                        >
                          <Hammer size={15} />
                          Usta Paneli (/craftsman)
                        </Link>
                      )}

                      {/* Menedjer paneli havolasi */}
                      {isManager && (
                        <Link
                          to="/manager"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#f59e0b',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.25)'
                          }}
                        >
                          <Briefcase size={15} />
                          Menedjer Paneli (/manager)
                        </Link>
                      )}

                      {/* Super Admin paneli havolasi */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#ef4444',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)'
                          }}
                        >
                          <Shield size={15} />
                          Admin Paneli (/admin)
                        </Link>
                      )}

                      <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={logout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#ef4444',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'left'
                          }}
                        >
                          <LogOut size={15} />
                          Chiqish
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)'
              }}
              className="mobile-hamburger-btn"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={smoothScrollToTop}
              style={({ isActive }) => ({
                padding: '0.6rem 0',
                fontSize: '1rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--wood-amber)' : 'var(--text-main)',
                borderBottom: '1px solid var(--border-subtle)'
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {isCraftsman && (
            <Link
              to="/craftsman-dashboard"
              onClick={smoothScrollToTop}
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#3730a3' }}
            >
              🔨 Usta Paneli
            </Link>
          )}

          {isManager && (
            <Link
              to="/manager"
              onClick={smoothScrollToTop}
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#b45309' }}
            >
              💼 Menedjer Paneli
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={smoothScrollToTop}
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#b91c1c' }}
            >
              🛡️ Admin Paneli
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-urgut-install-modal'));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(194, 109, 46, 0.1)',
              border: '1px solid rgba(194, 109, 46, 0.25)',
              color: 'var(--wood-amber)',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginTop: '0.75rem',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Download size={18} />
            <span>📲 Ilovani O‘rnatish (PWA)</span>
          </button>
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (min-width: 1100px) {
          .desktop-nav-container {
            display: flex !important;
          }
        }
        @media (max-width: 1099px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (min-width: 1100px) and (max-width: 1280px) {
          .desktop-nav-container {
            gap: 0.55rem !important;
          }
          .desktop-nav-container a {
            font-size: 0.82rem !important;
            padding: 0.3rem 0.15rem !important;
          }
        }
        @media (max-width: 768px) {
          .navbar-main-container {
            padding: 0.65rem 0.85rem !important;
          }
          .nav-action-desktop-only {
            display: none !important;
          }
          .desktop-announcement-info {
            display: none !important;
          }
          .nav-guest-text {
            display: none !important;
          }
          .navbar-user-name,
          .navbar-user-chevron {
            display: none !important;
          }
          .navbar-user-btn {
            padding: 0 !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .mobile-auth-btn {
            padding: 0.45rem !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .navbar-logo-title {
            font-size: 0.95rem !important;
          }
          .navbar-logo-sub {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-main-container {
            padding: 0.5rem 0.65rem !important;
          }
          .navbar-logo-title {
            font-size: 0.88rem !important;
          }
          .navbar-actions-group {
            gap: 0.3rem !important;
          }
          .navbar-actions-group button,
          .navbar-actions-group a {
            width: 34px !important;
            height: 34px !important;
          }
        }
      `}</style>
    </header>
    {/* Spacer to prevent layout shift and keep content visible below fixed navbar */}
    <div style={{ height: `${headerHeight}px`, flexShrink: 0 }} aria-hidden="true" />
  </>
  );
};
