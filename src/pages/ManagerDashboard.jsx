import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import { uploadProductImage, isSupabaseConfigured } from '../lib/supabase';
import { ImageUploadField } from '../components/ImageUploadField';
import { StatusBadge } from '../components/StatusBadge';
import { realtimeService } from '../services/realtimeService';
import { CUSTOM_ORDER_STATUS_OPTIONS, STANDARD_ORDER_STATUS_OPTIONS } from '../utils/statusHelper';
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
  X,
  Hammer,
  Tag,
  Percent,
  Store,
  Shield,
  Inbox
} from 'lucide-react';

export const ManagerDashboard = () => {
  const { user, isManager, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();

  // Navigation tab for Manager: 'furniture' | 'custom_orders' | 'craftsmen' | 'discounts'
  const [activeMainTab, setActiveMainTab] = useState('furniture');

  // Stores & Requests state
  const [stores, setStores] = useState([]);
  const [discountRequests, setDiscountRequests] = useState([]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    product_id: '',
    store_id: '',
    proposed_discount_price: '',
    placement: 'discount_section',
    manager_phone: user?.phone || '+998 90 123 45 67',
    notes: ''
  });

  // Discount Management State (Menedjer ham chegirmalarni boshqaradi)
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscountProduct, setEditingDiscountProduct] = useState(null);
  const [discountVal, setDiscountVal] = useState('');
  const [discountType, setDiscountType] = useState('price'); // 'price' | 'percent'

  // Craftsmen State (Mebel menedjeri ham ustalarni qo'sha oladi)
  const [craftsmen, setCraftsmen] = useState([]);
  const [craftsmanModalOpen, setCraftsmanModalOpen] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState(null);

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
    store_id: '',
    store_name: '',
    store_phone: '',
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

  // Standard Store Orders state (Do'kon / Savat buyurtmalari)
  const [standardOrders, setStandardOrders] = useState([]);

  // Craftsman Direct Requests state (Ustaga to'g'ridan-to'g'ri buyurtmalar)
  const [craftsmanRequests, setCraftsmanRequests] = useState([]);

  // Contact Form Messages state (Bog'lanish xabarlari)
  const [contactMessages, setContactMessages] = useState([]);

  // Newsletter Subscribers state (Obunachilar)
  const [newsletterSubs, setNewsletterSubs] = useState([]);

  // Custom Orders state (Maxsus o'lchamli buyurtmalar)
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
      const [
        orderList,
        prodList,
        catList,
        craftList,
        stdOrders,
        craftReqs,
        contactMsgs,
        subs,
        storeList,
        dReqs
      ] = await Promise.all([
        dataService.getCustomOrders(),
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getCraftsmen(),
        dataService.getStandardOrders(),
        dataService.getCraftsmanRequests(),
        dataService.getContactMessages(),
        dataService.getNewsletterSubscribers(),
        dataService.getStores(),
        dataService.getDiscountRequests()
      ]);
      setOrders(orderList || []);
      setProducts(prodList || []);
      setCategories(catList || []);
      setCraftsmen(craftList || []);
      setStandardOrders(stdOrders || []);
      setCraftsmanRequests(craftReqs || []);
      setContactMessages(contactMsgs || []);
      setNewsletterSubs(subs || []);
      setStores(storeList || []);
      setDiscountRequests(dReqs || []);
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
    window.addEventListener('urgut_store_orders_updated', handleCustomOrdersUpdate);
    window.addEventListener('urgut_store_craftsman_requests_updated', handleCustomOrdersUpdate);
    window.addEventListener('urgut_store_contact_messages_updated', handleCustomOrdersUpdate);
    window.addEventListener('urgut_store_newsletter_subscribers_updated', handleCustomOrdersUpdate);
    window.addEventListener('urgut_store_discount_requests_updated', handleProductsUpdate);
    window.addEventListener('urgut_store_stores_updated', handleProductsUpdate);
    window.addEventListener('urgut_realtime_event', handleCustomOrdersUpdate);

    const unsubRealtime = realtimeService.subscribe(() => {
      loadData();
    });

    return () => {
      window.removeEventListener('urgut_store_custom_orders_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_products_updated', handleProductsUpdate);
      window.removeEventListener('urgut_store_orders_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_craftsman_requests_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_contact_messages_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_newsletter_subscribers_updated', handleCustomOrdersUpdate);
      window.removeEventListener('urgut_store_discount_requests_updated', handleProductsUpdate);
      window.removeEventListener('urgut_store_stores_updated', handleProductsUpdate);
      window.removeEventListener('urgut_realtime_event', handleCustomOrdersUpdate);
      unsubRealtime();
    };
  }, []);

  if (isGuest || !isManager) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <Shield size={54} style={{ color: 'var(--primary)', margin: '0 auto 1rem', display: 'block' }} />
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
      store_id: stores[0]?.id || 'store-1',
      store_name: stores[0]?.name || "Urgut Shahar Mebel Markazi",
      store_phone: stores[0]?.phone || '+998 90 123 45 67',
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
      store_id: prod.store_id || (stores[0]?.id || 'store-1'),
      store_name: prod.store_name || stores.find(s => s.id === prod.store_id)?.name || "Urgut Shahar Mebel Markazi",
      store_phone: prod.store_phone || stores.find(s => s.id === prod.store_id)?.phone || '+998 90 123 45 67',
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
        setUrlInput(newUrls[newUrls.length - 1]);
        addToast(
          isSupabaseConfigured
            ? `${newUrls.length} ta rasm Supabase Storage ga muvaffaqiyatli yuklandi va URL havolasi o‘rnatildi!`
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

    const name = productForm.name.trim();
    const slug = editingProduct?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const prodPayload = {
      ...(editingProduct || {}),
      name,
      slug,
      price: Number(productForm.price),
      discount_price: productForm.discount_price ? Number(productForm.discount_price) : null,
      category_id: productForm.category_id || categories[0]?.id || null,
      store_id: productForm.store_id || editingProduct?.store_id || (stores[0]?.id || 'store-1'),
      store_name: stores.find(s => s.id === (productForm.store_id || editingProduct?.store_id))?.name || editingProduct?.store_name || "Urgut Shahar Mebel Markazi",
      store_phone: stores.find(s => s.id === (productForm.store_id || editingProduct?.store_id))?.phone || editingProduct?.store_phone || '+998 90 123 45 67',
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
  // DISCOUNTS REQUEST TO SUPER ADMIN HANDLERS
  // ==========================================
  const handleOpenRequestModal = (product = null) => {
    setRequestForm({
      product_id: product?.id || products[0]?.id || '',
      store_id: product?.store_id || stores[0]?.id || '',
      proposed_discount_price: product?.discount_price || (product ? Math.round(product.price * 0.85) : ''),
      placement: 'discount_section',
      manager_phone: user?.phone || '+998 90 123 45 67',
      notes: ''
    });
    setRequestModalOpen(true);
  };

  const handleSendDiscountRequest = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === requestForm.product_id);
    if (!product) {
      addToast('Iltimos, mahsulotni tanlang', 'warning');
      return;
    }
    const propPrice = Number(requestForm.proposed_discount_price);
    if (!propPrice || propPrice >= product.price) {
      addToast("Taklif qilinayotgan chegirma narxi asl narxdan past bo'lishi lozim!", 'warning');
      return;
    }
    const matchedStore = stores.find(s => s.id === (requestForm.store_id || product.store_id));
    const req = {
      product_id: product.id,
      product_name: product.name,
      product_image: product.images?.[0] || '',
      current_price: product.price,
      proposed_discount_price: propPrice,
      store_id: matchedStore?.id || product.store_id || stores[0]?.id || 'store-1',
      store_name: matchedStore?.name || product.store_name || "Urgut Mebel Do'koni",
      manager_name: user?.name || "Do'kon Menejeri",
      manager_phone: requestForm.manager_phone || '+998 90 123 45 67',
      placement: requestForm.placement || 'discount_section',
      notes: requestForm.notes || '',
      status: 'PENDING'
    };
    addToast("Super Adminga so'rov yuborilmoqda...", 'info');
    await dataService.saveDiscountRequest(req);
    setRequestModalOpen(false);
    setRequestForm({
      product_id: '',
      store_id: '',
      proposed_discount_price: '',
      placement: 'discount_section',
      manager_phone: user?.phone || '+998 90 123 45 67',
      notes: ''
    });
    addToast("Super Adminga so'rov muvaffaqiyatli yo'llandi!", 'success');
    loadData();
  };

  const handleDeleteDiscountRequest = async (id) => {
    if (window.confirm("Ushbu so'rovni bekor qilmoqchimisiz?")) {
      await dataService.deleteDiscountRequest(id);
      addToast("So'rov o'chirildi", 'info');
      loadData();
    }
  };

  // ==========================================
  // CRAFTSMEN HANDLERS (MENEDJER QO'SHADI VA BOSHQARADI)
  // ==========================================
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

  const handleDeleteCraftsman = async (id, name) => {
    if (window.confirm(`Rostdan ham "${name}" ustasini o‘chirmoqchimisiz?`)) {
      addToast('Usta profili o‘chirildi', 'info');
      const updated = await dataService.deleteCraftsman(id);
      setCraftsmen(updated);
    }
  };

  // ==========================================
  // DISCOUNTS HANDLERS (MENEDJER CHEGIRMALAR BOSHQARUVI)
  // ==========================================
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

  // Standard Store Orders Handler
  const handleUpdateStandardOrderStatus = async (orderId, newStatus) => {
    try {
      await dataService.updateStandardOrderStatus(orderId, newStatus);
      addToast(`Do‘kon buyurtmasi holati: ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Craftsman Direct Request Handler
  const handleUpdateCraftsmanRequestStatus = async (reqId, newStatus) => {
    try {
      await dataService.updateCraftsmanRequestStatus(reqId, newStatus);
      addToast(`Usta buyurtmasi holati: ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Contact Message Status Handler
  const handleUpdateContactMessageStatus = async (msgId, newStatus) => {
    try {
      await dataService.updateContactMessageStatus(msgId, newStatus);
      addToast(`Murojaat holati: ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteContactMessage = async (msgId) => {
    if (window.confirm("Ushbu xabarni o‘chirmoqchimisiz?")) {
      try {
        await dataService.deleteContactMessage(msgId);
        addToast("Xabar o‘chirildi", 'info');
        loadData();
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  const statusTabs = [
    { key: 'ALL', label: 'Barchasi • All' },
    { key: 'NEW', label: 'Yangi • New' },
    { key: 'REVIEWING', label: 'Ko‘rib chiqilmoqda • Reviewing' },
    { key: 'PRICE_SENT', label: 'Narx yuborilgan • Price Sent' },
    { key: 'CUSTOMER_APPROVED', label: 'Mijoz tasdiqlagan • Approved' },
    { key: 'IN_PRODUCTION', label: 'Ishlab chiqarishda • In Production' },
    { key: 'READY', label: 'Tayyor • Ready' },
    { key: 'COMPLETED', label: 'Tugatilgan • Completed' }
  ];

  return (
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: 'var(--bg-primary)', minHeight: '88vh' }}>
      <div className="container">

        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Briefcase size={16} /> MENEDJER PANELI (FIGMA USLUBIDA)
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 800 }}>Mebel va Buyurtmalar Boshqaruvi</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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

        {/* Top Navigation Switch: SEPARATE TABS & TABLES FOR EACH FORM */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.35rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            overflowX: 'auto',
            gap: '0.35rem'
          }}
        >
          {/* 1. Standart Buyurtmalar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('standard_orders')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'standard_orders' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'standard_orders' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Truck size={16} />
            <span>Standart Do‘kon ({standardOrders.length})</span>
          </button>

          {/* 2. Maxsus Buyurtmalar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('custom_orders')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'custom_orders' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'custom_orders' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Sliders size={16} />
            <span>Maxsus O‘lchamli ({orders.length})</span>
          </button>

          {/* 3. Ustalarga Buyurtmalar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('craftsman_requests')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'craftsman_requests' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'craftsman_requests' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Hammer size={16} />
            <span>Ustalarga Buyurtmalar ({craftsmanRequests.length})</span>
          </button>

          {/* 4. Murojaatlar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('contact_messages')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'contact_messages' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'contact_messages' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={16} />
            <span>Murojaatlar ({contactMessages.length})</span>
          </button>

          {/* 5. Obunachilar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('newsletter')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'newsletter' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'newsletter' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Mail size={16} />
            <span>Obunachilar ({newsletterSubs.length})</span>
          </button>

          {/* 6. Mebellar Katalogi */}
          <button
            type="button"
            onClick={() => setActiveMainTab('furniture')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'furniture' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'furniture' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Package size={16} />
            <span>Mebellar ({products.length})</span>
          </button>

          {/* 7. Chegirmalar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('discounts')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'discounts' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'discounts' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Tag size={16} />
            <span>Chegirmalar ({products.filter(p => Boolean(p.discount_price)).length})</span>
          </button>

          {/* 8. Ustalar */}
          <button
            type="button"
            onClick={() => setActiveMainTab('craftsmen')}
            style={{
              flex: '1 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              backgroundColor: activeMainTab === 'craftsmen' ? 'var(--primary)' : 'transparent',
              color: activeMainTab === 'craftsmen' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Hammer size={16} />
            <span>Ustalar ({craftsmen.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MEBELLAR KATALOGI BOSHQARUVI (ASOSIY VAZIFA)       */}
        {/* ========================================================= */}
        {activeMainTab === 'furniture' && (
          <div>
            {/* Top Toolbar: Search, Category Filter, and Add Button */}
            <div
              className="dashboard-action-toolbar"
              style={{
                marginBottom: '1.5rem',
                backgroundColor: 'var(--bg-card)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: '1 1 300px' }}>
                <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
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
                  style={{ width: 'auto', minWidth: '160px', flex: '1 1 140px' }}
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
            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
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
                            <span style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
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
                    backgroundColor: selectedStatusTab === tab.key ? 'var(--wood-amber)' : 'var(--bg-card)',
                    color: selectedStatusTab === tab.key ? '#ffffff' : 'var(--text-main)',
                    border: selectedStatusTab === tab.key ? '1px solid var(--wood-amber)' : '1px solid var(--border-subtle)',
                    boxShadow: selectedStatusTab === tab.key ? '0 2px 8px rgba(194, 109, 46, 0.3)' : 'none',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '4rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }} className="glass-card">
                  <p style={{ color: 'var(--text-muted)' }}>Ushbu bo‘limda buyurtmalar mavjud emas.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      backdropFilter: 'blur(8px)',
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
                    className="glass-card"
                  >
                    <div style={{ flex: '1 1 340px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.15rem', color: 'var(--wood-amber)' }}>
                          {order.order_number}
                        </strong>
                        <StatusBadge status={order.status} format="bilingual" size="md" />
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

        {/* ========================================================= */}
        {/* TAB 3: USTALAR BOSHQARUVI (MENEDJER QO'SHADI VA BOSHQARADI) */}
        {/* ========================================================= */}
        {activeMainTab === 'craftsmen' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Urgut Ustalari Boshqaruvi</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Yangi ustalarni ro‘yxatdan o‘tkazing va login ma'lumotlarini bering. Usta o‘z panelida portfoliolarini va hisob-kitob daftarlarini yuritadi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCraftsman(null);
                  setCraftsmanModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <Plus size={18} /> Yangi Usta Qo‘shish
              </button>
            </div>

            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Surati</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Usta Ismi</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Login Email</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Parol</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Telefon</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Mutaxassislik</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Tajriba</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {craftsmen.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Hozircha ustalar mavjud emas. Yuqoridagi tugma orqali yangi usta qo‘shing.
                      </td>
                    </tr>
                  ) : (
                    craftsmen.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <img
                            src={c.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                            alt={c.name}
                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                          />
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>{c.email || `${c.name?.toLowerCase().replace(/\s+/g, '')}@urgutmebel.uz`}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{ fontFamily: 'monospace', backgroundColor: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {c.password || 'usta12345'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>{c.phone || '-'}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{ backgroundColor: 'rgba(194, 109, 46, 0.1)', color: 'var(--wood-amber)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {c.specializations?.join(', ') || 'Mebel ustasi'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>{c.experience_years || 5} yil</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCraftsman(c);
                                setCraftsmanModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Tahrirlash"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCraftsman(c.id, c.name)}
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

        {/* ========================================================= */}
        {/* TAB: CHEGIRMALAR VA SUPER ADMINGA SO'ROVLAR               */}
        {/* ========================================================= */}
        {activeMainTab === 'discounts' && (
          <div>
            {/* 1. SUPER ADMINGA SO'ROV YUBORISH SECTION */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-subtle)', marginBottom: '2rem', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(250, 109, 88, 0.12)', color: 'var(--figma-coral)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    <Send size={13} /> DO‘KON MENEJERI • SUPER ADMINGA MUROJAAT
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Chegirmalar & Joylashtirish So‘rovlari
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem', maxWidth: '650px' }}>
                    Mebelingizni chegirmalar bo‘limiga yoki bosh sahifadagi Top 10 Trend hamda saralangan kolleksiyalarga joylashtirish uchun Super Adminga rasmiy so‘rov yuboring.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRequestModal(null)}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem', fontWeight: 700 }}
                >
                  <Plus size={16} /> Super Adminga So‘rov Yuborish
                </button>
              </div>

              {/* Submitted Requests Table */}
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>Mebel nomi</th>
                      <th style={{ padding: '0.75rem' }}>Asl Narx</th>
                      <th style={{ padding: '0.75rem' }}>Taklif Qilingan Chegirma</th>
                      <th style={{ padding: '0.75rem' }}>So‘ralgan Joy</th>
                      <th style={{ padding: '0.75rem' }}>Izoh & Admin Javobi</th>
                      <th style={{ padding: '0.75rem' }}>Holat</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <FileText size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.35rem', display: 'block' }} />
                          <div style={{ fontWeight: 700 }}>Hozircha hech qanday so‘rov yuborilmagan</div>
                          <div style={{ fontSize: '0.8rem' }}>Yuqoridagi tugma orqali mahsulotingizni chegirma yoki trendga chiqarishni so‘rang</div>
                        </td>
                      </tr>
                    ) : (
                      discountRequests.map((req) => {
                        const isPending = req.status === 'PENDING';
                        const isApproved = req.status === 'APPROVED';
                        const isRejected = req.status === 'REJECTED';

                        const placementNames = {
                          discount_section: "Chegirmalar bo‘limi",
                          hero_collection: "Asosiy Sahifa Karuseli",
                          trending: "Top 10 Trend Mebellari"
                        };

                        return (
                          <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <img
                                  src={req.product_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                                <div style={{ fontWeight: 700 }}>{req.product_name}</div>
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              {Number(req.current_price).toLocaleString()} so‘m
                            </td>
                            <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                              {Number(req.proposed_discount_price).toLocaleString()} so‘m
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <span style={{ backgroundColor: 'rgba(250, 109, 88, 0.1)', color: 'var(--figma-coral)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.74rem' }}>
                                {placementNames[req.placement] || req.placement}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', maxWidth: '240px', fontSize: '0.8rem' }}>
                              {req.notes && <div style={{ color: 'var(--text-muted)' }}>{req.notes}</div>}
                              {req.admin_feedback && (
                                <div style={{ marginTop: '0.25rem', color: isApproved ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                  Admin: {req.admin_feedback}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              {isPending && (
                                <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#d97706', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={11} /> Kutilmoqda
                                </span>
                              )}
                              {isApproved && (
                                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <CheckCircle2 size={11} /> Tasdiqlangan
                                </span>
                              )}
                              {isRejected && (
                                <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <X size={11} /> Rad etilgan
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteDiscountRequest(req.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444' }}
                                title="So‘rovni o‘chirish"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. AMALDAGI CHEGIRMALAR JADVALI */}
            <div className="dashboard-action-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', backgroundColor: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Saytda Faol Chegirmalar</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Katalogda ayni paytda chegirma bilan sotilayotgan barcha mebellar ro‘yxati.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddDiscount(null)}
                className="btn btn-secondary"
                style={{ gap: '0.5rem' }}
              >
                <Plus size={16} /> Chegirmali Narx Belgilash
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
                        <Tag size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Hozirda chegirmadagi mebellar yo‘q</h4>
                        <p style={{ fontSize: '0.85rem' }}>Super Adminga so‘rov yuborish orqali aksiyalarni faollashtiring</p>
                      </td>
                    </tr>
                  ) : (
                    products
                      .filter((p) => Boolean(p.discount_price))
                      .map((p) => {
                        const originalPrice = Number(p.price) || 0;
                        const discPrice = Number(p.discount_price) || 0;
                        const savings = Math.max(0, originalPrice - discPrice);
                        const discountPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                                  alt=""
                                  style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                                <div>
                                  <div>{p.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id?.slice(0, 8)}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              {originalPrice.toLocaleString()} so‘m
                            </td>
                            <td style={{ padding: '0.85rem', fontWeight: 700, color: 'var(--wood-amber)', fontSize: '0.95rem' }}>
                              {discPrice.toLocaleString()} so‘m
                            </td>
                            <td style={{ padding: '0.85rem' }}>
                              <span style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.78rem' }}>
                                -{discountPercent}% ({savings.toLocaleString()} so‘m tejash)
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddDiscount(p)}
                                  className="btn btn-secondary btn-sm"
                                  title="Chegirmani tahrirlash"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDiscount(p)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: '#ef4444' }}
                                  title="Chegirmani olib tashlash"
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
        {/* TAB: STANDART DO'KON BUYURTMALARI (ORDERS JADVALI)        */}
        {/* ========================================================= */}
        {activeMainTab === 'standard_orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Standart Do‘kon Buyurtmalari
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Katalogdan savat orqali xarid qilingan tayyor mebellar ro‘yxati (Jami: {standardOrders.length} ta)
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Buyurtma #</th>
                    <th style={{ padding: '0.85rem' }}>Mijoz</th>
                    <th style={{ padding: '0.85rem' }}>Manzil</th>
                    <th style={{ padding: '0.85rem' }}>Mahsulotlar</th>
                    <th style={{ padding: '0.85rem' }}>Summa</th>
                    <th style={{ padding: '0.85rem' }}>Holati</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {standardOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Package size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hozircha standart do‘kon buyurtmalari yo‘q</h4>
                      </td>
                    </tr>
                  ) : (
                    standardOrders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {ord.order_number || ord.id?.slice(0, 8)}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{ord.customer_name}</div>
                          <a href={`tel:${ord.customer_phone}`} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                            {ord.customer_phone}
                          </a>
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                          {ord.shipping_address || 'Keltirilmagan'}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((it, idx) => (
                              <div key={idx} style={{ fontSize: '0.82rem' }}>
                                • {it.product_name || it.name} ({it.quantity || 1} dona)
                              </div>
                            ))
                          ) : (
                            <span style={{ color: 'var(--text-light)' }}>Mebel to‘plami</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {Number(ord.total_amount || 0).toLocaleString()} so‘m
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <StatusBadge status={ord.status || 'PENDING'} format="bilingual" size="sm" />
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <select
                            value={ord.status || 'PENDING'}
                            onChange={(e) => handleUpdateStandardOrderStatus(ord.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-card)',
                              fontSize: '0.8rem',
                              backgroundColor: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              cursor: 'pointer'
                            }}
                          >
                            {STANDARD_ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.bilingual}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: USTALARGA TO'G'RIDAN-TO'G'RI BUYURTMALAR              */}
        {/* ========================================================= */}
        {activeMainTab === 'craftsman_requests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Ustalarga To‘g‘ridan-to‘g‘ri Murojaatlar
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Mijozlar tomonidan ma'lum bir ustaga yuborilgan individual loyihalar (Jami: {craftsmanRequests.length} ta)
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Murojaat #</th>
                    <th style={{ padding: '0.85rem' }}>Biriktirilgan Usta</th>
                    <th style={{ padding: '0.85rem' }}>Mijoz</th>
                    <th style={{ padding: '0.85rem' }}>Mebel Turi & Tavsif</th>
                    <th style={{ padding: '0.85rem' }}>Taxminiy Byudjet</th>
                    <th style={{ padding: '0.85rem' }}>Holati</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {craftsmanRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Hammer size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hozircha ustalarga to‘g‘ridan-to‘g‘ri murojaatlar yo‘q</h4>
                      </td>
                    </tr>
                  ) : (
                    craftsmanRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {req.request_number || req.id?.slice(0, 8)}
                        </td>
                        <td style={{ padding: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {req.craftsman_name || req.craftsman_id}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{req.customer_name}</div>
                          <a href={`tel:${req.customer_phone}`} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                            {req.customer_phone}
                          </a>
                        </td>
                        <td style={{ padding: '0.85rem', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 600 }}>{req.furniture_type}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {req.description}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          {req.estimated_budget || 'Kelishiladi'}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor:
                                req.status === 'COMPLETED' ? '#ecfdf5' :
                                req.status === 'IN_PROGRESS' ? '#eff6ff' : '#fff7ed',
                              color:
                                req.status === 'COMPLETED' ? '#059669' :
                                req.status === 'IN_PROGRESS' ? '#2563eb' : '#c2410c'
                            }}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateCraftsmanRequestStatus(req.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-card)',
                              fontSize: '0.8rem',
                              backgroundColor: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="NEW">Yangi (NEW)</option>
                            <option value="IN_PROGRESS">Jarayonda</option>
                            <option value="COMPLETED">Tugatildi</option>
                            <option value="CANCELLED">Bekor qilindi</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: BOG'LANISH VA MUROJAATLAR (CONTACT FORMI)             */}
        {/* ========================================================= */}
        {activeMainTab === 'contact_messages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Saytdan Qoldirilgan Murojaatlar
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  "Bog‘lanish" sahifasi orqali yuborilgan savollar va takliflar (Jami: {contactMessages.length} ta)
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Yuboruvchi</th>
                    <th style={{ padding: '0.85rem' }}>Aloqa</th>
                    <th style={{ padding: '0.85rem' }}>Mavzu</th>
                    <th style={{ padding: '0.85rem' }}>Xabar Matni</th>
                    <th style={{ padding: '0.85rem' }}>Sana</th>
                    <th style={{ padding: '0.85rem' }}>Holati</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Inbox size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hozircha yangi xabarlar yo‘q</h4>
                      </td>
                    </tr>
                  ) : (
                    contactMessages.map((msg) => (
                      <tr key={msg.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {msg.full_name}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <div><a href={`tel:${msg.phone}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>{msg.phone}</a></div>
                          {msg.email && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.email}</div>}
                        </td>
                        <td style={{ padding: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {msg.subject || 'Murojaat'}
                        </td>
                        <td style={{ padding: '0.85rem', maxWidth: '300px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {msg.message}
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-light)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(msg.created_at).toLocaleDateString('uz-UZ')}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor:
                                msg.status === 'REPLIED' ? '#ecfdf5' :
                                msg.status === 'READ' ? '#eff6ff' : '#fee2e2',
                              color:
                                msg.status === 'REPLIED' ? '#059669' :
                                msg.status === 'READ' ? '#2563eb' : '#dc2626'
                            }}
                          >
                            {msg.status === 'NEW' ? 'Yangi' : msg.status === 'READ' ? 'O‘qildi' : 'Javob berildi'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateContactMessageStatus(msg.id, msg.status === 'REPLIED' ? 'NEW' : 'REPLIED')}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-card)',
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-main)',
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              {msg.status === 'REPLIED' ? 'Yangi qilish' : 'Javob berildi'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContactMessage(msg.id)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                              title="O‘chirish"
                            >
                              <Trash2 size={13} />
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

        {/* ========================================================= */}
        {/* TAB: NEWSLETTER / JOIN US OBUNACHILARI                     */}
        {/* ========================================================= */}
        {activeMainTab === 'newsletter' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Mijozlar Klubi va Newsletter Obunachilari
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Figma "Join Us" va Blog orqali a'zo bo‘lgan mijozlar bazasi (Jami: {newsletterSubs.length} ta)
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Email Manzili</th>
                    <th style={{ padding: '0.85rem' }}>Foydalanuvchi</th>
                    <th style={{ padding: '0.85rem' }}>Manba</th>
                    <th style={{ padding: '0.85rem' }}>Promo-kod</th>
                    <th style={{ padding: '0.85rem' }}>A'zo bo‘lgan sana</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Holati</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterSubs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Mail size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', display: 'block' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hozircha obunachilar ro‘yxatga olinmagan</h4>
                      </td>
                    </tr>
                  ) : (
                    newsletterSubs.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {sub.email}
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          {sub.full_name || 'Mijoz'}
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {sub.source || 'Figma Join Us'}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>
                            {sub.discount_code || 'URGUT10'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                          {new Date(sub.created_at).toLocaleDateString('uz-UZ')}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                            Faol
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

              <div className="form-group">
                <label className="form-label">Tegishli Mebel Do‘koni *</label>
                <select
                  value={productForm.store_id || ''}
                  onChange={(e) => {
                    const sel = stores.find((s) => s.id === e.target.value);
                    setProductForm({
                      ...productForm,
                      store_id: e.target.value,
                      store_name: sel?.name || '',
                      store_phone: sel?.phone || ''
                    });
                  }}
                  className="form-select"
                >
                  <option value="">Do‘konni tanlang</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.address})
                    </option>
                  ))}
                </select>
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

              <div className="dashboard-form-row">
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

              <div className="dashboard-form-row">
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
                  backgroundColor: 'var(--bg-secondary)',
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
                <div className="dashboard-form-row" style={{ marginBottom: '1.25rem' }}>
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
                      backgroundColor: 'var(--bg-card)',
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
                      backgroundColor: 'var(--bg-card)',
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
                            backgroundColor: 'var(--bg-card)',
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
                              backgroundColor: 'var(--bg-card)',
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

              <div style={{ padding: '1rem', backgroundColor: 'rgba(212, 163, 89, 0.12)', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Yakuniy Taklif Qilinadigan Narx:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: activeOrder.status === t.key ? 700 : 500,
                    borderColor: activeOrder.status === t.key ? 'var(--wood-amber)' : 'var(--border-subtle)',
                    padding: '0.65rem 1rem'
                  }}
                >
                  <StatusBadge status={t.key} format="bilingual" />
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

      {/* MODAL: USTA QO'SHISH / TAHRIRLASH (MENEDJER HAM QO'SHA OLADI) */}
      {craftsmanModalOpen && (
        <div className="modal-overlay" onClick={() => setCraftsmanModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '560px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingCraftsman ? 'Ustani Tahrirlash' : 'Yangi Usta Qo‘shish'}
            </h3>
            <form onSubmit={handleSaveCraftsman}>
              <div className="form-group">
                <label className="form-label">Usta To‘liq Ismi *</label>
                <input type="text" required name="name" defaultValue={editingCraftsman?.name || ''} placeholder="Masalan: Dilshod Usta" className="form-input" />
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
                  <label className="form-label">Telefon</label>
                  <input type="text" name="phone" defaultValue={editingCraftsman?.phone || '+998 90 123 45 67'} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tajribasi (yil)</label>
                  <input type="number" name="experience_years" defaultValue={editingCraftsman?.experience_years || 5} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Joylashuv</label>
                  <input type="text" name="location" defaultValue={editingCraftsman?.location || 'Urgut shahri'} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telegram</label>
                  <input type="text" name="telegram" defaultValue={editingCraftsman?.telegram || ''} placeholder="@dilshod_usta" className="form-input" />
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
                <input type="text" name="specializations" defaultValue={editingCraftsman?.specializations?.join(', ') || 'Klassik mebel, Oshxona, O‘ymakorlik'} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Biografiya / Ustaxona haqida</label>
                <textarea rows={2} name="bio" defaultValue={editingCraftsman?.bio || ''} className="form-textarea" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setCraftsmanModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CHEGIRMA QO'SHISH / TAHRIRLASH                     */}
      {/* ========================================================= */}
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
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{editingDiscountProduct.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Asl narxi: <strong style={{ color: 'var(--text-main)' }}>{Number(editingDiscountProduct.price).toLocaleString()} so‘m</strong>
                  </div>
                </div>
              )}

              {/* Discount type tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setDiscountType('price')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    backgroundColor: discountType === 'price' ? 'var(--wood-amber)' : 'var(--bg-secondary)',
                    color: discountType === 'price' ? '#fff' : 'var(--text-main)'
                  }}
                >
                  <DollarSign size={14} /> Aniq Chegirmali Narx (so‘m)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('percent')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    backgroundColor: discountType === 'percent' ? 'var(--wood-amber)' : 'var(--bg-secondary)',
                    color: discountType === 'percent' ? '#fff' : 'var(--text-main)'
                  }}
                >
                  <Percent size={14} /> Foizda (% chegirma)
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">
                  {discountType === 'price' ? 'Yangi Chegirmali Narx (so‘m) *' : 'Chegirma Foizi (1% - 99%) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={discountType === 'percent' ? 99 : (editingDiscountProduct ? editingDiscountProduct.price - 1 : undefined)}
                  value={discountVal}
                  onChange={(e) => setDiscountVal(e.target.value)}
                  placeholder={discountType === 'price' ? 'Masalan: 8500000' : 'Masalan: 15'}
                  className="form-input"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                />
                {editingDiscountProduct && discountVal && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--wood-amber)', marginTop: '0.4rem', fontWeight: 600 }}>
                    {discountType === 'price'
                      ? `Mijoz tejaydi: ${(editingDiscountProduct.price - Number(discountVal)).toLocaleString()} so‘m (${Math.round(((editingDiscountProduct.price - Number(discountVal)) / editingDiscountProduct.price) * 100)}%)`
                      : `Chegirmali narx: ${(Math.round(editingDiscountProduct.price * (1 - Number(discountVal) / 100))).toLocaleString()} so‘m`
                    }
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setDiscountModalOpen(false);
                    setEditingDiscountProduct(null);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!editingDiscountProduct || !discountVal}
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

      {/* ========================================================= */}
      {/* MODAL: SUPER ADMINGA CHEGIRMA VA JOYLASHTIRISH SO'ROVI    */}
      {/* ========================================================= */}
      {requestModalOpen && (
        <div className="modal-overlay" onClick={() => setRequestModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '580px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} color="var(--figma-coral)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Super Adminga Chegirma So‘rovi Yuborish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Do‘koningiz mebeliga chegirma berish yoki uni Bosh sahifadagi Top 10 Trend hamda saralangan kolleksiyalarga joylashtirish bo‘yicha Super Adminga murojaat qiling.
            </p>

            <form onSubmit={handleSendDiscountRequest}>
              <div className="form-group">
                <label className="form-label">Mebelni Tanlang *</label>
                <select
                  required
                  value={requestForm.product_id}
                  onChange={(e) => {
                    const selected = products.find((p) => p.id === e.target.value);
                    setRequestForm({
                      ...requestForm,
                      product_id: e.target.value,
                      proposed_discount_price: selected?.discount_price || (selected ? Math.round(selected.price * 0.85) : '')
                    });
                  }}
                  className="form-select"
                >
                  <option value="">Mebelni tanlang</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Asl narxi: {Number(p.price).toLocaleString()} so‘m
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qaysi Do‘kon Nomidan? *</label>
                <select
                  required
                  value={requestForm.store_id}
                  onChange={(e) => setRequestForm({ ...requestForm, store_id: e.target.value })}
                  className="form-select"
                >
                  <option value="">Do‘konni tanlang</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.address})
                    </option>
                  ))}
                </select>
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Taklif Qilinayotgan Chegirma Narxi (so‘m) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Masalan: 8500000"
                    value={requestForm.proposed_discount_price}
                    onChange={(e) => setRequestForm({ ...requestForm, proposed_discount_price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Qayerga Joylashtirishni So‘raysiz? *</label>
                  <select
                    value={requestForm.placement}
                    onChange={(e) => setRequestForm({ ...requestForm, placement: e.target.value })}
                    className="form-select"
                  >
                    <option value="discount_section">Chegirmalar bo‘limiga</option>
                    <option value="hero_collection">Bosh sahifa karuseliga (Autumn Collection)</option>
                    <option value="trending">Top 10 Trend Mebellari Reytingiga</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Menedjer Bog‘lanish Telefoni *</label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={requestForm.manager_phone}
                  onChange={(e) => setRequestForm({ ...requestForm, manager_phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Super Adminga Murojaat Xati / Izoh</label>
                <textarea
                  rows={3}
                  placeholder="Masalan: Ushbu modelimizga 15% chegirma berib, xaridorlar oqimini oshirish maqsadida Top 10 Trend mebellariga joylashtirishingizni so‘raymiz..."
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5, gap: '0.5rem', fontWeight: 750 }}
                >
                  <Send size={15} /> So‘rovni Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
