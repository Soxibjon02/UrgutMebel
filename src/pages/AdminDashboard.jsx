import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { dataService, getStored } from '../services/dataService';
import {
  initialProducts,
  initialCategories,
  initialCraftsmen,
  initialOrders,
  initialCustomOrders,
  initialComments,
  initialBanners
} from '../data/mockData';
import {
  Shield,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Users,
  Award,
  MessageSquare,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Database,
  ExternalLink,
  Copy,
  Menu
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import { SUPABASE_SQL_SCRIPT } from '../data/supabaseSql';

export const AdminDashboard = () => {
  const { user, isAdmin, isGuest, openAuthModal } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview');

  // Datasets - Instantaneous cache hydration so UI NEVER flashes (0)!
  const [products, setProducts] = useState(() => getStored('products', initialProducts));
  const [categories, setCategories] = useState(() => getStored('categories', initialCategories));
  const [customOrders, setCustomOrders] = useState(() => getStored('custom_orders', initialCustomOrders));
  const [standardOrders, setStandardOrders] = useState(() => getStored('standard_orders', initialOrders));
  const [craftsmen, setCraftsmen] = useState(() => getStored('craftsmen', initialCraftsmen));
  const [comments, setComments] = useState(() => getStored('comments', initialComments));
  const [banners, setBanners] = useState(() => getStored('banners', initialBanners));
  const [managers, setManagers] = useState(() => getStored('managers', []));
  const [usersList, setUsersList] = useState(() => getStored('urgut_mebel_registered_users', []));

  // Modals & Forms
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [craftsmanModalOpen, setCraftsmanModalOpen] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState(null);
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  // Settings Form (Web Loyiha Nomi, Header & Footer o'zgartirish)
  const [settingsForm, setSettingsForm] = useState({
    site_name: settings.site_name,
    site_tagline: settings.site_tagline || '',
    phone: settings.phone || '',
    email: settings.email || '',
    address: settings.address || '',
    telegram: settings.telegram || '',
    instagram: settings.instagram || '',
    currency: settings.currency || 'so‘m',
    hero_badge: settings.hero_badge || '',
    announcement: settings.announcement || '',
    working_hours: settings.working_hours || '',
    footer_about: settings.footer_about || '',
    copyright_text: settings.copyright_text || '',
    feature1_title: settings.feature1_title || '',
    feature1_desc: settings.feature1_desc || '',
    feature2_title: settings.feature2_title || '',
    feature2_desc: settings.feature2_desc || '',
    feature3_title: settings.feature3_title || '',
    feature3_desc: settings.feature3_desc || '',
    hero_banner_image: settings.hero_banner_image || '',
    logo_url: settings.logo_url || '/pwa-icon.svg'
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const checkHealth = async () => {
    const health = await dataService.checkSupabaseHealth();
    setSupabaseHealth(health);
    return health;
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    addToast('SQL skripti nusxalandi! Uni Supabase SQL Editor ga joylab (Run) tugmasini bosing.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCheckAndSync = async () => {
    setIsSyncing(true);
    addToast('Supabase bazasi tekshirilmoqda...', 'info');
    const health = await checkHealth();
    if (!health.tablesFound) {
      setIsSyncing(false);
      addToast('Jadvallar hali yaratilmagan! Iltimos, nusxalangan SQL kodni Supabase SQL Editor-da ishga tushiring (Run)', 'error');
      return;
    }

    addToast('Jadvallar topildi! Barcha ma’lumotlar Supabase-ga yozilmoqda...', 'info');
    const res = await dataService.syncAllDataToSupabase();
    setIsSyncing(false);
    if (res.success) {
      addToast('Barcha ma’lumotlar (sozlamalar, kategoriyalar, mebellar, ustalar) Supabase-ga to‘liq saqlandi!', 'success');
      loadAllData();
    } else {
      addToast(`Xatolik: ${res.error}`, 'error');
    }
  };

  const handleSyncSupabase = handleCheckAndSync;

  const loadAllData = async () => {
    try {
      checkHealth();
      const [prods, cats, cOrders, sOrders, crafts, comms, bans, mgrs, usrs] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getCustomOrders(),
        dataService.getStandardOrders(),
        dataService.getCraftsmen(),
        dataService.getComments(),
        dataService.getBanners(),
        dataService.getManagers(),
        dataService.getUsers()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setCustomOrders(cOrders || []);
      setStandardOrders(sOrders || []);
      setCraftsmen(crafts || []);
      setComments(comms || []);
      setBanners(bans || []);
      setManagers(mgrs || []);
      setUsersList(usrs || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('urgut_store_orders_updated', handleUpdate);
    window.addEventListener('urgut_store_standard_orders_updated', handleUpdate);
    window.addEventListener('urgut_store_custom_orders_updated', handleUpdate);
    window.addEventListener('urgut_store_managers_updated', handleUpdate);
    window.addEventListener('urgut_store_craftsmen_updated', handleUpdate);
    const interval = setInterval(loadAllData, 10000);
    return () => {
      window.removeEventListener('urgut_store_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_standard_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_custom_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_managers_updated', handleUpdate);
      window.removeEventListener('urgut_store_craftsmen_updated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setSettingsForm({
      site_name: settings.site_name,
      site_tagline: settings.site_tagline || '',
      phone: settings.phone || '',
      email: settings.email || '',
      address: settings.address || '',
      telegram: settings.telegram || '',
      instagram: settings.instagram || '',
      currency: settings.currency || 'so‘m',
      hero_badge: settings.hero_badge || '',
      announcement: settings.announcement || '',
      working_hours: settings.working_hours || 'Har kuni 08:30 dan 20:00 gacha (Dam olish kunlarisiz)',
      footer_about: settings.footer_about || '',
      copyright_text: settings.copyright_text || '',
      feature1_title: settings.feature1_title || 'Tezkor Yetkazib Berish',
      feature1_desc: settings.feature1_desc || 'Butun O‘zbekiston bo‘ylab professional yetkazish va o‘rnatish',
      feature2_title: settings.feature2_title || 'Rasmiy Kafolat',
      feature2_desc: settings.feature2_desc || 'Har bir mebel uchun 3 yildan 5 yilgacha sifat kafolati',
      feature3_title: settings.feature3_title || 'Urgut Duradgorlari',
      feature3_desc: settings.feature3_desc || 'Asriy hunarmandchilik va zamonaviy texnologiya uyg‘unligi',
      hero_banner_image: settings.hero_banner_image || ''
    });
  }, [settings]);

  if (isGuest || !isAdmin) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Maxfiy Admin Paneli
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Ushbu bo‘lim yopiq boshqaruv tizimi bo‘lib, faqat Super Admin vakolatiga ega foydalanuvchilar kira oladi.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
          >
            Admin Sifatida Kirish
          </button>
        </div>
      </div>
    );
  }

  // Handle Settings Save (Web Loyiha Nomini o'zgartirish)
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    addToast(`Tizim sozlamalari saqlandi! Loyiha nomi: "${settingsForm.site_name}" ga o‘zgartirildi. Barcha joyda aks etdi.`, 'success');
  };

  // Products CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const prodData = {
      ...editingProduct,
      name: form.name.value,
      price: Number(form.price.value),
      discount_price: form.discount_price.value ? Number(form.discount_price.value) : null,
      category_id: form.category_id.value,
      material: form.material.value,
      dimensions: form.dimensions.value,
      stock: Number(form.stock.value),
      is_published: form.is_published.checked,
      is_featured: form.is_featured.checked,
      is_new: form.is_new.checked,
      description: form.description.value,
      images: [form.image_url.value || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80']
    };

    setProductModalOpen(false);
    setEditingProduct(null);
    addToast('Mahsulot muvaffaqiyatli saqlandi!', 'success');
    const updated = await dataService.saveProduct(prodData);
    setProducts(updated);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Rostdan ham ushbu mebelni o‘chirmoqchimisiz?")) {
      addToast('Mahsulot o‘chirildi', 'info');
      const updated = await dataService.deleteProduct(id);
      setProducts(updated);
    }
  };

  // Categories CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const form = e.target;
    const catData = {
      ...editingCategory,
      name: form.name.value,
      slug: form.slug.value || form.name.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: form.description.value,
      image_url: form.image_url.value || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    };

    setCategoryModalOpen(false);
    setEditingCategory(null);
    addToast('Kategoriya saqlandi!', 'success');
    const updated = await dataService.saveCategory(catData);
    setCategories(updated);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Kategoriyani o‘chirishni xohlaysizmi?")) {
      addToast('Kategoriya o‘chirildi', 'info');
      const updated = await dataService.deleteCategory(id);
      setCategories(updated);
    }
  };

  // Craftsman CRUD
  const handleSaveCraftsman = async (e) => {
    e.preventDefault();
    const form = e.target;
    const craftData = {
      ...editingCraftsman,
      name: form.name.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value.trim() || 'usta12345',
      experience_years: Number(form.experience_years.value),
      location: form.location.value,
      phone: form.phone.value,
      telegram: form.telegram.value,
      bio: form.bio.value,
      photo_url: form.photo_url.value || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      specializations: form.specializations.value.split(',').map((s) => s.trim())
    };

    setCraftsmanModalOpen(false);
    setEditingCraftsman(null);
    addToast('Usta saqlandi! Endi u o‘z paroli bilan Usta paneliga (/craftsman) kira oladi.', 'success');
    const updated = await dataService.saveCraftsman(craftData);
    setCraftsmen(updated);
  };

  const handleDeleteCraftsman = async (id) => {
    if (window.confirm("Ustani o‘chirmoqchimisiz?")) {
      addToast('Usta profili o‘chirildi', 'info');
      const updated = await dataService.deleteCraftsman(id);
      setCraftsmen(updated);
    }
  };

  // Managers CRUD (Super Admin qo'shadi va boshqaradi)
  const handleSaveManager = async (e) => {
    e.preventDefault();
    const form = e.target;
    const mgrData = {
      ...editingManager,
      full_name: form.full_name.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value.trim(),
      phone: form.phone.value.trim(),
      department: form.department.value.trim() || 'Katalog va Buyurtmalar'
    };

    if (!mgrData.email || !mgrData.password) {
      addToast('Email va parol kiritilishi shart!', 'error');
      return;
    }

    setManagerModalOpen(false);
    setEditingManager(null);
    addToast('Menedjer saqlandi! Endi u o‘z paroli bilan tizimga kira oladi.', 'success');
    const updated = await dataService.saveManager(mgrData);
    setManagers(updated);
  };

  const handleDeleteManager = async (id) => {
    if (window.confirm("Rostdan ham ushbu menedjerni o‘chirmoqchimisiz?")) {
      addToast('Menedjer o‘chirildi', 'info');
      const updated = await dataService.deleteManager(id);
      setManagers(updated);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Rostdan ham ushbu foydalanuvchini o‘chirmoqchimisiz?")) {
      addToast('Foydalanuvchi o‘chirildi', 'info');
      const updated = await dataService.deleteUser(id);
      setUsersList(updated);
    }
  };

  // Comments moderation
  const handleModerateComment = async (id, action) => {
    await dataService.moderateComment(id, action);
    addToast(`Sharh: ${action}`, 'info');
    loadAllData();
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Total revenue calc
  const totalRevenue = standardOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const adminTabs = [
    { id: 'overview', label: 'Umumiy Statistika', shortLabel: 'Statistika', icon: LayoutDashboard },
    { id: 'products', label: `Mahsulotlar (${products.length})`, shortLabel: `Mebellar (${products.length})`, icon: Package },
    { id: 'categories', label: `Kategoriyalar (${categories.length})`, shortLabel: `Toifalar (${categories.length})`, icon: Layers },
    { id: 'custom_orders', label: `Maxsus Buyurtmalar (${customOrders.length})`, shortLabel: `Maxsus (${customOrders.length})`, icon: Sliders },
    { id: 'orders', label: `Do‘kon Buyurtmalari (${standardOrders.length})`, shortLabel: `Do‘kon (${standardOrders.length})`, icon: ShoppingBag },
    { id: 'craftsmen', label: `Ustalar (${craftsmen.length})`, shortLabel: `Ustalar (${craftsmen.length})`, icon: Award },
    { id: 'comments', label: `Sharhlar (${comments.length})`, shortLabel: `Sharhlar (${comments.length})`, icon: MessageSquare },
    { id: 'managers', label: `Menedjerlar (${managers.length})`, shortLabel: `Menedjerlar (${managers.length})`, icon: Users },
    { id: 'users', label: `Foydalanuvchilar (${usersList.length})`, shortLabel: `Foydalanuvchilar (${usersList.length})`, icon: Users },
    { id: 'settings', label: 'Tizim & Sayt Nomi', shortLabel: 'Sozlamalar', icon: SettingsIcon }
  ];

  return (
    <div className="admin-layout">

      {/* Mobile Top Header (<= 1024px) */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>{settings.site_name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--wood-amber)', fontWeight: 700 }}>SUPER ADMIN PANEL</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>{mobileMenuOpen ? 'Yopish' : 'Bo‘limlar'}</span>
        </button>
      </div>

      {/* Mobile Horizontal Tabs Quick Switch Bar */}
      <div className="admin-mobile-tabs-bar no-scrollbar">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`admin-mobile-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-dark)',
              color: '#fff',
              padding: '1.25rem',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--wood-amber)' }}>Admin Bo‘limlari</div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: isActive ? '#ffffff' : '#a8a29e',
                      backgroundColor: isActive ? 'var(--wood-amber)' : 'rgba(255,255,255,0.06)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="admin-sidebar-desktop">
        <div style={{ padding: '1.5rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{settings.site_name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--wood-amber)', fontWeight: 700 }}>SUPER ADMIN PANEL</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : (tab.id === 'settings' ? 'var(--gold-accent)' : '#a8a29e'),
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={17} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#78716c' }}>
          <div>Foydalanuvchi: {user.full_name}</div>
          <div style={{ color: 'var(--status-success)', marginTop: '0.2rem' }}>● Tizim faol</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        
        {/* SUPABASE TABLES MISSING WARNING BANNER */}
        {supabaseHealth && !supabaseHealth.tablesFound && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <AlertTriangle size={26} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.35rem' }}>
                  Diqqat: Supabase Ma’lumotlar Bazasi Jadvallari Yaratilishi Kerak!
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Siz Super Admin sifatida o‘chirgan yoki qo‘shgan ma’lumotlar (masalan, <strong>o‘chirilgan ustalar</strong>, yangi qo‘shilgan mebellar) faqat hozirgi brauzeringizda qolmasdan, <strong>barcha boshqa foydalanuvchilar, mijozlar va qurilmalarda ham to‘liq saqlanib ko‘rinishi uchun</strong> Supabase loyihangizda SQL skriptni 1 marta ishga tushiring.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.25rem' }}>
              <button
                type="button"
                onClick={handleCopySql}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                {copiedSql ? 'SQL Nusxalandi!' : '1. SQL Skriptni Nusxalash (1-Click)'}
              </button>

              <a
                href="https://supabase.com/dashboard/project/hlnzxwcupwaaxrutvnvb/sql/new"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-accent)', fontWeight: 700 }}
              >
                <ExternalLink size={15} /> 2. Supabase SQL Editor-ni Ochish
              </a>

              <button
                type="button"
                onClick={handleCheckAndSync}
                disabled={isSyncing}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <Database size={15} color="#10b981" />
                {isSyncing ? 'Sinxronlanmoqda...' : '3. Tekshirish va Barchasini Supabase-ga Yozish'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Platforma Statistikasi</h2>

            {/* Metrics Grid */}
            <div className="dashboard-grid-stats">
              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>JAMI SAVDO (TUSHUM)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--wood-amber)', marginTop: '0.4rem' }}>
                  {Number(totalRevenue).toLocaleString()} so‘m
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>MAXSUS BUYURTMALAR</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {customOrders.length} ta
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>MAHSULOTLAR SONI</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {products.length} ta
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>RO‘YXATDAGI USTALAR</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {craftsmen.length} nafar
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }} className="glass-card">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>MIJOZLAR (USERS)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.4rem' }}>
                  {usersList.length} nafar
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>So‘nggi Maxsus Buyurtmalar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {customOrders.slice(0, 4).map((o) => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <strong>{o.order_number}</strong> — {o.furniture_type} ({o.full_name})
                    </div>
                    <span className="badge badge-wood">{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div>
            <div className="dashboard-action-toolbar">
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mahsulotlar Boshqaruvi</h2>
              <button
                type="button"
                onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}
                className="btn btn-primary"
              >
                <Plus size={16} /> Yangi Mebel Qo‘shish
              </button>
            </div>

            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Mebel nomi</th>
                    <th style={{ padding: '0.85rem' }}>Narxi</th>
                    <th style={{ padding: '0.85rem' }}>Chegirma</th>
                    <th style={{ padding: '0.85rem' }}>Qoldiq</th>
                    <th style={{ padding: '0.85rem' }}>Holati</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.85rem' }}>{Number(p.price).toLocaleString()} so‘m</td>
                      <td style={{ padding: '1rem 0.85rem', color: '#ef4444' }}>
                        {p.discount_price ? `${Number(p.discount_price).toLocaleString()} so‘m` : 'Yo‘q'}
                      </td>
                      <td style={{ padding: '1rem 0.85rem' }}>{p.stock ?? 10} dona</td>
                      <td style={{ padding: '1rem 0.85rem' }}>
                        <span className={`badge ${p.is_published ? 'badge-stock' : 'badge-discount'}`}>
                          {p.is_published ? 'E‘lon qilingan' : 'Yashirilgan'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => { setEditingProduct(p); setProductModalOpen(true); }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Kategoriyalar Boshqaruvi</h2>
              <button
                type="button"
                onClick={() => { setEditingCategory(null); setCategoryModalOpen(true); }}
                className="btn btn-primary"
              >
                <Plus size={16} /> Yangi Kategoriya
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {categories.map((c) => (
                <div key={c.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                  <img src={c.image_url} alt={c.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }} />
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.3rem 0 1rem' }}>{c.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => { setEditingCategory(c); setCategoryModalOpen(true); }} className="btn btn-secondary btn-sm">Tahrirlash</button>
                    <button type="button" onClick={() => handleDeleteCategory(c.id)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>O‘chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM ORDERS */}
        {activeTab === 'custom_orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Barcha Maxsus Buyurtmalar va Murojaatlar</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Mijozlar tomonidan qoldirilgan barcha individual buyurtma va murojaatlar</p>
              </div>
              <span className="badge badge-wood" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                Jami: {customOrders.length} ta
              </span>
            </div>

            {customOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Hozircha maxsus buyurtmalar yo‘q</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mijozlar buyurtma berganda bu yerda darhol aks etadi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {customOrders.map((o) => (
                  <div key={o.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <strong style={{ color: 'var(--wood-amber)', fontSize: '1.15rem' }}>{o.order_number}</strong>
                          <span className="badge badge-wood">{o.status || 'NEW'}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleString('uz-UZ')}</span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{o.title || o.furniture_type || o.category || 'Mebel Buyurtmasi'}</h4>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{o.customer_name || o.full_name || 'Mijoz'}</div>
                        <a href={`tel:${o.customer_phone || o.phone}`} style={{ color: 'var(--wood-amber)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          📞 {o.customer_phone || o.phone || 'Telefon yo‘q'}
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <div><strong>Kategoriya / Xona:</strong> {o.category || o.room_type || 'Noma‘lum'}</div>
                      <div><strong>O‘lchamlari:</strong> {o.dimensions || (o.length ? `${o.length}x${o.width}x${o.height} sm` : 'Ko‘rsatilmagan')}</div>
                      <div><strong>Material / Yog‘och:</strong> {o.wood_type || o.material || 'Standart'}</div>
                      <div><strong>Rang / Lak:</strong> {o.color_finish || o.color || 'Standart'}</div>
                    </div>

                    {(o.notes || o.description || o.special_requirements) && (
                      <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--wood-amber)', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                        <strong>Mijoz talabi / Izohi:</strong> {o.notes || o.description || o.special_requirements}
                      </div>
                    )}

                    {o.files && o.files.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Biriktirilgan rasmlar:</span>
                        {o.files.map((f, idx) => (
                          <a key={idx} href={f.file_url || f.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
                            <img src={f.file_url || f.url} alt="file" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
                          </a>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {o.assigned_craftsman ? `Biriktirilgan usta: ${o.assigned_craftsman_name || o.assigned_craftsman}` : 'Hali ustaga biriktirilmagan'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a href={`tel:${o.customer_phone || o.phone}`} className="btn btn-secondary btn-sm">
                          Mijozga Qo‘ng‘iroq
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4.5: STANDARD SHOP ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Do‘kon Xaridlari (Savatdan tushgan buyurtmalar)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Saytdagi tayyor mebellarni onlayn sotib olgan mijozlar buyurtmalari</p>
              </div>
              <span className="badge badge-wood" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                Jami: {standardOrders.length} ta
              </span>
            </div>

            {standardOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛍️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Hozircha do‘kon xaridlari yo‘q</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mijoz savatdan xarid qilganda bu yerda darhol aks etadi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {standardOrders.map((ord) => (
                  <div key={ord.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <strong style={{ color: 'var(--wood-amber)', fontSize: '1.15rem' }}>{ord.order_number}</strong>
                          <span className="badge badge-wood">{ord.status || 'PENDING'}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.created_at ? new Date(ord.created_at).toLocaleString('uz-UZ') : ''}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          Yetkazib berish manzili: <strong style={{ color: 'var(--text-main)' }}>{ord.shipping_address || ord.address || 'Ko‘rsatilmagan'}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
                          {(Number(ord.total_amount) || 0).toLocaleString()} so‘m
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{ord.customer_name || ord.full_name || 'Mijoz'}</div>
                        <a href={`tel:${ord.customer_phone || ord.phone}`} style={{ color: 'var(--wood-amber)', fontWeight: 600, fontSize: '0.9rem' }}>
                          📞 {ord.customer_phone || ord.phone}
                        </a>
                      </div>
                    </div>

                    {/* Order items */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Xarid qilingan mebellar:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {(ord.items || []).map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.88rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {it.image && <img src={it.image} alt={it.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />}
                              <span><strong>{it.name}</strong> × {it.quantity} dona</span>
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--wood-amber)' }}>
                              {(Number(it.price) * (it.quantity || 1)).toLocaleString()} so‘m
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        To‘lov usuli: <strong>{ord.payment_method === 'cash_on_delivery' ? 'Naqd (yetkazganda)' : ord.payment_method}</strong>
                      </span>
                      <a href={`tel:${ord.customer_phone || ord.phone}`} className="btn btn-secondary btn-sm">
                        📞 Mijozga Bog‘lanish
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CRAFTSMEN CRUD */}
        {activeTab === 'craftsmen' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Duradgor Ustalar Boshqaruvi</h2>
              <button
                type="button"
                onClick={() => { setEditingCraftsman(null); setCraftsmanModalOpen(true); }}
                className="btn btn-primary"
              >
                <Plus size={16} /> Yangi Usta Qo‘shish
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {craftsmen.map((c) => (
                <div key={c.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img src={c.photo_url} alt={c.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.experience_years} yil tajriba</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{c.bio}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => { setEditingCraftsman(c); setCraftsmanModalOpen(true); }} className="btn btn-secondary btn-sm">Tahrirlash</button>
                    <button type="button" onClick={() => handleDeleteCraftsman(c.id)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>O‘chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMMENTS MODERATION */}
        {activeTab === 'comments' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sharhlar Moderatsiyasi</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.map((comm) => (
                <div key={comm.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>{comm.user_name}</strong>
                    <span style={{ color: '#d97706', fontWeight: 700 }}>★ {comm.rating}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{comm.content}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => handleModerateComment(comm.id, 'hide')}
                      className="btn btn-secondary btn-sm"
                    >
                      {comm.is_hidden ? 'Ko‘rsatish' : 'Yashirish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateComment(comm.id, 'delete')}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SYSTEM SETTINGS (DYNAMIC PLATFORM TITLE) */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>SUPER ADMIN SOZLAMALARI</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Tizim & Web Loyiha Nomi</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Loyiha nomini o‘zgartiring. Ushbu o‘zgarish saytning butun qismida (Navbar, Footer, Sarlavhalar, Brauzer oynasi va Admin panelida) darhol amal qiladi!
              </p>
            </div>

            <form
              onSubmit={handleSaveSettings}
              style={{
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                border: '1.5px solid var(--wood-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="glass-card"
            >
              {/* PRIMARY REQUIREMENT: Web Loyiha Nomi */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ fontSize: '1rem', color: 'var(--wood-amber)' }}>
                  ★ Web Loyiha Nomi (Platform Title) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.site_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                  placeholder="Masalan: Urgut Mebel Markazi"
                  className="form-input"
                  style={{ fontSize: '1.15rem', fontWeight: 700, borderColor: 'var(--wood-amber)' }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  Ushbu nom butun loyiha bo‘ylab bir lahzada yangilanadi.
                </span>
              </div>

              {/* LOGO IMAGE UPLOAD */}
              <ImageUploadField
                label="Sayt Logotipi (Logo Rasmi) *"
                value={settingsForm.logo_url || '/pwa-icon.svg'}
                onChange={(val) => setSettingsForm({ ...settingsForm, logo_url: val })}
                folder="logos"
                name="logo_url"
                placeholder="https://... yoki fayldan tanlang"
                helperText="Saytning boshidagi (Header) va pastidagi (Footer) logotip rasmi. Kompyuterdan rasm yuklash yoki URL kiritishingiz mumkin."
              />

              <div className="form-group">
                <label className="form-label">Sayt Shiori (Tagline)</label>
                <input
                  type="text"
                  value={settingsForm.site_tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, site_tagline: e.target.value })}
                  placeholder="Sifatli va qulay mebellar uyingiz uchun"
                  className="form-input"
                />
              </div>

              <ImageUploadField
                label="Bosh Sahifa Asosiy Banner Rasmi (Hero Banner)"
                value={settingsForm.hero_banner_image}
                onChange={(val) => setSettingsForm({ ...settingsForm, hero_banner_image: val })}
                folder="banners"
                name="hero_banner_image"
                placeholder="https://images.unsplash.com/... yoki kompyuterdan yuklang"
                helperText="Saytning bosh sahifasi fon rasmi. Havola kiriting yoki fayl tanlang (Supabase Storage ga saqlanadi)."
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Aloqa Telefoni</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Elektron Pochta</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Urgut Showroom Manzili</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Telegram Manzili</label>
                  <input
                    type="text"
                    value={settingsForm.telegram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instagram Manzili</label>
                  <input
                    type="text"
                    value={settingsForm.instagram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Yuqori Banner E'loni (Header Announcement)</label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  placeholder="Bahorgi aksiya: barcha yotoqxona to‘plamlariga 15% gacha chegirma!"
                  className="form-input"
                />
              </div>

              {/* FOOTER & XIZMATLAR BO'LIMI */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--wood-amber)' }}>
                  Footer & Afzalliklar Sozlamalari (Super Admin)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Saytning pastki qismidagi (Footer) 3 ta xizmat afzalliklari, ish vaqti va tavsif matnlarini tahrirlang.
                </p>

                <div className="form-group">
                  <label className="form-label">Footer Haqida Matni</label>
                  <textarea
                    rows={2}
                    value={settingsForm.footer_about}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footer_about: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ish Vaqti</label>
                  <input
                    type="text"
                    value={settingsForm.working_hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, working_hours: e.target.value })}
                    placeholder="Har kuni 08:30 dan 20:00 gacha (Dam olish kunlarisiz)"
                    className="form-input"
                  />
                </div>

                {/* 3 ta afzallik */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>1-Afzallik Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.feature1_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature1_title: e.target.value })}
                      className="form-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <label className="form-label">1-Afzallik Tavsifi</label>
                    <input
                      type="text"
                      value={settingsForm.feature1_desc}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature1_desc: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>2-Afzallik Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.feature2_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature2_title: e.target.value })}
                      className="form-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <label className="form-label">2-Afzallik Tavsifi</label>
                    <input
                      type="text"
                      value={settingsForm.feature2_desc}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature2_desc: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>3-Afzallik Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.feature3_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature3_title: e.target.value })}
                      className="form-input"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <label className="form-label">3-Afzallik Tavsifi</label>
                    <input
                      type="text"
                      value={settingsForm.feature3_desc}
                      onChange={(e) => setSettingsForm({ ...settingsForm, feature3_desc: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Copyright Matni</label>
                  <input
                    type="text"
                    value={settingsForm.copyright_text}
                    onChange={(e) => setSettingsForm({ ...settingsForm, copyright_text: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* SUPABASE SYNC BUTTON */}
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#10b981', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Database size={16} /> Supabase Ma’lumotlar Bazasi va Sinxronlash
                    </strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Super Admin kiritgan barcha o‘zgarishlar, o‘chirilgan va yangi qo‘shilgan ustalar hamda mebellarni Supabase bulutli bazasiga to‘liq saqlaydi.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                      {copiedSql ? 'SQL Nusxalandi!' : 'SQL Kodni Nusxalash'}
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/hlnzxwcupwaaxrutvnvb/sql/new"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-accent)' }}
                    >
                      <ExternalLink size={14} /> SQL Editor
                    </a>
                    <button
                      type="button"
                      onClick={handleSyncSupabase}
                      disabled={isSyncing}
                      className="btn btn-secondary btn-sm"
                      style={{ backgroundColor: 'var(--bg-card)', color: '#10b981', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.35)' }}
                    >
                      {isSyncing ? 'Yozilmoqda...' : '🔄 Barchasini Supabase-ga Yozish'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Barcha Sozlamalarni Saqlash va Saytda Yangilash
              </button>
            </form>
          </div>
        )}

        {/* TAB: MANAGERS MANAGEMENT (SUPER ADMIN QO'SHADI VA BOSHQARADI) */}
        {activeTab === 'managers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Menedjerlar Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Super Admin sifatida yangi menedjerlarni qo‘shing. Ular mebellar katalogini to‘ldirish, rasmlarni yuklash va tahrirlash vakolatiga ega bo‘ladi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingManager(null);
                  setManagerModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Plus size={16} /> Yangi Menedjer Qo‘shish
              </button>
            </div>

            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Menedjer Ismi</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Email (Login)</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Parol</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Telefon</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Bo‘lim / Mas'uliyat</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Harakatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Hozircha menedjerlar mavjud emas. Yuqoridagi tugma orqali yangi menedjer qo‘shing.
                      </td>
                    </tr>
                  ) : (
                    managers.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wood-amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                              {m.full_name?.charAt(0) || 'M'}
                            </div>
                            <span>{m.full_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{m.email}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ fontFamily: 'monospace', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                            {m.password || '••••••••'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{m.phone || '-'}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ backgroundColor: 'rgba(212, 163, 89, 0.15)', color: 'var(--gold-accent)', border: '1px solid rgba(212, 163, 89, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {m.department || 'Mebel katalogi'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingManager(m);
                                setManagerModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Tahrirlash"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteManager(m.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#ef4444' }}
                              title="O‘chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REGISTERED USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Foydalanuvchilar va Ro‘yxatdan O‘tgan Mijozlar</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Saytda ro‘yxatdan o‘tgan barcha mijozlar va foydalanuvchilar ro‘yxati (Supabase <code>public.users</code> jadvalida to‘liq saqlanadi).
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Foydalanuvchi</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Telefon</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Roli</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Ro‘yxatdan o‘tgan sana</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Hozircha birorta ham ro‘yxatdan o‘tgan foydalanuvchi yo‘q
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                              {u.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700 }}>{u.full_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                          {u.phone || '—'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: u.role === 'admin' ? 'rgba(239,68,68,0.15)' : u.role === 'manager' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                            color: u.role === 'admin' ? '#ef4444' : u.role === 'manager' ? '#3b82f6' : '#10b981'
                          }}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'manager' ? 'Menedjer' : 'Mijoz'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('uz-UZ') : '—'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444' }}
                            title="O‘chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* PRODUCT CREATE/EDIT MODAL */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingProduct ? 'Mebelni Tahrirlash' : 'Yangi Mebel Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Mebel Nomi *</label>
                <input type="text" required name="name" defaultValue={editingProduct?.name || ''} className="form-input" />
              </div>
              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Narxi (so‘m) *</label>
                  <input type="number" required name="price" defaultValue={editingProduct?.price || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chegirma Narxi (so‘m)</label>
                  <input type="number" name="discount_price" defaultValue={editingProduct?.discount_price || ''} className="form-input" />
                </div>
              </div>
              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Kategoriya</label>
                  <select name="category_id" defaultValue={editingProduct?.category_id || categories[0]?.id} className="form-select">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Omborda mavjud soni</label>
                  <input type="number" name="stock" defaultValue={editingProduct?.stock ?? 10} className="form-input" />
                </div>
              </div>
              <ImageUploadField
                label="Mebel Rasmi (URL yoki Supabase-ga yuklash)"
                name="image_url"
                value={editingProduct?.images?.[0] || ''}
                folder="furniture"
                placeholder="https://... yoki faylni tanlab yuklang"
                helperText="Mebel rasm havolasini kiriting yoki fayl tanlang (Supabase Storage ga yuklanadi va URL qo‘yiladi)."
              />
              <div className="form-group">
                <label className="form-label">Material</label>
                <input type="text" name="material" defaultValue={editingProduct?.material || 'Eman massiv'} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">O‘lchamlari</label>
                <input type="text" name="dimensions" defaultValue={editingProduct?.dimensions || '200x90x85 sm'} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Tavsif</label>
                <textarea rows={3} name="description" defaultValue={editingProduct?.description || ''} className="form-textarea" />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                  <input type="checkbox" name="is_published" defaultChecked={editingProduct ? editingProduct.is_published : true} />
                  <span>E‘lon qilish</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                  <input type="checkbox" name="is_featured" defaultChecked={editingProduct?.is_featured} />
                  <span>Asosiy sahifada</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                  <input type="checkbox" name="is_new" defaultChecked={editingProduct ? editingProduct.is_new : true} />
                  <span>Yangi belgisini qo‘yish</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE/EDIT MODAL */}
      {categoryModalOpen && (
        <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
            </h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Kategoriya Nomi *</label>
                <input type="text" required name="name" defaultValue={editingCategory?.name || ''} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input type="text" name="slug" defaultValue={editingCategory?.slug || ''} placeholder="masalan: oshxona" className="form-input" />
              </div>
              <ImageUploadField
                label="Kategoriya Rasmi (URL yoki Supabase-ga yuklash)"
                name="image_url"
                value={editingCategory?.image_url || ''}
                folder="categories"
                placeholder="https://... yoki fayldan yuklang"
                helperText="Kategoriya uchun muqova rasmi (URL yoki Supabase-ga yuklang)."
              />
              <div className="form-group">
                <label className="form-label">Qisqa Tavsif</label>
                <input type="text" name="description" defaultValue={editingCategory?.description || ''} className="form-input" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CRAFTSMAN CREATE/EDIT MODAL */}
      {craftsmanModalOpen && (
        <div className="modal-overlay" onClick={() => setCraftsmanModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '540px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingCraftsman ? 'Ustani Tahrirlash' : 'Yangi Usta Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveCraftsman}>
              <div className="form-group">
                <label className="form-label">Usta To‘liq Ismi *</label>
                <input type="text" required name="name" defaultValue={editingCraftsman?.name || ''} className="form-input" />
              </div>
              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Login Email *</label>
                  <input type="email" required name="email" defaultValue={editingCraftsman?.email || ''} placeholder="usta@urgutmebel.uz" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Kirish Paroli *</label>
                  <input type="text" required name="password" defaultValue={editingCraftsman?.password || 'usta12345'} className="form-input" />
                </div>
              </div>
              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Tajribasi (yil)</label>
                  <input type="number" name="experience_years" defaultValue={editingCraftsman?.experience_years || 5} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Joylashuv</label>
                  <input type="text" name="location" defaultValue={editingCraftsman?.location || 'Urgut tumani'} className="form-input" />
                </div>
              </div>
              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input type="text" name="phone" defaultValue={editingCraftsman?.phone || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telegram</label>
                  <input type="text" name="telegram" defaultValue={editingCraftsman?.telegram || ''} className="form-input" />
                </div>
              </div>
              <ImageUploadField
                label="Usta Fotosurati (URL yoki Supabase-ga yuklash)"
                name="photo_url"
                value={editingCraftsman?.photo_url || ''}
                folder="craftsmen"
                placeholder="https://... yoki fayldan yuklang"
                helperText="Usta profili uchun fotosurat (URL yoki Supabase Storage ga saqlanadi)."
              />
              <div className="form-group">
                <label className="form-label">Ixtisosliklar (vergul bilan)</label>
                <input type="text" name="specializations" defaultValue={editingCraftsman?.specializations?.join(', ') || 'Klassik mebel, Oshxona'} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Biografiya</label>
                <textarea rows={3} name="bio" defaultValue={editingCraftsman?.bio || ''} className="form-textarea" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANAGER CREATE/EDIT MODAL */}
      {managerModalOpen && (
        <div className="modal-overlay" onClick={() => setManagerModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingManager ? 'Menedjerni Tahrirlash' : 'Yangi Menedjer Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveManager}>
              <div className="form-group">
                <label className="form-label">Menedjer To‘liq Ismi *</label>
                <input
                  type="text"
                  required
                  name="full_name"
                  defaultValue={editingManager?.full_name || ''}
                  placeholder="Masalan: Jasur Menedjer"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Tizimga kirish uchun) *</label>
                <input
                  type="email"
                  required
                  name="email"
                  defaultValue={editingManager?.email || ''}
                  placeholder="manager@urgutmebel.uz"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parol *</label>
                <input
                  type="text"
                  required
                  name="password"
                  defaultValue={editingManager?.password || 'manager12345'}
                  placeholder="Menedjer paroli"
                  className="form-input"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Menedjer ushbu email va parol orqali tizimga kiradi.
                </span>
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingManager?.phone || '+998 90 123 45 67'}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bo‘lim / Mas'uliyat</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingManager?.department || 'Katalog va Buyurtmalar'}
                    placeholder="Masalan: Oshxona mebellari"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setManagerModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
