import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
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
  DollarSign
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin, isGuest, openAuthModal } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [standardOrders, setStandardOrders] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const [comments, setComments] = useState([]);
  const [banners, setBanners] = useState([]);
  const [managers, setManagers] = useState([]);

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
    feature3_desc: settings.feature3_desc || ''
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    addToast('Barcha default ma’lumotlar Supabase-ga ko‘chirilmoqda...', 'info');
    const res = await dataService.syncAllDataToSupabase();
    setIsSyncing(false);
    if (res.success) {
      addToast('Barcha ma’lumotlar (sozlamalar, kategoriyalar, mebellar) muvaffaqiyatli Supabase-ga ko‘chirildi!', 'success');
      loadAllData();
    } else {
      addToast(`Xatolik: ${res.error}`, 'error');
    }
  };

  const loadAllData = async () => {
    try {
      const [prods, cats, cOrders, sOrders, crafts, comms, bans, mgrs] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getCustomOrders(),
        dataService.getStandardOrders(),
        dataService.getCraftsmen(),
        dataService.getComments(),
        dataService.getBanners(),
        dataService.getManagers()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setCustomOrders(cOrders || []);
      setStandardOrders(sOrders || []);
      setCraftsmen(crafts || []);
      setComments(comms || []);
      setBanners(bans || []);
      setManagers(mgrs || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAllData();
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
      feature3_desc: settings.feature3_desc || 'Asriy hunarmandchilik va zamonaviy texnologiya uyg‘unligi'
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

    await dataService.saveProduct(prodData);
    addToast('Mahsulot muvaffaqiyatli saqlandi!', 'success');
    setProductModalOpen(false);
    setEditingProduct(null);
    loadAllData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Rostdan ham ushbu mebelni o‘chirmoqchimisiz?")) {
      await dataService.deleteProduct(id);
      addToast('Mahsulot o‘chirildi', 'info');
      loadAllData();
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
    await dataService.saveCategory(catData);
    addToast('Kategoriya saqlandi!', 'success');
    setCategoryModalOpen(false);
    setEditingCategory(null);
    loadAllData();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Kategoriyani o‘chirishni xohlaysizmi?")) {
      await dataService.deleteCategory(id);
      addToast('Kategoriya o‘chirildi', 'info');
      loadAllData();
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
    await dataService.saveCraftsman(craftData);
    addToast('Usta saqlandi! Endi u o‘z paroli bilan Usta paneliga (/craftsman) kira oladi.', 'success');
    setCraftsmanModalOpen(false);
    setEditingCraftsman(null);
    loadAllData();
  };

  const handleDeleteCraftsman = async (id) => {
    if (window.confirm("Ustani o‘chirmoqchimisiz?")) {
      await dataService.deleteCraftsman(id);
      addToast('Usta profili o‘chirildi', 'info');
      loadAllData();
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

    await dataService.saveManager(mgrData);
    addToast('Menedjer saqlandi! Endi u o‘z paroli bilan tizimga kira oladi.', 'success');
    setManagerModalOpen(false);
    setEditingManager(null);
    loadAllData();
  };

  const handleDeleteManager = async (id) => {
    if (window.confirm("Rostdan ham ushbu menedjerni o‘chirmoqchimisiz?")) {
      await dataService.deleteManager(id);
      addToast('Menedjer o‘chirildi', 'info');
      loadAllData();
    }
  };

  // Comments moderation
  const handleModerateComment = async (id, action) => {
    await dataService.moderateComment(id, action);
    addToast(`Sharh: ${action}`, 'info');
    loadAllData();
  };

  // Total revenue calc
  const totalRevenue = standardOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  return (
    <div style={{ display: 'flex', minHeight: '90vh', backgroundColor: '#f9f8f6' }}>
      
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-dark)',
          color: '#e7e5e4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
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
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'overview' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'overview' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <LayoutDashboard size={17} /> Umumiy Statistika
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'products' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'products' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Package size={17} /> Mahsulotlar ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'categories' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'categories' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Layers size={17} /> Kategoriyalar ({categories.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom_orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'custom_orders' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'custom_orders' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Sliders size={17} /> Maxsus Buyurtmalar ({customOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'orders' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <ShoppingBag size={17} /> Do‘kon Buyurtmalari ({standardOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('craftsmen')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'craftsmen' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'craftsmen' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Award size={17} /> Ustalar ({craftsmen.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'comments' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'comments' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <MessageSquare size={17} /> Sharhlar ({comments.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('managers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'managers' ? '#ffffff' : '#a8a29e',
                backgroundColor: activeTab === 'managers' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Users size={17} /> Menedjerlar ({managers.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'settings' ? 'var(--gold-accent)' : '#a8a29e',
                backgroundColor: activeTab === 'settings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <SettingsIcon size={17} /> Tizim & Sayt Nomi
            </button>
          </nav>
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#78716c' }}>
          <div>Foydalanuvchi: {user.full_name}</div>
          <div style={{ color: 'var(--status-success)', marginTop: '0.2rem' }}>● Tizim faol</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Platforma Statistikasi</h2>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>JAMI SAVDO (TUSHUM)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--wood-amber)', marginTop: '0.4rem' }}>
                  {Number(totalRevenue).toLocaleString()} so‘m
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>MAXSUS BUYURTMALAR</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {customOrders.length} ta
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>MAHSULOTLAR SONI</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {products.length} ta
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>RO‘YXATDAGI USTALAR</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
                  {craftsmen.length} nafar
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mahsulotlar Boshqaruvi</h2>
              <button
                type="button"
                onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}
                className="btn btn-primary"
              >
                <Plus size={16} /> Yangi Mebel Qo‘shish
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
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
                <div key={c.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Barcha Maxsus Buyurtmalar</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {customOrders.map((o) => (
                <div key={o.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: 'var(--wood-amber)', fontSize: '1.1rem' }}>{o.order_number}</strong> — {o.furniture_type}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mijoz: {o.full_name} ({o.phone}) | O‘lchami: {o.length}x{o.width}x{o.height} sm</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-wood">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
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
                <div key={c.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
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
                <div key={comm.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
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
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                border: '1.5px solid var(--wood-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
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
                  <div style={{ padding: '0.9rem', backgroundColor: '#fcfbfa', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
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

                  <div style={{ padding: '0.9rem', backgroundColor: '#fcfbfa', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
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

                  <div style={{ padding: '0.9rem', backgroundColor: '#fcfbfa', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
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
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#166534', fontSize: '0.95rem' }}>🔄 Supabase-ga Ma’lumotlarni Ko‘chirish</strong>
                    <p style={{ color: '#15803d', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Barcha default mahsulotlar, kategoriyalar va sozlamalarni bevosita ulangan Supabase bazasiga ko‘chiradi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncSupabase}
                    disabled={isSyncing}
                    className="btn btn-secondary btn-sm"
                    style={{ backgroundColor: '#ffffff', color: '#166534', fontWeight: 700 }}
                  >
                    {isSyncing ? 'Ko‘chirilmoqda...' : 'Barchasini Supabase-ga Yozish'}
                  </button>
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

            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: '#fcfbf9', borderBottom: '1px solid var(--border-subtle)' }}>
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
                          <span style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                            {m.password || '••••••••'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{m.phone || '-'}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Narxi (so‘m) *</label>
                  <input type="number" required name="price" defaultValue={editingProduct?.price || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chegirma Narxi (so‘m)</label>
                  <input type="number" name="discount_price" defaultValue={editingProduct?.discount_price || ''} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div className="form-group">
                <label className="form-label">Rasm URL manzili</label>
                <input type="url" name="image_url" defaultValue={editingProduct?.images?.[0] || ''} placeholder="https://..." className="form-input" />
              </div>
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
              <div className="form-group">
                <label className="form-label">Rasm URL</label>
                <input type="url" name="image_url" defaultValue={editingCategory?.image_url || ''} className="form-input" />
              </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Login Email *</label>
                  <input type="email" required name="email" defaultValue={editingCraftsman?.email || ''} placeholder="usta@urgutmebel.uz" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Kirish Paroli *</label>
                  <input type="text" required name="password" defaultValue={editingCraftsman?.password || 'usta12345'} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tajribasi (yil)</label>
                  <input type="number" name="experience_years" defaultValue={editingCraftsman?.experience_years || 5} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Joylashuv</label>
                  <input type="text" name="location" defaultValue={editingCraftsman?.location || 'Urgut tumani'} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input type="text" name="phone" defaultValue={editingCraftsman?.phone || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telegram</label>
                  <input type="text" name="telegram" defaultValue={editingCraftsman?.telegram || ''} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Surat URL</label>
                <input type="url" name="photo_url" defaultValue={editingCraftsman?.photo_url || ''} className="form-input" />
              </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
