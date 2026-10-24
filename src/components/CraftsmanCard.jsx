import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Star, MapPin, Award, Send, Phone, ArrowRight, Store, Calendar, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export const CraftsmanCard = ({ craftsman, onRequestClick }) => {
  const { t } = useLanguage();
  if (!craftsman) return null;

  // Generate next 7 days for schedule mini-strip
  const getNext7Days = () => {
    const days = [];
    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      const dayNum = d.getDate();
      days.push({ dateStr, dayName, dayNum, isToday: i === 0 });
    }
    return days;
  };

  const next7Days = getNext7Days();

  // Determine date status
  const getDateStatus = (dateStr) => {
    if (craftsman.schedule?.dates && craftsman.schedule.dates[dateStr]) {
      return craftsman.schedule.dates[dateStr];
    }
    return craftsman.schedule?.status || 'available';
  };

  const currentStatus = craftsman.schedule?.status || 'available';

  return (
    <div
      className="apple-card craftsman-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative'
      }}
    >
      {/* Top Meta Bar: Store Affiliation & Live Status */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Store Status */}
        {craftsman.store_id || (craftsman.store_name && craftsman.store_name !== 'Mustaqil Usta') ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '980px',
              backgroundColor: 'rgba(0, 113, 227, 0.08)',
              color: '#0071e3',
              border: '1px solid rgba(0, 113, 227, 0.18)'
            }}
          >
            <Store size={12} />
            <span>{craftsman.store_name || 'Do‘konga biriktirilgan'}</span>
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '980px',
              backgroundColor: 'rgba(134, 134, 139, 0.12)',
              color: '#424245',
              border: '1px solid rgba(134, 134, 139, 0.2)'
            }}
          >
            <span>🆓</span>
            <span>Free / Mustaqil Usta</span>
          </span>
        )}

        {/* Live Availability Status */}
        {currentStatus === 'busy' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '980px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
            <span>Band</span>
          </span>
        ) : currentStatus === 'partial' || currentStatus === 'tentative' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '980px',
              backgroundColor: '#ffedd5',
              color: '#c2410c',
              border: '1px solid #fdba74'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff9500' }} />
            <span>Noaniq / Kelishuv</span>
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '980px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              border: '1px solid #86efac'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34c759' }} />
            <span>Bo‘sh (Qabul qilmoqda)</span>
          </span>
        )}
      </div>

      {/* Header with Photo & Details */}
      <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to={`/craftsmen/${craftsman.id}`} style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={craftsman.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
            alt={craftsman.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(0, 113, 227, 0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          />
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
            <Star size={14} fill="#f59e0b" />
            <strong style={{ color: 'var(--text-main)' }}>{craftsman.rating || 5.0}</strong>
            <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>({craftsman.reviews_count || 24})</span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem', letterSpacing: '-0.01em' }}>
            <Link to={`/craftsmen/${craftsman.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {craftsman.name}
            </Link>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={13} color="#0071e3" />
              {craftsman.experience_years} yil tajriba
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} color="#0071e3" />
              {craftsman.location}
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Public Availability Calendar Strip */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} color="#0071e3" /> Ish Jadvali (Keyingi 7 kun):
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>
            🟢 Bo‘sh &nbsp; 🔴 Band &nbsp; 🟠 Noaniq
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
          {next7Days.map((d) => {
            const status = getDateStatus(d.dateStr);
            const isAvail = status === 'available';
            const isBusy = status === 'busy';
            const dotColor = isAvail ? '#34c759' : isBusy ? '#ff3b30' : '#ff9500';
            const bgTint = isAvail ? 'rgba(52, 199, 89, 0.12)' : isBusy ? 'rgba(255, 59, 48, 0.12)' : 'rgba(255, 149, 0, 0.12)';

            return (
              <div
                key={d.dateStr}
                title={`${d.dateStr}: ${isAvail ? 'Bo‘sh' : isBusy ? 'Band' : 'Noaniq'}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.35rem 0.15rem',
                  borderRadius: '8px',
                  backgroundColor: bgTint,
                  border: d.isToday ? `1.5px solid ${dotColor}` : '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)' }}>{d.dayName}</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)', margin: '1px 0' }}>{d.dayNum}</span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    marginTop: '2px'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Body: Bio & Specializations */}
      <div style={{ padding: '1.15rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {craftsman.bio}
          </p>

          {/* Specialization Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {craftsman.specializations?.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '980px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Portfolio Thumbnails */}
          {craftsman.portfolio?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Namunaviy Ishlar:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                {craftsman.portfolio.slice(0, 3).map((item, i) => (
                  <img
                    key={i}
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '58px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Actions (Apple Styled Buttons) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
          <Link
            to={`/craftsmen/${craftsman.id}`}
            style={{
              flex: '1 1 120px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              backgroundColor: '#0071e3',
              color: '#ffffff',
              borderRadius: '980px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Portfolioni Ko‘rish</span>
            <ArrowRight size={14} />
          </Link>

          {craftsman.phone && (
            <a
              href={`tel:${craftsman.phone}`}
              title="Qo‘ng‘iroq qilish"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0071e3',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Phone size={15} />
            </a>
          )}

          {craftsman.telegram && (
            <a
              href={`https://t.me/${craftsman.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              title="Telegram orqali bog‘lanish"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 136, 204, 0.1)',
                border: '1px solid rgba(0, 136, 204, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0088cc',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={15} />
            </a>
          )}

          <button
            type="button"
            onClick={() => (onRequestClick ? onRequestClick(craftsman) : null)}
            style={{
              padding: '0.65rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              borderRadius: '980px',
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Buyurtma
          </button>
        </div>
      </div>
    </div>
  );
};
