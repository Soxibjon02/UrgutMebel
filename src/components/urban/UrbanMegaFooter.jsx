import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Smartphone, Download, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const UrbanMegaFooter = () => {
  const [openAccordions, setOpenAccordions] = useState({
    company: false,
    moreInfo: false,
    address: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const smoothScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#f5efe9',
        color: '#374151',
        borderTop: '1px solid #e7ded5',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem'
      }}
      className="urban-mega-footer"
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* App Download Banner */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}
          className="urban-app-download-bar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(250, 109, 88, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smartphone size={26} color="var(--figma-coral, #FA6D58)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                Download Our App
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#6b7280' }}>
                Xaridlarni mobil ilovamizda tezkor va qulay bajaring
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-urgut-install-modal'))}
              className="btn btn-secondary"
              style={{
                borderRadius: '8px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Download size={15} />
              <span>Google Play</span>
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-urgut-install-modal'))}
              className="btn btn-primary"
              style={{
                borderRadius: '8px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Download size={15} />
              <span>App Store</span>
            </button>
          </div>
        </div>

        {/* 3 Main Columns / Mobile Accordions */}
        <div
          className="urban-footer-columns-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid #e7ded5'
          }}
        >
          {/* Column 1: The Company */}
          <div>
            <div
              className="urban-footer-head"
              onClick={() => toggleAccordion('company')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                The Company
              </h4>
              <span className="urban-accordion-arrow" style={{ display: 'none' }}>
                {openAccordions.company ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>
            <ul
              className={`urban-footer-list ${openAccordions.company ? 'open' : ''}`}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem' }}
            >
              <li><Link to="/about" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/about" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Careers (Karyera)</Link></li>
              <li><Link to="/blog" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Media & Press</Link></li>
              <li><Link to="/craftsmen" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Urgut Duradgorlari Tarixi</Link></li>
              <li><Link to="/stores" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Showroomlar Xaritasi</Link></li>
            </ul>
          </div>

          {/* Column 2: More Information */}
          <div>
            <div
              className="urban-footer-head"
              onClick={() => toggleAccordion('moreInfo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                More Information
              </h4>
              <span className="urban-accordion-arrow" style={{ display: 'none' }}>
                {openAccordions.moreInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>
            <ul
              className={`urban-footer-list ${openAccordions.moreInfo ? 'open' : ''}`}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem' }}
            >
              <li><Link to="/faq" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>To‘lov va Muddatli To‘lov</Link></li>
              <li><Link to="/faq" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Yetkazib berish va O‘rnatish</Link></li>
              <li><Link to="/faq" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Kafolat va Qaytarish siyosati</Link></li>
              <li><Link to="/custom-order" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Buyurtma Asosida Mebel (3D Loyiha)</Link></li>
              <li><Link to="/contact" onClick={smoothScrollToTop} style={{ color: '#4b5563', textDecoration: 'none' }}>Mijozlarni Qo‘llab-quvvatlash</Link></li>
            </ul>
          </div>

          {/* Column 3: Address & Contact */}
          <div>
            <div
              className="urban-footer-head"
              onClick={() => toggleAccordion('address')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Address & Head Office
              </h4>
              <span className="urban-accordion-arrow" style={{ display: 'none' }}>
                {openAccordions.address ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>
            <div
              className={`urban-footer-list ${openAccordions.address ? 'open' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem', color: '#4b5563' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--figma-coral, #FA6D58)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Samarqand viloyati, Urgut tumani, Hunarmandlar shaharchasi, 24-bino</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--figma-coral, #FA6D58)" style={{ flexShrink: 0 }} />
                <a href="tel:+998904567890" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>+998 90 456 78 90</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--figma-coral, #FA6D58)" style={{ flexShrink: 0 }} />
                <span>info@urgutmebel.uz</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                STIR / INN: 309874125 | Urgut Mebel MCHJ
              </div>
            </div>
          </div>
        </div>

        {/* Social Follow Bar: "Like what you're seeing? Follow us for more." */}
        <div
          style={{
            padding: '2rem 0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#374151' }}>
            Like what you’re seeing? Follow us for more.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1877f2', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ff0000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* Telegram */}
            <a href="https://t.me" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#229ed9', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid #e7ded5',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#9ca3af'
          }}
        >
          &copy; 2012-2026 URGUT MEBEL MARKAZI. Barcha huquqlar himoyalangan.
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .urban-footer-columns-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .urban-accordion-arrow {
            display: block !important;
          }
          .urban-footer-head {
            padding: 1rem 0;
            border-bottom: 1px solid #e7ded5;
            margin-bottom: 0 !important;
          }
          .urban-footer-list {
            display: none !important;
            padding: 0.75rem 0 !important;
          }
          .urban-footer-list.open {
            display: flex !important;
          }
        }
      `}</style>
    </footer>
  );
};
