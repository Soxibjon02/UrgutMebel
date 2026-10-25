import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  Loader2,
  Sparkles,
  Check,
  Subtitles
} from 'lucide-react';

// Format seconds into MM:SS or HH:MM:SS
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const CustomVideoPlayer = ({
  video,
  nextVideo,
  onNext,
  autoPlay = true,
  className = ''
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const progressTrackRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const lastTapRef = useRef({ time: 0, x: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedFraction, setBufferedFraction] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState(null);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);

  // Send command to underlying YouTube iframe reliably via postMessage + API
  const sendYtCommand = useCallback((func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (e) {
        // ignore
      }
    }
    if (playerRef.current && typeof playerRef.current[func] === 'function') {
      try {
        playerRef.current[func](...args);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Autohide controls on inactivity
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 2600);
    }
  }, [isPlaying]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      sendYtCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      if (hasEnded) {
        sendYtCommand('seekTo', [0, true]);
        setCurrentTime(0);
        setHasEnded(false);
        setCountdown(null);
      }
      sendYtCommand('playVideo');
      setIsPlaying(true);
      setIsBuffering(false);
      setIsVideoLoaded(true);
    }
    handleUserActivity();
  }, [isPlaying, hasEnded, sendYtCommand, handleUserActivity]);

  // Seek forward / backward by exact seconds (e.g. 15s)
  const handleSeekDelta = useCallback(
    (seconds) => {
      const targetTime = Math.max(0, Math.min(duration || 9999, currentTime + seconds));
      setCurrentTime(targetTime);
      sendYtCommand('seekTo', [targetTime, true]);
      handleUserActivity();
    },
    [currentTime, duration, sendYtCommand, handleUserActivity]
  );

  // Toggle Subtitles / Captions (CC)
  const toggleCaptions = useCallback(() => {
    setIsCaptionsOn((prev) => {
      const nextState = !prev;
      if (nextState) {
        sendYtCommand('loadModule', ['captions']);
        sendYtCommand('setOption', ['captions', 'track', { languageCode: 'uz' }]);
        sendYtCommand('setOption', ['cc', 'track', { languageCode: 'uz' }]);
        sendYtCommand('setOption', ['captions', 'fontSize', 1]);
      } else {
        sendYtCommand('unloadModule', ['captions']);
        sendYtCommand('setOption', ['captions', 'track', {}]);
        sendYtCommand('setOption', ['cc', 'track', {}]);
      }
      return nextState;
    });
    handleUserActivity();
  }, [sendYtCommand, handleUserActivity]);

  // Reset states when video changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setBufferedFraction(0);
    setHasEnded(false);
    setCountdown(null);
    setIsBuffering(true);
    setIsVideoLoaded(false);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Safety timeout: dismiss loading spinner after 2.2 seconds even if events lag
    const timer = setTimeout(() => {
      setIsBuffering(false);
      setIsVideoLoaded(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [video?.id, video?.youtube_id]);

  // Listen to postMessage events from YouTube IFrame
  useEffect(() => {
    const handleYtMessage = (event) => {
      try {
        if (typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);

        if (data.event === 'onStateChange') {
          // YT States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering)
          if (data.info === 1) {
            setIsPlaying(true);
            setIsBuffering(false);
            setIsVideoLoaded(true);
            setHasEnded(false);
          } else if (data.info === 2) {
            setIsPlaying(false);
            setIsBuffering(false);
          } else if (data.info === 3) {
            setIsBuffering(true);
          } else if (data.info === 0) {
            setIsPlaying(false);
            setHasEnded(true);
            if (nextVideo && onNext) {
              setCountdown(4);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                  if (prev === null) return null;
                  if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    if (onNext) onNext();
                    return null;
                  }
                  return prev - 1;
                });
              }, 1000);
            }
          }
        } else if (data.event === 'infoDelivery') {
          if (data.info) {
            if (typeof data.info.currentTime === 'number' && !isDraggingProgress) {
              setCurrentTime(data.info.currentTime);
              if (data.info.currentTime > 0.2) {
                setIsVideoLoaded(true);
                setIsBuffering(false);
              }
            }
            if (typeof data.info.duration === 'number' && data.info.duration > 0) {
              setDuration(data.info.duration);
            }
            if (typeof data.info.videoLoadedFraction === 'number') {
              setBufferedFraction(data.info.videoLoadedFraction);
            }
          }
        }
      } catch (e) {
        // Not a JSON message or not from YT
      }
    };

    window.addEventListener('message', handleYtMessage);
    return () => window.removeEventListener('message', handleYtMessage);
  }, [isDraggingProgress, nextVideo, onNext]);

  // Fallback: poll playback status & duration via postMessage listening ping
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      sendYtCommand('getCurrentTime');
      sendYtCommand('getDuration');
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, sendYtCommand]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Global Keyboard Shortcuts (Space, 15s jump, F, M)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSeekDelta(-15);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSeekDelta(15);
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleCaptions();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [togglePlay, handleSeekDelta, toggleCaptions]);

  // Double-tap to seek 15s on mobile or desktop overlay
  const handleOverlayClick = (e) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    if (now - lastTapRef.current.time < 320) {
      // Double tap detected
      if (isLeft) {
        handleSeekDelta(-15);
        setDoubleTapFeedback({ side: 'left', text: '-15 soniya' });
      } else {
        handleSeekDelta(15);
        setDoubleTapFeedback({ side: 'right', text: '+15 soniya' });
      }
      setTimeout(() => setDoubleTapFeedback(null), 650);
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x: clickX };
      togglePlay();
    }
  };

  // Progress Bar click & drag
  const handleProgressSeek = (clientX) => {
    if (!progressTrackRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    setCurrentTime(targetTime);
    sendYtCommand('seekTo', [targetTime, true]);
  };

  const handleProgressMouseDown = (e) => {
    setIsDraggingProgress(true);
    handleProgressSeek(e.clientX);

    const onMouseMove = (moveEvent) => {
      handleProgressSeek(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDraggingProgress(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleProgressMouseMove = (e) => {
    if (!progressTrackRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  // Volume & Mute
  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    sendYtCommand('setVolume', [newVol]);
    if (newVol === 0) {
      setIsMuted(true);
      sendYtCommand('mute');
    } else if (isMuted) {
      setIsMuted(false);
      sendYtCommand('unMute');
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      sendYtCommand('unMute');
      setIsMuted(false);
      if (volume === 0) {
        setVolume(60);
        sendYtCommand('setVolume', [60]);
      }
    } else {
      sendYtCommand('mute');
      setIsMuted(true);
    }
  };

  // Playback Rate
  const handleSetSpeed = (rate) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    sendYtCommand('setPlaybackRate', [rate]);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = Math.min(100, bufferedFraction * 100);

  // YouTube embed URL with strict parameters: NO controls, NO branding, NO logo
  const embedSrc = `https://www.youtube-nocookie.com/embed/${video?.youtube_id}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseMove={handleUserActivity}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowSpeedMenu(false);
        }
      }}
      className={`custom-video-player-root ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#0a0a0c',
        borderRadius: isFullscreen ? '0px' : '16px',
        overflow: 'hidden',
        boxShadow: isFullscreen ? 'none' : '0 20px 50px rgba(0,0,0,0.35)',
        outline: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 1. Underlying Video Engine: Standard 100% 16:9 dimensions with natural scale and zero distortion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <iframe
          ref={iframeRef}
          key={video?.youtube_id}
          title={video?.title || 'Urgut Mebel Video'}
          src={embedSrc}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. Poster / Thumbnail Splash Shield: Fades out only when the video actually starts playing, permanently eliminating the 1-2s YouTube logo flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${video?.videoThumb || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isVideoLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 3
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }} />
      </div>

      {/* 3. Transparent Gesture Overlay: Double-tap to Seek -15s/+15s, Single tap to Play/Pause */}
      <div
        onClick={handleOverlayClick}
        onDoubleClick={toggleFullscreen}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          cursor: isPlaying ? 'default' : 'pointer'
        }}
      />

      {/* 4. Double tap seek visual feedback ripple */}
      {doubleTapFeedback && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [doubleTapFeedback.side]: 0,
            width: '42%',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderTopRightRadius: doubleTapFeedback.side === 'left' ? '50%' : 0,
            borderBottomRightRadius: doubleTapFeedback.side === 'left' ? '50%' : 0,
            borderTopLeftRadius: doubleTapFeedback.side === 'right' ? '50%' : 0,
            borderBottomLeftRadius: doubleTapFeedback.side === 'right' ? '50%' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '6px',
            color: '#ffffff',
            fontSize: '0.92rem',
            fontWeight: 800,
            zIndex: 9,
            pointerEvents: 'none',
            animation: 'cvpFadeRipple 0.65s ease-out forwards'
          }}
        >
          {doubleTapFeedback.side === 'left' ? <RotateCcw size={28} /> : <RotateCw size={28} />}
          <span>{doubleTapFeedback.text}</span>
        </div>
      )}

      {/* 5. Top Gradient Header: Brand Tag + Video Title + HD Indicator */}
      <div
        className="cvp-top-bar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '1.1rem 1.4rem',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          opacity: showControls || !isPlaying ? 1 : 0,
          transform: showControls || !isPlaying ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, overflow: 'hidden' }}>
          {/* Brand Pill */}
          <div
            className="cvp-brand-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(250, 109, 88, 0.18)',
              border: '1px solid rgba(250, 109, 88, 0.45)',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              backdropFilter: 'blur(8px)',
              flexShrink: 0
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--figma-coral, #FA6D58)',
                boxShadow: '0 0 8px #FA6D58'
              }}
            />
            <span
              className="cvp-brand-text"
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Urgut Mebel Markazi
            </span>
          </div>

          {/* Video Title */}
          <span
            className="cvp-top-title"
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {video?.title || ''}
          </span>
        </div>

        {/* Quality indicator */}
        <div
          className="cvp-quality-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.05em',
            flexShrink: 0
          }}
        >
          <Sparkles size={11} color="var(--figma-coral, #FA6D58)" />
          <span>FULL HD</span>
        </div>
      </div>

      {/* 6. Center State: Buffering Spinner (hidden as soon as playback starts) */}
      {isBuffering && !isVideoLoaded && (
        <div
          style={{
            position: 'absolute',
            zIndex: 8,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <Loader2
            size={32}
            color="var(--figma-coral, #FA6D58)"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        </div>
      )}

      {/* 7. Center Big Play Button (shown when paused) */}
      {!isPlaying && isVideoLoaded && !hasEnded && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Videoni ijro etish"
          style={{
            position: 'absolute',
            zIndex: 8,
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            backgroundColor: 'rgba(250, 109, 88, 0.95)',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(250, 109, 88, 0.45)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Play size={32} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
        </button>
      )}

      {/* 8. Auto-Next Countdown Screen when video ends */}
      {hasEnded && nextVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            backgroundColor: 'rgba(10, 10, 12, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--figma-coral, #FA6D58)',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem'
            }}
          >
            Keyingi Video {countdown !== null ? `(${countdown}s)` : ''}
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              maxWidth: '540px',
              margin: '0 0 1.25rem',
              lineHeight: 1.3
            }}
          >
            {nextVideo.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                if (onNext) onNext();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--figma-coral, #FA6D58)',
                color: '#ffffff',
                border: 'none',
                padding: '0.7rem 1.4rem',
                borderRadius: '999px',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(250, 109, 88, 0.4)'
              }}
            >
              <SkipForward size={16} />
              <span>Hozir Ko‘rish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                togglePlay();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.7rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              <span>Qayta Ijro Etish</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. Modern Glassmorphic Bottom Control Bar */}
      <div
        className="cvp-bottom-bar"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '1.4rem 1.25rem 0.85rem',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 65%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          opacity: showControls || !isPlaying ? 1 : 0,
          transform: showControls || !isPlaying ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
        }}
      >
        {/* Scrubber / Progress Bar */}
        <div
          ref={progressTrackRef}
          className="cvp-scrubber-track"
          onMouseDown={handleProgressMouseDown}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          style={{
            position: 'relative',
            width: '100%',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              style={{
                position: 'absolute',
                bottom: '22px',
                left: `${hoverPosition}%`,
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(15, 15, 18, 0.95)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.2rem 0.45rem',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Track background */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              overflow: 'visible'
            }}
          >
            {/* Buffered bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${bufferedPercent}%`,
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                borderRadius: '999px',
                transition: 'width 0.2s linear'
              }}
            />

            {/* Played progress bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FA6D58, #FF8A75)',
                borderRadius: '999px'
              }}
            />

            {/* Thumb */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px rgba(250, 109, 88, 0.8)',
                transition: 'transform 0.15s ease'
              }}
            />
          </div>
        </div>

        {/* Controls Deck: Buttons & Metadata */}
        <div
          className="cvp-controls-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            color: '#ffffff',
            width: '100%'
          }}
        >
          {/* Left Controls: Play/Pause, 15s Rewind, 15s Forward, Volume, Time */}
          <div
            className="cvp-left-group"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}
          >
            {/* Play/Pause Button */}
            <button
              type="button"
              className="cvp-btn-play"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pauza' : 'Ijro'}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '6px',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--figma-coral, #FA6D58)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" />
              )}
            </button>

            {/* Rewind 15s (User requested 15s) */}
            <button
              type="button"
              className="cvp-btn-rewind"
              onClick={() => handleSeekDelta(-15)}
              title="15 soniya orqaga"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              <RotateCcw size={17} />
              <span>15</span>
            </button>

            {/* Fast-forward 15s (User requested 15s) */}
            <button
              type="button"
              className="cvp-btn-forward"
              onClick={() => handleSeekDelta(15)}
              title="15 soniya oldinga"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              <RotateCw size={17} />
              <span>15</span>
            </button>

            {/* Volume Control */}
            <div
              className="cvp-volume-group"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <button
                type="button"
                className="cvp-btn-volume"
                onClick={toggleMute}
                aria-label={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isMuted ? '#ef4444' : '#ffffff',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : volume < 50 ? (
                  <Volume1 size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>

              <input
                type="range"
                className="cvp-volume-slider"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{
                  width: '60px',
                  height: '4px',
                  accentColor: 'var(--figma-coral, #FA6D58)',
                  cursor: 'pointer'
                }}
                aria-label="Ovoz balandligi"
              />
            </div>

            {/* Time display */}
            <div
              className="cvp-time-display"
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                marginLeft: '0.15rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span style={{ margin: '0 0.35rem', color: 'rgba(255,255,255,0.4)' }}>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed Selector, Next Video, Fullscreen */}
          <div
            className="cvp-right-group"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', flexShrink: 0 }}
          >
            {/* Next Video button if available */}
            {nextVideo && onNext && (
              <button
                type="button"
                className="cvp-btn-next"
                onClick={onNext}
                title={`Keyingi video: ${nextVideo.title}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--figma-coral, #FA6D58)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
              >
                <SkipForward size={20} />
              </button>
            )}

            {/* Captions / Subtitles toggle button (User requested) */}
            <button
              type="button"
              className="cvp-btn-captions"
              onClick={toggleCaptions}
              title={isCaptionsOn ? "Subtitrlar: Yoqilgan (C)" : "Subtitrlar: O‘chirilgan (C)"}
              aria-label={isCaptionsOn ? "Subtitrlar yoqilgan" : "Subtitrlar o‘chirilgan"}
              style={{
                background: isCaptionsOn ? 'rgba(250, 109, 88, 0.28)' : 'rgba(255, 255, 255, 0.12)',
                border: isCaptionsOn ? '1px solid rgba(250, 109, 88, 0.75)' : '1px solid rgba(255, 255, 255, 0.18)',
                color: isCaptionsOn ? 'var(--figma-coral, #FA6D58)' : '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isCaptionsOn) e.currentTarget.style.color = 'var(--figma-coral, #FA6D58)';
              }}
              onMouseLeave={(e) => {
                if (!isCaptionsOn) e.currentTarget.style.color = '#ffffff';
              }}
            >
              <Subtitles size={15} />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>CC</span>
            </button>

            {/* Playback speed selector */}
            <div className="cvp-btn-speed-group" style={{ position: 'relative' }}>
              <button
                type="button"
                className="cvp-btn-speed"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  minWidth: '38px',
                  textAlign: 'center'
                }}
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    right: 0,
                    backgroundColor: 'rgba(18, 18, 22, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.35rem',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    zIndex: 20
                  }}
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSetSpeed(rate)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.4rem 0.75rem',
                        backgroundColor: playbackRate === rate ? 'rgba(250, 109, 88, 0.2)' : 'transparent',
                        color: playbackRate === rate ? 'var(--figma-coral, #FA6D58)' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: playbackRate === rate ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span>{rate}x</span>
                      {playbackRate === rate && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen toggle */}
            <button
              type="button"
              className="cvp-btn-fullscreen"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Kichik ekran' : 'Katta ekran'}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--figma-coral, #FA6D58)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cvpFadeRipple {
          0% { opacity: 0; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .cvp-top-bar {
            padding: 0.65rem 0.85rem !important;
          }
          .cvp-bottom-bar {
            padding: 0.9rem 0.85rem 0.55rem !important;
            gap: 0.45rem !important;
          }
        }

        @media (max-width: 600px) {
          .cvp-top-title {
            display: none !important;
          }
          .cvp-volume-slider {
            display: none !important;
          }
          .cvp-top-bar {
            padding: 0.5rem 0.65rem !important;
          }
          .cvp-brand-text {
            font-size: 0.68rem !important;
          }
          .cvp-quality-badge {
            padding: 0.15rem 0.45rem !important;
            font-size: 0.68rem !important;
          }
          .cvp-bottom-bar {
            padding: 0.65rem 0.6rem 0.45rem !important;
            gap: 0.35rem !important;
          }
          .cvp-controls-row {
            gap: 0.35rem !important;
          }
          .cvp-left-group {
            gap: 0.45rem !important;
          }
          .cvp-right-group {
            gap: 0.45rem !important;
          }
          .cvp-time-display {
            font-size: 0.72rem !important;
            margin-left: 0 !important;
          }
          .cvp-btn-play svg {
            width: 20px !important;
            height: 20px !important;
          }
          .cvp-btn-fullscreen svg {
            width: 20px !important;
            height: 20px !important;
          }
          .cvp-btn-speed {
            padding: 0.15rem 0.4rem !important;
            font-size: 0.72rem !important;
            min-width: 36px !important;
          }
          .cvp-btn-captions {
            padding: 0.15rem 0.35rem !important;
            font-size: 0.68rem !important;
          }
        }

        @media (max-width: 480px) {
          .cvp-btn-rewind,
          .cvp-btn-forward {
            display: none !important;
          }
          .cvp-time-display {
            font-size: 0.7rem !important;
          }
          .cvp-brand-text {
            font-size: 0.65rem !important;
          }
          .cvp-left-group {
            gap: 0.35rem !important;
          }
          .cvp-btn-captions span {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
