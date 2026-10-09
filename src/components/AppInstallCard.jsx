import React, { useState } from 'react';
import { usePwa } from '../context/PwaContext';
import { useNotification } from '../context/NotificationContext';
import {
  Smartphone,
  Laptop,
  Download,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Bell
} from 'lucide-react';

export const AppInstallCard = () => {
  const { isInstalled, platform, installApp, setIsInstalledManual } = usePwa();
  const { addToast } = useNotification();
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [instructionText, setInstructionText] = useState('');

  const handleInstallClick = async () => {
    const result = await installApp();
    if (result?.success) {
      addToast(result.message || "Ilova muvaffaqiyatli o‘rnatildi!", "success");
    } else if (result?.instruction) {
      setInstructionText(result.instruction);
      setInstructionOpen(true);
      addToast("Ilovani o‘rnatish yo‘riqnomasi ko‘rsatildi", "info");
    }
  };

  return (
    <div
      style={{
        marginTop: '3.5rem',
        borderRadius: 'var(--radius-xl)',
        background: isInstalled
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 148, 136, 0.04) 100%)'
          : 'linear-gradient(135deg, rgba(194, 109, 46, 0.1) 0%, rgba(212, 163, 89, 0.05) 100%)',
        border: isInstalled
          ? '1.5px solid rgba(16, 185, 129, 0.3)'
          : '1.5px solid rgba(194, 109, 46, 0.25)',
        padding: '2rem 1.75rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)'
      }}
      className="glass-card"
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: isInstalled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(194, 109, 46, 0.15)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: isInstalled ? 'rgba(16, 185, 129, 0.18)' : 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isInstalled ? '#10b981' : '#ffffff',
                boxShadow: isInstalled ? 'none' : '0 6px 18px rgba(194, 109, 46, 0.35)',
                flexShrink: 0
              }}
            >
              {isInstalled ? (
                <CheckCircle2 size={32} />
              ) : platform === 'desktop' ? (
                <Laptop size={28} />
              ) : (
                <Smartphone size={28} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {isInstalled ? "Ilova o‘rnatilgan" : "Urgut Mebel Markazi Ilovasi"}
                </h3>
                {isInstalled && (
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    Faol & Tayyor
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', maxWidth: '640px', lineHeight: 1.5 }}>
                {isInstalled
                  ? "Urgut Mebel Markazi ilovasi qurilmangizga muvaffaqiyatli o‘rnatilgan. Bosh ekrandan yoki ilovalar menyusidan bir bosishda ochib foydalanishingiz mumkin."
                  : "Ilovani mobil telefoningiz yoki shaxsiy kompyuteringizga o‘rnatib oling. Brauzersiz, tezkor va internetni tejagan holda foydalaning."}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {isInstalled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.92rem' }}>
                <CheckCircle2 size={18} />
                <span>Qurilma bilan sinxron</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(194, 109, 46, 0.35)'
                }}
              >
                <Download size={18} />
                <span>Ilovani O‘rnatish</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Highlights when not yet installed */}
        {!isInstalled && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <Zap size={16} color="var(--wood-amber)" />
              <span>Bir zumda ochilish & offline rejim</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <Bell size={16} color="var(--wood-amber)" />
              <span>Yangi mebellar va chegirmalar xabari</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <ShieldCheck size={16} color="var(--wood-amber)" />
              <span>Xavfsiz va qulay buyurtma nazorati</span>
            </div>
          </div>
        )}

        {/* Instruction Popup / Dropdown if browser doesn't trigger automated prompt */}
        {instructionOpen && !isInstalled && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              fontSize: '0.86rem',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginTop: '0.5rem',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <Info size={18} color="var(--wood-amber)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>O‘rnatish yo‘riqnomasi:</div>
              <div>{instructionText}</div>
            </div>
            <button
              type="button"
              onClick={() => setInstructionOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              Tushunarli
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
