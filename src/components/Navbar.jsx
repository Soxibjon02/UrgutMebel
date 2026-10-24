import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UrbanTopBar } from './urban/UrbanTopBar';
import { UrbanHeaderMegaMenu } from './urban/UrbanHeaderMegaMenu';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);
  const location = useLocation();

  // Reset navbar visibility on page/route navigation
  useEffect(() => {
    setIsVisible(true);
    setIsScrolled(false);
  }, [location.pathname]);

  // Keep spacer height dynamically accurate to header height
  useEffect(() => {
    const el = navbarRef.current;
    if (!el) return;

    const measureHeight = () => {
      if (el) {
        setNavbarHeight(el.offsetHeight);
      }
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(() => {
      measureHeight();
    });
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY ?? window.pageYOffset ?? 0;
    let ticking = false;

    const updateNavbar = () => {
      // If mobile menu or drawer is open, NEVER hide navbar!
      if (document.body.classList.contains('mobile-nav-open')) {
        setIsVisible(true);
        lastScrollY = window.scrollY ?? window.pageYOffset ?? 0;
        ticking = false;
        return;
      }

      const currentScrollY = window.scrollY ?? window.pageYOffset ?? 0;

      // Ignore negative rubber-band scrolls (e.g. on macOS / iOS bounce)
      if (currentScrollY <= 0) {
        setIsVisible(true);
        setIsScrolled(false);
        lastScrollY = 0;
        ticking = false;
        return;
      }

      // Always visible at or near the very top (<= 40px)
      if (currentScrollY <= 40) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);

        const delta = currentScrollY - lastScrollY;

        // Reveal immediately on even a slight scroll UP (e.g. delta <= -2px)
        if (delta <= -2) {
          setIsVisible(true);
        }
        // Hide when scrolling DOWN past threshold (delta >= 6px and scrollY > 60px)
        else if (delta >= 6 && currentScrollY > 60) {
          setIsVisible(false);
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        ref={navbarRef}
        id="main-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 990,
          width: '100%',
          boxShadow: isScrolled
            ? '0 6px 20px rgba(0, 0, 0, 0.08)'
            : '0 2px 12px rgba(0, 0, 0, 0.06)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          willChange: 'transform',
          backgroundColor: 'var(--bg-card, #ffffff)'
        }}
      >
        <UrbanTopBar />
        <UrbanHeaderMegaMenu />
      </header>
      <div id="navbar-spacer" style={{ height: navbarHeight, flexShrink: 0 }} />
    </>
  );
};
