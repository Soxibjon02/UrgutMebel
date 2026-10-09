import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { dataService } from '../services/dataService';
import { Sparkles, Phone, Mail, MapPin, Send, Globe, ShieldCheck, Truck, Clock, ChevronRight } from 'lucide-react';

export const Footer = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await dataService.getCategories();
        if (cats && cats.length) {
          setCategories(cats.slice(0, 8)); // eng sara 8 ta bo'lim
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
    const handleUpdate = () => loadCategories();
    window.addEventListener('urgut_store_categories_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_categories_updated', handleUpdate);
  }, []);

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="site-footer">
      {/* 3 Asosiy Afzallik Kartalari (Ixcham va Chiroyli) */}
      <div className="footer-features-section">
        <div className="container">
          <div className="footer-features-grid">
            <div className="footer-feature-item">
              <div className="footer-feature-icon">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="footer-feature-title">
                  {settings.feature1_title || "Tezkor Yetkazib Berish"}
                </h4>
                <p className="footer-feature-desc">
                  {settings.feature1_desc || "O‘zbekiston bo‘ylab ehtiyotkor yetkazish va yig‘ib berish"}
                </p>
              </div>
            </div>

            <div className="footer-feature-item">
              <div className="footer-feature-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="footer-feature-title">
                  {settings.feature2_title || "Rasmiy Kafolat"}
                </h4>
                <p className="footer-feature-desc">
                  {settings.feature2_desc || "Har bir mebel mahsulotiga uzoq muddatli sifat kafolati"}
                </p>
              </div>
            </div>

            <div className="footer-feature-item">
              <div className="footer-feature-icon">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="footer-feature-title">
                  {settings.feature3_title || "Urgut Duradgorlari"}
                </h4>
                <p className="footer-feature-desc">
                  {settings.feature3_desc || "Asriy hunarmandchilik tajribasi va zamonaviy texnologiya"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asosiy Havolalar & Ma'lumotlar */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div className="footer-columns-grid">
          
          {/* 1. Brend & Ijtimoiy tarmoqlar */}
          <div className="footer-brand-col">
            <Link to="/" onClick={smoothScrollToTop} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', textDecoration: 'none' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  background: 'var(--gold-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(194, 109, 46, 0.3)'
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                {settings.site_name}
              </h3>
            </Link>

            <p style={{ color: '#a8a29e', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {settings.footer_about || "Urgutning mohir ustalari tomonidan tayyorlangan zamonaviy, didli va uzoq yillik xizmat qiluvchi saralangan mebellar markazi."}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {settings.telegram && (
                <a
                  href={`https://t.me/${settings.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                  className="footer-social-btn"
                >
                  <Send size={15} />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="footer-social-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              <Link to="/contact" onClick={smoothScrollToTop} className="footer-social-btn" title="Vebsayt & Manzil">
                <Globe size={15} />
              </Link>
            </div>
          </div>

          {/* 2. Mebel Bo'limlari (Dinamik Admin Kategoriyalari) */}
          <div>
            <h4 className="footer-heading">
              Mebel Bo‘limlari
            </h4>
            <ul className="footer-nav-list">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/furniture?category=${cat.id}`}
                      onClick={smoothScrollToTop}
                      className="footer-nav-link"
                    >
                      <ChevronRight size={13} className="footer-link-chevron" />
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/furniture?category=mehmonxona" onClick={smoothScrollToTop} className="footer-nav-link"><ChevronRight size={13} className="footer-link-chevron" />Mehmonxona Mebellari</Link></li>
                  <li><Link to="/furniture?category=yotoqxona" onClick={smoothScrollToTop} className="footer-nav-link"><ChevronRight size={13} className="footer-link-chevron" />Yotoqxona To‘plamlari</Link></li>
                  <li><Link to="/furniture?category=oshxona" onClick={smoothScrollToTop} className="footer-nav-link"><ChevronRight size={13} className="footer-link-chevron" />Oshxona Garniturlari</Link></li>
                  <li><Link to="/furniture?category=ofis" onClick={smoothScrollToTop} className="footer-nav-link"><ChevronRight size={13} className="footer-link-chevron" />Ofis va Ish Stollari</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* 3. Foydali Havolalar */}
          <div>
            <h4 className="footer-heading">
              Xizmatlar
            </h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/custom-order" onClick={smoothScrollToTop} className="footer-nav-link highlight-link">
                  <Sparkles size={14} color="var(--wood-amber)" />
                  <span>Maxsus O‘lchamda Buyurtma</span>
                </Link>
              </li>
              <li>
                <Link to="/craftsmen" onClick={smoothScrollToTop} className="footer-nav-link">
                  <ChevronRight size={13} className="footer-link-chevron" />
                  <span>Urgut Ustalari Katalogi</span>
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={smoothScrollToTop} className="footer-nav-link">
                  <ChevronRight size={13} className="footer-link-chevron" />
                  <span>Biz Haqimizda</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={smoothScrollToTop} className="footer-nav-link">
                  <ChevronRight size={13} className="footer-link-chevron" />
                  <span>Bog‘lanish & Manzil</span>
                </Link>
              </li>
              <li>
                <Link to="/furniture" onClick={smoothScrollToTop} className="footer-nav-link">
                  <ChevronRight size={13} className="footer-link-chevron" />
                  <span>Chegirmadagi Mebellar</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Bog'lanish & Lokatsiya */}
          <div>
            <h4 className="footer-heading">
              Bog‘lanish
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#a8a29e' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--wood-amber)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span style={{ color: '#e7e5e4' }}>{settings.address}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <a href={`tel:${settings.phone}`} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}>
                  {settings.phone}
                </a>
              </div>

              {settings.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Mail size={18} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#d6d3d1' }}>{settings.email}</span>
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#78716c', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Ish vaqti: {settings.working_hours || "Har kuni 08:30 dan 20:00 gacha"}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <div>
            {settings.copyright_text || `© ${currentYear} ${settings.site_name}. Barcha huquqlar himoyalangan.`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#78716c' }}>
            <span>Samarqand, Urgut tumani</span>
            <span>•</span>
            <button
              type="button"
              onClick={smoothScrollToTop}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--wood-amber)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Yuqoriga qaytish ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
