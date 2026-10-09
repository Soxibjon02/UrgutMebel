import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext();

export const PwaProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [platform, setPlatform] = useState('desktop'); // 'ios' | 'android' | 'desktop'

  useEffect(() => {
    // 1. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 2. Check if already installed
    const checkIsInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://') ||
        localStorage.getItem('urgut_app_installed') === 'true';

      setIsInstalled(Boolean(isStandalone));
    };

    checkIsInstalled();

    // Listen for display mode change
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        localStorage.setItem('urgut_app_installed', 'true');
      }
    };
    try {
      mediaQuery.addEventListener('change', handleModeChange);
    } catch {
      // older browsers fallback
    }

    // 3. Capture beforeinstallprompt (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      window.urgutDeferredPrompt = e;
    };

    // 4. Capture appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
      localStorage.setItem('urgut_app_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      try {
        mediaQuery.removeEventListener('change', handleModeChange);
      } catch {}
    };
  }, []);

  const installApp = async () => {
    // If we have captured the browser install prompt
    const promptEvent = deferredPrompt || window.urgutDeferredPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('urgut_app_installed', 'true');
          setDeferredPrompt(null);
          setIsInstallable(false);
          return { success: true, message: "Ilova o‘rnatildi!" };
        } else {
          return { success: false, message: "O‘rnatish bekor qilindi" };
        }
      } catch (err) {
        console.error('Install error:', err);
      }
    }

    // Manual guidance when direct prompt is not available
    if (platform === 'ios') {
      return {
        success: false,
        instruction: "iOS Safari: Pastdagi 'Ulashish' (Share) tugmasini bosing va 'Bosh ekranga qo‘shish' (Add to Home Screen) bandini tanlang."
      };
    } else if (platform === 'desktop') {
      return {
        success: false,
        instruction: "Kompyuterda: Brauzer yuqori qismidagi manzil qatori (URL bar) o‘ng tomonida joylashgan 'O‘rnatish' (Install) belgisini bosing."
      };
    } else {
      return {
        success: false,
        instruction: "Brauzer menyusidan (3 nuqta) 'Ilovani o‘rnatish' yoki 'Bosh ekranga qo‘shish' bandini tanlang."
      };
    }
  };

  return (
    <PwaContext.Provider
      value={{
        isInstalled,
        isInstallable,
        platform,
        installApp,
        setIsInstalledManual: (val) => {
          setIsInstalled(val);
          localStorage.setItem('urgut_app_installed', val ? 'true' : 'false');
        }
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => useContext(PwaContext);
