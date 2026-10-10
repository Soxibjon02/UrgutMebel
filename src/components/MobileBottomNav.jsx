import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Home, Armchair, Sparkles, ShoppingBag, User, ShieldCheck } from 'lucide-react';

export const MobileBottomNav = () => {
  const { totalItemsCount } = useCart();
  const { user, isGuest, isAdmin, isManager, isCraftsman, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = () => {
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

  const handleProfileClick = (e) => {
    handleNavClick();

    if (isGuest) {
      e.preventDefault();
      openAuthModal('login');
      return;
    }

    // Direct to their specialized panel if applicable
    if (isAdmin) {
      navigate('/admin');
    } else if (isManager) {
      navigate('/manager');
    } else if (isCraftsman) {
      navigate('/craftsman-dashboard');
    } else {
      navigate('/account');
    }
  };

  const navItems = [
    {
      to: '/',
      label: 'Bosh sahifa',
      icon: Home,
      exact: true
    },
    {
      to: '/furniture',
      label: 'Mebellar',
      icon: Armchair
    },
    {
      to: '/custom-order',
      label: 'Buyurtma',
      icon: Sparkles,
      highlight: true
    },
    {
      to: '/cart',
      label: 'Savat',
      icon: ShoppingBag,
      badge: totalItemsCount
    }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobil pastki navigatsiya">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`
              }
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={20} />
                {item.badge > 0 && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </NavLink>
          );
        })}

        {/* User / Kabinet Item */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="mobile-nav-link mobile-nav-btn"
        >
          <div className="mobile-nav-icon-wrap">
            {isAdmin || isManager || isCraftsman ? (
              <ShieldCheck size={20} color="var(--wood-amber)" />
            ) : (
              <User size={20} />
            )}
          </div>
          <span className="mobile-nav-label">
            {isGuest ? 'Kirish' : (user?.full_name ? user.full_name.split(' ')[0] : 'Kabinet')}
          </span>
        </button>
      </div>
    </nav>
  );
};
