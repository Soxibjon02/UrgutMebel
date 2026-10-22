import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Send, Calendar, Phone, User, CheckCircle2, ShieldAlert } from 'lucide-react';

import { dataService } from '../services/dataService';

export const CraftsmanRequestModal = ({ craftsman, isOpen, onClose }) => {
  const { user, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();
  const { t } = useLanguage();

  const [serviceType, setServiceType] = useState('Uy jihozlarini ta\'mirlash');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !craftsman) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGuest || !user) {
      openAuthModal('login', 'Ustaga buyurtma yuborish faqatgina oddiy mijozlar uchun! Tizimga kiring yoki ro‘yxatdan o‘ting.');
      return;
    }

    if (user.role !== 'customer') {
      const roleTitle = user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Menedjer' : 'Usta';
      addToast(`Ustaga buyurtma berish faqatgina oddiy mijozlar uchun ruxsat etilgan! Xodimlar (${roleTitle}) hisobidan buyurtma berilmaydi.`, 'error');
      return;
    }

    try {
      await dataService.createCraftsmanRequest({
        craftsman_id: craftsman.id,
        craftsman_name: craftsman.name,
        customer_name: fullName,
        customer_phone: phone,
        customer_telegram: user?.telegram || null,
        furniture_type: serviceType,
        description: message,
        preferred_date: preferredDate || null,
        status: 'NEW'
      });
    } catch (err) {
      console.warn('Error saving craftsman request:', err);
      addToast(err.message || 'Xatolik yuz berdi', 'error');
      return;
    }

    setSubmitted(true);
    addToast(`Buyurtma ${craftsman.name}ga muvaffaqiyatli yetkazildi! Usta tez orada siz bilan bog‘lanadi.`, 'success');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {t('checkout.order_success', 'Buyurtmangiz Qabul Qilindi!')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {t('custom_order.request_sent', 'Usta tez orada siz bilan bog‘lanadi.')}
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--wood-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('custom_order.title', 'Shaxsiy Buyurtma va Bog‘lanish')}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {craftsman.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {t('craftsmen.subtitle', 'Usta bilan to‘g‘ridan-to‘g‘ri bog‘laning')}
              </p>
            </div>

            {/* Craftsman Availability Banner */}
            <div
              style={{
                backgroundColor: craftsman.schedule?.status === 'busy' ? '#fef2f2' : 'var(--bg-secondary)',
                border: craftsman.schedule?.status === 'busy' ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {craftsman.schedule?.status === 'busy' ? '🔴 Ayni paytda band' : craftsman.schedule?.status === 'partial' ? '🟡 Qisman band' : '🟢 Bo‘sh — Buyurtmaga tayyor'}
                </span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                  🕒 {craftsman.schedule?.working_hours || '08:30 - 18:30'}
                </span>
              </div>
              {craftsman.schedule?.busy_notes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                  <strong>Izoh:</strong> {craftsman.schedule.busy_notes}
                </div>
              )}
            </div>

            {user && user.role !== 'customer' && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.95rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  lineHeight: 1.4
                }}
              >
                <ShieldAlert size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Siz <strong>{user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Menedjer' : 'Usta'}</strong> hisobidasiz.
                  Chalkashliklarning oldini olish uchun faqatgina <strong>oddiy mijozlar</strong> ustaga buyurtma bera oladi.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('custom_order.furniture_type', 'Xizmat Turi *')}</label>
                <select
                  className="form-select"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                >
                  <option value="Uy mebellari va jihozlarini ta'mirlash">🛠️ {t('craftsmen.service_repair', 'Uy mebellari va jihozlarini ta\'mirlash')}</option>
                  <option value="Mebellarni ko'chirish, demontaj va montaj (yig'ish)">🚚 {t('craftsmen.service_assembly', 'Mebellarni ko\'chirish, demontaj va montaj')}</option>
                  <option value="Yangi mebel yasash (shaxsiy buyurtma)">🪚 {t('craftsmen.service_custom', 'Yangi mebel yasash (shaxsiy buyurtma)')}</option>
                  <option value="Mebel restavratsiyasi va yangilash">✨ {t('craftsmen.service_restore', 'Mebel restavratsiyasi va yangilash')}</option>
                  <option value="Boshqa duradgorlik xizmati">📦 {t('common.other', 'Boshqa duradgorlik xizmati')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('checkout.full_name', 'Ismingiz')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('contact.your_name', 'Ismingiz va familiyangiz')}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('checkout.phone', 'Telefon Raqamingiz')}</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('custom_order.preferred_date', 'Kutilayotgan Muddati (Ixtiyoriy)')}</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('custom_order.dimensions', 'Mebel Talablari va Tavsifi')}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('custom_order.dimensions', 'Qanday mebel yasatmoqchisiz?')}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={user && user.role !== 'customer'}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  opacity: (user && user.role !== 'customer') ? 0.6 : 1,
                  cursor: (user && user.role !== 'customer') ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={16} />
                <span>{user && user.role !== 'customer' ? t('common.customers_only_order', 'Xodim hisobidan buyurtma taqiqlangan') : t('craftsmen.order_now', 'Ustaga Yuborish')}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
