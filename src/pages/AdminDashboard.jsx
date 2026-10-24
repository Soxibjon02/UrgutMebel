import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { dataService, getStored, DEFAULT_HOME_SECTIONS, sortWithDiscountsFirst } from '../services/dataService';
import {
  initialProducts,
  initialCategories,
  initialCraftsmen,
  initialOrders,
  initialCustomOrders,
  initialComments,
  initialBanners,
  initialSettings,
  initialStores,
  initialDiscountRequests,
  initialCollections
} from '../data/mockData';
import {
  Shield,
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
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
  Menu,
  Loader2,
  Info,
  Store,
  Star,
  Trophy,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  Wifi,
  SlidersHorizontal,
  MoveUp,
  MoveDown,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Filter
} from 'lucide-react';
import ImageUploadField from '../components/ImageUploadField';
import { StatusBadge } from '../components/StatusBadge';
import { realtimeService } from '../services/realtimeService';
import { CUSTOM_ORDER_STATUS_OPTIONS, STANDARD_ORDER_STATUS_OPTIONS } from '../utils/statusHelper';
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
  const [stores, setStores] = useState(() => getStored('stores', initialStores));
  const [discountRequests, setDiscountRequests] = useState(() => getStored('discount_requests', initialDiscountRequests));
  const [managers, setManagers] = useState(() => getStored('managers', []));
  const [usersList, setUsersList] = useState(() => getStored('urgut_mebel_registered_users', []));

  // Dynamic Homepage Sections Configuration (Super Admin full control)
  const [homeSections, setHomeSections] = useState(() => getStored('home_sections', DEFAULT_HOME_SECTIONS));
  const [editingSection, setEditingSection] = useState(null);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionCategoryFilter, setSectionCategoryFilter] = useState('ALL');

  // Collections State (Super Admin)
  const [collections, setCollections] = useState(() => getStored('collections', initialCollections));
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [assignProductsModalOpen, setAssignProductsModalOpen] = useState(false);
  const [selectedColForProducts, setSelectedColForProducts] = useState(null);
  const [colProductSearch, setColProductSearch] = useState('');
  const [colCategoryFilter, setColCategoryFilter] = useState('ALL');

  // Product Filtering by Category & Search (Super Admin & Store Manager)
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productStoreFilter, setProductStoreFilter] = useState('ALL');

  // Modals & Forms
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewPlacement, setReviewPlacement] = useState('discount_section');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [craftsmanModalOpen, setCraftsmanModalOpen] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState(null);
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscountProduct, setEditingDiscountProduct] = useState(null);
  const [discountVal, setDiscountVal] = useState('');
  const [discountType, setDiscountType] = useState('price'); // 'price' | 'percent'
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    hero_title: settings.hero_title || '',
    hero_subtitle: settings.hero_subtitle || '',
    logo_url: settings.logo_url || '/pwa-icon.svg',

    // Biz Haqimizda (About Page) fields
    about_title: settings.about_title || 'Urgut Mebel Markazi Haqida',
    about_subtitle: settings.about_subtitle || settings.site_tagline || "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi",
    about_badge: settings.about_badge || 'Tarix & Mahorat',
    about_story_title: settings.about_story_title || 'Urgut Duradgorlarining Asriy Merosi',
    about_story_p1: settings.about_story_p1 || "Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik, ayniqsa yog‘ochsozlik va mebelchilik maktabi bilan butun O‘rta Osiyoda dong taratgan.",
    about_story_p2: settings.about_story_p2 || "Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari (CNC kesish, avstriyalik Blum fitinglari, ekologik xavfsiz bo‘yoqlar) bilan birlashtirib, har bir xonadonga ko‘p yillar xizmat qiluvchi hashamatli va qulay mebellarni taqdim etamiz.",
    about_image_url: settings.about_image_url || 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80',
    about_btn_text: settings.about_btn_text || 'Maxsus Buyurtma Berish',
    about_btn_url: settings.about_btn_url || '/custom-order',
    about_stat1_number: settings.about_stat1_number || '25+',
    about_stat1_label: settings.about_stat1_label || 'Yillik Tajriba',
    about_stat2_number: settings.about_stat2_number || '10,000+',
    about_stat2_label: settings.about_stat2_label || 'Tayyorlangan Mebellar',
    about_stat3_number: settings.about_stat3_number || '98%',
    about_stat3_label: settings.about_stat3_label || 'Mamnun Mijozlar',
    about_stat4_number: settings.about_stat4_number || '5 Yil',
    about_stat4_label: settings.about_stat4_label || 'Rasmiy Kafolat',
    about_val1_title: settings.about_val1_title || '100% Tabiiy Massiv',
    about_val1_desc: settings.about_val1_desc || 'Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz. Mebellar yorilmaydi va qiyshaymaydi.',
    about_val2_title: settings.about_val2_title || 'Rasmiy Kafolat',
    about_val2_desc: settings.about_val2_desc || 'Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat va servis xizmati beriladi.',
    about_val3_title: settings.about_val3_title || '200+ Mohir Usta',
    about_val3_desc: settings.about_val3_desc || 'Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib, buyurtma berishingiz mumkin.',

    // Header Afishalari va Slayder Rasmlari
    chairs_hero_slides: settings.chairs_hero_slides || initialSettings.chairs_hero_slides || [],
    sofas_hero_slides: settings.sofas_hero_slides || initialSettings.sofas_hero_slides || [],
    blog_hero_slides: settings.blog_hero_slides || initialSettings.blog_hero_slides || [],
    faq_hero_slides: settings.faq_hero_slides || initialSettings.faq_hero_slides || [],
    collection_carousel_slides: settings.collection_carousel_slides || [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [selectedAfishaKey, setSelectedAfishaKey] = useState('chairs_hero_slides');
  const [newSlideUrl, setNewSlideUrl] = useState('');

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
      const [prods, cats, cOrders, sOrders, crafts, comms, bans, mgrs, usrs, strs, dReqs, secList, colList] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getCustomOrders(),
        dataService.getStandardOrders(),
        dataService.getCraftsmen(),
        dataService.getComments(),
        dataService.getBanners(),
        dataService.getManagers(),
        dataService.getUsers(),
        dataService.getStores(),
        dataService.getDiscountRequests(),
        dataService.getHomeSections(),
        dataService.getCollections()
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
      setStores(strs || []);
      setDiscountRequests(dReqs || []);
      if (secList && secList.length > 0) setHomeSections(secList);
      if (colList && colList.length > 0) setCollections(colList);
    } catch (e) {
      console.error(e);
    }
  };

  const [wsStatus, setWsStatus] = useState(realtimeService.connectionStatus || 'active');

  const handleAdminUpdateCustomOrderStatus = async (orderId, newStatus) => {
    try {
      await dataService.updateCustomOrderStatus(
        orderId,
        newStatus,
        `Super Admin (${user?.full_name || 'Admin'}) tomonidan yangilandi`,
        user?.full_name || 'Super Admin'
      );
      addToast(`Maxsus buyurtma holati yangilandi: ${newStatus}`, 'success');
      loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAdminUpdateStandardOrderStatus = async (orderId, newStatus) => {
    try {
      await dataService.updateStandardOrderStatus(orderId, newStatus);
      addToast(`Do‘kon buyurtmasi holati yangilandi: ${newStatus}`, 'success');
      loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
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
    window.addEventListener('urgut_store_stores_updated', handleUpdate);
    window.addEventListener('urgut_store_discount_requests_updated', handleUpdate);
    window.addEventListener('urgut_store_products_updated', handleUpdate);
    window.addEventListener('urgut_store_collections_updated', handleUpdate);
    window.addEventListener('urgut_realtime_event', handleUpdate);

    const unsubRealtime = realtimeService.subscribe(() => {
      loadAllData();
    });

    const handleWsStatus = (e) => {
      setWsStatus(e.detail || 'active');
    };
    window.addEventListener('urgut_ws_status_change', handleWsStatus);

    const interval = setInterval(loadAllData, 10000);
    return () => {
      window.removeEventListener('urgut_store_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_standard_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_custom_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_managers_updated', handleUpdate);
      window.removeEventListener('urgut_store_craftsmen_updated', handleUpdate);
      window.removeEventListener('urgut_store_stores_updated', handleUpdate);
      window.removeEventListener('urgut_store_discount_requests_updated', handleUpdate);
      window.removeEventListener('urgut_store_products_updated', handleUpdate);
      window.removeEventListener('urgut_realtime_event', handleUpdate);
      window.removeEventListener('urgut_ws_status_change', handleWsStatus);
      unsubRealtime();
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
      hero_banner_image: settings.hero_banner_image || '',
      hero_title: settings.hero_title || '',
      hero_subtitle: settings.hero_subtitle || '',
      logo_url: settings.logo_url || '/pwa-icon.svg',

      about_title: settings.about_title || 'Urgut Mebel Markazi Haqida',
      about_subtitle: settings.about_subtitle || settings.site_tagline || "Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi",
      about_badge: settings.about_badge || 'Tarix & Mahorat',
      about_story_title: settings.about_story_title || 'Urgut Duradgorlarining Asriy Merosi',
      about_story_p1: settings.about_story_p1 || "Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik, ayniqsa yog‘ochsozlik va mebelchilik maktabi bilan butun O‘rta Osiyoda dong taratgan.",
      about_story_p2: settings.about_story_p2 || "Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari (CNC kesish, avstriyalik Blum fitinglari, ekologik xavfsiz bo‘yoqlar) bilan birlashtirib, har bir xonadonga ko‘p yillar xizmat qiluvchi hashamatli va qulay mebellarni taqdim etamiz.",
      about_image_url: settings.about_image_url || 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80',
      about_btn_text: settings.about_btn_text || 'Maxsus Buyurtma Berish',
      about_btn_url: settings.about_btn_url || '/custom-order',
      about_stat1_number: settings.about_stat1_number || '25+',
      about_stat1_label: settings.about_stat1_label || 'Yillik Tajriba',
      about_stat2_number: settings.about_stat2_number || '10,000+',
      about_stat2_label: settings.about_stat2_label || 'Tayyorlangan Mebellar',
      about_stat3_number: settings.about_stat3_number || '98%',
      about_stat3_label: settings.about_stat3_label || 'Mamnun Mijozlar',
      about_stat4_number: settings.about_stat4_number || '5 Yil',
      about_stat4_label: settings.about_stat4_label || 'Rasmiy Kafolat',
      about_val1_title: settings.about_val1_title || '100% Tabiiy Massiv',
      about_val1_desc: settings.about_val1_desc || 'Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz. Mebellar yorilmaydi va qiyshaymaydi.',
      about_val2_title: settings.about_val2_title || 'Rasmiy Kafolat',
      about_val2_desc: settings.about_val2_desc || 'Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat va servis xizmati beriladi.',
      about_val3_title: settings.about_val3_title || '200+ Mohir Usta',
      about_val3_desc: settings.about_val3_desc || 'Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib, buyurtma berishingiz mumkin.',

      chairs_hero_slides: settings.chairs_hero_slides || initialSettings.chairs_hero_slides || [],
      sofas_hero_slides: settings.sofas_hero_slides || initialSettings.sofas_hero_slides || [],
      blog_hero_slides: settings.blog_hero_slides || initialSettings.blog_hero_slides || [],
      faq_hero_slides: settings.faq_hero_slides || initialSettings.faq_hero_slides || [],
      collection_carousel_slides: settings.collection_carousel_slides || [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
      ]
    });
  }, [settings]);

  if (isGuest || !isAdmin) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <Shield size={54} style={{ color: 'var(--wood-amber)', margin: '0 auto 1rem', display: 'block' }} />
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

  // Handle Settings Save (Web Loyiha Nomini o'zgartirish va Supabase-ga to'g'ridan-to'g'ri saqlash)
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsForm);
      addToast(`Barcha sozlamalar Supabase bazasiga muvaffaqiyatli saqlandi va saytda yangilandi!`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Xatolik: Sozlamalarni saqlashda xatolik yuz berdi (${err.message || 'Supabase xatosi'})`, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsForm);
      addToast(`"Biz Haqimizda" ma‘lumotlari saqlandi va saytda yangilandi!`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Xatolik: ${err.message || 'Saqlashda xatolik yuz berdi'}`, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Products CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const imgUrl = form.image_url?.value || editingProduct?.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    const selectedStoreId = user?.store_id || form.store_id?.value || editingProduct?.store_id || (stores[0]?.id || 'store-1');
    const matchedStore = stores.find(s => s.id === selectedStoreId);
    const rawCraftsmanVal = form.craftsman_id?.value;
    const selectedCraftsmanId = rawCraftsmanVal && rawCraftsmanVal !== 'NONE' ? rawCraftsmanVal : (editingProduct?.craftsman_id || null);

    const prodData = {
      ...(editingProduct || {}),
      name,
      slug: editingProduct?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(form.price.value),
      discount_price: form.discount_price.value ? Number(form.discount_price.value) : null,
      category_id: form.category_id.value || null,
      store_id: selectedStoreId,
      store_name: matchedStore?.name || editingProduct?.store_name || "Urgut Shahar Mebel Markazi",
      store_phone: matchedStore?.phone || editingProduct?.store_phone || "+998 90 123 45 67",
      craftsman_id: selectedCraftsmanId,
      material: form.material.value,
      dimensions: form.dimensions.value,
      stock: Number(form.stock.value) || 0,
      is_published: form.is_published.checked,
      is_featured: form.is_featured.checked,
      is_new: form.is_new.checked,
      description: form.description.value,
      images: [imgUrl],
      image_url: imgUrl
    };

    setProductModalOpen(false);
    setEditingProduct(null);
    addToast('Mahsulot saqlanmoqda...', 'info');
    const updated = await dataService.saveProduct(prodData);
    setProducts(updated);
    addToast('Mahsulot muvaffaqiyatli saqlandi!', 'success');
  };

  // ==========================================
  // HOMEPAGE SECTIONS & LAYOUT MANAGEMENT
  // ==========================================
  const handleMoveSection = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= homeSections.length) return;
    const reordered = [...homeSections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const updated = reordered.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setHomeSections(updated);
    await dataService.saveHomeSections(updated);
    addToast(`"${moved.name}" bo‘limi tartibi #${targetIndex + 1}-o‘ringa o‘tkazildi!`, 'info');
  };

  const handleToggleSectionActive = async (section) => {
    const nextState = section.is_active === false;
    const updated = homeSections.map((s) =>
      s.id === section.id ? { ...s, is_active: nextState } : s
    );
    setHomeSections(updated);
    await dataService.saveHomeSections(updated);
    addToast(`"${section.name}" ${nextState ? 'faollashtirildi' : 'o‘chirildi'}`, nextState ? 'success' : 'info');
  };

  const handleOpenEditSection = (section) => {
    setEditingSection({ ...section });
    setSectionModalOpen(true);
  };

  const handleSaveSectionForm = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    const form = e.target;
    const updatedSec = {
      ...editingSection,
      title: form.title.value.trim(),
      subtitle: form.subtitle?.value?.trim() || '',
      badge: form.badge?.value?.trim() || '',
      banner_image: form.banner_image?.value?.trim() || editingSection.banner_image || '',
      link: form.link?.value?.trim() || editingSection.link || '',
      is_active: form.is_active.checked
    };
    const updatedList = homeSections.map((s) => s.id === updatedSec.id ? updatedSec : s);
    setHomeSections(updatedList);
    await dataService.saveHomeSections(updatedList);
    setSectionModalOpen(false);
    setEditingSection(null);
    addToast(`"${updatedSec.name}" bo‘limi muvaffaqiyatli saqlandi!`, 'success');
  };

  const handleResetSections = async () => {
    if (window.confirm("Barcha bo‘limlar tartibi va sozlamalarini dastlabki holatga qaytarishni xohlaysizmi?")) {
      const def = await dataService.resetHomeSections();
      setHomeSections(def);
      addToast("Barcha bo‘limlar dastlabki holatga qaytarildi", 'info');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Rostdan ham ushbu mebelni o‘chirmoqchimisiz?")) {
      addToast('Mahsulot o‘chirilmoqda...', 'info');
      const updated = await dataService.deleteProduct(id);
      setProducts(updated);
      addToast('Mahsulot o‘chirildi', 'success');
    }
  };

  // Discounts Management
  const handleOpenAddDiscount = (product = null) => {
    setEditingDiscountProduct(product);
    setDiscountVal(product?.discount_price ? String(product.discount_price) : '');
    setDiscountType('price');
    setDiscountModalOpen(true);
  };

  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    if (!editingDiscountProduct) return;
    let finalDiscountPrice = Number(discountVal);
    if (discountType === 'percent') {
      const pct = Math.min(99, Math.max(1, Number(discountVal)));
      finalDiscountPrice = Math.round(editingDiscountProduct.price * (1 - pct / 100));
    }
    if (!finalDiscountPrice || finalDiscountPrice >= editingDiscountProduct.price) {
      addToast('Chegirmali narx asl narxdan past bo‘lishi shart!', 'warning');
      return;
    }
    const updatedProd = {
      ...editingDiscountProduct,
      discount_price: finalDiscountPrice
    };
    addToast('Chegirma saqlanmoqda...', 'info');
    const updatedList = await dataService.saveProduct(updatedProd);
    setProducts(updatedList);
    setDiscountModalOpen(false);
    setEditingDiscountProduct(null);
    addToast('Chegirma muvaffaqiyatli saqlandi va saytda aks ettirildi!', 'success');
  };

  const handleRemoveDiscount = async (product) => {
    if (window.confirm(`"${product.name}" mahsulotidan chegirmani bekor qilmoqchimisiz?`)) {
      const updatedProd = {
        ...product,
        discount_price: null
      };
      addToast('Chegirma bekor qilinmoqda...', 'info');
      const updatedList = await dataService.saveProduct(updatedProd);
      setProducts(updatedList);
      addToast('Chegirma bekor qilindi', 'success');
    }
  };

  // ==========================================
  // STORES MANAGEMENT HANDLERS (DO'KONLAR)
  // ==========================================
  const handleOpenStoreModal = (store = null) => {
    setEditingStore(store);
    setStoreModalOpen(true);
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) return;

    const payload = {
      ...(editingStore || {}),
      name,
      slug: editingStore?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: form.address.value.trim(),
      phone: form.phone.value.trim(),
      working_hours: form.working_hours.value.trim() || '08:30 - 20:00',
      manager_name: form.manager_name.value.trim(),
      description: form.description.value.trim(),
      rating: Number(form.rating.value) || 4.9,
      verified: form.verified.checked,
      banner: form.banner?.value || editingStore?.banner || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      logo: form.logo?.value || editingStore?.logo || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'
    };

    addToast("Do'kon saqlanmoqda...", 'info');
    const updated = await dataService.saveStore(payload);
    setStores(updated);
    setStoreModalOpen(false);
    setEditingStore(null);
    addToast("Do'kon muvaffaqiyatli saqlandi!", 'success');
  };

  const handleDeleteStore = async (id, name) => {
    if (window.confirm(`Rostdan ham "${name}" do'konini tizimdan o'chirmoqchimisiz?`)) {
      addToast("Do'kon o'chirilmoqda...", 'info');
      const updated = await dataService.deleteStore(id);
      setStores(updated);
      addToast("Do'kon o'chirildi", 'info');
    }
  };

  // ==========================================
  // DISCOUNT REQUESTS REVIEW HANDLERS
  // ==========================================
  const handleOpenReviewModal = (req) => {
    setSelectedRequest(req);
    setReviewPlacement(req.placement || 'discount_section');
    setReviewFeedback(req.admin_feedback || '');
    setReviewModalOpen(true);
  };

  const handleApproveRequest = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    addToast("So'rov tasdiqlanmoqda...", 'info');
    const updatedRequests = await dataService.approveDiscountRequest(
      selectedRequest.id,
      reviewPlacement,
      reviewFeedback || 'Super Admin tomonidan tasdiqlandi va saytga joylandi.'
    );
    setDiscountRequests(updatedRequests);
    setReviewModalOpen(false);
    setSelectedRequest(null);
    const updatedProducts = await dataService.getProducts();
    setProducts(updatedProducts);
    addToast("Menedjer so'rovi tasdiqlandi va mebel saytga joylashtirildi!", 'success');
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    addToast("So'rov rad etilmoqda...", 'info');
    const updatedRequests = await dataService.rejectDiscountRequest(
      selectedRequest.id,
      reviewFeedback || "Talab qilingan shartlar bajarilmaganligi sababli rad etildi."
    );
    setDiscountRequests(updatedRequests);
    setReviewModalOpen(false);
    setSelectedRequest(null);
    addToast("So'rov rad etildi va menedjerga xabar qoldirildi", 'info');
  };

  const handleDeleteDiscountRequest = async (id) => {
    if (window.confirm("Ushbu so'rovni o'chirib tashlamoqchimisiz?")) {
      const updated = await dataService.deleteDiscountRequest(id);
      setDiscountRequests(updated);
      addToast("So'rov o'chirildi", 'info');
    }
  };

  // ==========================================
  // TOP 10 TRENDING MANAGEMENT HANDLERS
  // ==========================================
  const handleMoveTrending = async (index, direction) => {
    const trendingProducts = [...products]
      .filter(p => p.is_trending)
      .sort((a, b) => (Number(a.trending_rank) || 999) - (Number(b.trending_rank) || 999));

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= trendingProducts.length) return;

    // Swap ranks
    const tempRank = trendingProducts[index].trending_rank;
    trendingProducts[index].trending_rank = trendingProducts[targetIndex].trending_rank;
    trendingProducts[targetIndex].trending_rank = tempRank;

    const rankUpdates = trendingProducts.map((p, idx) => ({
      id: p.id,
      trending_rank: idx + 1
    }));

    addToast("Top 10 tartibi yangilanmoqda...", 'info');
    const updated = await dataService.updateTrendingRanking(rankUpdates);
    setProducts(updated);
    addToast("Top 10 reyting tartibi muvaffaqiyatli saqlandi!", 'success');
  };

  const handleToggleTrending = async (product) => {
    const isNowTrending = !product.is_trending;
    const currentTrendingCount = products.filter(p => p.is_trending).length;
    const updatedProd = {
      ...product,
      is_trending: isNowTrending,
      trending_rank: isNowTrending ? currentTrendingCount + 1 : null
    };
    addToast(isNowTrending ? "Mebel Top 10 Trendga qo'shildi!" : "Mebel Top 10 Trenddan chiqarildi", 'info');
    const updated = await dataService.saveProduct(updatedProd);
    setProducts(updated);
  };

  // Categories CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const catData = {
      ...(editingCategory || {}),
      name,
      slug: form.slug.value.trim() || editingCategory?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: form.description.value,
      image_url: form.image_url.value || editingCategory?.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    };

    setCategoryModalOpen(false);
    setEditingCategory(null);
    addToast('Kategoriya saqlanmoqda...', 'info');
    const updated = await dataService.saveCategory(catData);
    setCategories(updated);
    addToast('Kategoriya muvaffaqiyatli saqlandi!', 'success');
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Kategoriyani o‘chirishni xohlaysizmi?")) {
      addToast('Kategoriya o‘chirilmoqda...', 'info');
      const updated = await dataService.deleteCategory(id);
      setCategories(updated);
      addToast('Kategoriya o‘chirildi', 'success');
    }
  };

  // ==========================================
  // COLLECTIONS CRUD & PRODUCT ASSIGNMENT
  // ==========================================
  const handleOpenAddCollection = () => {
    setEditingCollection(null);
    setCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (col) => {
    setEditingCollection({ ...col });
    setCollectionModalOpen(true);
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    if (!title) {
      addToast("Kolleksiya nomini kiriting!", 'warning');
      return;
    }
    const colData = {
      ...(editingCollection || {}),
      title,
      slug: form.slug.value.trim() || editingCollection?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: form.subtitle?.value?.trim() || '',
      badge: form.badge?.value?.trim() || '',
      cover_image: form.cover_image?.value?.trim() || editingCollection?.cover_image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      description: form.description?.value?.trim() || '',
      display_order: Number(form.display_order?.value) || 0,
      is_active: form.is_active ? form.is_active.checked : true,
      product_ids: Array.isArray(editingCollection?.product_ids) ? editingCollection.product_ids : []
    };

    setCollectionModalOpen(false);
    setEditingCollection(null);
    addToast('Kolleksiya saqlanmoqda...', 'info');
    const updated = await dataService.saveCollection(colData);
    setCollections(updated);
    addToast(`"${title}" kolleksiyasi muvaffaqiyatli saqlandi!`, 'success');
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Rostdan ham ushbu kolleksiyani o‘chirmoqchimisiz?")) {
      addToast('Kolleksiya o‘chirilmoqda...', 'info');
      const updated = await dataService.deleteCollection(id);
      setCollections(updated);
      addToast('Kolleksiya o‘chirildi', 'success');
    }
  };

  const handleOpenAssignProducts = (col) => {
    setSelectedColForProducts({ ...col, product_ids: [...(col.product_ids || [])] });
    setAssignProductsModalOpen(true);
  };

  const handleToggleProductInCollection = async (productId) => {
    if (!selectedColForProducts) return;
    const currentIds = new Set(selectedColForProducts.product_ids || []);
    if (currentIds.has(productId)) {
      currentIds.delete(productId);
    } else {
      currentIds.add(productId);
    }
    const newProductIds = Array.from(currentIds);
    const updatedCol = { ...selectedColForProducts, product_ids: newProductIds };
    setSelectedColForProducts(updatedCol);

    const updatedList = await dataService.saveCollection(updatedCol);
    setCollections(updatedList);
  };

  // Craftsman CRUD
  const handleSaveCraftsman = async (e) => {
    e.preventDefault();
    const form = e.target;
    const craftData = {
      ...(editingCraftsman || {}),
      name: form.name.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value.trim() || editingCraftsman?.password || 'usta12345',
      experience_years: Number(form.experience_years.value) || 1,
      location: form.location.value,
      phone: form.phone.value,
      telegram: form.telegram.value,
      bio: form.bio.value,
      photo_url: form.photo_url.value || editingCraftsman?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      specializations: form.specializations.value.split(',').map((s) => s.trim()).filter(Boolean)
    };

    setCraftsmanModalOpen(false);
    setEditingCraftsman(null);
    addToast('Usta ma‘lumotlari saqlanmoqda...', 'info');
    const updated = await dataService.saveCraftsman(craftData);
    setCraftsmen(updated);
    addToast('Usta saqlandi! Endi u o‘z paroli bilan Usta paneliga (/craftsman) kira oladi.', 'success');
  };

  const handleDeleteCraftsman = async (id) => {
    if (window.confirm("Ustani o‘chirmoqchimisiz?")) {
      addToast('Usta profili o‘chirilmoqda...', 'info');
      const updated = await dataService.deleteCraftsman(id);
      setCraftsmen(updated);
      addToast('Usta profili o‘chirildi', 'success');
    }
  };

  // Managers CRUD (Super Admin qo'shadi va boshqaradi)
  const handleSaveManager = async (e) => {
    e.preventDefault();
    const form = e.target;
    const mgrData = {
      ...(editingManager || {}),
      full_name: form.full_name.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value.trim() || editingManager?.password || 'manager123',
      phone: form.phone.value.trim(),
      department: form.department.value.trim() || 'Katalog va Buyurtmalar'
    };

    if (!mgrData.email || !mgrData.password) {
      addToast('Email va parol kiritilishi shart!', 'error');
      return;
    }

    setManagerModalOpen(false);
    setEditingManager(null);
    addToast('Menedjer saqlanmoqda...', 'info');
    const updated = await dataService.saveManager(mgrData);
    setManagers(updated);
    addToast('Menedjer saqlandi! Endi u o‘z paroli bilan tizimga kira oladi.', 'success');
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

  // Banners & Announcements CRUD (3 tilda: UZ majburiy, RU & EN ixtiyoriy)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    const form = e.target;
    const uzTitle = form.title.value.trim();
    const uzSubtitle = form.subtitle?.value?.trim() || '';
    const uzButtonText = form.button_text?.value?.trim() || 'Batafsil';

    const bannerData = {
      ...(editingBanner || {}),
      // Uzbek (Majburiy)
      title: uzTitle,
      subtitle: uzSubtitle,
      button_text: uzButtonText,
      title_uz: uzTitle,
      subtitle_uz: uzSubtitle,
      button_text_uz: uzButtonText,
      // Russian (Ixtiyoriy)
      title_ru: form.title_ru?.value?.trim() || '',
      subtitle_ru: form.subtitle_ru?.value?.trim() || '',
      button_text_ru: form.button_text_ru?.value?.trim() || '',
      // English (Ixtiyoriy)
      title_en: form.title_en?.value?.trim() || '',
      subtitle_en: form.subtitle_en?.value?.trim() || '',
      button_text_en: form.button_text_en?.value?.trim() || '',
      // General
      link: form.link?.value?.trim() || '/furniture',
      image_url: form.image_url?.value?.trim() || editingBanner?.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      is_active: form.is_active ? form.is_active.checked : true,
      display_order: Number(form.display_order?.value) || 0
    };

    setBannerModalOpen(false);
    setEditingBanner(null);
    addToast('E‘lon saqlanmoqda...', 'info');
    const updated = await dataService.saveBanner(bannerData);
    setBanners(updated);
    addToast('E‘lon / Banner 3 tilda saqlandi va Supabase-ga yuborildi!', 'success');
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Rostdan ham ushbu e‘lonni o‘chirmoqchimisiz?")) {
      addToast('E‘lon o‘chirilmoqda...', 'info');
      const updated = await dataService.deleteBanner(id);
      setBanners(updated);
      addToast('E‘lon o‘chirildi', 'success');
    }
  };

  // AFISHA SLIDE SHOW CONFIGURATIONS & HANDLERS
  const AFISHA_SLIDE_CONFIGS = [
    {
      key: 'chairs_hero_slides',
      title: 'Chairs & Stools Afishasi',
      page: 'Bosh sahifa & Mahsulot toifalari',
      badge: 'NEW COLLECTION',
      heading: 'Chairs & Stools',
      desc: 'Oq hashamatli stul va kreslo afishasining avtomatik almashib turuvchi slayd suratlari.',
      accent: '#ff6b4a'
    },
    {
      key: 'sofas_hero_slides',
      title: 'Sofas and Armchairs (-35%) Afishasi',
      page: 'Mebellar katalogi sahifasi',
      badge: '-35% SALE OFF',
      heading: 'Sofas and Armchairs',
      desc: 'Yashil baxmal divan va yumshoq mebellar aksiyasi afishasining slayd suratlari.',
      accent: '#ef4444'
    },
    {
      key: 'blog_hero_slides',
      title: 'Kichik xonadonlarda mebeldan unumli foydalanish (Blog)',
      page: 'Blog & Interyer maslahatlari sahifasi',
      badge: 'FEATURED POST',
      heading: 'Kichik xonadonlarda mebeldan unumli foydalanishning 7 siri',
      desc: 'Blog maqolasi muqovasi va interyer foni bo‘lib almashib turuvchi slayd suratlari.',
      accent: '#3b82f6'
    },
    {
      key: 'faq_hero_slides',
      title: 'How can We help You (Yordam Markazi)',
      page: 'FAQ & Savol-javoblar sahifasi',
      badge: 'HELP CENTER',
      heading: 'How can We help You',
      desc: 'Yordam markazi sarlavhasining avtomatik almashib turuvchi slayd suratlari.',
      accent: '#10b981'
    },
    {
      key: 'collection_carousel_slides',
      title: 'Autumn Collection Bosh Sahifa Slayderi',
      page: 'Bosh sahifa asosiy karuseli',
      badge: 'AUTUMN COLLECTION',
      heading: 'Zamonaviy Mebellar Kolleksiyasi',
      desc: 'Bosh sahifadagi 4-slaydli Figma karuselining avtomatik almashib turuvchi kartalari.',
      accent: '#f59e0b'
    }
  ];

  const handleAddSlideImage = (key, customUrl = null) => {
    const urlToAdd = (customUrl || newSlideUrl).trim();
    if (!urlToAdd) {
      addToast('Iltimos, rasm havolasini kiriting yoki fayl tanlang!', 'error');
      return;
    }
    const currentList = settingsForm[key] || [];
    const updated = [...currentList, urlToAdd];
    setSettingsForm(prev => ({ ...prev, [key]: updated }));
    setNewSlideUrl('');
    addToast('Yangi slayd rasm qo‘shildi! "Saqlash va Saytda Yangilash" tugmasini bosing.', 'info');
  };

  const handleRemoveSlideImage = (key, index) => {
    const currentList = settingsForm[key] || [];
    if (currentList.length <= 1) {
      if (!window.confirm("Ushbu afishada oxirgi slayd rasm qolmoqda. Uni ham o‘chirmoqchimisiz?")) {
        return;
      }
    }
    const updated = currentList.filter((_, idx) => idx !== index);
    setSettingsForm(prev => ({ ...prev, [key]: updated }));
    addToast('Slayd rasm ro‘yxatdan olib tashlandi.', 'info');
  };

  const handleQuickSaveSlides = async () => {
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsForm);
      addToast('Barcha afisha va slayd rasmlari Supabase-ga saqlandi hamda saytda yangilandi!', 'success');
    } catch (err) {
      console.error(err);
      addToast(`Xatolik: ${err.message || 'Saqlashda xatolik yuz berdi'}`, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Total revenue calc
  const totalRevenue = standardOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const adminTabs = [
    { id: 'overview', label: 'Umumiy Statistika', shortLabel: 'Statistika', icon: LayoutDashboard },
    { id: 'home_sections', label: `Bo‘limlar Boshqaruvi (${homeSections.length})`, shortLabel: `Bo‘limlar (${homeSections.length})`, icon: SlidersHorizontal },
    { id: 'products', label: `Mebellar & E‘lonlar (${products.length})`, shortLabel: `E‘lonlar (${products.length})`, icon: Package },
    { id: 'discounts', label: `Chegirmalar & Aksiyalar (${products.filter(p => Boolean(p.discount_price)).length})`, shortLabel: `Chegirmalar (${products.filter(p => Boolean(p.discount_price)).length})`, icon: DollarSign },
    { id: 'trending', label: `Top 10 Trend (${products.filter(p => p.is_trending).length})`, shortLabel: 'Top 10 Trend', icon: Trophy },
    { id: 'stores', label: `Do‘konlar (${stores.length})`, shortLabel: `Do‘konlar (${stores.length})`, icon: Store },
    { id: 'discount_requests', label: `Chegirma So‘rovlari (${discountRequests.filter(r => r.status === 'PENDING').length} yangi)`, shortLabel: `So‘rovlar (${discountRequests.length})`, icon: Send },
    { id: 'categories', label: `Kategoriyalar (${categories.length})`, shortLabel: `Toifalar (${categories.length})`, icon: Layers },
    { id: 'collections', label: `Kolleksiyalar Boshqaruvi (${collections.length})`, shortLabel: `Kolleksiyalar (${collections.length})`, icon: Sparkles },
    { id: 'banners', label: `E'lonlar & Bannerlar (${banners.length})`, shortLabel: `E'lonlar (${banners.length})`, icon: ImageIcon },
    { id: 'slides', label: 'Header Slayd Shou Boshqaruvi', shortLabel: 'Slaydlar', icon: ImageIcon },
    { id: 'craftsmen', label: `Ustalar (${craftsmen.length})`, shortLabel: `Ustalar (${craftsmen.length})`, icon: Award },
    { id: 'custom_orders', label: `Maxsus Buyurtmalar (${customOrders.length})`, shortLabel: `Maxsus (${customOrders.length})`, icon: Sliders },
    { id: 'orders', label: `Do‘kon Buyurtmalari (${standardOrders.length})`, shortLabel: `Do‘kon (${standardOrders.length})`, icon: ShoppingBag },
    { id: 'comments', label: `Sharhlar (${comments.length})`, shortLabel: `Sharhlar (${comments.length})`, icon: MessageSquare },
    { id: 'managers', label: `Menedjerlar (${managers.length})`, shortLabel: `Menedjerlar (${managers.length})`, icon: Users },
    { id: 'users', label: `Foydalanuvchilar (${usersList.length})`, shortLabel: `Foydalanuvchilar (${usersList.length})`, icon: Users },
    { id: 'about', label: 'Biz Haqimizda Boshqaruvi', shortLabel: 'Biz Haqimizda', icon: Info },
    { id: 'settings', label: 'Tizim & Sayt Nomi', shortLabel: 'Sozlamalar', icon: SettingsIcon }
  ];

  const renderSlideManagementContent = () => {
    const activeConfig = AFISHA_SLIDE_CONFIGS.find(c => c.key === selectedAfishaKey) || AFISHA_SLIDE_CONFIGS[0];
    const currentSlides = settingsForm[selectedAfishaKey] || [];

    return (
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--wood-amber)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <ImageIcon size={14} /> SUPER ADMIN • SLAYD SHOU SOZLAMALARI
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Header Afishalari va Slayd Rasmlari Boshqaruvi
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem', maxWidth: '720px' }}>
              Saytdagi 4 ta asosiy header afishasi va bosh sahifa karuselining rasmlari har 3.5 soniyada avtomatik ravishda almashib turadi. Quyida kerakli afishani tanlab, yangi slayd rasmlarni qo‘shishingiz yoki keraksizlarini o‘chirishingiz mumkin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickSaveSlides}
            disabled={isSavingSettings}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontWeight: 700, gap: '0.5rem', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)' }}
          >
            {isSavingSettings ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Supabase-ga Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Slayd O‘zgarishlarini Saqlash</span>
              </>
            )}
          </button>
        </div>

        {/* AFISHA SELECTOR TABS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1.75rem'
        }}>
          {AFISHA_SLIDE_CONFIGS.map((cfg) => {
            const isSelected = selectedAfishaKey === cfg.key;
            const slideCount = (settingsForm[cfg.key] || []).length;
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => setSelectedAfishaKey(cfg.key)}
                style={{
                  textAlign: 'left',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '2px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  boxShadow: isSelected ? '0 4px 16px rgba(217, 119, 6, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? cfg.accent : 'var(--bg-secondary)',
                    color: isSelected ? '#fff' : 'var(--text-muted)'
                  }}>
                    {cfg.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {slideCount} ta slayd
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? 'var(--wood-amber)' : 'var(--text-main)', lineHeight: 1.3 }}>
                  {cfg.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  📍 {cfg.page}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE AFISHA DETAILS CARD */}
        <div className="glass-card" style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: activeConfig.accent, fontWeight: 800, letterSpacing: '1px' }}>
                {activeConfig.badge}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.15rem 0 0.3rem' }}>
                {activeConfig.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {activeConfig.desc}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
              <span>⏱️ Avtomatik almashish: <strong>3.5 soniya</strong></span>
              <span>•</span>
              <span>Jami: <strong>{currentSlides.length} ta rasm</strong></span>
            </div>
          </div>

          {/* SLIDES THUMBNAIL GALLERY */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.75rem' }}>
              Mavjud Slayd Rasmlari (Avtomatik 3.5 soniyada aylanadi):
            </label>

            {currentSlides.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                Hozircha slayd rasmlar yo‘q. Quyidagi forma orqali rasm qo‘shing.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
                {currentSlides.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1.5px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={url}
                        alt={`Slayd ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        #{idx + 1}-slayd
                      </span>
                    </div>

                    <div style={{ padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                        {url.split('/').pop()?.split('?')[0] || `Rasm ${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlideImage(activeConfig.key, idx)}
                        title="Ushbu slaydni o‘chirish"
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.45rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADD NEW SLIDE FORM */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              + Ushbu Afishaga Yangi Slayd Rasm Qo‘shish
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Kompyuterdan rasm yuklashingiz yoki internetdagi to‘g‘ridan-to‘g‘ri rasm havolasini (URL) kiritishingiz mumkin.
            </p>

            <ImageUploadField
              label="Yangi Slayd Rasmi (Fayl tanlang yoki URL kiriting)"
              value={newSlideUrl}
              onChange={(val) => setNewSlideUrl(val)}
              folder="slides"
              name="slide_uploader"
              placeholder="https://images.unsplash.com/... yoki faylni tanlang"
              helperText="Rasm tanlanganda u darhol tayyorlanadi va quyidagi tugma orqali ro‘yxatga qo‘shiladi."
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleAddSlideImage(activeConfig.key)}
                className="btn btn-secondary"
                style={{ fontWeight: 700, gap: '0.4rem' }}
              >
                <Plus size={16} /> Slaydga Qo‘shish
              </button>

              <button
                type="button"
                onClick={handleQuickSaveSlides}
                disabled={isSavingSettings}
                className="btn btn-primary"
                style={{ fontWeight: 700, gap: '0.4rem', marginLeft: 'auto' }}
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>O‘zgarishlarni Saqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Security Auth Guard: only Super Admin can view the dashboard
  if (!user || !isAdmin) {
    return (
      <div style={{ padding: '6rem 1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="apple-card" style={{ maxWidth: '460px', width: '100%', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(250, 109, 88, 0.12)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Super Admin Ruxsati Talab Qilinadi
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            Ushbu boshqaruv paneli faqat tizim ma’muri uchun mo‘ljallangan. O‘z elektron pochta va parolingiz orqali tizimga kiring.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login', 'Admin panelga kirish uchun Super Admin hisobingizga kiring')}
            className="apple-btn apple-btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Tizimga Kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* Mobile Top Header (<= 1024px) */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>{settings.site_name}</div>
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
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '1px solid var(--border-subtle)',
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
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-main)',
              padding: '1.25rem',
              borderBottomLeftRadius: '22px',
              borderBottomRightRadius: '22px',
              boxShadow: 'var(--shadow-xl)',
              borderBottom: '1.5px solid var(--border-subtle)',
              maxHeight: '82vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--wood-amber)' }}>Admin Bo‘limlari</div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
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
                      gap: '0.55rem',
                      padding: '0.75rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isActive ? '#ffffff' : 'var(--text-main)',
                      backgroundColor: isActive ? 'var(--wood-amber)' : 'var(--bg-secondary)',
                      border: isActive ? '1px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      minHeight: '48px',
                      boxShadow: isActive ? '0 4px 12px rgba(194, 109, 46, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.25 }}>{tab.label}</span>
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
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{settings.site_name}</div>
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
                  className={`admin-sidebar-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={17} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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

        {/* TAB: HOMEPAGE SECTIONS & LAYOUT MANAGEMENT (SUPER ADMIN TO'LIQ BOSHQARUVI) */}
        {activeTab === 'home_sections' && (
          <div>
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(0, 113, 227, 0.1)', color: '#0071e3', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  <SlidersHorizontal size={13} /> SUPER ADMIN • DINAMIK BO‘LIMLAR & TARTIB
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Asosiy Sahifa Bo‘limlari & Tartibi
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem', maxWidth: '780px', lineHeight: 1.5 }}>
                  Bosh sahifadagi barcha 37 ta bo‘limni to‘liq nazorat qiling: istalgan bo‘limni <strong>Yuqoriga/Pastga surish</strong> orqali tartiblang, <strong>Yoqish/O‘chirish</strong> orqali boshqaring yoki sarlavha, afisha va havolalarini tahrirlang. O‘zgarishlar darhol saytda aks etadi.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetSections}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                  title="Dastlabki tartibni tiklash"
                >
                  <RotateCcw size={14} /> Dastlabki Tartib
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await dataService.saveHomeSections(homeSections);
                    addToast("Barcha bo‘limlar sozlamalari saqlandi va saytda jonli yangilandi!", 'success');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, backgroundColor: '#0071e3', borderColor: '#0071e3' }}
                >
                  <CheckCircle2 size={15} /> Saqlash & Yangilash
                </button>
              </div>
            </div>

            {/* Apple-style Filter Segment Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.4rem', scrollbarWidth: 'none' }}>
              {[
                { id: 'ALL', label: `Barcha Bo‘limlar (${homeSections.length})` },
                { id: 'banner', label: 'Afisha & Katta Bannerlar' },
                { id: 'products', label: 'Mahsulot Qatorlari' },
                { id: 'showcase', label: 'Vitrinalar & Kolleksiyalar' },
                { id: 'deals', label: 'Chegirmalar & Aksiyalar' },
                { id: 'navigation', label: 'Navigatsiya & Vidjetlar' }
              ].map((f) => {
                const isSelected = sectionCategoryFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSectionCategoryFilter(f.id)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? '#0071e3' : 'var(--bg-secondary)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: isSelected ? '1px solid #0071e3' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Sections Reordering & Editing Table */}
            <div className="table-responsive glass-card" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1rem', width: '90px' }}>Tartib</th>
                    <th style={{ padding: '0.85rem' }}>Bo‘lim Nomi va ID</th>
                    <th style={{ padding: '0.85rem' }}>Saytdagi Sarlavha & Izoh</th>
                    <th style={{ padding: '0.85rem', width: '120px' }}>Holati</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', width: '140px' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {homeSections
                    .filter((sec) => sectionCategoryFilter === 'ALL' || sec.category === sectionCategoryFilter)
                    .map((sec, idx) => {
                      const originalIndex = homeSections.findIndex((s) => s.id === sec.id);
                      const isFirst = originalIndex === 0;
                      const isLast = originalIndex === homeSections.length - 1;
                      const isActive = sec.is_active !== false;

                      return (
                        <tr
                          key={sec.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: isActive ? 'transparent' : 'rgba(239, 68, 68, 0.03)',
                            opacity: isActive ? 1 : 0.72,
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {/* Order & Move buttons */}
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '6px',
                                  backgroundColor: 'var(--bg-secondary)',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  color: 'var(--text-main)',
                                  border: '1px solid var(--border-subtle)'
                                }}
                              >
                                #{sec.order || originalIndex + 1}
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(originalIndex, -1)}
                                  disabled={isFirst}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: isFirst ? 'not-allowed' : 'pointer',
                                    opacity: isFirst ? 0.3 : 1,
                                    padding: '1px',
                                    color: 'var(--text-main)'
                                  }}
                                  title="Yuqoriga surish"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(originalIndex, 1)}
                                  disabled={isLast}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: isLast ? 'not-allowed' : 'pointer',
                                    opacity: isLast ? 0.3 : 1,
                                    padding: '1px',
                                    color: 'var(--text-main)'
                                  }}
                                  title="Pastga surish"
                                >
                                  <ArrowDown size={13} />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Section identity */}
                          <td style={{ padding: '0.75rem 0.85rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                              {sec.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                              <code style={{ fontSize: '0.72rem', color: 'var(--text-light)', background: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                {sec.id}
                              </code>
                              {sec.category && (
                                <span style={{ fontSize: '0.7rem', color: '#0071e3', fontWeight: 600 }}>
                                  • {sec.category}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Titles preview */}
                          <td style={{ padding: '0.75rem 0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontWeight: 650, color: 'var(--text-main)' }}>
                                {sec.title || "—"}
                              </span>
                              {sec.badge && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}>
                                  {sec.badge}
                                </span>
                              )}
                            </div>
                            {sec.subtitle && (
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sec.subtitle}
                              </div>
                            )}
                          </td>

                          {/* Active / Inactive switch */}
                          <td style={{ padding: '0.75rem 0.85rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleSectionActive(sec)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.25rem 0.65rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                color: isActive ? '#10b981' : '#ef4444'
                              }}
                            >
                              {isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                              <span>{isActive ? 'Faol' : 'O‘chirilgan'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSection(sec)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                            >
                              <Edit2 size={13} /> Tahrirlash
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: STORES MANAGEMENT (MEBEL DO'KONLARI) */}
        {activeTab === 'stores' && (
          <div>
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Mebel Do‘konlari Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
                  Urgut tumanidagi barcha rasmiy mebel do‘konlari, salonlar va fabrikalar profillarini boshqaring.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenStoreModal(null)}
                className="btn btn-primary"
                style={{ gap: '0.5rem' }}
              >
                <Plus size={16} /> Yangi Do‘kon Qo‘shish
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {stores.map((s) => {
                const storeProductCount = products.filter((p) => p.store_id === s.id).length;
                return (
                  <div
                    key={s.id}
                    className="glass-card"
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Cover Banner */}
                    <div style={{ height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                      <img
                        src={s.banner || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                        alt={s.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)'
                        }}
                      />
                      {s.verified && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.9)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Tasdiqlangan</span>
                        </div>
                      )}
                    </div>

                    {/* Store Info Body */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginTop: '-2.5rem', marginBottom: '0.75rem' }}>
                        <img
                          src={s.logo || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80'}
                          alt={s.name}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '3px solid var(--bg-card)',
                            boxShadow: 'var(--shadow-md)',
                            backgroundColor: 'var(--bg-primary)'
                          }}
                        />
                        <div style={{ paddingTop: '1.5rem', minWidth: 0, flex: 1 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                            <Star size={13} fill="#fbbf24" color="#fbbf24" />
                            <span style={{ fontWeight: 750, fontSize: '0.82rem' }}>{Number(s.rating || 4.9).toFixed(1)}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>• {storeProductCount} ta e‘lon</span>
                          </div>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {s.description || "Urgut tumanidagi zamonaviy va sifatli mebellar markazi."}
                      </p>

                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <MapPin size={13} color="var(--figma-coral)" />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Phone size={13} color="var(--wood-amber)" />
                          <span>{s.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Clock size={13} />
                          <span>{s.working_hours || '08:30 - 20:00'}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                        <a
                          href={`/stores/${s.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                        >
                          <Eye size={13} /> Ko‘rish
                        </a>
                        <button
                          type="button"
                          onClick={() => handleOpenStoreModal(s)}
                          className="btn btn-secondary btn-sm"
                          title="Tahrirlash"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStore(s.id, s.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444' }}
                          title="O‘chirish"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: TOP 10 TREND MEBELLAR BOSHQARUVI */}
        {activeTab === 'trending' && (
          <div>
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(250, 109, 88, 0.12)', color: 'var(--figma-coral)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  <Trophy size={14} /> SUPER ADMIN • TRENDING REYT沢NG
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Top 10 Trend Mebellari Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem', maxWidth: '750px' }}>
                  Bosh sahifadagi eng ko‘p ko‘riladigan Top 10 Trend mebellar reytingini boshqaring. O‘rinlarni Yuqoriga/Pastga surish orqali tartiblang yoki yangi mebellarni trendga qo‘shing.
                </p>
              </div>
            </div>

            {/* Active Top 10 Ranking List */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-subtle)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={18} color="#f59e0b" />
                <span>Hozirgi Top 10 Trend Ro‘yxati (Bosh Sahifada Chiqadi)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products
                  .filter((p) => p.is_trending)
                  .sort((a, b) => (Number(a.trending_rank) || 999) - (Number(b.trending_rank) || 999))
                  .slice(0, 10)
                  .map((p, idx) => {
                    const rank = idx + 1;
                    const isGold = rank === 1;
                    const isSilver = rank === 2;
                    const isBronze = rank === 3;
                    const effectivePrice = p.discount_price || p.price;

                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          padding: '0.85rem 1.25rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-card)',
                          border: isGold ? '2px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                          boxShadow: isGold ? '0 4px 15px rgba(245, 158, 11, 0.1)' : 'none',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                          {/* Rank Medal */}
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '1rem',
                              flexShrink: 0,
                              background: isGold
                                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                : isSilver
                                ? 'linear-gradient(135deg, #94A3B8, #64748B)'
                                : isBronze
                                ? 'linear-gradient(135deg, #B45309, #78350F)'
                                : 'var(--bg-secondary)',
                              color: isGold || isSilver || isBronze ? '#ffffff' : 'var(--text-main)',
                              boxShadow: isGold ? '0 4px 10px rgba(245, 158, 11, 0.35)' : 'none'
                            }}
                          >
                            #{rank}
                          </div>

                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80'}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />

                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Do‘kon: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.store_name || "Urgut Mebel Markazi"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rating & Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                            <span style={{ fontWeight: 800 }}>{Number(p.rating || 5.0).toFixed(1)}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({p.reviews_count || 12})</span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: 'var(--figma-coral)', fontSize: '0.95rem' }}>
                              {Number(effectivePrice).toLocaleString()} so‘m
                            </div>
                            {p.discount_price && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                {Number(p.price).toLocaleString()} so‘m
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order & Remove Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveTrending(idx, -1)}
                            className="btn btn-secondary btn-sm"
                            title="Yuqoriga surish"
                            style={{ opacity: idx === 0 ? 0.35 : 1 }}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === products.filter((p) => p.is_trending).length - 1}
                            onClick={() => handleMoveTrending(idx, 1)}
                            className="btn btn-secondary btn-sm"
                            title="Pastga surish"
                            style={{ opacity: idx === products.filter((p) => p.is_trending).length - 1 ? 0.35 : 1 }}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleTrending(p)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Trenddan chiqarish"
                          >
                            <X size={14} /> Chiqarish
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Other Products to Add to Trending */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Katalogdagi Boshqa Mebellarni Trendga Qo‘shish
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Reytingi yuqori bo‘lgan mebellarni "+ Trendga Qo‘shish" tugmasini bosib yuqoridagi Top 10 ro‘yxatiga kiritishingiz mumkin.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {products
                  .filter((p) => !p.is_trending)
                  .map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ⭐ {Number(p.rating || 4.5).toFixed(1)} • {Number(p.discount_price || p.price).toLocaleString()} so‘m
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleTrending(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', whiteSpace: 'nowrap' }}
                      >
                        <Plus size={13} /> Qo‘shish
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DISCOUNT & PLACEMENT REQUESTS (MENEDJERLAR SO'ROVLARI) */}
        {activeTab === 'discount_requests' && (
          <div>
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Do‘kon Menedjerlarining Chegirma So‘rovlari</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
                  Do‘kon menejerlari o‘z mebellarini chegirmaga yoki trend kolleksiyasiga chiqarish uchun Super Adminga yo‘llagan so‘rovlari.
                </p>
              </div>
            </div>

            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Mebel & Do‘kon</th>
                    <th style={{ padding: '0.85rem' }}>Asl Narx</th>
                    <th style={{ padding: '0.85rem' }}>Taklif Qilingan Chegirma</th>
                    <th style={{ padding: '0.85rem' }}>So‘ralgan Joylashtirish</th>
                    <th style={{ padding: '0.85rem' }}>Menejer Izohi</th>
                    <th style={{ padding: '0.85rem' }}>Holat</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {discountRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Send size={42} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hozircha hech qanday chegirma so‘rovi yo‘q</h4>
                        <p style={{ fontSize: '0.85rem' }}>Do‘kon menejerlari so‘rov yuborganda bu yerda ko‘rinadi.</p>
                      </td>
                    </tr>
                  ) : (
                    discountRequests.map((req) => {
                      const isPending = req.status === 'PENDING';
                      const isApproved = req.status === 'APPROVED';
                      const isRejected = req.status === 'REJECTED';

                      const placementLabels = {
                        discount_section: "Chegirmalar Bo'limi",
                        hero_collection: "Asosiy Sahifa Kolleksiyasi",
                        trending: "Top 10 Trend Mebellari"
                      };

                      return (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={req.product_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{req.product_name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--figma-coral)', fontWeight: 600 }}>
                                  {req.store_name} • {req.manager_phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {Number(req.current_price).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '0.85rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                            {Number(req.proposed_discount_price).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            <span style={{ backgroundColor: 'rgba(250, 109, 88, 0.1)', color: 'var(--figma-coral)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                              {placementLabels[req.placement] || req.placement}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem', maxWidth: '220px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {req.notes || "—"}
                            {req.admin_feedback && (
                              <div style={{ marginTop: '0.25rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.78rem' }}>
                                Admin javobi: {req.admin_feedback}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            {isPending && (
                              <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={12} /> Kutilmoqda
                              </span>
                            )}
                            {isApproved && (
                              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <CheckCircle2 size={12} /> Tasdiqlangan
                              </span>
                            )}
                            {isRejected && (
                              <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <X size={12} /> Rad etilgan
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReviewModal(req)}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                                >
                                  Ko‘rib chiqish
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteDiscountRequest(req.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444' }}
                                title="O‘chirish"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & ADS CRUD (SUPER ADMIN & STORE MANAGERS) */}
        {activeTab === 'products' && (() => {
          const filteredList = products.filter((p) => {
            if (productCategoryFilter !== 'ALL' && p.category_id !== productCategoryFilter) return false;
            if (productStoreFilter !== 'ALL' && p.store_id !== productStoreFilter) return false;
            if (productSearch.trim()) {
              const q = productSearch.toLowerCase();
              const matchName = p.name?.toLowerCase().includes(q);
              const matchStore = p.store_name?.toLowerCase().includes(q);
              const matchMat = p.material?.toLowerCase().includes(q);
              if (!matchName && !matchStore && !matchMat) return false;
            }
            return true;
          });

          // Discounted products are automatically placed at the top in their category as requested
          const displayedProducts = sortWithDiscountsFirst(filteredList);

          return (
            <div>
              <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(0, 113, 227, 0.1)', color: '#0071e3', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                    <Package size={13} /> {isAdmin ? 'SUPER ADMIN' : 'DO‘KON MENEDJERI'} • E‘LONLAR VA MEBELLAR
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                    Mebellar va E‘lonlar Boshqaruvi
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem', maxWidth: '780px' }}>
                    Barcha e‘lonlarni kategoriya bo‘yicha saralang yoki birgalikda ko‘ring. Chegirmali mebellar o‘z kategoriyasida avtomatik ravishda eng yuqoriga chiqariladi. Yangi e‘lon kiritganda do‘kon va usta biriktirilishi mumkin.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { setEditingProduct(null); setProductModalOpen(true); }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.25rem', backgroundColor: '#0071e3', borderColor: '#0071e3' }}
                >
                  <Plus size={16} /> Yangi Mebel E‘loni Qo‘shish
                </button>
              </div>

              {/* Category Filter Pills (Apple Segmented Style) */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.4rem', scrollbarWidth: 'none' }}>
                <button
                  type="button"
                  onClick={() => setProductCategoryFilter('ALL')}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: productCategoryFilter === 'ALL' ? 700 : 500,
                    backgroundColor: productCategoryFilter === 'ALL' ? '#0071e3' : 'var(--bg-secondary)',
                    color: productCategoryFilter === 'ALL' ? '#ffffff' : 'var(--text-main)',
                    border: productCategoryFilter === 'ALL' ? '1px solid #0071e3' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease'
                  }}
                >
                  Barchasi ({products.length})
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category_id === c.id || p.category_id === c.slug).length;
                  const isSelected = productCategoryFilter === c.id || productCategoryFilter === c.slug;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setProductCategoryFilter(c.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? '#0071e3' : 'var(--bg-secondary)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        border: isSelected ? '1px solid #0071e3' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search & Store Filter Bar */}
              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 260px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Mebel nomi, do‘kon yoki material bo‘yicha qidirish..."
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ flex: '0 1 240px' }}>
                  <select
                    value={productStoreFilter}
                    onChange={(e) => setProductStoreFilter(e.target.value)}
                    className="form-select"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="ALL">🏪 Barcha Mebel Do‘konlari</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="table-responsive glass-card" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Mebel nomi & Kategoriya</th>
                      <th style={{ padding: '0.85rem' }}>Do‘kon</th>
                      <th style={{ padding: '0.85rem' }}>Usta (Portfolio)</th>
                      <th style={{ padding: '0.85rem' }}>Narxi</th>
                      <th style={{ padding: '0.85rem' }}>Omborda</th>
                      <th style={{ padding: '0.85rem' }}>Holati</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <Package size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Ushbu mezon bo‘yicha mebellar topilmadi</div>
                          <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>Filtrni tozalang yoki yangi mebel e‘lonini qo‘shing</div>
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((p) => {
                        const hasDiscount = Boolean(p.discount_price && Number(p.discount_price) > 0 && Number(p.discount_price) < Number(p.price));
                        const matchedStore = stores.find((s) => s.id === p.store_id);
                        const matchedCraftsman = craftsmen.find((c) => c.id === p.craftsman_id);
                        const matchedCategory = categories.find((c) => c.id === p.category_id || c.slug === p.category_id);

                        return (
                          <tr
                            key={p.id}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              backgroundColor: hasDiscount ? 'rgba(239, 68, 68, 0.02)' : 'transparent'
                            }}
                          >
                            {/* Product Info */}
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-subtle)' }}
                                />
                                <div>
                                  <div style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span>{p.name}</span>
                                    {hasDiscount && (
                                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                                        CHEGIRMA
                                      </span>
                                    )}
                                  </div>
                                  <span style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                                    {matchedCategory?.name || p.category_id || 'Mebel'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Store Name */}
                            <td style={{ padding: '0.75rem 0.85rem', fontSize: '0.82rem' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                <Store size={13} color="#0071e3" />
                                {p.store_name || matchedStore?.name || "Urgut Shahar Mebel Markazi"}
                              </span>
                            </td>

                            {/* Craftsman (Portfolio link) */}
                            <td style={{ padding: '0.75rem 0.85rem', fontSize: '0.82rem' }}>
                              {matchedCraftsman ? (
                                <a
                                  href={`/craftsmen/${matchedCraftsman.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    color: 'var(--wood-amber)',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '6px'
                                  }}
                                  title="Ustaning portfoliosiga o‘tish"
                                >
                                  <Award size={12} /> {matchedCraftsman.name}
                                </a>
                              ) : (
                                <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>— Biriktirilmagan</span>
                              )}
                            </td>

                            {/* Price & Discount */}
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              {hasDiscount ? (
                                <div>
                                  <div style={{ fontWeight: 800, color: '#dc2626' }}>
                                    {Number(p.discount_price).toLocaleString()} so‘m
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                    {Number(p.price).toLocaleString()} so‘m
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                  {Number(p.price).toLocaleString()} so‘m
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td style={{ padding: '0.75rem 0.85rem', fontSize: '0.82rem' }}>
                              {p.stock ?? 10} dona
                            </td>

                            {/* Status */}
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <span className={`badge ${p.is_published !== false ? 'badge-stock' : 'badge-discount'}`}>
                                {p.is_published !== false ? 'Faol' : 'Yashirilgan'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  onClick={() => { setEditingProduct(p); setProductModalOpen(true); }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.35rem 0.55rem' }}
                                  title="Tahrirlash"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                                  title="O‘chirish"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* TAB: DISCOUNTS & SPECIAL OFFERS */}
        {activeTab === 'discounts' && (
          <div>
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Chegirmalar & Aksiyalar Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Asosiy sahifadagi va katalogdagi chegirmadagi barcha mebellarni boshqaring.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddDiscount(null)}
                className="btn btn-primary"
              >
                <Plus size={16} /> Mebelga Chegirma Qo‘shish
              </button>
            </div>

            {/* Announcement Banner Quick Edit */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--wood-amber)', textTransform: 'uppercase' }}>
                  Sayt Yuqorisidagi Chegirma E’loni:
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {settings.announcement || 'Hozircha faol chegirma e’loni yo‘q'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="btn btn-secondary btn-sm"
              >
                E’lonni O‘zgartirish
              </button>
            </div>

            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Mebel nomi</th>
                    <th style={{ padding: '0.85rem' }}>Asl Narxi</th>
                    <th style={{ padding: '0.85rem' }}>Chegirmali Narx</th>
                    <th style={{ padding: '0.85rem' }}>Tejov / Chegirma</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter((p) => Boolean(p.discount_price)).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <DollarSign size={42} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Hozircha chegirmadagi mebellar yo‘q</h4>
                        <p style={{ fontSize: '0.85rem' }}>Yuqoridagi "+ Mebelga Chegirma Qo‘shish" tugmasini bosib istalgan mebelga aksiya belgilang.</p>
                      </td>
                    </tr>
                  ) : (
                    products.filter((p) => Boolean(p.discount_price)).map((p) => {
                      const discountPct = p.price > 0 ? Math.round((1 - p.discount_price / p.price) * 100) : 0;
                      const savings = p.price - p.discount_price;
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div>
                                <div>{p.name}</div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.category_id || 'Mebel'}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            {Number(p.price).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--wood-amber)' }}>
                            {Number(p.discount_price).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.55rem', borderRadius: '12px', display: 'inline-block' }}>
                              -{discountPct}% ({savings.toLocaleString()} so‘m tejov)
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenAddDiscount(p)}
                                className="btn btn-secondary btn-sm"
                                title="Chegirmani o‘zgartirish"
                              >
                                Tahrirlash
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDiscount(p)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444' }}
                                title="Chegirmani bekor qilish"
                              >
                                Bekor qilish
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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

        {/* TAB: COLLECTIONS CRUD & PRODUCTS ASSIGNMENT */}
        {activeTab === 'collections' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--wood-amber)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  <Sparkles size={14} /> SUPER ADMIN • MEBEL KOLLEKSIYALARI
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Kolleksiyalar Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  Saytdagi barcha maxsus mebel kolleksiyalarini boshqaring, yangi kolleksiya yarating, banner va tavsiflarini o‘zgartiring hamda mebellarni biriktiring.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="/collections"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                >
                  <Eye size={16} /> Saytda Ko‘rish
                </a>
                <button
                  type="button"
                  onClick={handleOpenAddCollection}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                >
                  <Plus size={16} /> Yangi Kolleksiya Yaratish
                </button>
              </div>
            </div>

            {collections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <Sparkles size={48} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hozircha hech qanday kolleksiya yaratilmagan</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Yangi eksklyuziv mebel to‘plamini yaratish uchun yuqoridagi tugmani bosing.</p>
                <button type="button" onClick={handleOpenAddCollection} className="btn btn-primary">
                  <Plus size={16} /> Kolleksiya Qo‘shish
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {collections.map((col) => {
                  const attachedCount = (col.product_ids || []).length;
                  return (
                    <div
                      key={col.id}
                      className="glass-card"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Image cover & badges */}
                      <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                        <img
                          src={col.cover_image}
                          alt={col.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                        {col.badge && (
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-gradient)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {col.badge}
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                            {attachedCount} ta mebel
                          </span>
                          <span style={{ background: col.is_active !== false ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                            {col.is_active !== false ? 'Faol' : 'Yashirilgan'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, marginBottom: '1rem' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                          {col.title}
                        </h4>
                        {col.subtitle && (
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--wood-amber)', marginBottom: '0.4rem' }}>
                            {col.subtitle}
                          </div>
                        )}
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {col.description || 'Kolleksiya haqida qo‘shimcha tavsif kiritilmagan.'}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignProducts(col)}
                          className="btn btn-primary"
                          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.55rem 0.8rem', gap: '0.4rem' }}
                        >
                          <Package size={15} /> Mebellarni Biriktirish ({attachedCount})
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCollection(col)}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, justifyContent: 'center', gap: '0.35rem' }}
                          >
                            <Edit2 size={13} /> Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCollection(col.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444', justifyContent: 'center', gap: '0.35rem' }}
                          >
                            <Trash2 size={13} /> O‘chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                <Sliders size={42} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 0.75rem', display: 'block' }} />
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
                          <StatusBadge status={o.status || 'NEW'} format="bilingual" size="md" />
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
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Holat / Status:</span>
                          <select
                            value={o.status || 'NEW'}
                            onChange={(e) => handleAdminUpdateCustomOrderStatus(o.id, e.target.value)}
                            style={{
                              padding: '0.32rem 0.6rem',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-main)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {CUSTOM_ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
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
                <ShoppingBag size={42} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 0.75rem', display: 'block' }} />
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
                          <StatusBadge status={ord.status || 'PENDING'} format="bilingual" size="md" />
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
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Holat / Status:</span>
                          <select
                            value={ord.status || 'PENDING'}
                            onChange={(e) => handleAdminUpdateStandardOrderStatus(ord.id, e.target.value)}
                            style={{
                              padding: '0.32rem 0.6rem',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-main)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {STANDARD_ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <a href={`tel:${ord.customer_phone || ord.phone}`} className="btn btn-secondary btn-sm">
                          📞 Mijozga Bog‘lanish
                        </a>
                      </div>
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

        {/* TAB: BIZ HAQIMIZDA BOSHQARUVI */}
        {activeTab === 'about' && (
          <div style={{ maxWidth: '920px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="section-tag" style={{ color: 'var(--gold-accent)' }}>SAHIFA VA MAZMUN BOSHQARUVI</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>"Biz Haqimizda" Sahifasi Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                  Saytning <code>/about</code> sahifasidagi barcha matnlar, sarlavhalar, tarix, suratlar, statistika va tamoyillarni o‘zingiz istagandek o‘zgartiring.
                </p>
              </div>
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <Eye size={16} /> Saytda Ko‘rish
              </a>
            </div>

            <form
              onSubmit={handleSaveAbout}
              style={{
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.2rem, 4vw, 2.5rem)',
                border: '1.5px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem'
              }}
              className="glass-card"
            >
              {/* 1. SAHIFA BOSH QISMI (HERO & INTRO) */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--wood-amber)', marginBottom: '1.25rem' }}>
                  1. Sahifa Sarlavhasi va Nishoni
                </h3>

                <div className="dashboard-form-row">
                  <div className="form-group">
                    <label className="form-label">Kichik Nishon (Badge matni)</label>
                    <input
                      type="text"
                      value={settingsForm.about_badge || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_badge: e.target.value })}
                      placeholder="Masalan: Tarix & Mahorat"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sahifa Asosiy Sarlavhasi (H1) *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.about_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_title: e.target.value })}
                      placeholder="Masalan: Urgut Mebel Markazi Haqida"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Qisqa Shior / Tavsif (Tagline)</label>
                  <input
                    type="text"
                    value={settingsForm.about_subtitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_subtitle: e.target.value })}
                    placeholder="Urgutning asriy duradgorlik san'ati va zamonaviy uslub uyg'unligi"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 2. TARIX VA ASOSIY MATN (STORY SECTION) */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--wood-amber)', marginBottom: '1.25rem' }}>
                  2. Kompaniya Tarixi va Faoliyati
                </h3>

                <div className="form-group">
                  <label className="form-label">Bo‘lim Sarlavhasi (H2)</label>
                  <input
                    type="text"
                    value={settingsForm.about_story_title || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_story_title: e.target.value })}
                    placeholder="Masalan: Urgut Duradgorlarining Asriy Merosi"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">1-Asosiy Paragraf (Tarix va an'analar)</label>
                  <textarea
                    rows={3}
                    value={settingsForm.about_story_p1 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_story_p1: e.target.value })}
                    placeholder="Samarqand viloyatining Urgut tumani qadim zamonlardan beri hunarmandchilik..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">2-Asosiy Paragraf (Texnologiya va sifat)</label>
                  <textarea
                    rows={3}
                    value={settingsForm.about_story_p2 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_story_p2: e.target.value })}
                    placeholder="Biz ushbu asriy tajribani eng so‘nggi Germaniya va Italiya texnologiyalari bilan..."
                    className="form-textarea"
                  />
                </div>

                <ImageUploadField
                  label="Tarix Bo‘limi Rasmi (Surat yuklang yoki havola bering)"
                  value={settingsForm.about_image_url || ''}
                  onChange={(val) => setSettingsForm({ ...settingsForm, about_image_url: val })}
                  folder="about"
                  name="about_image_url"
                  placeholder="https://... yoki kompyuterdan surat yuklang"
                  helperText="Biz haqimizda sahifasidagi asosiy illustrativ fotosurat (Supabase Storage ga saqlanadi)."
                />

                <div className="dashboard-form-row" style={{ marginTop: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tugma Matni</label>
                    <input
                      type="text"
                      value={settingsForm.about_btn_text || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_btn_text: e.target.value })}
                      placeholder="Maxsus Buyurtma Berish"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tugma Havolasi (URL)</label>
                    <input
                      type="text"
                      value={settingsForm.about_btn_url || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_btn_url: e.target.value })}
                      placeholder="/custom-order"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* 3. RAQAMLAR VA STATISTIKA (STATS BLOCK) */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--wood-amber)', marginBottom: '0.4rem' }}>
                  3. Statistika Ko‘rsatkichlari (4 ta ko‘rsatkich)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Mijozlarga ishonch bag‘ishlovchi statistika raqamlarini o‘zgartiring.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label">1-Raqam</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat1_number || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat1_number: e.target.value })}
                      placeholder="25+"
                      className="form-input"
                      style={{ marginBottom: '0.5rem', fontWeight: 700 }}
                    />
                    <label className="form-label">1-Izoh</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat1_label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat1_label: e.target.value })}
                      placeholder="Yillik Tajriba"
                      className="form-input"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label">2-Raqam</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat2_number || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat2_number: e.target.value })}
                      placeholder="10,000+"
                      className="form-input"
                      style={{ marginBottom: '0.5rem', fontWeight: 700 }}
                    />
                    <label className="form-label">2-Izoh</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat2_label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat2_label: e.target.value })}
                      placeholder="Mebellar"
                      className="form-input"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label">3-Raqam</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat3_number || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat3_number: e.target.value })}
                      placeholder="98%"
                      className="form-input"
                      style={{ marginBottom: '0.5rem', fontWeight: 700 }}
                    />
                    <label className="form-label">3-Izoh</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat3_label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat3_label: e.target.value })}
                      placeholder="Mamnun Mijozlar"
                      className="form-input"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label">4-Raqam</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat4_number || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat4_number: e.target.value })}
                      placeholder="5 Yil"
                      className="form-input"
                      style={{ marginBottom: '0.5rem', fontWeight: 700 }}
                    />
                    <label className="form-label">4-Izoh</label>
                    <input
                      type="text"
                      value={settingsForm.about_stat4_label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_stat4_label: e.target.value })}
                      placeholder="Rasmiy Kafolat"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* 4. ASOSIY TAMOYILLAR VA AFZALLIKLAR (VALUES) */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--wood-amber)', marginBottom: '0.4rem' }}>
                  4. Asosiy Tamoyillar va Ustunliklar (3 ta karta)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Kompaniya sifat kafolatlari va ustunliklari.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>1-Tamoyil Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.about_val1_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val1_title: e.target.value })}
                      placeholder="100% Tabiiy Massiv"
                      className="form-input"
                      style={{ marginBottom: '0.6rem' }}
                    />
                    <label className="form-label">1-Tamoyil Tavsifi</label>
                    <textarea
                      rows={2}
                      value={settingsForm.about_val1_desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val1_desc: e.target.value })}
                      placeholder="Quritilgan eman, yong‘oq va qarag‘ay daraxtlaridan foydalanamiz..."
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>2-Tamoyil Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.about_val2_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val2_title: e.target.value })}
                      placeholder="Rasmiy Kafolat"
                      className="form-input"
                      style={{ marginBottom: '0.6rem' }}
                    />
                    <label className="form-label">2-Tamoyil Tavsifi</label>
                    <textarea
                      rows={2}
                      value={settingsForm.about_val2_desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val2_desc: e.target.value })}
                      placeholder="Har bir ishlab chiqarilgan mebel uchun 3 yildan 5 yilgacha rasmiy kafolat..."
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>3-Tamoyil Sarlavhasi</label>
                    <input
                      type="text"
                      value={settingsForm.about_val3_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val3_title: e.target.value })}
                      placeholder="200+ Mohir Usta"
                      className="form-input"
                      style={{ marginBottom: '0.6rem' }}
                    />
                    <label className="form-label">3-Tamoyil Tavsifi</label>
                    <textarea
                      rows={2}
                      value={settingsForm.about_val3_desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, about_val3_desc: e.target.value })}
                      placeholder="Platformamiz orqali Urgutning eng sara mebel ustalari bilan bevosita bog‘lanib..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSavingSettings}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.9rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Supabase-ga Saqlanmoqda...</span>
                  </>
                ) : (
                  <span>"Biz Haqimizda" Ma‘lumotlarini Saqlash va Saytda Yangilash</span>
                )}
              </button>
            </form>
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
                padding: 'clamp(1.2rem, 4vw, 2.5rem)',
                border: '1.5px solid var(--wood-light)',
                boxShadow: 'var(--shadow-sm)',
                boxSizing: 'border-box',
                width: '100%'
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

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Hero Asosiy Sarlavhasi (Ixtiyoriy)</label>
                  <input
                    type="text"
                    value={settingsForm.hero_title || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    placeholder={`${settingsForm.site_name || "Urgut Mebel Markazi"} - Zamonaviy va Buyurtma Mebellar`}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bo‘sh qoldirilsa: "{settingsForm.site_name || "Urgut Mebel Markazi"} - Zamonaviy va Buyurtma Mebellar" ko‘rsatiladi.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Ostidagi Matn / Shior (Ixtiyoriy)</label>
                  <input
                    type="text"
                    value={settingsForm.hero_subtitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                    placeholder={settingsForm.site_tagline || "Urgutning asriy duradgorlik san'ati..."}
                    className="form-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bo‘sh qoldirilsa sayt shiori ko‘rsatiladi.
                  </span>
                </div>
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

              <button
                type="submit"
                disabled={isSavingSettings}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  marginTop: '1.75rem',
                  padding: '0.9rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Supabase-ga Saqlanmoqda...</span>
                  </>
                ) : (
                  <span>Barcha Sozlamalarni Saqlash va Saytda Yangilash</span>
                )}
              </button>
            </form>

            {/* AFISHA VA SLAYD RASMLARI SOZLAMALARI */}
            <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '2px dashed var(--border-subtle)' }}>
              {renderSlideManagementContent()}
            </div>
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

        {/* TAB: BANNERS & ANNOUNCEMENTS (ELONLAR VA REKLAMA BANNERLARI) */}
        {activeTab === 'banners' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>E‘lonlar va Reklama Bannerlari Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Bosh sahifadagi aksiyalar, chegirmalar va e‘lonlar bannerlarini qo‘shing, tahrirlang yoki o‘chiring (Supabase <code>public.banners</code> jadvalida to‘g‘ridan-to‘g‘ri saqlanadi).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBanner(null);
                  setBannerModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Plus size={16} /> Yangi E‘lon Qo‘shish
              </button>
            </div>

            {/* Quick Link to Slide Shows */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(217, 119, 6, 0.08)',
              border: '1.5px solid rgba(217, 119, 6, 0.25)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <ImageIcon size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Header Afishalari va Slayd Shou Rasmlari Boshqaruvi
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Chairs & Stools, Sofas (-35%), Blog, FAQ va Kolleksiya afishalari slaydlarini tahrirlash
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700, gap: '0.4rem', borderColor: 'var(--wood-amber)', color: 'var(--wood-amber)' }}
              >
                Slaydlarni Boshqarish →
              </button>
            </div>

            {banners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <ImageIcon size={42} style={{ color: 'var(--wood-amber)', opacity: 0.6, margin: '0 auto 0.75rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Hozircha e‘lonlar mavjud emas</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Yuqoridagi "Yangi E‘lon Qo‘shish" tugmasi orqali yangi e‘lon yoki reklama banneri yarating</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {banners.map((ban) => (
                  <div key={ban.id} className="glass-card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '160px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                      {ban.image_url ? (
                        <img src={ban.image_url} alt={ban.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          Rasm yuklanmagan
                        </div>
                      )}
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: ban.is_active !== false ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                        color: '#fff'
                      }}>
                        {ban.is_active !== false ? 'Faol' : 'Faol emas'}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>{ban.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            Tartib: #{ban.display_order ?? 0}
                          </span>
                        </div>
                        {ban.subtitle && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                            {ban.subtitle}
                          </p>
                        )}
                        {/* 3-Language status pills */}
                        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                            🇺🇿 UZ (Asosiy)
                          </span>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: ban.title_ru ? 'rgba(59, 130, 246, 0.15)' : 'rgba(156, 163, 175, 0.12)', color: ban.title_ru ? '#3b82f6' : 'var(--text-muted)', fontWeight: 600 }}>
                            🇷🇺 RU: {ban.title_ru ? '✓ Kiritilgan' : '— Ixtiyoriy'}
                          </span>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: ban.title_en ? 'rgba(139, 92, 246, 0.15)' : 'rgba(156, 163, 175, 0.12)', color: ban.title_en ? '#8b5cf6' : 'var(--text-muted)', fontWeight: 600 }}>
                            🇬🇧 EN: {ban.title_en ? '✓ Kiritilgan' : '— Ixtiyoriy'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--wood-amber)', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
                          🔗 Havola: <strong>{ban.link || '/furniture'}</strong> ({ban.button_text || 'Batafsil'})
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBanner(ban);
                            setBannerModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Edit2 size={13} /> Tahrirlash
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(ban.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444', gap: '0.35rem' }}
                        >
                          <Trash2 size={13} /> O‘chirish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: HEADER AFISHALARI & SLAYD SHOU BOSHQARUVI */}
        {activeTab === 'slides' && (
          <div>
            {renderSlideManagementContent()}
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
              <div className="form-group">
                <label className="form-label">
                  Tegishli Mebel Do‘koni * {user?.store_id && <span style={{ color: 'var(--wood-amber)' }}>(Do‘koningiz avtomatik biriktirilgan)</span>}
                </label>
                {user?.store_id ? (
                  <div>
                    <input
                      type="text"
                      disabled
                      value={stores.find((s) => s.id === user.store_id)?.name || "Do‘koningiz"}
                      className="form-input"
                      style={{ opacity: 0.85, backgroundColor: 'var(--bg-secondary)' }}
                    />
                    <input type="hidden" name="store_id" value={user.store_id} />
                  </div>
                ) : (
                  <select name="store_id" defaultValue={editingProduct?.store_id || stores[0]?.id} className="form-select">
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>🏪 {s.name} ({s.address})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Yasagan Usta (Ustaning shaxsiy portfoliosi uchun)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ixtiyoriy</span>
                </label>
                <select name="craftsman_id" defaultValue={editingProduct?.craftsman_id || 'NONE'} className="form-select">
                  <option value="NONE">— Biriktirilmagan (Umumiy do‘kon mahsuloti)</option>
                  {craftsmen.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.store_name ? `(${c.store_name})` : '(Mustaqil / Free)'}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Usta tanlansa, ushbu mebel e‘loni ustaning shaxsiy profilida va portfolio sahifasida avtomatik ko‘rinadi.
                </div>
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

      {/* DISCOUNT CREATE/EDIT MODAL */}
      {discountModalOpen && (
        <div className="modal-overlay" onClick={() => setDiscountModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingDiscountProduct ? `"${editingDiscountProduct.name}"ga Chegirma Belgilash` : 'Yangi Mebelga Chegirma Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveDiscount}>
              {!editingDiscountProduct ? (
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Mebelni Tanlang *</label>
                  <select
                    required
                    className="form-select"
                    onChange={(e) => {
                      const found = products.find((p) => p.id === e.target.value);
                      setEditingDiscountProduct(found);
                      setDiscountVal(found?.discount_price ? String(found.discount_price) : '');
                    }}
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    <option value="">-- Mebelni tanlang --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({Number(p.price).toLocaleString()} so‘m)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Tanlangan mebel:</div>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{editingDiscountProduct.name}</strong>
                  <div style={{ fontSize: '0.88rem', color: 'var(--wood-amber)', marginTop: '0.2rem' }}>
                    Asl narxi: <strong>{Number(editingDiscountProduct.price).toLocaleString()} so‘m</strong>
                  </div>
                </div>
              )}

              {/* Discount Type: Price or Percent */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Chegirma Usuli:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setDiscountType('price')}
                    className={`btn ${discountType === 'price' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ flex: 1 }}
                  >
                    Aniq Narx (so‘m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`btn ${discountType === 'percent' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ flex: 1 }}
                  >
                    Foiz (% off)
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">
                  {discountType === 'price' ? 'Yangi Chegirmali Narx (so‘m) *' : 'Chegirma Foizi (%) *'}
                </label>
                <input
                  type="number"
                  required
                  value={discountVal}
                  onChange={(e) => setDiscountVal(e.target.value)}
                  placeholder={discountType === 'price' ? 'Masalan: 9500000' : 'Masalan: 15'}
                  className="form-input"
                />
                {editingDiscountProduct && discountVal && (
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '0.35rem', fontWeight: 600 }}>
                    {discountType === 'percent' ? (
                      `Mijoz to‘laydigan yakuniy narx: ${Math.round(editingDiscountProduct.price * (1 - Math.min(99, Number(discountVal)) / 100)).toLocaleString()} so‘m`
                    ) : (
                      Number(discountVal) < editingDiscountProduct.price ? (
                        `Chegirma: -${Math.round((1 - Number(discountVal) / editingDiscountProduct.price) * 100)}% (${(editingDiscountProduct.price - Number(discountVal)).toLocaleString()} so‘m tejov)`
                      ) : (
                        <span style={{ color: '#dc2626' }}>Chegirmali narx asl narxdan kam bo‘lishi lozim!</span>
                      )
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setDiscountModalOpen(false); setEditingDiscountProduct(null); }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!editingDiscountProduct}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Chegirmani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER CREATE/EDIT MODAL */}
      {bannerModalOpen && (
        <div className="modal-overlay" onClick={() => setBannerModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingBanner ? 'E‘lonni Tahrirlash' : 'Yangi E‘lon Qo‘shish'}
            </h3>
            <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              💡 <strong>Ko‘p tilli e‘lon:</strong> O‘zbekcha matn <u>majburiy</u> (*). Ruscha va Inglizcha tarjimalari esa <u>ixtiyoriy</u>. Agar ruscha/inglizcha kiritilmasa, saytda avtomatik ravishda o‘zbekcha e‘lon ko‘rinadi.
            </div>

            <form onSubmit={handleSaveBanner}>
              {/* 1. O'ZBEKCHA (MAJBURITY) */}
              <div style={{ border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🇺🇿</span>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>O‘zbekcha (Majburiy *)</strong>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: '#10b981', color: '#fff', fontWeight: 700 }}>Asosiy</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">E‘lon Sarlavhasi (UZ) *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    defaultValue={editingBanner?.title_uz || editingBanner?.title || ''}
                    placeholder="Masalan: Bahorgi Yangi To‘plam Aksiyasi"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Qisqa Tavsif / Tagline (UZ)</label>
                  <textarea
                    rows={2}
                    name="subtitle"
                    defaultValue={editingBanner?.subtitle_uz || editingBanner?.subtitle || ''}
                    placeholder="Barcha mebellarga 20% gacha chegirma..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tugma Matni (UZ)</label>
                  <input
                    type="text"
                    name="button_text"
                    defaultValue={editingBanner?.button_text_uz || editingBanner?.button_text || 'Batafsil'}
                    placeholder="Batafsil"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 2. RUSCHA (IXTIYORIY) */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🇷🇺</span>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Русский (Ixtiyoriy / Необязательно)</strong>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Ixtiyoriy</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Заголовок объявления (RU)</label>
                  <input
                    type="text"
                    name="title_ru"
                    defaultValue={editingBanner?.title_ru || ''}
                    placeholder="Например: Весенняя коллекция мебели"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Описание / Подзаголовок (RU)</label>
                  <textarea
                    rows={2}
                    name="subtitle_ru"
                    defaultValue={editingBanner?.subtitle_ru || ''}
                    placeholder="Скидки до 20% на весь ассортимент..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Текст кнопки (RU)</label>
                  <input
                    type="text"
                    name="button_text_ru"
                    defaultValue={editingBanner?.button_text_ru || ''}
                    placeholder="Подробнее"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 3. INGLIZCHA (IXTIYORIY) */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🇬🇧</span>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>English (Ixtiyoriy / Optional)</strong>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Optional</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Announcement Title (EN)</label>
                  <input
                    type="text"
                    name="title_en"
                    defaultValue={editingBanner?.title_en || ''}
                    placeholder="E.g.: Spring Special Sale & New Collection"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Subtitle / Description (EN)</label>
                  <textarea
                    rows={2}
                    name="subtitle_en"
                    defaultValue={editingBanner?.subtitle_en || ''}
                    placeholder="Up to 20% discount on modern furniture..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Button Text (EN)</label>
                  <input
                    type="text"
                    name="button_text_en"
                    defaultValue={editingBanner?.button_text_en || ''}
                    placeholder="Learn More"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 4. UMUMIY SOZLAMALAR */}
              <ImageUploadField
                label="Banner Rasmi (URL yoki Supabase Storage)"
                name="image_url"
                value={editingBanner?.image_url || ''}
                folder="banners"
                placeholder="https://... yoki faylni tanlab yuklang"
                helperText="Banner rasm havolasini kiriting yoki fayl tanlang (Supabase Storage ga yuklanadi)."
              />

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">O‘tish Havolasi (Link)</label>
                  <input
                    type="text"
                    name="link"
                    defaultValue={editingBanner?.link || '/furniture'}
                    placeholder="/furniture yoki /discounts"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tartib Raqami</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingBanner?.display_order ?? 0}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingBanner ? editingBanner.is_active !== false : true}
                  />
                  <span>E‘lon saytda faol ko‘rinsin</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
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

      {/* STORE CREATE/EDIT MODAL */}
      {storeModalOpen && (
        <div className="modal-overlay" onClick={() => setStoreModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingStore ? 'Do‘kon Profilini Tahrirlash' : 'Yangi Mebel Do‘koni Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveStore}>
              <div className="form-group">
                <label className="form-label">Do‘kon / Fabrika Nomi *</label>
                <input
                  type="text"
                  required
                  name="name"
                  defaultValue={editingStore?.name || ''}
                  placeholder="Masalan: Urgut Shahar Mebel Markazi"
                  className="form-input"
                />
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Telefon Raqami *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    defaultValue={editingStore?.phone || '+998 90 '}
                    placeholder="+998 90 123 45 67"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mas‘ul Menedjer Ismi</label>
                  <input
                    type="text"
                    name="manager_name"
                    defaultValue={editingStore?.manager_name || ''}
                    placeholder="Masalan: Jamshid Rustamov"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Manzil *</label>
                <input
                  type="text"
                  required
                  name="address"
                  defaultValue={editingStore?.address || ''}
                  placeholder="Masalan: Urgut shahri, Navoiy shoh ko‘chasi, 45-uy"
                  className="form-input"
                />
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Ish Vaqti</label>
                  <input
                    type="text"
                    name="working_hours"
                    defaultValue={editingStore?.working_hours || '08:30 - 20:00 (Dam olish kunlarisiz)'}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reyting (1.0 dan 5.0 gacha)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1"
                    max="5"
                    name="rating"
                    defaultValue={editingStore?.rating || 4.95}
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Do‘kon Banner Rasmi"
                name="banner"
                value={editingStore?.banner || ''}
                folder="stores"
                placeholder="https://... yoki faylni tanlab yuklang"
                helperText="Do'kon sahifasi tepasidagi keng formatdagi rasm."
              />

              <ImageUploadField
                label="Do‘kon Logotipi"
                name="logo"
                value={editingStore?.logo || ''}
                folder="stores"
                placeholder="https://... yoki faylni tanlab yuklang"
                helperText="Do'konning dumaloq/kvadrat logotipi."
              />

              <div className="form-group">
                <label className="form-label">Do‘kon Haqida Tavsif</label>
                <textarea
                  rows={3}
                  name="description"
                  defaultValue={editingStore?.description || ''}
                  placeholder="Do'kon ixtisosligi, assortimenti va xizmatlari..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="verified"
                    defaultChecked={editingStore ? editingStore.verified !== false : true}
                  />
                  <span>Rasmiy Tasdiqlangan Do‘kon nishoni (Verified)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStoreModalOpen(false)}
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

      {/* REVIEW & APPROVE DISCOUNT REQUEST MODAL */}
      {reviewModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '560px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Menejer So‘rovini Ko‘rib Chiqish
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Ushbu so‘rovni tasdiqlashingiz bilan mebel avtomatik ravishda tanlangan bo‘limga joylashtiriladi va narxi yangilanadi.
            </p>

            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.25rem' }}>
              <img
                src={selectedRequest.product_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80'}
                alt=""
                style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 850 }}>{selectedRequest.product_name}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Do‘kon: <strong>{selectedRequest.store_name}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Menejer: <strong>{selectedRequest.manager_name} ({selectedRequest.manager_phone})</strong>
                </div>
                <div style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                    {Number(selectedRequest.current_price).toLocaleString()} so‘m
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--wood-amber)' }}>
                    → {Number(selectedRequest.proposed_discount_price).toLocaleString()} so‘m
                  </span>
                </div>
              </div>
            </div>

            {selectedRequest.notes && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(250, 109, 88, 0.08)', border: '1px solid rgba(250, 109, 88, 0.2)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--figma-coral)', display: 'block', marginBottom: '0.2rem' }}>Menejer Murojaati:</strong>
                {selectedRequest.notes}
              </div>
            )}

            <form onSubmit={handleApproveRequest}>
              <div className="form-group">
                <label className="form-label">Qaysi Bo‘limga Joylashtirishni Tasdiqlaysiz? *</label>
                <select
                  value={reviewPlacement}
                  onChange={(e) => setReviewPlacement(e.target.value)}
                  className="form-select"
                >
                  <option value="discount_section">Chegirmalar Bo‘limi (Katalogda chegirma)</option>
                  <option value="hero_collection">Asosiy Sahifa Karuseli (Figma Collection)</option>
                  <option value="trending">Top 10 Trend Mebellari Reytingi</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Super Admin Javobi / Izohi (Menejer ko‘radi)</label>
                <textarea
                  rows={2}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Masalan: So‘rov ma'qullandi, mahsulot bosh sahifa trend mebellariga joylashtirildi."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleRejectRequest}
                  className="btn"
                  style={{ flex: 1, backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 700 }}
                >
                  Rad Etish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.2, fontWeight: 750 }}
                >
                  Tasdiqlash & Joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOMEPAGE SECTION EDIT MODAL (SUPER ADMIN FULL CONTROL) */}
      {sectionModalOpen && editingSection && (
        <div className="modal-overlay" onClick={() => setSectionModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px', padding: '2rem', borderRadius: '22px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SUPER ADMIN • BO‘LIMNI TAHRIRLASH
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0 0', color: 'var(--text-main)' }}>
                  {editingSection.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSectionModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSectionForm}>
              <div className="form-group">
                <label className="form-label">Bo‘lim Sarlavhasi (Heading) *</label>
                <input
                  type="text"
                  required
                  name="title"
                  defaultValue={editingSection.title || ''}
                  placeholder="Masalan: Explore Shoe Racks yoki Bayramona Chegirmalar"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qisqa Izoh / Ta'rif (Subtitle)</label>
                <textarea
                  rows={2}
                  name="subtitle"
                  defaultValue={editingSection.subtitle || ''}
                  placeholder="Bo‘lim haqidagi qo‘shimcha yozuv yoki reklama shiori..."
                  className="form-textarea"
                />
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Aksiya Nishoni (Badge)</label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingSection.badge || ''}
                    placeholder="Masalan: NEW, -50%, SALE, EDITORIAL"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tugma / Bo‘lim Havolasi (Link)</label>
                  <input
                    type="text"
                    name="link"
                    defaultValue={editingSection.link || ''}
                    placeholder="/furniture?category=cat-living"
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Afisha yoki Banner Rasmi (Ixtiyoriy)"
                name="banner_image"
                value={editingSection.banner_image || ''}
                folder="banners"
                placeholder="https://... yoki faylni tanlab yuklang"
                helperText="Banner yoki vitrina bo‘limlari uchun rasm havolasi (Supabase-ga yuklanadi)."
              />

              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingSection.is_active !== false}
                    style={{ width: '18px', height: '18px', accentColor: '#0071e3' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      Ushbu bo‘lim bosh sahifada ko‘rinsin (Faol holat)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Belgini olib tashlasangiz, bo‘lim sayt bosh sahifasidan vaqtincha yashiriladi.
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.7rem 1.25rem' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.7rem 1.5rem', backgroundColor: '#0071e3', borderColor: '#0071e3', fontWeight: 700 }}
                >
                  Saqlash va Saytda Yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT COLLECTION */}
      {collectionModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content apple-card" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} style={{ color: 'var(--wood-amber)' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  {editingCollection ? 'Kolleksiyani Tahrirlash' : 'Yangi Kolleksiya Yaratish'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCollectionModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCollection}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Kolleksiya Nomi <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingCollection?.title || ''}
                    placeholder="Masalan: Atmos Kolleksiyasi"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Slug (URL identifikatori)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingCollection?.slug || ''}
                    placeholder="Masalan: atmos-collection"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Kichik Sarlavha (Subtitle)
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={editingCollection?.subtitle || ''}
                    placeholder="Masalan: Shinam va zamonaviy interyer to‘plami"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Yorliq (Badge)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingCollection?.badge || ''}
                    placeholder="Masalan: THE NEW ATMOS, 2026 TREND"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <ImageUploadField
                  label="Kolleksiya Asosiy Muqova Rasmi (Cover Image)"
                  name="cover_image"
                  defaultValue={editingCollection?.cover_image || ''}
                  folder="collections"
                  placeholder="https://... yoki kompyuterdan fayl tanlang"
                  helperText="Kolleksiyalar sahifasida va bosh sahifa kartalarida aks etadigan yuqori sifatli banner rasmi."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Kolleksiya Tavsifi
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingCollection?.description || ''}
                  placeholder="Ushbu to‘plam haqida mijozlar uchun jozibador qisqacha ma’lumot..."
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Tartib Raqami (Display Order)
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingCollection?.display_order || 0}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingCollection?.is_active !== false}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--wood-amber)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        Kolleksiya saytda ko‘rinsin (Faol)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Belgini olsangiz, foydalanuvchilardan yashiriladi
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setCollectionModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  <Check size={16} /> Saqlash va Saytda Yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN PRODUCTS TO COLLECTION */}
      {assignProductsModalOpen && selectedColForProducts && (
        <div className="modal-backdrop">
          <div className="modal-content apple-card" style={{ maxWidth: '820px', width: '95%', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-amber)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={13} /> Kolleksiya Mebellari
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0' }}>
                  "{selectedColForProducts.title}" Kolleksiyasiga Mebellarni Biriktirish
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Kolleksiyaga qo‘shmoqchi bo‘lgan mebellarni belgilang. Tanlangan: <strong>{(selectedColForProducts.product_ids || []).length} ta</strong> mebel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignProductsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Search & Filter toolbar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={colProductSearch}
                  onChange={(e) => setColProductSearch(e.target.value)}
                  placeholder="Mebel nomi bo‘yicha qidirish..."
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>

              <select
                value={colCategoryFilter}
                onChange={(e) => setColCategoryFilter(e.target.value)}
                className="form-input"
                style={{ minWidth: '190px', width: 'auto' }}
              >
                <option value="ALL">Barcha Kategoriyalar</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Products List with Checkboxes */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px', background: 'var(--bg-secondary)', padding: '0.5rem' }}>
              {(() => {
                const filteredProducts = products.filter((p) => {
                  const matchSearch = !colProductSearch || p.name.toLowerCase().includes(colProductSearch.toLowerCase());
                  const matchCat = colCategoryFilter === 'ALL' || p.category_id === colCategoryFilter || p.category === colCategoryFilter;
                  return matchSearch && matchCat;
                });

                if (filteredProducts.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      Qidiruv bo‘yicha mebellar topilmadi.
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {filteredProducts.map((p) => {
                      const isAssigned = (selectedColForProducts.product_ids || []).includes(p.id);
                      const catName = categories.find((c) => c.id === p.category_id)?.name || p.category || 'Mebel';
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleProductInCollection(p.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            background: isAssigned ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card)',
                            border: isAssigned ? '1.5px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => {}} // handled by parent div onClick
                            style={{ width: '18px', height: '18px', accentColor: 'var(--wood-amber)', cursor: 'pointer' }}
                          />

                          <img
                            src={p.image_url || p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80'}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                          />

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.name}
                            </div>
                            <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              <span style={{ color: 'var(--wood-amber)', fontWeight: 600 }}>{catName}</span>
                              {p.store_name && <span>• {p.store_name}</span>}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                              {(p.discount_price || p.price)?.toLocaleString()} so‘m
                            </div>
                            {p.discount_price && (
                              <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                                {p.price?.toLocaleString()} so‘m
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Belgilangan mebellar darhol kolleksiyaga biriktiriladi.
              </div>
              <button
                type="button"
                onClick={() => setAssignProductsModalOpen(false)}
                className="btn btn-primary"
                style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}
              >
                <Check size={16} /> Tayyor / Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
