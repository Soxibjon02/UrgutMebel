import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

import { dataService } from '../services/dataService';

export const ContactPage = () => {
  const { settings } = useSettings();
  const { addToast } = useNotification();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dataService.createCustomOrder({
        customer_name: name,
        customer_phone: phone,
        notes: message,
        category: 'Bog‘lanish / Savol',
        title: 'Saytdan qoldirilgan murojaat',
        furniture_type: 'Murojaat va savol',
        status: 'NEW'
      });
    } catch (err) {
      console.warn('Error saving contact message:', err);
    }
    setSent(true);
    addToast('Xabaringiz qabul qilindi! Tez orada bog‘lanamiz.', 'success');
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag">Biz Bilan Bog‘lanish</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.85rem', wordBreak: 'break-word', lineHeight: 1.25 }}>
            Bizning Showroom va Aloqa
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.92rem, 2.5vw, 1.05rem)', maxWidth: '600px', margin: '0 auto' }}>
            Mebellarni o‘z ko‘zingiz bilan ko‘rish, buyurtma berish yoki maslahat olish uchun biz bilan bog‘laning
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
          
          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Showroom Manzili:</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {settings.address}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Telefon Raqam:</h4>
                  <a href={`tel:${settings.phone}`} style={{ color: 'var(--wood-amber)', fontWeight: 700, fontSize: '1.1rem' }}>
                    {settings.phone}
                  </a>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Qo‘ng‘iroqlarga 24/7 javob beriladi</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Elektron Pochta:</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {settings.email}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(194, 109, 46, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wood-amber)', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Ish Vaqti:</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Dushanba - Yakshanba: 08:30 dan 20:00 gacha (Dam olish kunlarisiz)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="glass-card"
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Xabaringiz Qabul Qilindi!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Mutaxassislarimiz tez orada siz bilan bog‘lanadi.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Bizga Xabar Qoldiring
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Ismingiz *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ismingiz"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefon Raqamingiz *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Xabar Matni *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Qiziqtirgan mebelingiz yoki savolingiz..."
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                    <Send size={16} />
                    <span>Xabarni Yuborish</span>
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
