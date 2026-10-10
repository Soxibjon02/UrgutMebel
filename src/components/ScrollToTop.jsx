import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls window smoothly to the top whenever route (pathname/search) changes.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const scrollToTop = () => {
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

    scrollToTop();
    // Safety timeout in case new page components take a render tick to settle layout height
    const timer = setTimeout(scrollToTop, 60);
    return () => clearTimeout(timer);
  }, [pathname, search, hash]);

  return null;
};
