import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const AnimatedFurnitureBackground = () => {
  const location = useLocation();
  // Don't render 3D canvas inside admin/manager/craftsman workspace dashboards
  const isDashboard = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/manager') ||
                      location.pathname.startsWith('/craftsman');

  const canvasRef = useRef(null);
  const [isPhone, setIsPhone] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  const imagesCacheRef = useRef({});
  const isPhoneRef = useRef(isPhone);
  const TOTAL_FRAMES = 300;

  // Continuous position tracking for smooth lerp interpolation
  const currentPosRef = useRef(0);
  const targetFrameRef = useRef(0);
  const renderedFrameRef = useRef(1);
  const isTickingRef = useRef(false);

  // Helper to get image path for frame index 1..300
  const getImagePath = useCallback((index, phone) => {
    const folder = phone ? 'phone' : 'comp';
    const padded = String(index).padStart(3, '0');
    return `/animations/${folder}/ezgif-frame-${padded}.jpg`;
  }, []);

  // Helper to find closest available frame in cache to prevent blank flicker
  const findClosestFrame = useCallback((target) => {
    const cache = imagesCacheRef.current;
    if (cache[target] && cache[target].complete) return cache[target];

    for (let offset = 1; offset <= 35; offset++) {
      const prev = ((target - offset - 1 + TOTAL_FRAMES) % TOTAL_FRAMES) + 1;
      if (cache[prev] && cache[prev].complete) return cache[prev];

      const next = ((target + offset - 1) % TOTAL_FRAMES) + 1;
      if (cache[next] && cache[next].complete) return cache[next];
    }
    return cache[1] || null;
  }, [TOTAL_FRAMES]);

  // Canvas drawing function with aspect-ratio cover
  const renderFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      drawHeight = height;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Smooth RAF render loop that chases targetFrame with fluid lerp
  const renderLoop = useCallback(() => {
    const diff = targetFrameRef.current - currentPosRef.current;

    if (Math.abs(diff) > 0.04) {
      // 0.22 gives a super responsive yet buttery smooth Apple-style inertia
      currentPosRef.current += diff * 0.22;

      let normalized = Math.floor(currentPosRef.current) % TOTAL_FRAMES;
      if (normalized < 0) normalized += TOTAL_FRAMES;
      const nextFrame = normalized + 1;

      if (nextFrame !== renderedFrameRef.current) {
        renderedFrameRef.current = nextFrame;
        const img = imagesCacheRef.current[nextFrame] || findClosestFrame(nextFrame);
        if (img) renderFrame(img);
      }

      requestAnimationFrame(renderLoop);
    } else {
      currentPosRef.current = targetFrameRef.current;
      let normalized = Math.floor(currentPosRef.current) % TOTAL_FRAMES;
      if (normalized < 0) normalized += TOTAL_FRAMES;
      const finalFrame = normalized + 1;

      renderedFrameRef.current = finalFrame;
      const img = imagesCacheRef.current[finalFrame] || findClosestFrame(finalFrame);
      if (img) renderFrame(img);

      isTickingRef.current = false;
    }
  }, [TOTAL_FRAMES, findClosestFrame, renderFrame]);

  // Window resize listener to switch between phone & comp
  useEffect(() => {
    if (isDashboard) return;

    const handleResize = () => {
      const phoneMode = window.innerWidth < 768;
      if (phoneMode !== isPhoneRef.current) {
        setIsPhone(phoneMode);
        isPhoneRef.current = phoneMode;
        imagesCacheRef.current = {};

        // Preload frame 1 of new device folder immediately
        const newFirst = new Image();
        newFirst.src = getImagePath(1, phoneMode);
        newFirst.onload = () => {
          imagesCacheRef.current[1] = newFirst;
          renderFrame(newFirst);
        };
      } else {
        const curImg = imagesCacheRef.current[renderedFrameRef.current] || findClosestFrame(renderedFrameRef.current);
        if (curImg) renderFrame(curImg);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [findClosestFrame, getImagePath, isDashboard, renderFrame]);

  // Progressive background preloader of 300 frames
  useEffect(() => {
    if (isDashboard) return;

    let isCancelled = false;
    const phone = isPhone;

    // Load first frame immediately and render as initial static view
    const initialImg = new Image();
    initialImg.src = getImagePath(1, phone);
    initialImg.onload = () => {
      if (isCancelled) return;
      imagesCacheRef.current[1] = initialImg;
      renderFrame(initialImg);
    };

    const loadBatch = async (start, end) => {
      for (let i = start; i <= end; i++) {
        if (isCancelled) return;
        if (!imagesCacheRef.current[i]) {
          const img = new Image();
          img.src = getImagePath(i, phone);
          await new Promise((resolve) => {
            img.onload = () => {
              imagesCacheRef.current[i] = img;
              resolve();
            };
            img.onerror = () => resolve();
          });
        }
      }
    };

    // Preload first 25 frames urgently so immediate scrolling is seamless
    loadBatch(1, 25).then(() => {
      if (!isCancelled) {
        let nextStart = 26;
        const loadNextChunks = () => {
          if (isCancelled || nextStart > TOTAL_FRAMES) return;
          const nextEnd = Math.min(nextStart + 25, TOTAL_FRAMES);
          loadBatch(nextStart, nextEnd).then(() => {
            nextStart = nextEnd + 1;
            if (nextStart <= TOTAL_FRAMES && !isCancelled) {
              setTimeout(loadNextChunks, 30);
            }
          });
        };
        loadNextChunks();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [getImagePath, isDashboard, isPhone, renderFrame]);

  // SCROLL EVENT LISTENER: Only rotates when the user scrolls!
  useEffect(() => {
    if (isDashboard) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Sensitivity: ~2.2px per frame on mobile, ~2.8px per frame on desktop
      const pixelsPerFrame = isPhoneRef.current ? 2.2 : 2.8;

      // Update target frame strictly according to scroll position
      targetFrameRef.current = scrollY / pixelsPerFrame;

      if (!isTickingRef.current) {
        isTickingRef.current = true;
        requestAnimationFrame(renderLoop);
      }
    };

    // Initialize position based on current scroll
    const initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const pixelsPerFrame = isPhoneRef.current ? 2.2 : 2.8;
    targetFrameRef.current = initialScrollY / pixelsPerFrame;
    currentPosRef.current = targetFrameRef.current;

    let normalized = Math.floor(currentPosRef.current) % TOTAL_FRAMES;
    if (normalized < 0) normalized += TOTAL_FRAMES;
    const initialFrame = normalized + 1;
    renderedFrameRef.current = initialFrame;

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [TOTAL_FRAMES, isDashboard, renderLoop]);

  if (isDashboard) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* HTML5 Canvas for ultra-smooth 60fps frame rendering */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          inset: 0,
          objectFit: 'cover'
        }}
      />

      {/* Atmospheric Theme-aware Scrim Overlay for Readability and Contrast */}
      <div
        className="animated-furniture-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Warm Amber Light Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194, 109, 46, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
