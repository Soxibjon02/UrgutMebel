import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Check, Phone, Mail, MapPin } from 'lucide-react';

export const ContactPage = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Iltimos, barcha maydonlarni to‘ldiring!', 'warning');
      return;
    }
    setLoading(true);
    try {
      await dataService.createContactMessage({
        full_name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || settings.phone || '+998 90 123 45 67',
        subject: 'Figma Contact Form',
        message: message.trim()
      });
      setSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      addToast('Xabaringiz qabul qilindi! Tez orada mutaxassisimiz javob beradi.', 'success');
    } catch (err) {
      console.error('Error saving contact message:', err);
      addToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh', padding: '2rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Figma Split Hero & Contact Form */}
        <div className="figma-split-hero">
          {/* Left: Clean Visual Area (Showroom / Workshop Photo) */}
          <div
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '380px',
              position: 'relative'
            }}
          >
            {/* Subtle Overlay with Showroom Info */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                color: '#FFFFFF'
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                {settings.site_name || 'Urgut Mebel Markazi'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                {settings.address || 'Urgut, Dehqonobod ko‘chasi, 12-uy'}
              </p>
            </div>
          </div>

          {/* Right: Exact Figma Contact Form */}
          <div
            style={{
              padding: '4.5rem 3.5rem',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <span
              style={{
                color: 'var(--figma-coral)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.75rem',
                display: 'block'
              }}
            >
              {t('contact.title', 'Biz bilan Bog‘lanish')}
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 1rem',
                lineHeight: 1.15
              }}
            >
              {t('contact.send_message', 'Xabar Yuborish')}
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '2.5rem'
              }}
            >
              {t('contact.subtitle', 'Savollaringiz bormi? Mutaxassislarimiz har doim yordam berishga tayyor.')}
            </p>

            {sent ? (
              <div
                style={{
                  backgroundColor: 'rgba(250, 109, 88, 0.1)',
                  border: '1px solid rgba(250, 109, 88, 0.25)',
                  padding: '1.75rem',
                  borderRadius: '4px',
                  color: 'var(--figma-coral)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  <Check size={22} /> {t('common.message_sent_success', 'Xabaringiz muvaffaqiyatli yetkazildi!')}
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('common.reply_soon', 'Mutaxassislarimiz qisqa vaqt ichida siz bilan bog‘lanishadi.')}
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-figma-coral"
                  style={{ marginTop: '1.25rem', padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}
                >
                  {t('common.send_another_message', 'Yana xabar yozish')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('contact.your_name', 'Ismingiz')}
                    required
                    className="figma-input"
                    aria-label="Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@abcdef.com"
                    required
                    className="figma-input"
                    style={{ borderColor: 'var(--figma-coral)' }}
                    aria-label="Email"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('contact.your_message', 'Xabaringiz...')}
                    required
                    className="figma-input"
                    style={{ resize: 'vertical' }}
                    aria-label="Message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-figma-dark"
                  style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                >
                  {loading ? '...' : t('contact.send_btn', 'Xabarni Yuborish')}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
