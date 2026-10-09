import React, { useState, useEffect } from 'react';
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
  Sun
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/furniture?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
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
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? '0 6px 24px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease'
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
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>

          {/* Logo */}
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
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(194, 109, 46, 0.3)',
                flexShrink: 0
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div
                className="navbar-logo-title"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                {settings.site_name}
              </div>
              <div
                className="navbar-logo-sub"
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--wood-amber)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}
              >
                Mebel & Dizayn Markazi
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links - Fixed Single Line & No Wrap */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'nowrap',
              flexShrink: 0
            }}
            className="desktop-nav-container"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontSize: '0.92rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

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
                      gap: '0.5rem',
                      padding: '0.35rem 0.65rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)'
                    }}
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
                        justifyContent: 'center'
                      }}
                    >
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} color="var(--text-muted)" />
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
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#3730a3' }}
            >
              🔨 Usta Paneli
            </Link>
          )}

          {isManager && (
            <Link
              to="/manager"
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#b45309' }}
            >
              💼 Menedjer Paneli
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{ padding: '0.6rem 0', fontSize: '1rem', fontWeight: 600, color: '#b91c1c' }}
            >
              🛡️ Admin Paneli
            </Link>
          )}
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (min-width: 980px) {
          .desktop-nav-container {
            display: flex !important;
          }
        }
        @media (max-width: 979px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .nav-action-desktop-only {
            display: none !important;
          }
          .desktop-announcement-info {
            display: none !important;
          }
          .nav-guest-text {
            display: none !important;
          }
          .mobile-auth-btn {
            padding: 0.45rem !important;
            width: 38px !important;
            height: 38px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .navbar-logo-title {
            font-size: 1.05rem !important;
          }
          .navbar-logo-sub {
            font-size: 0.58rem !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-logo-title {
            font-size: 0.95rem !important;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </header>
  );
};
