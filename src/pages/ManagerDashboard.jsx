import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import { uploadProductImage, isSupabaseConfigured } from '../lib/supabase';
import {
  Briefcase,
  Sliders,
  DollarSign,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Send,
  Eye,
  AlertCircle,
  Truck,
  Layers,
  Ruler,
  MessageSquare,
  Package,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Search,
  Check,
  X
} from 'lucide-react';

export const ManagerDashboard = () => {
  const { user, isManager, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();

  // Navigation tab for Manager: 'furniture' (Mebellar) or 'custom_orders' (Buyurtmalar)
  const [activeMainTab, setActiveMainTab] = useState('furniture');

  // Furniture / Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form state
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    discount_price: '',
    category_id: '',
    material: '',
    dimensions: '',
    stock: 10,
    description: '',
    is_published: true,
    is_featured: false,
    is_new: true,
    images: []
  });
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Custom Orders state
  const [orders, setOrders] = useState([]);
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [activeOrder, setActiveOrder] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [loading, setLoading] = useState(true);

  // Price Offer Calculator State
  const [calculatorForm, setCalculatorForm] = useState({
    material_cost: '',
    labor_cost: '',
    additional_cost: '',
    delivery_cost: '',
    discount: '',
    notes: ''
  });

  const loadData = async () => {
    try {
      const [orderList, prodList, catList] = await Promise.all([
        dataService.getCustomOrders(),
        dataService.getProducts(),
        dataService.getCategories()
      ]);
      setOrders(orderList || []);
      setProducts(prodList || []);
      setCategories(catList || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleCustomOrdersUpdate = () => loadData();
    const handleProductsUpdate = () => loadData();
    window.addEventListener('urgut_store_custom_orders_updated', handleCustomOrdersUpdate);
    window.addEventListener('urgut_store_products_updated', handleProductsUpdate);
    return () => {
      window.removeEventListener('urgut_store_custom_orders_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_products_updated', handleProductsUpdate);
    };
  }, []);

  if (isGuest || !isManager) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Menedjer Ruxsati Talab Qilinadi
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Ushbu bo‘lim faqat Urgut Mebel menedjerlari uchun mo‘ljallangan. Iltimos, tizimga kiring.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
          >
            Menedjer Sifatida Kirish
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FURNITURE / PRODUCT CRUD HANDLERS
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      discount_price: '',
      category_id: categories[0]?.id || '',
      material: 'Eman / MDF',
      dimensions: '200x90x75 sm',
      stock: 10,
      description: '',
      is_published: true,
      is_featured: false,
      is_new: true,
      images: []
    });
    setUrlInput('');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      price: prod.price || '',
      discount_price: prod.discount_price || '',
      category_id: prod.category_id || (categories[0]?.id || ''),
      material: prod.material || '',
      dimensions: prod.dimensions || '',
      stock: prod.stock ?? 10,
      description: prod.description || '',
      is_published: prod.is_published ?? true,
      is_featured: prod.is_featured ?? false,
      is_new: prod.is_new ?? false,
      images: prod.images && prod.images.length > 0 ? [...prod.images] : (prod.image_url ? [prod.image_url] : [])
    });
    setUrlInput('');
    setProductModalOpen(true);
  };

  // 1. Fayldan rasm yuklash (Kompyuter yoki telefon) -> Supabase Storage ga yuklanadi
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    addToast('Rasm yuklanmoqda...', 'info');

    try {
      const uploadPromises = Array.from(files).map((file) => uploadProductImage(file));
      const results = await Promise.all(uploadPromises);

      const newUrls = [];
      results.forEach((res) => {
        if (res.url) {
          newUrls.push(res.url);
        }
      });

      if (newUrls.length > 0) {
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newUrls]
        }));
        addToast(
          isSupabaseConfigured
            ? `${newUrls.length} ta rasm Supabase Storage ga muvaffaqiyatli yuklandi!`
            : `${newUrls.length} ta rasm muvaffaqiyatli qo‘shildi!`,
          'success'
        );
      }
    } catch (err) {
      console.error(err);
      addToast('Rasmni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // 2. Tayyor link (URL) orqali rasm qo'shish
  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      addToast('Iltimos, rasm havolasini (URL) kiriting', 'warning');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      addToast('To‘g‘ri rasm havolasini kiriting (https://...)', 'error');
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed]
    }));
    setUrlInput('');
    addToast('Rasm havolasi qo‘shildi!', 'success');
  };

  // Rasmni o'chirish
  const handleRemoveImage = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Rasmni asosiy (bosh rasm) qilish
  const handleSetPrimaryImage = (index) => {
    setProductForm((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [selected, ...rest]
      };
    });
    addToast('Asosiy (bosh) rasm belgilandi!', 'info');
  };

  // Mebelni saqlash
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      addToast('Mebel nomi va narxini kiritish majburiy!', 'warning');
      return;
    }

    const finalImages = productForm.images.length > 0
      ? productForm.images
      : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];

    const prodPayload = {
      ...(editingProduct || {}),
      name: productForm.name.trim(),
      price: Number(productForm.price),
      discount_price: productForm.discount_price ? Number(productForm.discount_price) : null,
      category_id: productForm.category_id || categories[0]?.id,
      material: productForm.material,
      dimensions: productForm.dimensions,
      stock: Number(productForm.stock) || 0,
      description: productForm.description,
      is_published: Boolean(productForm.is_published),
      is_featured: Boolean(productForm.is_featured),
      is_new: Boolean(productForm.is_new),
      images: finalImages,
      image_url: finalImages[0]
    };

    await dataService.saveProduct(prodPayload);
    addToast(editingProduct ? 'Mebel muvaffaqiyatli yangilandi!' : 'Yangi mebel muvaffaqiyatli qo‘shildi!', 'success');
    setProductModalOpen(false);
    loadData();
  };

  // Mebelni o'chirish
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Rostdan ham "${name}" mebelini o‘chirmoqchimisiz?`)) {
      await dataService.deleteProduct(id);
      addToast('Mebel katalogdan o‘chirildi', 'info');
      loadData();
    }
  };

  // Mebellarni filtrlash
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // CUSTOM ORDERS HANDLERS
  // ==========================================
  const filteredOrders = orders.filter((o) => {
    if (selectedStatusTab === 'ALL') return true;
    return o.status === selectedStatusTab;
  });

  const totalCost =
    (Number(calculatorForm.material_cost) || 0) +
    (Number(calculatorForm.labor_cost) || 0) +
    (Number(calculatorForm.additional_cost) || 0) +
    (Number(calculatorForm.delivery_cost) || 0) -
    (Number(calculatorForm.discount) || 0);

  const openOrderInspection = (order) => {
    setActiveOrder(order);
    setInternalNotes(order.internal_notes || '');
    if (order.price_offer) {
      setCalculatorForm({
        material_cost: order.price_offer.material_cost || '',
        labor_cost: order.price_offer.labor_cost || '',
        additional_cost: order.price_offer.additional_cost || '',
        delivery_cost: order.price_offer.delivery_cost || '',
        discount: order.price_offer.discount || '',
        notes: order.price_offer.notes || ''
      });
    } else {
      setCalculatorForm({
        material_cost: '',
        labor_cost: '',
        additional_cost: '',
        delivery_cost: '',
        discount: '',
        notes: ''
      });
    }
  };

  const handleSendPriceOffer = async (e) => {
    e.preventDefault();
    if (!activeOrder) return;
    if (totalCost <= 0) {
      addToast('Yakuniy narx 0 dan katta bo‘lishi lozim!', 'warning');
      return;
    }
    await dataService.savePriceOffer(activeOrder.id, {
      ...calculatorForm,
      total_price: totalCost
    });
    addToast(`Mijozga narx taklifi yuborildi: ${Number(totalCost).toLocaleString()} so‘m!`, 'success');
    setCalculatorOpen(false);
    loadData();
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeOrder) return;
    await dataService.updateCustomOrderStatus(
      activeOrder.id,
      newStatus,
      `Menedjer (${user.full_name}) tomonidan yangilandi`,
      user.full_name
    );
    addToast(`Holat yangilandi: ${newStatus}`, 'success');
    setStatusModalOpen(false);
    loadData();
  };

  const statusTabs = [
    { key: 'ALL', label: 'Barchasi' },
    { key: 'NEW', label: 'Yangi (NEW)' },
    { key: 'REVIEWING', label: 'Ko‘rib chiqilmoqda' },
    { key: 'PRICE_SENT', label: 'Narx yuborilgan' },
    { key: 'CUSTOMER_APPROVED', label: 'Mijoz tasdiqlagan' },
    { key: 'IN_PRODUCTION', label: 'Ishlab chiqarishda' },
    { key: 'READY', label: 'Tayyor' },
    { key: 'COMPLETED', label: 'Tugatilgan' }
  ];

  return (
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: '#fcfbfa', minHeight: '88vh' }}>
      <div className="container">

        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
              <Briefcase size={16} /> MENEDJER PANELI
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Mebel va Ishlab Chiqarish Boshqaruvi</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Menedjer: <strong style={{ color: 'var(--text-main)' }}>{user.full_name}</strong>
            </div>
            {isSupabaseConfigured && (
              <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={14} /> Supabase Ulangan
              </span>
            )}
          </div>
        </div>

        {/* Top Navigation Switch: MEBELLAR vs MAXSUS BUYURTMALAR */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '0.4rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            maxWidth: '540px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab('furniture')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              backgroundColor: activeMainTab === 'furniture' ? 'var(--wood-amber)' : 'transparent',
              color: activeMainTab === 'furniture' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Package size={18} />
            <span>Mebellar Katalogi ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('custom_orders')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              backgroundColor: activeMainTab === 'custom_orders' ? 'var(--wood-amber)' : 'transparent',
              color: activeMainTab === 'custom_orders' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Sliders size={18} />
            <span>Maxsus Buyurtmalar ({orders.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MEBELLAR KATALOGI BOSHQARUVI (ASOSIY VAZIFA)       */}
        {/* ========================================================= */}
        {activeMainTab === 'furniture' && (
          <div>
            {/* Top Toolbar: Search, Category Filter, and Add Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 320px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    placeholder="Mebel nomi yoki material bo‘yicha izlash..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '180px' }}
                >
                  <option value="ALL">Barcha kategoriyalar</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="btn btn-primary"
                style={{ gap: '0.5rem', padding: '0.75rem 1.25rem', fontWeight: 700 }}
              >
                <Plus size={18} /> Yangi Mebel Qo‘shish
              </button>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: '#fcfbf9', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Rasm</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Mebel Nomi</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Kategoriya</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Narxi</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Ombor</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Rasmlar soni</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Holati</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Hech qanday mebel topilmadi. "Yangi Mebel Qo‘shish" tugmasini bosing.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const cat = categories.find((c) => c.id === p.category_id);
                      const thumb = p.images?.[0] || p.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                      const imgCount = (p.images && p.images.length) || (p.image_url ? 1 : 0);

                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <img
                              src={thumb}
                              alt={p.name}
                              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                            />
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{p.material || 'Material ko‘rsatilmagan'}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span style={{ backgroundColor: '#f5f2eb', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                              {cat?.name || 'Umumiy'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--wood-amber)' }}>
                              {Number(p.price).toLocaleString()} so‘m
                            </div>
                            {p.discount_price && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                {Number(p.discount_price).toLocaleString()} so‘m
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span style={{ fontWeight: 600, color: (p.stock || 0) > 0 ? 'var(--text-main)' : '#ef4444' }}>
                              {p.stock ?? 10} dona
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <ImageIcon size={14} /> {imgCount} ta
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: p.is_published !== false ? '#ecfdf5' : '#fee2e2',
                                color: p.is_published !== false ? '#047857' : '#b91c1c'
                              }}
                            >
                              {p.is_published !== false ? 'Faol' : 'Nofaol'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(p)}
                                className="btn btn-secondary btn-sm"
                                title="Tahrirlash"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444' }}
                                title="O‘chirish"
                              >
                                <Trash2 size={14} />
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

        {/* ========================================================= */}
        {/* TAB 2: MAXSUS BUYURTMALAR ISH JARAYONI & KALKULYATOR     */}
        {/* ========================================================= */}
        {activeMainTab === 'custom_orders' && (
          <div>
            {/* Status Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.75rem',
                marginBottom: '2rem'
              }}
            >
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStatusTab(tab.key)}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: selectedStatusTab === tab.key ? 'var(--wood-amber)' : '#ffffff',
                    color: selectedStatusTab === tab.key ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: selectedStatusTab === tab.key ? '0 2px 8px rgba(194, 109, 46, 0.3)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '4rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Ushbu bo‘limda buyurtmalar mavjud emas.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.75rem 2rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.5rem'
                    }}
                  >
                    <div style={{ flex: '1 1 340px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.15rem', color: 'var(--wood-amber)' }}>
                          {order.order_number}
                        </strong>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309' }}>
                          {order.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        {order.title || order.category || 'Maxsus Mebel Buyurtmasi'}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <span>👤 {order.customer_name || 'Mijoz'}</span>
                        <span>📞 {order.customer_phone}</span>
                        <span>📅 {new Date(order.created_at).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          openOrderInspection(order);
                          setStatusModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Holatni o‘zgartirish
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openOrderInspection(order);
                          setCalculatorOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        <DollarSign size={15} /> Narx Hisoblash
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: MEBEL QO'SHISH / TAHRIRLASH (RASM YUKLASH BILAN)  */}
      {/* ========================================================= */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '2.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {editingProduct ? 'Mebelni Tahrirlash' : 'Yangi Mebel Qo‘shish'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              {/* Asosiy ma'lumotlar */}
              <div className="form-group">
                <label className="form-label">Mebel Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Urgut Premium Oshxona Garnituri"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Kategoriya *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="form-select"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ombordagi Soni (dona)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Narxi (so‘m) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="12000000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chegirma Narxi (so‘m, ixtiyoriy)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10500000"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Materiali</label>
                  <input
                    type="text"
                    placeholder="Eman massivi, MDF, Akril"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">O‘lchamlari</label>
                  <input
                    type="text"
                    placeholder="240 x 180 x 85 sm"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Batafsil Tavsifi</label>
                <textarea
                  rows={3}
                  placeholder="Mebel haqida to‘liq ma‘lumot, xususiyatlari, furniturasi..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* =================================================== */}
              {/* RASMLAR BOSHQARUVI: FILE UPLOAD (SUPABASE) + URL LINK */}
              {/* =================================================== */}
              <div
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  backgroundColor: '#fbf9f5',
                  marginBottom: '1.5rem'
                }}
              >
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={18} color="var(--wood-amber)" /> Mebel Rasmlari (Fayldan yuklash yoki Link orqali)
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Fayllarni kompyuteringizdan yuklang (Supabase Storage ga saqlanadi) yoki tayyor internet havolasini kiriting. Bir nechta rasm qo‘shish mumkin.
                </p>

                {/* 1. Fayl yuklash (Kompyuterdan tanlash) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      border: '2px dashed var(--wood-amber)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      backgroundColor: '#ffffff',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Upload size={24} color="var(--wood-amber)" style={{ marginBottom: '0.4rem' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {isUploading ? 'Yuklanmoqda...' : 'Kompyuterdan rasm tanlash'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      PNG, JPG, WEBP (ko‘p rasm tanlash mumkin)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {/* 2. Link orqali qo'shish */}
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        <LinkIcon size={14} color="var(--wood-amber)" /> Tayyor Link (URL) orqali:
                      </div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.82rem', padding: '0.45rem' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '0.5rem', alignSelf: 'flex-end', fontSize: '0.78rem' }}
                    >
                      + Linkni Qo‘shish
                    </button>
                  </div>
                </div>

                {/* Qo'shilgan rasmlar ro'yxati (Preview gallery) */}
                {productForm.images.length > 0 ? (
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                      Yuklangan rasmlar ({productForm.images.length} ta):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                      {productForm.images.map((imgUrl, index) => (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: index === 0 ? '2px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${index}`}
                            style={{ width: '100%', height: '85px', objectFit: 'cover', display: 'block' }}
                          />
                          {index === 0 && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                backgroundColor: 'var(--wood-amber)',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px'
                              }}
                            >
                              Bosh rasm
                            </span>
                          )}

                          <div
                            style={{
                              padding: '0.3rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: '#ffffff',
                              borderTop: '1px solid var(--border-subtle)'
                            }}
                          >
                            {index !== 0 ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(index)}
                                title="Asosiy rasm qilish"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--wood-amber)', fontWeight: 600 }}
                              >
                                Bosh
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>✓ Bosh</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              title="O‘chirish"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                    Hozircha rasmlar yuklanmadi. Yuqoridagi tugmalar orqali rasm yuklang.
                  </div>
                )}
              </div>

              {/* Statuslar */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_published}
                    onChange={(e) => setProductForm({ ...productForm, is_published: e.target.checked })}
                  />
                  <span>Saytda ko‘rinsin (Faol)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_new}
                    onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })}
                  />
                  <span>Yangi mahsulot</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                  />
                  <span>Ommabop / Tavsiya etiladi</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {isUploading ? 'Rasm yuklanmoqda...' : editingProduct ? 'O‘zgarishlarni Saqlash' : 'Mebelni Katalogga Qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRICE CALCULATOR (CUSTOM ORDER)                    */}
      {/* ========================================================= */}
      {calculatorOpen && activeOrder && (
        <div className="modal-overlay" onClick={() => setCalculatorOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '580px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Narx Kalkulyatori: {activeOrder.order_number}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Mebel uchun barcha xarajatlarni hisoblang va yakuniy narxni mijozga yuboring.
            </p>

            <form onSubmit={handleSendPriceOffer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Material xarajati (so‘m)</label>
                  <input
                    type="number"
                    value={calculatorForm.material_cost}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, material_cost: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Usta mehnati (so‘m)</label>
                  <input
                    type="number"
                    value={calculatorForm.labor_cost}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, labor_cost: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Furnitura / Qo‘shimcha</label>
                  <input
                    type="number"
                    value={calculatorForm.additional_cost}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, additional_cost: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Yetkazib o‘rnatish</label>
                  <input
                    type="number"
                    value={calculatorForm.delivery_cost}
                    onChange={(e) => setCalculatorForm({ ...calculatorForm, delivery_cost: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Chegirma (so‘m)</label>
                <input
                  type="number"
                  value={calculatorForm.discount}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, discount: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#92400e' }}>Yakuniy Taklif Qilinadigan Narx:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                  {totalCost > 0 ? Number(totalCost).toLocaleString() : 0} so‘m
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setCalculatorOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Mijozga Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER STATUS CHANGE                                */}
      {/* ========================================================= */}
      {statusModalOpen && activeOrder && (
        <div className="modal-overlay" onClick={() => setStatusModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Buyurtma Holatini Yangilash
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {statusTabs.filter(t => t.key !== 'ALL').map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleStatusChange(t.key)}
                  className="btn btn-secondary"
                  style={{
                    justifyContent: 'space-between',
                    fontWeight: activeOrder.status === t.key ? 700 : 500,
                    borderColor: activeOrder.status === t.key ? 'var(--wood-amber)' : 'var(--border-subtle)'
                  }}
                >
                  <span>{t.label}</span>
                  {activeOrder.status === t.key && <Check size={16} color="var(--wood-amber)" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Yopish
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
