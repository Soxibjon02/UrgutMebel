import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';

export const AnimatedFurnitureBackground = ({
  overlayOpacity = 0.55,
  showControls = true
}) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPhone, setIsPhone] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);

  const imagesCacheRef = useRef({});
  const animationFrameIdRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const currentFrameRef = useRef(1);
  const isPlayingRef = useRef(true);
  const isPhoneRef = useRef(isPhone);

  const TOTAL_FRAMES = 300;
  // ~25 fps = 40ms per frame
  const FRAME_INTERVAL = 40;

  // Window resize listener to switch between phone & comp
  useEffect(() => {
    const handleResize = () => {
      const phoneMode = window.innerWidth < 768;
      if (phoneMode !== isPhoneRef.current) {
        setIsPhone(phoneMode);
        isPhoneRef.current = phoneMode;
        // Reset cache on device orientation switch to reload appropriate frames
        imagesCacheRef.current = {};
        setLoadedCount(0);
        currentFrameRef.current = 1;
        setCurrentFrame(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update isPlaying ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Progressive preloading of 300 frames
  useEffect(() => {
    let isCancelled = false;
    const folder = isPhone ? 'phone' : 'comp';

    // Helper to get image path for frame index 1..300
    const getImagePath = (index) => {
      const padded = String(index).padStart(3, '0');
      return `/animations/${folder}/ezgif-frame-${padded}.jpg`;
    };

    // 1. Preload first 15 frames urgently
    const loadBatch = async (start, end) => {
      for (let i = start; i <= end; i++) {
        if (isCancelled) return;
        if (!imagesCacheRef.current[i]) {
          const img = new Image();
          img.src = getImagePath(i);
          await new Promise((resolve) => {
            img.onload = () => {
              imagesCacheRef.current[i] = img;
              if (!isCancelled) {
                setLoadedCount((prev) => prev + 1);
              }
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
          });
        }
      }
    };

    // Start with initial frames so animation starts quickly
    loadBatch(1, 20).then(() => {
      if (!isCancelled) {
        // Continue loading remaining frames smoothly in chunks
        let nextStart = 21;
        const loadNextChunks = () => {
          if (isCancelled || nextStart > TOTAL_FRAMES) return;
          const nextEnd = Math.min(nextStart + 20, TOTAL_FRAMES);
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
  }, [isPhone]);

  // Canvas drawing & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = (img) => {
      if (!img || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width * dpr;
      const height = rect.height * dpr;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Aspect ratio 'cover' algorithm
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
    };

    const animate = (timestamp) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
      const delta = timestamp - lastFrameTimeRef.current;

      if (isPlayingRef.current && delta >= FRAME_INTERVAL) {
        lastFrameTimeRef.current = timestamp - (delta % FRAME_INTERVAL);

        const nextFrame = (currentFrameRef.current % TOTAL_FRAMES) + 1;
        const img = imagesCacheRef.current[nextFrame];

        // If next image is ready in cache, advance; otherwise stay on current
        if (img && img.complete) {
          currentFrameRef.current = nextFrame;
          setCurrentFrame(nextFrame);
          renderFrame(img);
        } else {
          // If next is not ready, try to render current if available
          const currentImg = imagesCacheRef.current[currentFrameRef.current];
          if (currentImg && currentImg.complete) {
            renderFrame(currentImg);
          }
        }
      } else if (!isPlayingRef.current) {
        // Paused state: re-render current frame on resize
        const currentImg = imagesCacheRef.current[currentFrameRef.current];
        if (currentImg && currentImg.complete) {
          renderFrame(currentImg);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* HTML5 Canvas Rendering Animation */}
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

      {/* Atmospheric Cinematic Gradients for Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isPhone
            ? 'linear-gradient(to bottom, rgba(12,10,9,0.85) 0%, rgba(12,10,9,0.45) 50%, rgba(12,10,9,0.92) 100%)'
            : 'linear-gradient(to right, rgba(12,10,9,0.92) 0%, rgba(12,10,9,0.65) 55%, rgba(12,10,9,0.3) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Additional warm light glow accent */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194, 109, 46, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom right subtle interactive controls & indicator */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            pointerEvents: 'auto'
          }}
        >
          {/* Badge: 3D Animatsiya */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(12, 10, 9, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(194, 109, 46, 0.35)',
              padding: '0.3rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              color: 'var(--wood-light)',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isPlaying ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                boxShadow: isPlaying ? '0 0 8px #10b981' : 'none'
              }}
            />
            <span>{isPhone ? '📱 Mobil 3D' : '💻 3D Jonli Mebel'}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
              ({currentFrame}/300)
            </span>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Animatsiyani to‘xtatib turish" : "Animatsiyani davom ettirish"}
            aria-label={isPlaying ? "To‘xtatish" : "O‘ynatish"}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(12, 10, 9, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(194, 109, 46, 0.4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: '1px' }} />}
          </button>
        </div>
      )}
    </div>
  );
};
