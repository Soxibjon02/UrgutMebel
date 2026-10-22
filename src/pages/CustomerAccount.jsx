import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { ProductCard } from '../components/ProductCard';
import { AppInstallCard } from '../components/AppInstallCard';
import {
  User,
  ShoppingBag,
  Sliders,
  Heart,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Truck,
  Layers,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Eye,
  Check,
  X,
  Calendar,
  Settings,
  Save,
  PackageCheck,
  Hammer,
  AlertTriangle
} from 'lucide-react';

export const CustomerAccount = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isGuest, openAuthModal, logout, updateProfile } = useAuth();
  const { favorites } = useWishlist();
  const { addToast } = useNotification();
  const { t, getLocalized, language } = useLanguage();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'orders' || tabParam === 'custom' ? 'orders' : tabParam === 'wishlist' ? 'wishlist' : 'profile'
  );
  const [orderSubTab, setOrderSubTab] = useState(tabParam === 'orders' ? 'standard' : 'custom');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [customOrders, setCustomOrders] = useState([]);
  const [standardOrders, setStandardOrders] = useState([]);
  const [selectedOfferOrder, setSelectedOfferOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customFilter, setCustomFilter] = useState('ALL');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        notes: user.notes || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'custom') {
      setActiveTab('orders');
      if (tab === 'orders') setOrderSubTab('standard');
      if (tab === 'custom') setOrderSubTab('custom');
    } else if (tab === 'wishlist') {
      setActiveTab('wishlist');
    } else if (tab === 'profile') {
      setActiveTab('profile');
    }
  }, [searchParams]);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const [cOrders, sOrders] = await Promise.all([
          dataService.getCustomOrders(),
          dataService.getStandardOrders()
        ]);
        setCustomOrders(cOrders || []);
        setStandardOrders(sOrders || []);
      } catch (err) {
        console.error('Error loading account data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAccountData();

    const handleUpdate = () => loadAccountData();
    window.addEventListener('urgut_store_custom_orders_updated', handleUpdate);
    window.addEventListener('urgut_store_standard_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('urgut_store_custom_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_standard_orders_updated', handleUpdate);
    };
  }, []);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      if (updateProfile) {
        updateProfile({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
          address: profileForm.address,
          notes: profileForm.notes
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Offer Response (Accept or Reject)
  const handleOfferResponse = async (orderId, response) => {
    try {
      await dataService.respondPriceOffer(orderId, response);
      if (response === 'ACCEPTED') {
        addToast('Narx taklifi ma‘qullandi! Buyurtmangiz ishlab chiqarishga yo‘naltirildi.', 'success');
      } else {
        addToast('Narx taklifi rad etildi. Menedjer siz bilan tez orada qayta bog‘lanadi.', 'info');
      }
      setSelectedOfferOrder(null);
      const updated = await dataService.getCustomOrders();
      setCustomOrders(updated);
    } catch (e) {
      console.error(e);
      addToast('Amalni bajarishda xatolik yuz berdi', 'error');
    }
  };

  // Status mapping and badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Yangi (Qabul qilindi)</span>;
      case 'REVIEWING':
        return <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Ko‘rib chiqilmoqda</span>;
      case 'CALCULATING':
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Narx hisoblanmoqda</span>;
      case 'PRICE_SENT':
        return <span className="badge" style={{ backgroundColor: 'rgba(250, 109, 88, 0.2)', color: 'var(--figma-coral)', border: '1px solid rgba(250, 109, 88, 0.4)', fontWeight: 800 }}>⚠️ Narx Taklifi Tayyor</span>;
      case 'CUSTOMER_APPROVED':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Tasdiqlangan</span>;
      case 'IN_PRODUCTION':
        return <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>Ishlab chiqarishda</span>;
      case 'READY':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Tayyor bo‘ldi</span>;
      case 'DELIVERING':
        return <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Yetkazilmoqda</span>;
      case 'COMPLETED':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Topshirildi (Bajarildi)</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Bekor qilindi</span>;
      default:
        return <span className="badge badge-wood">{status}</span>;
    }
  };

  // 6-Step Visual Timeline Calculator
  const getStepStatus = (orderStatus, stepIndex) => {
    // 0: Qabul qilindi (NEW)
    // 1: Ko'rib chiqilmoqda (REVIEWING / CALCULATING)
    // 2: Narx taklifi (PRICE_SENT / CUSTOMER_APPROVED)
    // 3: Ishlab chiqarishda (IN_PRODUCTION)
    // 4: Yetkazilmoqda (READY / DELIVERING)
    // 5: Bajarildi (COMPLETED)
    const statusMap = {
      NEW: 0,
      REVIEWING: 1,
      CALCULATING: 1,
      PRICE_SENT: 2,
      CUSTOMER_APPROVED: 2,
      IN_PRODUCTION: 3,
      READY: 4,
      DELIVERING: 4,
      COMPLETED: 5
    };

    const currentLevel = statusMap[orderStatus] !== undefined ? statusMap[orderStatus] : 0;
    if (stepIndex < currentLevel) return 'completed';
    if (stepIndex === currentLevel) return 'active';
    return 'upcoming';
  };

  // Filter custom orders
  const filteredCustomOrders = customOrders.filter((ord) => {
    if (customFilter === 'ALL') return true;
    if (customFilter === 'PENDING') return ['NEW', 'REVIEWING', 'CALCULATING'].includes(ord.status);
    if (customFilter === 'PRICE_SENT') return ord.status === 'PRICE_SENT';
    if (customFilter === 'IN_PRODUCTION') return ['CUSTOMER_APPROVED', 'IN_PRODUCTION'].includes(ord.status);
    if (customFilter === 'DELIVERING') return ['READY', 'DELIVERING'].includes(ord.status);
    if (customFilter === 'COMPLETED') return ord.status === 'COMPLETED';
    return true;
  });

  // Calculate pending offers count
  const pendingOffersCount = customOrders.filter((o) => o.status === 'PRICE_SENT').length;

  if (isGuest) {
    return (
      <div style={{ padding: '6rem 0', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
          <div
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'rgba(250, 109, 88, 0.12)',
                color: 'var(--figma-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}
            >
              <User size={38} />
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.85rem' }}>
              Shaxsiy Kabinetga Kiring
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Buyurtmalaringiz bosqichma-bosqich jarayonini real vaqtda kuzatish, usta va menedjer narx takliflarini tasdiqlash hamda sevimlilarni boshqarish uchun tizimga kiring.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="btn btn-figma-primary"
                style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}
              >
                Kirish (Avtorizatsiya)
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.9rem', justifyContent: 'center' }}
              >
                Ro‘yxatdan O‘tish
              </button>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <AppInstallCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem', minHeight: '85vh' }}>
      <div className="container">

        {/* 1. TOP TAB NAVIGATION */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.75rem',
            borderBottom: '2px solid var(--border-subtle)',
            marginBottom: '2.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem'
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`customer-tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
          >
            <User size={18} />
            <span>{t('account.title', 'Mening Hisobim')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('orders')}
            className={`customer-tab-button ${activeTab === 'orders' || activeTab === 'custom' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
          >
            <ShoppingBag size={18} />
            <span>{t('nav.my_orders', 'Buyurtmalarim')}</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: (activeTab === 'orders' || activeTab === 'custom') ? 'var(--figma-coral)' : 'var(--bg-secondary)',
                color: (activeTab === 'orders' || activeTab === 'custom') ? '#fff' : 'var(--text-muted)'
              }}
            >
              {customOrders.length + standardOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('wishlist')}
            className={`customer-tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
          >
            <Heart size={18} />
            <span>{t('nav.wishlist', 'Sevimlilar')}</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: activeTab === 'wishlist' ? 'var(--figma-coral)' : 'var(--bg-secondary)',
                color: activeTab === 'wishlist' ? '#fff' : 'var(--text-muted)'
              }}
            >
              {favorites.length}
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB: PROFILE (MENING HISOBIM - FAQAT O'ZI HAQIDAGI MA'LUMOTLAR)
            ========================================================================= */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* HERO PROFILE CARD */}
            <div className="account-hero-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' }}>
                  <div className="account-avatar">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {user.full_name || 'Hurmatli Mijoz'}
                      </h1>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: '#10b981',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        <ShieldCheck size={14} />
                        Tasdiqlangan Profil
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.86rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} /> {user.email || 'Email kiritilmagan'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} /> {user.phone || 'Telefon kiritilmagan'}
                      </span>
                      {user.address && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} /> {user.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange('orders')}
                    className="btn btn-figma-primary"
                    style={{ padding: '0.75rem 1.4rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>{t('nav.my_orders', 'Buyurtmalarimga O‘tish')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="btn btn-secondary"
                    style={{ padding: '0.75rem 1rem', color: '#ef4444' }}
                    title={t('nav.logout', 'Hisobdan chiqish')}
                  >
                    <LogOut size={16} />
                    <span style={{ fontSize: '0.85rem' }}>{t('nav.logout', 'Chiqish')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Info Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shaxsiy Ma‘lumotlar</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.full_name || 'Kiritilmagan'}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email: <strong style={{ color: 'var(--text-main)' }}>{user.email}</strong></div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Bog‘lanish Telefoni</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.phone || 'Kiritilmagan'}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Yetkazish manzili: <strong style={{ color: 'var(--text-main)' }}>{user.address || 'Kiritilmagan'}</strong></div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hisob Holati</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Faol & Tasdiqlangan</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Foydalanuvchi darajasi: <strong style={{ color: 'var(--text-main)' }}>Mijoz ({user.role || 'customer'})</strong></div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <div
              className="glass-card"
              style={{
                padding: '2.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Profil Ma‘lumotlarini Tahrirlash
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Buyurtmalarni tezkor rasmiylashtirish va yetkazish uchun aloqa ma‘lumotlaringizni yangilab boring.
              </p>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      To‘liq Ism-Sharifingiz
                    </label>
                    <input
                      type="text"
                      className="figma-input"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Telefon Raqamingiz
                    </label>
                    <input
                      type="tel"
                      className="figma-input"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Asosiy Yetkazib Berish Manzili
                  </label>
                  <input
                    type="text"
                    className="figma-input"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Viloyat, shahar/tuman, ko'cha, uy raqami"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Qo‘shimcha Izoh yoki Mo‘ljal
                  </label>
                  <textarea
                    className="figma-input"
                    rows="3"
                    value={profileForm.notes}
                    onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                    placeholder="Masalan: 3-qavat, domofon kodi yoki mo'ljal..."
                  ></textarea>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="btn btn-figma-primary"
                    style={{ padding: '0.9rem 2rem' }}
                  >
                    <Save size={18} />
                    <span>{isSavingProfile ? 'Saqlanmoqda...' : 'Ma‘lumotlarni Saqlash'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: ORDERS (BUYURTMALARIM - FAQAT BUYURTMALAR)
            ========================================================================= */}
        {(activeTab === 'orders' || activeTab === 'custom') && (
          <div>
            {/* Orders Stats Row */}
            <div className="account-stat-grid" style={{ marginBottom: '2rem' }}>
              <div className="account-stat-card">
                <div className="account-stat-icon" style={{ backgroundColor: 'rgba(250, 109, 88, 0.12)', color: 'var(--figma-coral)' }}>
                  <Sliders size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {customOrders.length}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Maxsus Loyihalarim
                  </div>
                </div>
              </div>

              <div className="account-stat-card">
                <div className="account-stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                  <ShoppingBag size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {standardOrders.length}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Do‘kon Xaridlari
                  </div>
                </div>
              </div>

              <div className="account-stat-card" style={pendingOffersCount > 0 ? { borderColor: 'rgba(250, 109, 88, 0.5)', background: 'rgba(250, 109, 88, 0.05)' } : {}}>
                <div className="account-stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                  <DollarSign size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pendingOffersCount > 0 ? 'var(--figma-coral)' : 'var(--text-main)', lineHeight: 1.2 }}>
                    {pendingOffersCount}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: pendingOffersCount > 0 ? 'var(--figma-coral)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {pendingOffersCount > 0 ? 'Kutilayotgan Takliflar!' : 'Narx Takliflari'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Maxsus Buyurtmalar vs Do'kon Xaridlari */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-lg)' }}>
                <button
                  type="button"
                  onClick={() => setOrderSubTab('custom')}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: orderSubTab === 'custom' ? 'var(--bg-card)' : 'transparent',
                    color: orderSubTab === 'custom' ? 'var(--figma-coral)' : 'var(--text-muted)',
                    boxShadow: orderSubTab === 'custom' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Sliders size={16} />
                  <span>Maxsus Buyurtmalar</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.45rem', borderRadius: '999px', backgroundColor: orderSubTab === 'custom' ? 'rgba(250, 109, 88, 0.15)' : 'rgba(0,0,0,0.06)' }}>
                    {customOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderSubTab('standard')}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: orderSubTab === 'standard' ? 'var(--bg-card)' : 'transparent',
                    color: orderSubTab === 'standard' ? 'var(--figma-coral)' : 'var(--text-muted)',
                    boxShadow: orderSubTab === 'standard' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Do‘kon Xaridlari</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.45rem', borderRadius: '999px', backgroundColor: orderSubTab === 'standard' ? 'rgba(250, 109, 88, 0.15)' : 'rgba(0,0,0,0.06)' }}>
                    {standardOrders.length}
                  </span>
                </button>
              </div>

              <Link to="/custom-order" className="btn btn-figma-primary" style={{ padding: '0.65rem 1.25rem' }}>
                <Sliders size={16} />
                <span>+ Yangi Maxsus Buyurtma</span>
              </Link>
            </div>

            {/* SUB-SECTION 1: MAXSUS BUYURTMALAR */}
            {orderSubTab === 'custom' && (
              <div>
                {/* Filter Pills */}
                {customOrders.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    {[
                      { id: 'ALL', label: 'Barchasi' },
                      { id: 'PENDING', label: 'Ko‘rib chiqilmoqda' },
                      { id: 'PRICE_SENT', label: 'Narx taklifi berilgan' },
                      { id: 'IN_PRODUCTION', label: 'Ishlab chiqarishda' },
                      { id: 'DELIVERING', label: 'Yetkazilmoqda' },
                      { id: 'COMPLETED', label: 'Bajarilgan' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCustomFilter(f.id)}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '999px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          border: customFilter === f.id ? '1.5px solid var(--figma-coral)' : '1px solid var(--border-subtle)',
                          backgroundColor: customFilter === f.id ? 'rgba(250, 109, 88, 0.12)' : 'var(--bg-card)',
                          color: customFilter === f.id ? 'var(--figma-coral)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

            {filteredCustomOrders.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: '4.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(250, 109, 88, 0.1)',
                    color: 'var(--figma-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <Sliders size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {customFilter === 'ALL'
                    ? 'Maxsus buyurtmalar hali mavjud emas'
                    : 'Ushbu bo‘limda buyurtmalar topilmadi'}
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.75rem', fontSize: '0.92rem' }}>
                  Uyingiz yoki ofisingizga mos keladigan o‘lcham va dizayndagi mebelni loyihalash uchun buyurtma bering.
                </p>
                <Link to="/custom-order" className="btn btn-figma-primary" style={{ padding: '0.85rem 1.75rem' }}>
                  <Sliders size={18} />
                  <span>Maxsus Mebel Buyurtma Qilish</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {filteredCustomOrders.map((order) => {
                  const stepperSteps = [
                    { title: 'Qabul qilindi', icon: Check },
                    { title: 'Ko‘rib chiqilmoqda', icon: Eye },
                    { title: 'Narx Taklifi', icon: DollarSign },
                    { title: 'Ishlab chiqarish', icon: Hammer },
                    { title: 'Yetkazilmoqda', icon: Truck },
                    { title: 'Bajarildi', icon: PackageCheck }
                  ];

                  return (
                    <div
                      key={order.id}
                      className="glass-card"
                      style={{
                        padding: '2rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      {/* Order Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          borderBottom: '1px solid var(--border-subtle)',
                          paddingBottom: '1.25rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700, letterSpacing: '0.04em' }}>
                            BUYURTMA RAQAMI
                          </div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--figma-coral)', marginTop: '0.2rem' }}>
                            {order.order_number}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          {getStatusBadge(order.status)}
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Visual Stepper / Progress Timeline */}
                      <div className="order-stepper">
                        {stepperSteps.map((step, idx) => {
                          const state = getStepStatus(order.status, idx);
                          const IconComp = step.icon;
                          return (
                            <div key={idx} className={`order-step-node ${state}`}>
                              <div className="order-step-circle">
                                {state === 'completed' ? <Check size={18} /> : <IconComp size={16} />}
                              </div>
                              <div className="order-step-label">{step.title}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Specs Chips Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                          gap: '1rem',
                          margin: '1.5rem 0'
                        }}
                      >
                        <div className="spec-chip">
                          <div className="spec-chip-label">Mebel Turi & Xona</div>
                          <div className="spec-chip-val">{order.furniture_type || order.category || 'Mebel'}</div>
                        </div>

                        <div className="spec-chip">
                          <div className="spec-chip-label">O‘lchamlari (UxKxB)</div>
                          <div className="spec-chip-val">
                            {order.length || '-'} x {order.width || '-'} x {order.height || '-'} sm
                          </div>
                        </div>

                        <div className="spec-chip">
                          <div className="spec-chip-label">Material & Rangi</div>
                          <div className="spec-chip-val">
                            {order.material || 'Standart'} ({order.color || 'Buyurtma bo‘yicha'})
                          </div>
                        </div>

                        <div className="spec-chip">
                          <div className="spec-chip-label">Mas'ul Menedjer / Usta</div>
                          <div className="spec-chip-val" style={{ color: 'var(--figma-coral)' }}>
                            {order.assigned_manager_name || "Biriktirilmoqda"}
                          </div>
                        </div>
                      </div>

                      {/* Notes / Izoh */}
                      {order.description && (
                        <div
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            marginBottom: '1.5rem',
                            borderLeft: '3px solid var(--border-subtle)'
                          }}
                        >
                          <strong style={{ color: 'var(--text-main)' }}>Mijoz izohi: </strong>
                          {order.description}
                        </div>
                      )}

                      {/* Attached Sketches / Files */}
                      {order.files && order.files.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: '0.65rem' }}>
                            BIRIKTIRILGAN CHIZMALAR VA ESKIZLAR:
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {order.files.map((file, fIdx) => (
                              <a
                                key={fIdx}
                                href={file.file_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.5rem 0.85rem',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-subtle)',
                                  fontSize: '0.82rem',
                                  color: 'var(--text-main)',
                                  textDecoration: 'none'
                                }}
                              >
                                <FileText size={16} color="var(--figma-coral)" />
                                <span>{file.file_name || `Chizma #${fIdx + 1}`}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PRICE OFFER BANNER IF RECEIVED */}
                      {order.price_offer && (
                        <div className="price-offer-box">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--figma-coral)', fontWeight: 800, fontSize: '0.95rem' }}>
                              <Sparkles size={18} />
                              <span>Menedjer Narx Taklifini Tayyorladi!</span>
                            </div>
                            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.35rem 0' }}>
                              {Number(order.price_offer.total_price || order.price_offer).toLocaleString()} so‘m
                            </div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                              Qaror holati:{' '}
                              <strong>
                                {order.price_offer.customer_status === 'ACCEPTED'
                                  ? '✅ Qabul qilingan'
                                  : order.price_offer.customer_status === 'REJECTED'
                                  ? '❌ Rad etilgan'
                                  : '⏳ Sizning tasdiqingiz kutilmoqda'}
                              </strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedOfferOrder(order)}
                            className="btn btn-figma-primary"
                            style={{ padding: '0.85rem 1.4rem' }}
                          >
                            <DollarSign size={16} />
                            <span>Kalkulyatsiyani Ko‘rish va Qaror Qilish</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUB-SECTION 2: STANDARD STORE ORDERS (DO'KON XARIDLARI) */}
        {orderSubTab === 'standard' && (
          <div>
            {standardOrders.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: '4.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <ShoppingBag size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Hali standart xaridlar qilinmagan
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.75rem', fontSize: '0.92rem' }}>
                  Katalogimizdan tayyor sifatli mebellarni tanlang va uyingizga bepul yetkazib berish xizmatidan foydalaning.
                </p>
                <Link to="/furniture" className="btn btn-figma-primary" style={{ padding: '0.85rem 1.75rem' }}>
                  <ShoppingBag size={18} />
                  <span>Katalogga O‘tish</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {standardOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        paddingBottom: '1.25rem',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700 }}>
                          BUYURTMA RAQAMI
                        </div>
                        <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                          {ord.order_number}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="badge badge-stock" style={{ textTransform: 'uppercase' }}>
                          {ord.status}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      {ord.items?.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <img
                            src={item.product_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80"}
                            alt={item.product_name}
                            style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                              {item.product_name}
                            </strong>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {item.selected_color || 'Rang'} • {item.quantity} dona
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--figma-coral)' }}>
                            {Number(item.total_price || item.price * item.quantity).toLocaleString()} so‘m
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Info & Total */}
                    <div
                      style={{
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                        Yetkazish manzili: <strong style={{ color: 'var(--text-main)' }}>{ord.address}</strong>
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Jami:{' '}
                        <span style={{ color: 'var(--figma-coral)' }}>
                          {Number(ord.total_amount).toLocaleString()} so‘m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )}

    {/* =========================================================================
        TAB 3: WISHLIST (SEVIMLI MEBELLAR)
        ========================================================================= */}
    {activeTab === 'wishlist' && (
      <div>
        {favorites.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '4.5rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sevimlilar ro‘yxati bo‘sh
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.75rem', fontSize: '0.92rem' }}>
              Katalogimizdagi mahsulotlarning yurakchasini bosib, ularni keyinchalik qulay ko‘rish uchun saqlab qo‘yishingiz mumkin.
            </p>
            <Link to="/furniture" className="btn btn-figma-primary" style={{ padding: '0.85rem 1.75rem' }}>
              <Heart size={18} />
              <span>Mebellarni Ko‘rish</span>
            </Link>
          </div>
        ) : (
          <div className="grid-products">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    )}

        {/* =========================================================================
            PRICE OFFER REVIEW & APPROVAL MODAL
            ========================================================================= */}
        {selectedOfferOrder && selectedOfferOrder.price_offer && (
          <div className="modal-overlay" onClick={() => setSelectedOfferOrder(null)}>
            <div
              className="modal-content"
              style={{ maxWidth: '600px', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                    Narx Kalkulyatsiyasi va Taklif
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                    Buyurtma: <strong style={{ color: 'var(--figma-coral)' }}>{selectedOfferOrder.order_number}</strong> ({selectedOfferOrder.furniture_type || selectedOfferOrder.category})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOfferOrder(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Detailed Breakdown Table */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.92rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Asosiy material xarajatlari:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.material_cost || 0).toLocaleString()} so‘m</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duradgorlar ish haqi (Mehnat):</span>
                  <strong>{Number(selectedOfferOrder.price_offer.labor_cost || 0).toLocaleString()} so‘m</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fiting, mexanizm va aksessuarlar:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.additional_cost || 0).toLocaleString()} so‘m</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Yetkazib berish va o‘rnatish:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.delivery_cost || 0).toLocaleString()} so‘m</strong>
                </div>

                {selectedOfferOrder.price_offer.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                    <span>Maxsus mijoz chegirmasi:</span>
                    <strong>-{Number(selectedOfferOrder.price_offer.discount).toLocaleString()} so‘m</strong>
                  </div>
                )}

                <div
                  style={{
                    borderTop: '2px dashed var(--border-subtle)',
                    paddingTop: '1rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>Umumiy Yakuniy Narx:</span>
                  <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--figma-coral)' }}>
                    {Number(selectedOfferOrder.price_offer.total_price || selectedOfferOrder.price_offer).toLocaleString()} so‘m
                  </span>
                </div>
              </div>

              {selectedOfferOrder.price_offer.notes && (
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(250, 109, 88, 0.05)',
                    border: '1px solid rgba(250, 109, 88, 0.2)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <strong style={{ color: 'var(--figma-coral)' }}>Menedjer tavsiyasi: </strong>
                  {selectedOfferOrder.price_offer.notes}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleOfferResponse(selectedOfferOrder.id, 'ACCEPTED')}
                  className="btn btn-figma-primary"
                  style={{ padding: '0.95rem', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={18} />
                  <span>Narxni Qabul Qilish</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfferResponse(selectedOfferOrder.id, 'REJECTED')}
                  className="btn btn-secondary"
                  style={{ padding: '0.95rem', color: '#ef4444', justifyContent: 'center' }}
                >
                  <XCircle size={18} />
                  <span>Rad Etish / Qayta Ko‘rish</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PWA Mobile App Card */}
        <div style={{ marginTop: '4rem' }}>
          <AppInstallCard />
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-xl, 18px)',
              padding: '2.25rem 2rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <AlertTriangle size={30} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {t('nav.logout_confirm', 'Hisobdan chiqishni tasdiqlaysizmi?')}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              {t('common.logout_desc', 'To‘satdan bosilib ketishining oldini olish uchun tasdiqlang. Chiqqaningizdan so‘ng qayta kirish uchun telefon raqamingiz yoki emailingiz zarur bo‘ladi.')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-secondary"
                style={{
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  justifyContent: 'center'
                }}
              >
                {t('catalog.reset_filters', 'Bekor qilish')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                style={{
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <LogOut size={16} />
                <span>{t('nav.logout', 'Ha, chiqish')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
