import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { CraftsmanRequestModal } from '../components/CraftsmanRequestModal';
import {
  Star,
  MapPin,
  Award,
  Phone,
  Send,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Calendar,
  Store,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const CraftsmanDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [craftsman, setCraftsman] = useState(null);
  const [craftsmanProducts, setCraftsmanProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCraftsmanAndProducts = async () => {
      try {
        const found = await dataService.getCraftsmanById(id);
        setCraftsman(found);
        if (found) {
          const prods = await dataService.getProductsByCraftsman(found.id);
          setCraftsmanProducts(prods || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCraftsmanAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Usta profili va portfoliosi yuklanmoqda...</p>
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>{t('common.not_found', 'Usta topilmadi')}</h2>
        <Link to="/craftsmen" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {t('craftsmen.title', 'Ustalar katalogiga qaytish')}
        </Link>
      </div>
    );
  }

  // Generate 14-day schedule
  const getNext14Days = () => {
    const days = [];
    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      const dayNum = d.getDate();
      const monthName = monthNames[d.getMonth()];
      days.push({ dateStr, dayName, dayNum, monthName, isToday: i === 0 });
    }
    return days;
  };

  const next14Days = getNext14Days();

  const getDateStatus = (dateStr) => {
    if (craftsman.schedule?.dates && craftsman.schedule.dates[dateStr]) {
      return craftsman.schedule.dates[dateStr];
    }
    return craftsman.schedule?.status || 'available';
  };

  const currentStatus = craftsman.schedule?.status || 'available';

  return (
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: 'var(--bg-primary)', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Back Link */}
        <Link
          to="/craftsmen"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#0071e3',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} /> {t('craftsmen.title', 'Barcha ustalarga qaytish')}
        </Link>

        {/* Profile Header Apple Cupertino Card */}
        <div
          className="apple-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Status & Affiliation Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.75rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Store affiliation badge */}
            {craftsman.store_id || (craftsman.store_name && craftsman.store_name !== 'Mustaqil Usta') ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '980px',
                  backgroundColor: 'rgba(0, 113, 227, 0.08)',
                  color: '#0071e3',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid rgba(0, 113, 227, 0.2)'
                }}
              >
                <Store size={15} />
                <span>Do‘kon a’zosi: <strong>{craftsman.store_name}</strong></span>
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '980px',
                  backgroundColor: 'rgba(134, 134, 139, 0.1)',
                  color: '#424245',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid rgba(134, 134, 139, 0.2)'
                }}
              >
                <span>🆓</span>
                <span>Mustaqil Usta (Free / Shaxsiy ustaxona)</span>
              </div>
            )}

            {/* Current schedule status badge */}
            {currentStatus === 'busy' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '980px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid #fca5a5'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
                <span>Band (Buyurtmada ishlamoqda)</span>
              </span>
            ) : currentStatus === 'partial' || currentStatus === 'tentative' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '980px',
                  backgroundColor: '#ffedd5',
                  color: '#c2410c',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid #fdba74'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9500' }} />
                <span>Noaniq / Kelishuv asosida</span>
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '980px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid #86efac'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34c759' }} />
                <span>Bo‘sh (Yangi buyurtma qabul qilmoqda)</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={craftsman.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
              alt={craftsman.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(0, 113, 227, 0.25)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}
            />

            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', marginBottom: '0.35rem' }}>
                <Star size={18} fill="#f59e0b" />
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{craftsman.rating || 5.0}</strong>
                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>({craftsman.reviews_count || 32} baho)</span>
              </div>

              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {craftsman.name}
              </h1>

              <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={16} color="#0071e3" />
                  {craftsman.experience_years} {t('craftsmen.experience', 'yillik tajriba')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} color="#0071e3" />
                  {craftsman.location}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {craftsman.specializations?.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '980px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Apple Pill Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: '240px' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#0071e3',
                  color: '#ffffff',
                  borderRadius: '980px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(0, 113, 227, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={16} />
                <span>Buyurtma Berish</span>
              </button>

              {craftsman.phone && (
                <a
                  href={`tel:${craftsman.phone}`}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    borderRadius: '980px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Phone size={15} color="#0071e3" />
                  <span>{craftsman.phone}</span>
                </a>
              )}

              {craftsman.telegram && (
                <a
                  href={`https://t.me/${craftsman.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'rgba(0, 136, 204, 0.1)',
                    color: '#0088cc',
                    borderRadius: '980px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: '1px solid rgba(0, 136, 204, 0.25)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Send size={15} />
                  <span>Telegram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 14-Day Interactive Schedule & Availability Calendar (Apple Cupertino Style) */}
        <div
          className="apple-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar color="#0071e3" size={20} />
                <span>Usta Ish Jadvali (14 Kunlik Bandlik)</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
                Har bir sanaga qarab usta band yoki bo‘sh ekanligini bilib, buyurtma vaqtingizni qulay rejalashtiring.
              </p>
            </div>

            {/* Color Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', fontWeight: 700 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#15803d' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34c759' }} /> Bo‘sh
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff3b30' }} /> Band
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#c2410c' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9500' }} /> Noaniq / Kelishuv
              </span>
            </div>
          </div>

          {/* 14-Day Calendar Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))',
              gap: '0.65rem',
              marginBottom: '1.5rem'
            }}
          >
            {next14Days.map((d) => {
              const status = getDateStatus(d.dateStr);
              const isAvail = status === 'available';
              const isBusy = status === 'busy';
              const color = isAvail ? '#34c759' : isBusy ? '#ff3b30' : '#ff9500';
              const bgColor = isAvail ? 'rgba(52, 199, 89, 0.1)' : isBusy ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 149, 0, 0.1)';
              const statusText = isAvail ? 'Bo‘sh' : isBusy ? 'Band' : 'Noaniq';

              return (
                <div
                  key={d.dateStr}
                  title={`${d.dateStr}: ${statusText}`}
                  style={{
                    backgroundColor: bgColor,
                    border: d.isToday ? `2px solid ${color}` : `1px solid ${color}33`,
                    borderRadius: '16px',
                    padding: '0.75rem 0.35rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {d.isToday && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        backgroundColor: color,
                        color: '#fff',
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        padding: '0 0.35rem',
                        borderRadius: '980px',
                        lineHeight: '14px'
                      }}
                    >
                      BUGUN
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{d.dayName}</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>{d.dayNum}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>{d.monthName}</span>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: color
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Working Hours Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Ish Soatlari
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {craftsman.schedule?.working_hours || '08:30 - 18:30'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Haftalik Ish Kunlari
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {craftsman.schedule?.days || 'Dushanba - Shanba'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                Qo‘shimcha Ma’lumot
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {craftsman.schedule?.busy_notes || 'Oldindan telefon orqali band qilib qo‘yishingiz mumkin.'}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: CRAFTSMAN'S PERSONAL FURNITURE PRODUCTS (E'LONLAR VA MAHSULOTLAR) */}
        <div
          className="apple-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ustaning Shaxsiy Portfoliosi
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0 0', letterSpacing: '-0.01em' }}>
                🔨 {craftsman.name} Yasagan Mebellar & E‘lonlar ({craftsmanProducts.length})
              </h2>
            </div>
            <Link
              to="/custom-order"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0071e3',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Shu ustaga shaxsiy loyiha buyurtma qilish</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {craftsmanProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {craftsmanProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                    <img
                      src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {prod.discount_price && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#ff3b30',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '980px'
                        }}
                      >
                        Chegirma
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.2rem' }}>
                        {prod.store_name || craftsman.store_name || 'Usta shaxsiy mahsuloti'}
                      </div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {prod.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0071e3', fontWeight: 800 }}>
                          {(prod.discount_price || prod.price)?.toLocaleString()} so‘m
                        </strong>
                        {prod.discount_price && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                            {prod.price?.toLocaleString()} so‘m
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/furniture/${prod.id}`}
                      style={{
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: '#0071e3',
                        color: '#ffffff',
                        borderRadius: '980px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'block'
                      }}
                    >
                      Batafsil ko‘rish
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px dashed rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪵</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                Hozircha do‘konga biriktirilgan mahsulot e’lonlari yuklanmagan
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
                Usta tomonidan tayyorlangan namunalarni quyidagi portfolio bo‘limida ko‘rishingiz yoki maxsus buyurtma yuborishingiz mumkin.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: '#0071e3',
                  color: '#ffffff',
                  borderRadius: '980px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Ushbu Ustaga Buyurtma Berish
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div
          className="apple-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem'
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem' }}>
            Usta Haqida Batafsil
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.98rem', margin: 0 }}>
            {craftsman.bio}
          </p>
        </div>

        {/* Services & Price Estimates */}
        <div
          className="apple-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: '2.5rem'
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🛠️</span> Taklif Qilinadigan Duradgorlik Xizmatlari
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {(craftsman.services?.length > 0 ? craftsman.services : [
              { name: "Uy mebellarini ta'mirlash", price: "Kelishuv asosida", desc: "Siniq eshik, ilgaklar, mebel mexanizmi, stul va shkaflarni sozlash" },
              { name: "Mebellarni ko'chirish va montaj", price: "Xonadonga qarab", desc: "Mebellarni xavfsiz ko'chirish, yechish va yangi uyda sifatli qayta yig'ib berish" },
              { name: "Yangi mebel yasash", price: "O‘lchamga qarab", desc: "Mijoz xohishi va o'lchamlari bo'yicha hashamatli shaxsiy mebellar" },
              { name: "Mebel restavratsiyasi", price: "Kelishuv asosida", desc: "Eski sifatli yog'och mebellarni qayta silliqlash, loklash va yangilash" }
            ]).map((srv, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{srv.name}</h3>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0071e3', margin: '0 0 0.4rem' }}>
                  {srv.price}
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Gallery */}
        {craftsman.portfolio?.length > 0 && (
          <div
            className="apple-card"
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1.5rem' }}>
              Portfolio (Bajarilgan Namunaviy Ishlar Fotogalereyasi)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {craftsman.portfolio.map((item, idx) => (
                <div key={idx} style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>{item.title}</h4>
                    {item.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <CraftsmanRequestModal
          craftsman={craftsman}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
