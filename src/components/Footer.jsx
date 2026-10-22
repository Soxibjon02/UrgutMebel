import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react';

export const Footer = () => {
  const { addToast } = useNotification();
  const { t, language } = useLanguage();
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes('@')) {
      addToast(language === 'ru' ? 'Введите корректный email!' : language === 'en' ? 'Please enter a valid email!' : 'Iltimos, to‘g‘ri elektron pochta manzilini kiriting!', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await dataService.subscribeNewsletter(subEmail, subName || 'Mijoz');
      setSubscribed(true);
      setSubName('');
      setSubEmail('');
      addToast(t('footer.subscribed_success', 'Rahmat! Siz muvaffaqiyatli obuna bo‘ldingiz.'), 'success');
    } catch (err) {
      addToast(language === 'ru' ? 'Произошла ошибка, попробуйте снова.' : language === 'en' ? 'An error occurred, please try again.' : 'Xatolik yuz berdi, qaytadan urinib ko‘ring.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const smoothScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '5rem 0 2.5rem',
        transition: 'background-color 0.25s ease, color 0.25s ease'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 4 Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4.5rem'
          }}
        >
          {/* Col 1: Helpful Links */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1.6rem',
                letterSpacing: '-0.01em'
              }}
            >
              {t('footer.quick_links', 'Helpful Links')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <Link to="/about" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.about', 'About us')}
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('footer.features_delivery_title', 'Delivery & Returns Policy')}
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.faq', 'Help & FAQ')}
                </Link>
              </li>
              <li>
                <Link to="/custom-order" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.custom_order', 'Service for professionals')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories / Services */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1.6rem',
                letterSpacing: '-0.01em'
              }}
            >
              {t('nav.categories', 'Collection & Blog')}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <Link to="/furniture" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.furniture', 'Furniture Catalog')}
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.blog', 'Magazine & Interior Tips')}
                </Link>
              </li>
              <li>
                <Link to="/craftsmen" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.craftsmen', 'Master Craftsmen')}
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={smoothScrollToTop} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                  {t('nav.contact', 'Contact Us')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1.6rem',
                letterSpacing: '-0.01em'
              }}
            >
              {t('contact.title', 'Contact info')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  Urgut (Samarqand)
                </strong>
                <p style={{ margin: 0 }}>Dehqonobod ko‘chasi, 12-uy</p>
                <p style={{ margin: 0 }}>Samarqand viloyati, Urgut</p>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>+998 90 123 45 67</p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                  {language === 'ru' ? 'Ташкентский филиал' : language === 'en' ? 'Tashkent Branch' : 'Toshkent filiali'}
                </strong>
                <p style={{ margin: 0 }}>Chilonzor 9-mavze, 45-bino</p>
                <p style={{ margin: 0 }}>Toshkent shahri</p>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>info@urgutmebel.uz</p>
              </div>
            </div>
          </div>

          {/* Col 4: Sign Up Now Form */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1.6rem',
                letterSpacing: '-0.01em'
              }}
            >
              {t('footer.join_newsletter_title', 'Sign Up Now')}
            </h4>

            {subscribed ? (
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  padding: '1.25rem',
                  borderRadius: '2px',
                  color: 'var(--figma-coral)',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Check size={18} /> {t('footer.subscribed_success', 'Muvaffaqiyatli obuna bo‘ldingiz!')}
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t('footer.join_newsletter_desc', 'Yangi chegirmalar va yangiliklar pochtangizga yuboriladi.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <input
                    type="text"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder={t('contact.your_name', 'Name')}
                    className="figma-input-underline"
                    aria-label="Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder={t('footer.enter_email', 'Email')}
                    required
                    className="figma-input-underline"
                    aria-label="Email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-figma-coral"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {submitting ? '...' : t('footer.subscribe_btn', 'SIGN UP NOW')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-light)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} urgutmebel.uz. {t('footer.rights_reserved', 'All rights reserved.')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              aria-label="Facebook"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
              aria-label="Twitter"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
              aria-label="Instagram"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
