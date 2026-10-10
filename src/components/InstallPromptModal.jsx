import React, { useState, useEffect } from 'react';
import { usePwa } from '../context/PwaContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import {
  Download,
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Sparkles,
  Share,
  PlusSquare,
  Zap,
  Bell,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const InstallPromptModal = () => {
  const { isInstalled, isInstallable, platform, installApp, setIsInstalledManual } = usePwa();
  const { settings } = useSettings();
  const { addToast } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Agar ilova allaqachon o'rnatilgan bo'lsa, taklif etilmaydi
    if (isInstalled) return;

    // Web sahifaga birinchi marta kirganda (first visit) tekshirish
    const hasSeenPrompt = localStorage.getItem('urgut_install_prompt_first_visit');

    if (!hasSeenPrompt) {
      // 1.5 soniyadan keyin birinchi marta kirgan foydalanuvchiga modal ko'rsatiladi
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  // Global event orqali istalgan joydan ochish imkoniyati (masalan, tugma bosilganda)
  useEffect(() => {
    const handleOpenTrigger = () => {
      setIsOpen(true);
      setShowInstructions(false);
    };
    window.addEventListener('open-urgut-install-modal', handleOpenTrigger);
    return () => window.removeEventListener('open-urgut-install-modal', handleOpenTrigger);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Birinchi marta ko'rsatilganini saqlab qo'yamiz
    localStorage.setItem('urgut_install_prompt_first_visit', 'true');
  };

  const handleInstall = async () => {
    setInstalling(true);
    try {
      const result = await installApp();
      if (result?.success) {
        setInstalledSuccess(true);
        addToast(result.message || "Ilova muvaffaqiyatli o‘rnatildi!", "success");
        setTimeout(() => {
          handleClose();
        }, 2500);
      } else if (result?.instruction) {
        setInstructionText(result.instruction);
        setShowInstructions(true);
      } else {
        // Fallback platform instructions
        if (platform === 'ios') {
          setInstructionText("iOS Safari: Pastdagi 'Ulashish' (Share) tugmasini bosing va 'Bosh ekranga qo‘shish' (Add to Home Screen) bandini tanlang.");
        } else if (platform === 'desktop') {
          setInstructionText("Kompyuterda: Brauzer manzil qatori (URL bar) o‘ng tomonida joylashgan 'O‘rnatish' (Install) belgisini bosing.");
        } else {
          setInstructionText("Brauzer menyusidan (3 nuqta) 'Ilovani o‘rnatish' yoki 'Bosh ekranga qo‘shish' bandini tanlang.");
        }
        setShowInstructions(true);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
      setShowInstructions(true);
    } finally {
      setInstalling(false);
    }
  };

  if (!isOpen || isInstalled) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{
        zIndex: 99999,
        backgroundColor: 'rgba(12, 10, 9, 0.72)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          border: '1.5px solid rgba(194, 109, 46, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(194, 109, 46, 0.15)',
          overflow: 'hidden',
          animation: 'slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Decorative ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194, 109, 46, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: '1.1rem',
            right: '1.1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
        >
          <X size={18} />
        </button>

        {installedSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Ilova Muvaffaqiyatli O‘rnatildi!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Endi Urgut Mebel Markaziga bosh ekrandagi belgi orqali bir zumda kirishingiz mumkin.
            </p>
          </div>
        ) : (
          <>
            {/* Header / App Icon Branding */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  background: 'var(--bg-secondary)',
                  border: '2px solid rgba(194, 109, 46, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 24px rgba(194, 109, 46, 0.35)',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                <img
                  src={settings.logo_url || '/pwa-icon.svg'}
                  alt={settings.site_name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/pwa-icon.svg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                >
                  APP
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--wood-amber)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.4rem'
                }}
              >
                <Sparkles size={14} /> Rasmiy Mobil Ilova
              </div>

              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.4rem',
                  lineHeight: 1.25
                }}
              >
                Urgut Mebel Ilovasini O‘rnating!
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  maxWidth: '360px',
                  margin: '0 auto'
                }}
              >
                Saytdan tezkor va qulay foydalanish uchun ilovani telefoningiz yoki kompyuteringiz bosh ekraniga qo‘shing.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <Zap size={16} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <span>10x tezroq yuklanish</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <Smartphone size={16} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <span>Bosh ekranda qulay</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <Bell size={16} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <span>Chegirma va aksiyalar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <ShieldCheck size={16} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <span>Oflayn rejimda ishlash</span>
              </div>
            </div>

            {/* Specific Instructions for iOS or manual browsers */}
            {showInstructions && (
              <div
                style={{
                  backgroundColor: 'rgba(194, 109, 46, 0.08)',
                  border: '1px solid rgba(194, 109, 46, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: 'var(--text-main)'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--wood-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Share size={16} /> Qo‘lda o‘rnatish usuli:
                </div>
                {platform === 'ios' ? (
                  <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>Safari brauzerida pastdagi <strong>Ulashish (Share)</strong> belgisini bosing.</li>
                    <li>Menyuni pastga surib, <strong>«Bosh ekranga qo‘shish» (Add to Home Screen)</strong> bandini tanlang.</li>
                    <li>Yuqori o‘ng burchakdagi <strong>«Qo‘shish» (Add)</strong> tugmasini bosing.</li>
                  </ol>
                ) : (
                  <p style={{ margin: 0 }}>
                    {instructionText || "Brauzeringiz menyusini oching (yuqori o‘ngdagi 3 nuqta) va «Ilovani o‘rnatish» yoki «Bosh ekranga qo‘shish» tugmasini bosing."}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleInstall}
                disabled={installing}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  boxShadow: '0 6px 20px rgba(194, 109, 46, 0.35)'
                }}
              >
                <Download size={19} />
                <span>{installing ? 'O‘rnatilmoqda...' : 'Ilovani O‘rnatish'}</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}
              >
                Keyinroq
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
