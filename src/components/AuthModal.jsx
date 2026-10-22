import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { authModalState, closeAuthModal, login, register } = useAuth();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(authModalState.mode !== 'register');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  if (!authModalState.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginMode) {
      const res = await login(email, password);
      if (res?.success) {
        if (res.role === 'admin') {
          navigate('/admin');
        } else if (res.role === 'manager') {
          navigate('/manager');
        } else if (res.role === 'craftsman') {
          navigate('/craftsman-dashboard');
        } else {
          // Oddiy mijoz uchun o'z hisobiga yoki do'konga yo'naltirish
          navigate('/account');
        }
      }
    } else {
      const res = await register({
        full_name: fullName,
        email,
        password,
        phone
      });
      if (res?.success) {
        navigate('/account');
      }
    }

    setLoading(false);
  };

  const setDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('soxibgaybullayev439@gmail.com');
      setPassword('s0x1bj0n$02$');
    } else if (type === 'manager') {
      setEmail('manager@urgutmebel.uz');
      setPassword('manager12345');
    } else if (type === 'craftsman') {
      setEmail('usta@urgutmebel.uz');
      setPassword('usta12345');
    } else {
      setEmail('sherzod@gmail.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          type="button"
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '50%',
              background: 'rgba(250, 109, 88, 0.12)',
              color: 'var(--primary)',
              marginBottom: '0.75rem'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {settings.site_name}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {authModalState.reason || (isLoginMode ? t('auth.login_subtitle', 'Hisobingizga kiring') : t('auth.register_subtitle', 'Yangi hisob yaratish'))}
          </p>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: isLoginMode ? 'var(--primary)' : 'transparent',
              color: isLoginMode ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              boxShadow: isLoginMode ? '0 2px 8px rgba(250, 109, 88, 0.35)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {t('auth.login_tab', 'Kirish')}
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: !isLoginMode ? 'var(--primary)' : 'transparent',
              color: !isLoginMode ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              boxShadow: !isLoginMode ? '0 2px 8px rgba(250, 109, 88, 0.35)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {t('auth.register_tab', 'Ro‘yxatdan o‘tish')}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <div className="form-group">
                <label className="form-label">{t('auth.full_name', 'To‘liq Ismingiz')}</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder={t('auth.full_name_placeholder', 'Masalan: Sardor Rustamov')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('auth.phone', 'Telefon Raqamingiz')}</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder={t('auth.phone_placeholder', '+998 90 123 45 67')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{t('auth.email', 'Elektron Pochta (Email)')}</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="email"
                required
                placeholder={t('auth.email_placeholder', 'misol@pochta.uz')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.password', 'Parol')}</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="password"
                required
                placeholder={t('auth.password_placeholder', 'Kamida 6 ta belgi')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? t('auth.checking', 'Tekshirilmoqda...') : isLoginMode ? t('auth.btn_login', 'Tizimga Kirish') : t('auth.btn_register', 'Ro‘yxatdan O‘tish')}
            <ArrowRight size={18} />
          </button>
        </form>

        {isLoginMode && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.6rem', textAlign: 'center' }}>
              {t('auth.fast_demo_login', 'Sinov uchun tezkor kirish:')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setDemoCredentials('customer')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.45rem 0.2rem' }}
              >
                {t('auth.demo_customer', 'Mijoz')}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('craftsman')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.45rem 0.2rem' }}
              >
                {t('auth.demo_craftsman', 'Usta')}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('manager')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.45rem 0.2rem' }}
              >
                {t('auth.demo_manager', 'Menedjer')}
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.45rem 0.2rem' }}
              >
                {t('auth.demo_admin', 'Admin')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

