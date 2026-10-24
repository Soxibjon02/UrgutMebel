import React, { useState, useEffect, useRef } from 'react';
import { UrbanTopBar } from './urban/UrbanTopBar';
import { UrbanHeaderMegaMenu } from './urban/UrbanHeaderMegaMenu';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ignore negative rubber-band scrolls (e.g. on macOS / iOS)
      if (currentScrollY < 0) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const prevScrollY = lastScrollYRef.current;
          const delta = currentScrollY - prevScrollY;

          // Always visible at or near the very top
          if (currentScrollY <= 40) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);

            // Hide when scrolling DOWN by more than 8px past threshold
            if (delta > 8 && currentScrollY > 80) {
              setIsVisible(false);
            }
            // Reveal immediately on even a slight scroll UP (e.g. delta < -3px)
            else if (delta < -3) {
              setIsVisible(true);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 990,
        width: '100%',
        boxShadow: isScrolled
          ? '0 6px 20px rgba(0, 0, 0, 0.08)'
          : '0 2px 12px rgba(0, 0, 0, 0.06)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        willChange: 'transform'
      }}
    >
      <UrbanTopBar />
      <UrbanHeaderMegaMenu />
    </header>
  );
};

