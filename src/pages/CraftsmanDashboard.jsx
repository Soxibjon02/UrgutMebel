import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import { uploadProductImage, isSupabaseConfigured } from '../lib/supabase';
import ImageUploadField from '../components/ImageUploadField';
import { StatusBadge } from '../components/StatusBadge';
import { realtimeService } from '../services/realtimeService';
import { CUSTOM_ORDER_STATUS_OPTIONS } from '../utils/statusHelper';
import {
  Hammer,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Check,
  X,
  PieChart,
  User,
  Phone,
  Briefcase,
  Package,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const CraftsmanDashboard = () => {
  const { user, role, openAuthModal } = useAuth();
  const { addToast } = useNotification();

  // Active view tab: 'schedule' (Jadval & Bandlik) | 'works' (Portfolio ishlari) | 'finances' (Hisob-kitob daftari) | 'requests' (Buyurtmalar)
  const [activeTab, setActiveTab] = useState('schedule');

  // Schedule & Availability State
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    status: 'available', // 'available' | 'busy' | 'partial'
    working_hours: '08:30 - 18:30',
    days: 'Dushanba - Shanba',
    busy_notes: '',
    service_repair: true,
    service_moving: true,
    service_custom: true,
    service_restoration: true
  });

  // Works / Portfolio State
  const [works, setWorks] = useState([]);
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [workForm, setWorkForm] = useState({
    title: '',
    category: 'Mebel ta\'mirlash',
    customer_name: '',
    customer_phone: '',
    completion_date: '',
    description: '',
    price: '',
    images: []
  });
  const [workUrlInput, setWorkUrlInput] = useState('');
  const [isUploadingWorkImage, setIsUploadingWorkImage] = useState(false);

  // Finances / Accounting State
  const [finances, setFinances] = useState([]);
  const [financeModalOpen, setFinanceModalOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [financeFilter, setFinanceFilter] = useState('ALL');
  const [financeSearch, setFinanceSearch] = useState('');

  const [financeForm, setFinanceForm] = useState({
    project_name: '',
    customer_name: '',
    total_amount: '',
    advance_payment: '',
    materials_cost: '',
    labor_cost: '',
    transport_cost: '',
    other_cost: '',
    status: 'JARAYONDA', // 'JARAYONDA' | 'TUGATILGAN' | 'QARZDORLIK_BOR'
    notes: ''
  });

  const [craftsmanOrders, setCraftsmanOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const craftsmanId = user?.id || 'craft-1';

  const loadData = async () => {
    try {
      const [worksList, financesList, allCustomOrders, directRequests, craftProfile] = await Promise.all([
        dataService.getCraftsmanWorks(craftsmanId),
        dataService.getCraftsmanFinances(craftsmanId),
        dataService.getCustomOrders(),
        dataService.getCraftsmanRequests(),
        dataService.getCraftsmanById(craftsmanId)
      ]);
      setWorks(worksList || []);
      setFinances(financesList || []);

      if (craftProfile && craftProfile.schedule) {
        setScheduleForm((prev) => ({
          ...prev,
          ...craftProfile.schedule
        }));
      }

      const myCustomOrders = (allCustomOrders || []).filter((o) =>
        o.assigned_craftsman === craftsmanId ||
        (o.assigned_craftsman_name && user?.full_name && o.assigned_craftsman_name.toLowerCase().includes(user.full_name.toLowerCase())) ||
        (o.title && user?.full_name && o.title.toLowerCase().includes(user.full_name.toLowerCase())) ||
        role === 'admin'
      );

      const myDirectRequests = (directRequests || []).filter((r) =>
        r.craftsman_id === craftsmanId ||
        (r.craftsman_name && user?.full_name && r.craftsman_name.toLowerCase().includes(user.full_name.toLowerCase())) ||
        role === 'admin'
      ).map((r) => ({
        ...r,
        order_number: r.request_number,
        title: `[Shaxsiy Murojaat] ${r.furniture_type || 'Mebel'}`,
        is_direct_request: true
      }));

      setCraftsmanOrders([...myDirectRequests, ...myCustomOrders]);
    } finally {
      setLoading(false);
    }
  };

  const handleCraftsmanUpdateStatus = async (orderId, newStatus) => {
    try {
      await dataService.updateCustomOrderStatus(
        orderId,
        newStatus,
        `Usta (${user?.full_name || 'Usta'}) tomonidan yangilandi`,
        user?.full_name || 'Usta'
      );
      addToast(`Buyurtma holati yangilandi: ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('urgut_store_custom_orders_updated', handleUpdate);
    window.addEventListener('urgut_store_craftsman_requests_updated', handleUpdate);
    window.addEventListener('urgut_realtime_event', handleUpdate);

    const unsubRealtime = realtimeService.subscribe(() => {
      loadData();
    });

    const interval = setInterval(loadData, 10000);
    return () => {
      window.removeEventListener('urgut_store_custom_orders_updated', handleUpdate);
      window.removeEventListener('urgut_store_craftsman_requests_updated', handleUpdate);
      window.removeEventListener('urgut_realtime_event', handleUpdate);
      unsubRealtime();
      clearInterval(interval);
    };
  }, [user]);

  // Auth Guard
  if (!user || (role !== 'craftsman' && role !== 'admin' && role !== 'manager')) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔨</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Usta Ruxsati Talab Qilinadi
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Ushbu panel mohir ustalar uchun mo‘ljallangan. Usta hisobingizga kiring yoki administratorga murojaat qiling.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
          >
            Usta Sifatida Kirish
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FINANCIAL CALCULATIONS & STATS ALGORITHM
  // ==========================================
  const stats = dataService.calculateFinancialStats(finances);

  // Filter finances
  const filteredFinances = finances.filter((item) => {
    const matchesStatus = financeFilter === 'ALL' || item.status === financeFilter;
    const matchesSearch = item.project_name?.toLowerCase().includes(financeSearch.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(financeSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ==========================================
  // WORK / PORTFOLIO HANDLERS
  // ==========================================
  const handleOpenAddWork = () => {
    setEditingWork(null);
    setWorkForm({
      title: '',
      category: 'Oshxona mebeli',
      customer_name: '',
      customer_phone: '',
      completion_date: new Date().toISOString().split('T')[0],
      description: '',
      price: '',
      images: []
    });
    setWorkUrlInput('');
    setWorkModalOpen(true);
  };

  const handleOpenEditWork = (work) => {
    setEditingWork(work);
    setWorkForm({
      title: work.title || '',
      category: work.category || 'Oshxona mebeli',
      customer_name: work.customer_name || '',
      customer_phone: work.customer_phone || '',
      completion_date: work.completion_date || '',
      description: work.description || '',
      price: work.price || '',
      images: work.images || (work.image_url ? [work.image_url] : [])
    });
    setWorkUrlInput('');
    setWorkModalOpen(true);
  };

  const handleUploadWorkImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingWorkImage(true);
    addToast('Rasm Supabase-ga yuklanmoqda...', 'info');

    try {
      const uploadPromises = Array.from(files).map((f) => uploadProductImage(f));
      const results = await Promise.all(uploadPromises);

      const newUrls = [];
      results.forEach((r) => {
        if (r.url) newUrls.push(r.url);
      });

      if (newUrls.length > 0) {
        setWorkForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newUrls]
        }));
        setWorkUrlInput(newUrls[newUrls.length - 1]);
        addToast(`${newUrls.length} ta rasm Supabase-ga yuklandi va URL havolasi o‘rnatildi!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Rasmni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setIsUploadingWorkImage(false);
      e.target.value = '';
    }
  };

  const handleAddWorkUrlImage = () => {
    const trimmed = workUrlInput.trim();
    if (!trimmed) return;
    setWorkForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed]
    }));
    setWorkUrlInput('');
    addToast('Rasm havolasi qo‘shildi!', 'success');
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setIsSavingSchedule(true);
    try {
      await dataService.updateCraftsmanSchedule(craftsmanId, scheduleForm);
      addToast('Ish vaqti va bandlik jadvali Supabase-ga muvaffaqiyatli saqlandi! Profilingizda yangilandi.', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      addToast('Jadvalni saqlashda xatolik yuz berdi', 'error');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleSaveWork = async (e) => {
    e.preventDefault();
    if (!workForm.title) {
      addToast('Ish sarlavhasini kiritish majburiy!', 'warning');
      return;
    }

    const primaryImg = workForm.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    const payload = {
      ...(editingWork || {}),
      craftsman_id: craftsmanId,
      craftsman_name: user.full_name,
      ...workForm,
      image_url: primaryImg
    };

    await dataService.saveCraftsmanWork(payload);
    await dataService.saveCraftsmanPortfolioItem(craftsmanId, {
      id: editingWork?.id || `port-${Date.now()}`,
      title: workForm.title,
      image: primaryImg,
      category: workForm.category || 'Mebel ta\'mirlash',
      description: workForm.description || ''
    });

    addToast(editingWork ? 'Ish muvaffaqiyatli tahrirlandi!' : 'Yangi portfolio ishi qo‘shildi va Supabase-ga saqlandi!', 'success');
    setWorkModalOpen(false);
    loadData();
  };

  const handleDeleteWork = async (id, title) => {
    if (window.confirm(`Rostdan ham "${title}" ishini o‘chirmoqchimisiz?`)) {
      await dataService.deleteCraftsmanWork(id);
      await dataService.deleteCraftsmanPortfolioItem(craftsmanId, id);
      addToast('Ish o‘chirildi', 'info');
      loadData();
    }
  };

  // ==========================================
  // FINANCE RECORD HANDLERS
  // ==========================================
  const handleOpenAddFinance = () => {
    setEditingFinance(null);
    setFinanceForm({
      project_name: '',
      customer_name: '',
      total_amount: '',
      advance_payment: '',
      materials_cost: '',
      labor_cost: '',
      transport_cost: '',
      other_cost: '',
      status: 'JARAYONDA',
      notes: ''
    });
    setFinanceModalOpen(true);
  };

  const handleOpenEditFinance = (fin) => {
    setEditingFinance(fin);
    setFinanceForm({
      project_name: fin.project_name || '',
      customer_name: fin.customer_name || '',
      total_amount: fin.total_amount || '',
      advance_payment: fin.advance_payment || '',
      materials_cost: fin.materials_cost || '',
      labor_cost: fin.labor_cost || '',
      transport_cost: fin.transport_cost || '',
      other_cost: fin.other_cost || '',
      status: fin.status || 'JARAYONDA',
      notes: fin.notes || ''
    });
    setFinanceModalOpen(true);
  };

  const handleSaveFinance = async (e) => {
    e.preventDefault();
    if (!financeForm.project_name || !financeForm.total_amount) {
      addToast('Loyiha nomi va umumiy summani kiritish majburiy!', 'warning');
      return;
    }

    const payload = {
      ...(editingFinance || {}),
      craftsman_id: craftsmanId,
      project_name: financeForm.project_name.trim(),
      customer_name: financeForm.customer_name.trim(),
      total_amount: Number(financeForm.total_amount) || 0,
      advance_payment: Number(financeForm.advance_payment) || 0,
      materials_cost: Number(financeForm.materials_cost) || 0,
      labor_cost: Number(financeForm.labor_cost) || 0,
      transport_cost: Number(financeForm.transport_cost) || 0,
      other_cost: Number(financeForm.other_cost) || 0,
      status: financeForm.status,
      notes: financeForm.notes
    };

    await dataService.saveCraftsmanFinance(payload);
    addToast(editingFinance ? 'Hisob-kitob yangilandi!' : 'Yangi moliyaviy yozuv saqlandi!', 'success');
    setFinanceModalOpen(false);
    loadData();
  };

  const handleDeleteFinance = async (id, name) => {
    if (window.confirm(`"${name}" loyihasining hisob-kitobini o‘chirmoqchimisiz?`)) {
      await dataService.deleteCraftsmanFinance(id);
      addToast('Hisob-kitob yozuvi o‘chirildi', 'info');
      loadData();
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: 'var(--bg-primary)', minHeight: '90vh' }}>
      <div className="container">

        {/* Header Profile Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(194, 109, 46, 0.35)'
              }}
            >
              <Hammer size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                  USTA-HUNARMAND
                </span>
                {isSupabaseConfigured && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#047857' }}>
                    ● Supabase Faol
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.full_name}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {user.email} {user.phone && `• 📞 ${user.phone}`}
              </p>
            </div>
          </div>

          {/* Switcher Tab Buttons */}
          <div className="no-scrollbar" style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', maxWidth: '100%', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              style={{
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                backgroundColor: activeTab === 'schedule' ? 'var(--wood-amber)' : 'transparent',
                color: activeTab === 'schedule' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <Clock size={17} />
              <span>Jadval & Bandlik</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('works')}
              style={{
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                backgroundColor: activeTab === 'works' ? 'var(--wood-amber)' : 'transparent',
                color: activeTab === 'works' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={17} />
              <span>Portfolio & Ishlarim ({works.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              style={{
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                backgroundColor: activeTab === 'requests' ? 'var(--wood-amber)' : 'transparent',
                color: activeTab === 'requests' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <Package size={17} />
              <span>Buyurtmalar ({craftsmanOrders.length})</span>
              {craftsmanOrders.length > 0 && (
                <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 800 }}>
                  {craftsmanOrders.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('finances')}
              style={{
                flex: '1 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                whiteSpace: 'nowrap',
                backgroundColor: activeTab === 'finances' ? 'var(--wood-amber)' : 'transparent',
                color: activeTab === 'finances' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <DollarSign size={17} />
              <span>Hisob-Kitob Daftari</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB: ISH VAQTI VA BANDLIK JADVALI (SCHEDULE & STATUS)     */}
        {/* ========================================================= */}
        {activeTab === 'schedule' && (
          <div className="glass-card" style={{ padding: '2rem 2.25rem', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock color="var(--wood-amber)" /> Ish Vaqti va Bandlik Jadvalingiz
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  Mijozlar sizning qachon bo‘sh bo‘lishingizni ko‘rib, jihozlarni ta‘mirlash yoki ko‘chirish uchun to‘g‘ri vaqtda murojaat qilishadi.
                </p>
              </div>
              <span style={{
                backgroundColor: scheduleForm.status === 'busy' ? '#fee2e2' : scheduleForm.status === 'partial' ? '#fef3c7' : '#dcfce7',
                color: scheduleForm.status === 'busy' ? '#dc2626' : scheduleForm.status === 'partial' ? '#d97706' : '#16a34a',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {scheduleForm.status === 'busy' ? '🔴 Ayni paytda band' : scheduleForm.status === 'partial' ? '🟡 Qisman band' : '🟢 Bo‘sh (Buyurtmaga tayyor)'}
              </span>
            </div>

            <form onSubmit={handleSaveSchedule}>
              {/* Status Radio options */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                  Hozirgi Ishchi Holatingiz:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: scheduleForm.status === 'available' ? '2px solid #16a34a' : '1px solid var(--border-subtle)',
                      backgroundColor: scheduleForm.status === 'available' ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="schedule_status"
                      value="available"
                      checked={scheduleForm.status === 'available'}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    />
                    <div>
                      <strong style={{ color: '#16a34a', fontSize: '0.92rem' }}>🟢 Bo‘sh (Qabul qilmoqda)</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Mijozlar hoziroq bog‘lana oladi</div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: scheduleForm.status === 'busy' ? '2px solid #dc2626' : '1px solid var(--border-subtle)',
                      backgroundColor: scheduleForm.status === 'busy' ? 'rgba(220, 38, 38, 0.08)' : 'var(--bg-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="schedule_status"
                      value="busy"
                      checked={scheduleForm.status === 'busy'}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    />
                    <div>
                      <strong style={{ color: '#dc2626', fontSize: '0.92rem' }}>🔴 Ayni paytda band</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Boshqa buyurtmada ishlamoqda</div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: scheduleForm.status === 'partial' ? '2px solid #d97706' : '1px solid var(--border-subtle)',
                      backgroundColor: scheduleForm.status === 'partial' ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="schedule_status"
                      value="partial"
                      checked={scheduleForm.status === 'partial'}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    />
                    <div>
                      <strong style={{ color: '#d97706', fontSize: '0.92rem' }}>🟡 Qisman band</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Faqat ma‘lum soatlarda bo‘sh</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Working Hours & Days */}
              <div className="dashboard-form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Kunlik Ish Soatlaringiz</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.working_hours}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, working_hours: e.target.value })}
                    placeholder="Masalan: 08:30 - 18:30"
                    className="form-input"
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Qaysi soatlar oralig‘ida murojaatlarni qabul qilasiz</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Haftalik Ish Kunlari</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.days}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, days: e.target.value })}
                    placeholder="Masalan: Dushanba - Shanba"
                    className="form-input"
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Dam olish kunlaringizni ham kiritishingiz mumkin</small>
                </div>
              </div>

              {/* Busy Times Note */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Bandlik Vaqtlari / Mijozlarga Bildirishnoma (Ixtiyoriy)</label>
                <textarea
                  rows={2}
                  value={scheduleForm.busy_notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, busy_notes: e.target.value })}
                  placeholder="Masalan: Bugun soat 14:00 - 16:30 gacha mebel ta‘mirlashda bandman. Soat 17:00 dan keyin bo‘shman, murojaat qilishingiz mumkin."
                  className="form-textarea"
                />
                <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Ushbu yozuv profilingizda barcha mijozlarga darhol ko‘rinadi</small>
              </div>

              {/* Service categories offered */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                  Siz Bajaradigan Asosiy Xizmatlar:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={scheduleForm.service_repair}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, service_repair: e.target.checked })}
                    />
                    <span>🛠️ Uy mebellari va jihozlarini ta‘mirlash</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={scheduleForm.service_moving}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, service_moving: e.target.checked })}
                    />
                    <span>🚚 Mebel ko‘chirish, demontaj va montaj</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={scheduleForm.service_custom}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, service_custom: e.target.checked })}
                    />
                    <span>🪚 Buyurtma asosida yangi mebel yasash</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={scheduleForm.service_restoration}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, service_restoration: e.target.checked })}
                    />
                    <span>✨ Mebel restavratsiyasi va loklash</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingSchedule}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Check size={18} />
                <span>{isSavingSchedule ? 'Saqlanmoqda...' : 'Jadvalni Saqlash va E’lon Qilish'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: HISOB-KITOB DAFTARI & MOLIYAVIY ALGORITM           */}
        {/* ========================================================= */}
        {activeTab === 'finances' && (
          <div>
            {/* KPI STATS CARDS (Avtomatik Algoritm natijalari) */}
            <div className="dashboard-grid-stats">
              
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Jami Kirim (Kelishilgan)</span>
                  <TrendingUp size={20} />
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.totalRevenue.toLocaleString()} so‘m
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Tushgan avans: <strong>{stats.totalReceived.toLocaleString()} so‘m</strong>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Jami Xarajatlar</span>
                  <TrendingDown size={20} />
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.totalExpenses.toLocaleString()} so‘m
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Material xarajati: {stats.totalMaterials.toLocaleString()} so‘m
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--wood-amber)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--wood-amber)', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Sof Foyda (Daromad)</span>
                  <PieChart size={20} />
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: stats.netProfit >= 0 ? '#10b981' : '#ef4444' }}>
                  {stats.netProfit >= 0 ? `+${stats.netProfit.toLocaleString()}` : stats.netProfit.toLocaleString()} so‘m
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Rentabellik: <strong>{stats.profitMargin}%</strong>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Kutilayotgan Qoldiq Qarz</span>
                  <Clock size={20} />
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {stats.totalRemainingDebt.toLocaleString()} so‘m
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Mijozlar to‘lashi kerak bo‘lgan qoldiq
                </div>
              </div>

            </div>

            {/* Toolbar: Search, Status Filter & Add Button */}
            <div
              className="dashboard-action-toolbar glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: '1 1 300px' }}>
                <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '160px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    placeholder="Loyiha yoki mijoz bo‘yicha izlash..."
                    value={financeSearch}
                    onChange={(e) => setFinanceSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={financeFilter}
                  onChange={(e) => setFinanceFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '150px', flex: '1 1 130px' }}
                >
                  <option value="ALL">Barcha holatlar</option>
                  <option value="JARAYONDA">Jarayonda</option>
                  <option value="QARZDORLIK_BOR">Qarzdorlik bor</option>
                  <option value="TUGATILGAN">Tugatilgan</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddFinance}
                className="btn btn-primary"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <Plus size={18} /> Yangi Loyiha Hisob-Kitobi
              </button>
            </div>

            {/* Finances Table */}
            <div className="table-responsive glass-card">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Loyiha Nomi</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Mijoz</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Kelishilgan Summa</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>To‘langan Avans</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Xarajatlar</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Sof Foyda</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Qoldiq Qarz</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Holati</th>
                    <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFinances.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Hisob-kitob daftari bo‘sh. Yuqoridagi tugma orqali birinchi mebel buyurtmangiz hisob-kitobini kiriting.
                      </td>
                    </tr>
                  ) : (
                    filteredFinances.map((item) => {
                      const totalExp = (Number(item.materials_cost) || 0) + (Number(item.labor_cost) || 0) + (Number(item.transport_cost) || 0) + (Number(item.other_cost) || 0);
                      const profit = (Number(item.total_amount) || 0) - totalExp;
                      const debt = Math.max(0, (Number(item.total_amount) || 0) - (Number(item.advance_payment) || 0));

                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                            <div>{item.project_name}</div>
                            {item.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{item.notes}</div>}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                            {item.customer_name || 'Noma‘lum'}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                            {Number(item.total_amount).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#10b981', fontWeight: 600 }}>
                            {Number(item.advance_payment || 0).toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#ef4444', fontWeight: 600 }}>
                            {totalExp.toLocaleString()} so‘m
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ fontWeight: 800, color: profit >= 0 ? '#10b981' : '#ef4444' }}>
                              {profit >= 0 ? `+${profit.toLocaleString()}` : profit.toLocaleString()} so‘m
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ fontWeight: 700, color: debt > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                              {debt > 0 ? `${debt.toLocaleString()} so‘m` : '0 (Yopilgan)'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: item.status === 'TUGATILGAN' ? 'rgba(16, 185, 129, 0.15)' : item.status === 'QARZDORLIK_BOR' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: item.status === 'TUGATILGAN' ? '#10b981' : item.status === 'QARZDORLIK_BOR' ? '#ef4444' : '#f59e0b',
                                border: `1px solid ${item.status === 'TUGATILGAN' ? 'rgba(16, 185, 129, 0.3)' : item.status === 'QARZDORLIK_BOR' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditFinance(item)}
                                className="btn btn-secondary btn-sm"
                                title="Tahrirlash"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFinance(item.id, item.project_name)}
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
        {/* TAB 2: MENING ISHLARIM / PORTFOLIO                       */}
        {/* ========================================================= */}
        {activeTab === 'works' && (
          <div>
            <div className="dashboard-action-toolbar">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mening Qilgan Ishlarim</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Yaratgan mebellaringiz fotosuratlarini yuklang va mijozlarga taqdim eting. Rasmlar Supabase-ga saqlanadi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddWork}
                className="btn btn-primary"
                style={{ gap: '0.5rem', fontWeight: 700 }}
              >
                <Plus size={18} /> Yangi Portfolio Ishi Qo‘shish
              </button>
            </div>

            {/* Works Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              {works.length === 0 ? (
                <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Hozircha ishlaringiz mavjud emas. "+ Yangi Portfolio Ishi Qo‘shish" tugmasini bosing.
                </div>
              ) : (
                works.map((w) => {
                  const thumb = w.images?.[0] || w.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div key={w.id} className="furniture-card">
                      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                        <img
                          src={thumb}
                          alt={w.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            fontWeight: 600
                          }}
                        >
                          {w.category || 'Mebel'}
                        </span>
                      </div>

                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{w.title}</h4>
                          {w.description && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                              {w.description}
                            </p>
                          )}
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {w.customer_name && <span>👤 Buyurtmachi: {w.customer_name}</span>}
                            {w.price && <span style={{ fontWeight: 700, color: 'var(--wood-amber)' }}>💵 Narxi: {Number(w.price).toLocaleString()} so‘m</span>}
                            {w.completion_date && <span>📅 Sana: {w.completion_date}</span>}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditWork(w)}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1 }}
                          >
                            <Edit2 size={14} /> Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWork(w.id, w.title)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444' }}
                            title="O‘chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KELIB TUSHGAN MIJOZ BUYURTMALARI                   */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Menga Kelib Tushgan Shaxsiy Buyurtmalar</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Mijozlar to‘g‘ridan-to‘g‘ri sizga yuborgan mebel yasash buyurtmalari</p>
              </div>
              <span className="badge badge-wood" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                Jami: {craftsmanOrders.length} ta
              </span>
            </div>

            {craftsmanOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }} className="glass-card">
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem' }}>Hozircha yangi shaxsiy buyurtmalar yo‘q</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mijoz sizning profilingizdan murojaat qilganda bu yerda darhol aks etadi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {craftsmanOrders.map((ord) => (
                  <div key={ord.id} style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--border-subtle)' }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <strong style={{ color: 'var(--wood-amber)', fontSize: '1.15rem' }}>{ord.order_number}</strong>
                          <StatusBadge status={ord.status || 'NEW'} format="bilingual" size="md" />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(ord.created_at).toLocaleString('uz-UZ')}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{ord.title || ord.category || 'Shaxsiy mebel buyurtmasi'}</h4>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{ord.customer_name || ord.full_name || 'Mijoz'}</div>
                        <a href={`tel:${ord.customer_phone || ord.phone}`} style={{ color: 'var(--wood-amber)', fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          📞 {ord.customer_phone || ord.phone}
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <div><strong>Kategoriya:</strong> {ord.category || 'Mebel'}</div>
                      <div><strong>O‘lchamlari:</strong> {ord.dimensions || 'Kelishiladi'}</div>
                      <div><strong>Kutilayotgan muddat:</strong> {ord.urgency || ord.production_deadline || 'Ixtiyoriy'}</div>
                    </div>

                    {(ord.notes || ord.description) && (
                      <div style={{ padding: '0.9rem 1.1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--wood-amber)', fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                        <strong>Mijoz talablari va tavsifi:</strong>
                        <p style={{ marginTop: '0.3rem', whiteSpace: 'pre-wrap' }}>{ord.notes || ord.description}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Holat / Status:</span>
                        <select
                          value={ord.status || 'NEW'}
                          onChange={(e) => handleCraftsmanUpdateStatus(ord.id, e.target.value)}
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
                      <a href={`tel:${ord.customer_phone || ord.phone}`} className="btn btn-primary btn-sm">
                        📞 Mijozga Qo‘ng‘iroq Qilish
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: YANGI PORTFOLIO ISHI QO'SHISH (RASM YUKLASH)     */}
      {/* ========================================================= */}
      {workModalOpen && (
        <div className="modal-overlay" onClick={() => setWorkModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '680px', padding: '2.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingWork ? 'Ishni Tahrirlash' : 'Yangi Portfolio Ishi Qo‘shish'}
              </h3>
              <button type="button" onClick={() => setWorkModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveWork}>
              <div className="form-group">
                <label className="form-label">Ish / Mebel Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Klassik O‘ymakor Oshxona Shkafi"
                  value={workForm.title}
                  onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Toifasi</label>
                  <input
                    type="text"
                    placeholder="Oshxona, Yotoqxona, Xontaxta..."
                    value={workForm.category}
                    onChange={(e) => setWorkForm({ ...workForm, category: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kelishilgan Narxi (so‘m)</label>
                  <input
                    type="number"
                    placeholder="12000000"
                    value={workForm.price}
                    onChange={(e) => setWorkForm({ ...workForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Buyurtmachi Ismi</label>
                  <input
                    type="text"
                    placeholder="Sherzodbek"
                    value={workForm.customer_name}
                    onChange={(e) => setWorkForm({ ...workForm, customer_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Topshirilgan Sana</label>
                  <input
                    type="date"
                    value={workForm.completion_date}
                    onChange={(e) => setWorkForm({ ...workForm, completion_date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tavsifi / Ishlatilgan Materiallar</label>
                <textarea
                  rows={3}
                  placeholder="Eman yog‘ochi, Italiya laklari, maxsus o‘ymakor naqshlar..."
                  value={workForm.description}
                  onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* Rasm yuklash (Supabase Storage + URL Link) */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                  Mebel Fotosuratlari (Supabase-ga yuklanadi)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <label
                    style={{
                      border: '2px dashed var(--wood-amber)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isUploadingWorkImage ? 'not-allowed' : 'pointer',
                      backgroundColor: 'var(--bg-card)',
                      textAlign: 'center'
                    }}
                  >
                    <Upload size={22} color="var(--wood-amber)" style={{ marginBottom: '0.3rem' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {isUploadingWorkImage ? 'Yuklanmoqda...' : 'Rasmlarni tanlash'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploadingWorkImage}
                      onChange={handleUploadWorkImages}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <input
                      type="url"
                      placeholder="yoki rasm havolasi (URL)..."
                      value={workUrlInput}
                      onChange={(e) => setWorkUrlInput(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddWorkUrlImage}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '0.4rem', alignSelf: 'flex-end' }}
                    >
                      + Linkni Qo‘shish
                    </button>
                  </div>
                </div>

                {/* Previews */}
                {workForm.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {workForm.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setWorkForm({ ...workForm, images: workForm.images.filter((_, i) => i !== idx) })}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setWorkModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Bekor qilish
                </button>
                <button type="submit" disabled={isUploadingWorkImage} className="btn btn-primary" style={{ flex: 2 }}>
                  {editingWork ? 'O‘zgarishlarni Saqlash' : 'Portfolioga Qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MOLIYAVIY HISOB-KITOB YOZUVINI QO'SHISH           */}
      {/* ========================================================= */}
      {financeModalOpen && (
        <div className="modal-overlay" onClick={() => setFinanceModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', padding: '2.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingFinance ? 'Hisob-Kitobni Tahrirlash' : 'Yangi Loyiha Hisob-Kitobi'}
              </h3>
              <button type="button" onClick={() => setFinanceModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFinance}>
              <div className="form-group">
                <label className="form-label">Loyiha / Mebel Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: G‘iyosovlar uyi Oshxona garnituri"
                  value={financeForm.project_name}
                  onChange={(e) => setFinanceForm({ ...financeForm, project_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Mijoz Ismi</label>
                  <input
                    type="text"
                    placeholder="Masalan: Akmal aka"
                    value={financeForm.customer_name}
                    onChange={(e) => setFinanceForm({ ...financeForm, customer_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Holati</label>
                  <select
                    value={financeForm.status}
                    onChange={(e) => setFinanceForm({ ...financeForm, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="JARAYONDA">Jarayonda</option>
                    <option value="QARZDORLIK_BOR">Qarzdorlik bor</option>
                    <option value="TUGATILGAN">Tugatilgan</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-form-row">
                <div className="form-group">
                  <label className="form-label">Umumiy Kelishilgan Summa (so‘m) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15000000"
                    value={financeForm.total_amount}
                    onChange={(e) => setFinanceForm({ ...financeForm, total_amount: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Olingan Avans (so‘m)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="8000000"
                    value={financeForm.advance_payment}
                    onChange={(e) => setFinanceForm({ ...financeForm, advance_payment: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Xarajatlar bo'limi */}
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem' }}>
                  Xarajatlar Tafsiloti (Sof foydani aniqlash uchun):
                </div>

                <div className="dashboard-form-row">
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Materiallar (Taxta, MDF, bo‘yoq)</label>
                    <input
                      type="number"
                      placeholder="6000000"
                      value={financeForm.materials_cost}
                      onChange={(e) => setFinanceForm({ ...financeForm, materials_cost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Shogird / Mehnat haqi</label>
                    <input
                      type="number"
                      placeholder="1500000"
                      value={financeForm.labor_cost}
                      onChange={(e) => setFinanceForm({ ...financeForm, labor_cost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="dashboard-form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Transport & Yetkazish</label>
                    <input
                      type="number"
                      placeholder="400000"
                      value={financeForm.transport_cost}
                      onChange={(e) => setFinanceForm({ ...financeForm, transport_cost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Boshqa xarajatlar</label>
                    <input
                      type="number"
                      placeholder="200000"
                      value={financeForm.other_cost}
                      onChange={(e) => setFinanceForm({ ...financeForm, other_cost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Qo‘shimcha Izoh</label>
                <textarea
                  rows={2}
                  placeholder="Furnitura modellari, o‘rnatish muddati..."
                  value={financeForm.notes}
                  onChange={(e) => setFinanceForm({ ...financeForm, notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setFinanceModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {editingFinance ? 'Saqlash' : 'Daftarga Kiritish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
