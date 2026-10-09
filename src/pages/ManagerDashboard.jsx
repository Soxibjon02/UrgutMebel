import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
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
  MessageSquare
} from 'lucide-react';

export const ManagerDashboard = () => {
  const { user, isManager, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();

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

  const loadManagerOrders = async () => {
    try {
      const list = await dataService.getCustomOrders();
      setOrders(list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagerOrders();
    const handleUpdate = () => loadManagerOrders();
    window.addEventListener('urgut_store_custom_orders_updated', handleUpdate);
    return () => window.removeEventListener('urgut_store_custom_orders_updated', handleUpdate);
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
            Ushbu bo‘lim faqat mahsulot muhandislari va menedjerlar uchun mo‘ljallangan. Iltimos, menedjer hisobingizga kiring yoki rolni tanlang.
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

  // Filter orders by tabs
  const filteredOrders = orders.filter((o) => {
    if (selectedStatusTab === 'ALL') return true;
    return o.status === selectedStatusTab;
  });

  // Calculate totals
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

  const handleSaveNotes = async () => {
    if (!activeOrder) return;
    await dataService.updateCustomOrderNotes(activeOrder.id, internalNotes);
    addToast('Ichki eslatma saqlandi', 'success');
    loadManagerOrders();
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
    loadManagerOrders();
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeOrder) return;
    await dataService.updateCustomOrderStatus(
      activeOrder.id,
      newStatus,
      `Menedjer (${user.full_name}) tomonidan yangilandi`,
      user.full_name
    );
    addToast(`Holat muvaffaqiyatli yangilandi: ${newStatus}`, 'success');
    setStatusModalOpen(false);
    loadManagerOrders();
  };

  const statusTabs = [
    { key: 'ALL', label: 'Barcha buyurtmalar' },
    { key: 'NEW', label: 'Yangi (NEW)' },
    { key: 'REVIEWING', label: 'Ko‘rib chiqilmoqda' },
    { key: 'PRICE_SENT', label: 'Narx yuborilgan' },
    { key: 'CUSTOMER_APPROVED', label: 'Mijoz tasdiqlagan' },
    { key: 'IN_PRODUCTION', label: 'Ishlab chiqarishda' },
    { key: 'READY', label: 'Tayyor' },
    { key: 'COMPLETED', label: 'Tugatilgan' }
  ];

  return (
    <div style={{ padding: '2.5rem 0 6rem', backgroundColor: '#fcfbfa', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
              <Briefcase size={16} /> MENEDJER & USTAXONA BOSHQARUVI
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Buyurtmalar Ish Jarayoni</h1>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Menedjer: <strong>{user.full_name}</strong>
          </div>
        </div>

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

        {/* Orders Table / Cards List */}
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
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          order.status === 'NEW'
                            ? '#fef3c7'
                            : order.status === 'PRICE_SENT'
                            ? '#fef08a'
                            : order.status === 'CUSTOMER_APPROVED'
                            ? '#dcfce7'
                            : order.status === 'IN_PRODUCTION'
                            ? '#e0e7ff'
                            : '#f3f4f6',
                        color:
                          order.status === 'NEW'
                            ? '#b45309'
                            : order.status === 'PRICE_SENT'
                            ? '#854d0e'
                            : order.status === 'CUSTOMER_APPROVED'
                            ? '#15803d'
                            : '#374151'
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {order.furniture_type}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Mijoz: <strong>{order.full_name}</strong></span>
                    <span>Tel: <a href={`tel:${order.phone}`} style={{ color: 'var(--wood-amber)' }}>{order.phone}</a></span>
                    <span>O‘lcham: <strong>{order.length || '-'}x{order.width || '-'}x{order.height || '-'} sm</strong></span>
                  </div>
                </div>

                {/* Offer amount indicator if any */}
                {order.price_offer && (
                  <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>TAKLIFF QILINGAN NARX:</div>
                    <strong style={{ fontSize: '1.3rem', color: 'var(--wood-amber)' }}>
                      {Number(order.price_offer.total_price).toLocaleString()} so‘m
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: order.price_offer.customer_status === 'ACCEPTED' ? 'var(--status-success)' : '#78716c' }}>
                      {order.price_offer.customer_status === 'ACCEPTED' ? '✓ Mijoz qabul qildi' : 'Javob kutilmoqda'}
                    </div>
                  </div>
                )}

                {/* Inspection Button */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => openOrderInspection(order)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <Eye size={15} />
                    <span>Ko‘rish & Narxlash</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ORDER INSPECTION & PRICE OFFER CALCULATOR MODAL */}
        {activeOrder && (
          <div className="modal-overlay" onClick={() => setActiveOrder(null)}>
            <div
              className="modal-content"
              style={{ maxWidth: '820px', padding: '2.5rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--wood-amber)', fontWeight: 700 }}>
                    BUYURTMA TAFSILOTI
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {activeOrder.order_number} - {activeOrder.furniture_type}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    Holatni O‘zgartirish ({activeOrder.status})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveOrder(null)}
                    style={{ background: 'var(--bg-secondary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Customer & Technical Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem', backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Mijoz Ma'lumotlari</h4>
                  <div style={{ fontWeight: 700 }}>{activeOrder.full_name}</div>
                  <div style={{ fontSize: '0.88rem' }}>{activeOrder.phone}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{activeOrder.address}</div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>O‘lchamlar & Xona</h4>
                  <div>Xona: <strong>{activeOrder.room_type || "Noma'lum"}</strong></div>
                  <div>Uzunlik: <strong>{activeOrder.length || '-'} sm</strong></div>
                  <div>Kenglik / Balandlik: <strong>{activeOrder.width || '-'} x {activeOrder.height || '-'} sm</strong></div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Material & Ishlov</h4>
                  <div>Material: <strong>{activeOrder.material}</strong></div>
                  <div>Rangi: <strong>{activeOrder.color}</strong></div>
                  <div>Qoplama: <strong>{activeOrder.finish}</strong></div>
                </div>
              </div>

              {/* Description & Uploaded Files */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>Mijoz Talablari va Tavsifi:</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {activeOrder.description}
                </p>

                {/* Files Preview */}
                {activeOrder.files?.length > 0 && (
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      Yuklangan Fayllar va Chizmalar ({activeOrder.files.length}):
                    </h5>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {activeOrder.files.map((f, i) => (
                        <a
                          key={i}
                          href={f.file_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.75rem',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#ffffff',
                            fontSize: '0.82rem',
                            color: 'var(--wood-amber)'
                          }}
                        >
                          <FileText size={15} />
                          <span>{f.file_name || `Fayl ${i + 1}`}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>Ichki Menedjer Eslatmalari (Faqat ustaxona uchun):</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Masalan: Yog‘och korpusi tayyor, fitinglar olindi..."
                    className="form-input"
                  />
                  <button type="button" onClick={handleSaveNotes} className="btn btn-secondary btn-sm">
                    Saqlash
                  </button>
                </div>
              </div>

              {/* PRICE CALCULATOR SECTION */}
              <div
                style={{
                  border: '1.5px solid var(--wood-light)',
                  backgroundColor: '#fffdfa',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--wood-amber)', fontWeight: 800 }}>
                  <DollarSign size={20} />
                  <span>NARX KALKULYATSIYASI VA TAKLIF YARATISH</span>
                </div>

                <form onSubmit={handleSendPriceOffer}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Material xarajati (so‘m)</label>
                      <input
                        type="number"
                        required
                        value={calculatorForm.material_cost}
                        onChange={(e) => setCalculatorForm({ ...calculatorForm, material_cost: e.target.value })}
                        placeholder="12 000 000"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Ish haqi (Labor, so‘m)</label>
                      <input
                        type="number"
                        required
                        value={calculatorForm.labor_cost}
                        onChange={(e) => setCalculatorForm({ ...calculatorForm, labor_cost: e.target.value })}
                        placeholder="4 500 000"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Qo‘shimcha fitinglar</label>
                      <input
                        type="number"
                        value={calculatorForm.additional_cost}
                        onChange={(e) => setCalculatorForm({ ...calculatorForm, additional_cost: e.target.value })}
                        placeholder="1 000 000"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Yetkazib o‘rnatish</label>
                      <input
                        type="number"
                        value={calculatorForm.delivery_cost}
                        onChange={(e) => setCalculatorForm({ ...calculatorForm, delivery_cost: e.target.value })}
                        placeholder="800 000"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Chegirma (so‘m)</label>
                      <input
                        type="number"
                        value={calculatorForm.discount}
                        onChange={(e) => setCalculatorForm({ ...calculatorForm, discount: e.target.value })}
                        placeholder="500 000"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mijozga Izoh va Shartlar</label>
                    <input
                      type="text"
                      value={calculatorForm.notes}
                      onChange={(e) => setCalculatorForm({ ...calculatorForm, notes: e.target.value })}
                      placeholder="Masalan: Yetkazib berish va o‘rnatish ichida, 3 yil kafolat"
                      className="form-input"
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1rem',
                      marginTop: '1rem'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block' }}>HISOBLANGAN JAMI NARX:</span>
                      <strong style={{ fontSize: '1.6rem', color: 'var(--wood-amber)' }}>
                        {Number(totalCost).toLocaleString()} so‘m
                      </strong>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <Send size={16} />
                      <span>Mijozga Narx Taklifini Yuborish</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* STATUS CHANGE MODAL */}
        {statusModalOpen && activeOrder && (
          <div className="modal-overlay" onClick={() => setStatusModalOpen(false)}>
            <div
              className="modal-content"
              style={{ maxWidth: '440px', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
                Buyurtma Holatini O‘zgartirish
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Hozirgi holat: <strong>{activeOrder.status}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'NEW',
                  'REVIEWING',
                  'CALCULATING',
                  'PRICE_SENT',
                  'CUSTOMER_APPROVED',
                  'IN_PRODUCTION',
                  'READY',
                  'DELIVERING',
                  'COMPLETED',
                  'CANCELLED'
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      backgroundColor: activeOrder.status === st ? 'var(--bg-secondary)' : '#ffffff',
                      fontWeight: activeOrder.status === st ? 700 : 500
                    }}
                  >
                    <span>{st}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
