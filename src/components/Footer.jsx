import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Phone, Mail, MapPin, Send, Globe, ShieldCheck, Truck, Clock } from 'lucide-react';

export const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', color: '#d6d3d1', marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Top Value Badges */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 600 }}>Tezkor Yetkazib Berish</h4>
              <p style={{ color: '#a8a29e', fontSize: '0.82rem' }}>Butun O‘zbekiston bo‘ylab professional yetkazish</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 600 }}>Rasmiy Kafolat</h4>
              <p style={{ color: '#a8a29e', fontSize: '0.82rem' }}>Har bir mebel uchun 3 yildan 5 yilgacha kafolat</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)' }}>
              <Clock size={24} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.98rem', fontWeight: 600 }}>Urgut Duradgorlari</h4>
              <p style={{ color: '#a8a29e', fontSize: '0.82rem' }}>Asriy hunarmandchilik va zamonaviy texnologiya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--gold-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Sparkles size={18} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>
                {settings.site_name}
              </h3>
            </div>
            <p style={{ color: '#a8a29e', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {settings.site_tagline || "Urgutning mohir ustalari tomonidan yaratilgan zamonaviy, didli va uzoq yillar xizmat qiluvchi saralangan mebellar markazi."}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={`https://t.me/${settings.telegram?.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#292524',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e7e5e4'
                }}
              >
                <Send size={16} />
              </a>
              <a
                href={`https://instagram.com/${settings.instagram?.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#292524',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e7e5e4'
                }}
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mebel Bo‘limlari
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/furniture?category=mehmonxona" style={{ color: '#a8a29e' }}>Mehmonxona Mebellari</Link></li>
              <li><Link to="/furniture?category=yotoqxona" style={{ color: '#a8a29e' }}>Yotoqxona To‘plamlari</Link></li>
              <li><Link to="/furniture?category=oshxona" style={{ color: '#a8a29e' }}>Oshxona Garniturlari</Link></li>
              <li><Link to="/furniture?category=ofis" style={{ color: '#a8a29e' }}>Ofis va Ish Stollari</Link></li>
              <li><Link to="/furniture?category=bolalar" style={{ color: '#a8a29e' }}>Bolalar Xonasi Mebellari</Link></li>
              <li><Link to="/furniture?category=yumshoq-mebellar" style={{ color: '#a8a29e' }}>Yumshoq Divan va Kreslolar</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Xizmatlar & Havolalar
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/custom-order" style={{ color: '#d4a359', fontWeight: 600 }}>Maxsus O‘lchamda Buyurtma</Link></li>
              <li><Link to="/craftsmen" style={{ color: '#a8a29e' }}>Urgut Ustalari Katalogi</Link></li>
              <li><Link to="/about" style={{ color: '#a8a29e' }}>Biz Haqimizda</Link></li>
              <li><Link to="/contact" style={{ color: '#a8a29e' }}>Bog‘lanish & Manzil</Link></li>
              <li><Link to="/furniture?discount=true" style={{ color: '#ef4444' }}>Aksiyadagi Mebellar</Link></li>
            </ul>
          </div>

          {/* Contact & Showroom */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Biz Bilan Bog‘lanish
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#a8a29e' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--wood-amber)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>{settings.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <a href={`tel:${settings.phone}`} style={{ color: '#ffffff', fontWeight: 600 }}>{settings.phone}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="var(--wood-amber)" style={{ flexShrink: 0 }} />
                <span>{settings.email}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78716c', marginTop: '0.4rem' }}>
                Ish vaqti: Har kuni 08:30 dan 20:00 gacha (Dam olish kunlarisiz)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#78716c'
          }}
        >
          <div>
            © {currentYear} <strong>{settings.site_name}</strong>. Barcha huquqlar himoyalangan.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>O‘zbekiston, Samarqand / Urgut</span>
            <span>Maxfiylik siyosati</span>
            <span>Foydalanish shartlari</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
