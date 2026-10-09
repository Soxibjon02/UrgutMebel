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
  LogOut,
  ChevronDown,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = () => {
  const { settings } = useSettings();
  const { user, isGuest, role, isManager, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useWishlist();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
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
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                backgroundColor: 'var(--wood-amber)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              AKSIYA
            </span>
            <span>{settings.announcement || "O‘zbekiston bo‘ylab professional o‘rnatish xizmati"}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href={`tel:${settings.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d6d3d1' }}
            >
              <Phone size={13} color="var(--wood-amber)" />
              <span>{settings.phone}</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ color: '#a8a29e' }}>Samarqand, Urgut</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo with dynamic Web Project Name */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(194, 109, 46, 0.3)'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.28rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                {settings.site_name}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--wood-amber)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Mebel & Dizayn Markazi
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (Admin/Manager NEVER shown here) */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.5rem'
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
                  padding: '0.35rem 0',
                  transition: 'color 0.2s'
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Search, Wishlist, Cart, User Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)'
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
                    width: '300px',
                    backgroundColor: '#ffffff',
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
                      padding: '0.35rem'
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.75rem' }}>
                    Izlash
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/account?tab=wishlist"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                position: 'relative'
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

            {/* Cart Button */}
            <Link
              to="/cart"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                position: 'relative'
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
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem', padding: '0.5rem 0.95rem' }}
                >
                  <User size={15} />
                  <span>Kirish</span>
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
                        width: '230px',
                        backgroundColor: '#ffffff',
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
                            backgroundColor: role === 'admin' ? '#fee2e2' : role === 'manager' ? '#fef3c7' : '#ecfdf5',
                            color: role === 'admin' ? '#b91c1c' : role === 'manager' ? '#b45309' : '#047857'
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

                      <Link
                        to="/account?tab=custom"
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
                        <SlidersHorizontal size={15} />
                        Maxsus Buyurtmalarim
                      </Link>

                      {/* If user is Manager, show link to Manager Dashboard */}
                      {isManager && (
                        <Link
                          to="/manager"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#b45309',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#fffbeb'
                          }}
                        >
                          <Briefcase size={15} />
                          Menedjer Paneli (/manager)
                        </Link>
                      )}

                      {/* If user is Admin, show link to Admin Dashboard */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.85rem',
                            color: '#b91c1c',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#fef2f2'
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
            backgroundColor: '#ffffff',
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
                borderBottom: '1px solid #f5f2eb'
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {isManager && (
            <Link
              to="/manager"
              style={{
                padding: '0.6rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#b45309'
              }}
            >
              💼 Menedjer Paneli
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                padding: '0.6rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#b91c1c'
              }}
            >
              🛡️ Admin Paneli
            </Link>
          )}
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-container {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
