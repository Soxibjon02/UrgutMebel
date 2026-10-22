import React, { useState, useEffect } from 'react';

/**
 * HeaderAfishaSlideshow
 * Avtomatik almashib turuvchi zamonaviy header afisha slayderi.
 * Super admin tomonidan qo'shilgan rasmlarni 3.5 soniyada silliq almashtirib boradi.
 */
export const HeaderAfishaSlideshow = ({
  images = [],
  alt = "Afisha rasmi",
  interval = 3500,
  mode = "image", // 'image' | 'background'
  objectFit = "contain",
  imageStyle = {},
  containerStyle = {},
  overlay = null,
  showDots = true,
  children = null
}) => {
  // Filtrlash: faqat bo'sh bo'lmagan stringlar
  const validImages = Array.isArray(images)
    ? images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  // Avtomatik almashinuvchi timer (slideshow)
  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  // Agar rasm bo'lmasa
  if (validImages.length === 0) {
    return null;
  }

  // Background mode (masalan, Blog header)
  if (mode === "background") {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          ...containerStyle
        }}
      >
        {validImages.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: idx === activeIndex ? 1 : 0,
              transform: idx === activeIndex ? 'scale(1.02)' : 'scale(1)',
              transition: 'opacity 0.8s ease-in-out, transform 4s ease-out',
              zIndex: idx === activeIndex ? 1 : 0
            }}
          />
        ))}

        {overlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: overlay,
              zIndex: 2
            }}
          />
        )}

        {/* Dots */}
        {showDots && validImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 3
            }}
          >
            {validImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(dotIdx);
                }}
                aria-label={`Slide ${dotIdx + 1}`}
                style={{
                  width: dotIdx === activeIndex ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: dotIdx === activeIndex ? 'var(--figma-coral, #fa6d58)' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}

        {children}
      </div>
    );
  }

  // Image mode (masalan, Chairs & Stools, Sofas & Armchairs, Help Center)
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...containerStyle
      }}
    >
      {validImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${alt} ${idx + 1}`}
          style={{
            position: 'absolute',
            maxWidth: '85%',
            maxHeight: '380px',
            objectFit: objectFit,
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))',
            opacity: idx === activeIndex ? 1 : 0,
            transform: idx === activeIndex ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: idx === activeIndex ? 'auto' : 'none',
            ...imageStyle
          }}
        />
      ))}

      {/* Slide Navigation Dots */}
      {showDots && validImages.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: 10
          }}
        >
          {validImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(dotIdx);
              }}
              aria-label={`Slide ${dotIdx + 1}`}
              style={{
                width: dotIdx === activeIndex ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: dotIdx === activeIndex ? 'var(--figma-coral, #fa6d58)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}

      {children}
    </div>
  );
};
