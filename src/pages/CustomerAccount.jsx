import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
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
  Sparkles
} from 'lucide-react';

export const CustomerAccount = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isGuest, openAuthModal } = useAuth();
  const { favorites } = useWishlist();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'custom');
  const [customOrders, setCustomOrders] = useState([]);
  const [standardOrders, setStandardOrders] = useState([]);
  const [selectedOfferOrder, setSelectedOfferOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
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

  if (isGuest) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Hisobingizga Kiring
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Buyurtmalaringiz holatini kuzatish, narx takliflarini qabul qilish va sevimlilarni ko‘rish uchun tizimga kirishingiz lozim.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="btn btn-primary btn-lg"
          >
            Kirish / Ro‘yxatdan O‘tish
          </button>

          <AppInstallCard />
        </div>
      </div>
    );
  }

  // Handle Offer Response (Accept or Reject)
  const handleOfferResponse = async (orderId, response) => {
    try {
      await dataService.respondPriceOffer(orderId, response);
      if (response === 'ACCEPTED') {
        addToast('Narx taklifi ma‘qullandi! Buyurtmangiz ishlab chiqarishga yo‘naltirildi.', 'success');
      } else {
        addToast('Narx taklifi rad etildi. Menedjer siz bilan qayta bog‘lanadi.', 'info');
      }
      setSelectedOfferOrder(null);
      // reload
      const updated = await dataService.getCustomOrders();
      setCustomOrders(updated);
    } catch (e) {
      console.error(e);
      addToast('Amalni bajarishda xatolik yuz berdi', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="badge badge-wood">Yangi (NEW)</span>;
      case 'REVIEWING':
        return <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Ko‘rib chiqilmoqda</span>;
      case 'CALCULATING':
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Narx hisoblanmoqda</span>;
      case 'PRICE_SENT':
        return <span className="badge" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.4)', fontWeight: 800 }}>⚠️ Narx Taklifi Yuborildi</span>;
      case 'CUSTOMER_APPROVED':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Mijoz tasdiqladi</span>;
      case 'IN_PRODUCTION':
        return <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>Ishlab chiqarishda</span>;
      case 'READY':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Tayyor bo‘ldi</span>;
      case 'DELIVERING':
        return <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Yetkazilmoqda</span>;
      case 'COMPLETED':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Bajarildi (COMPLETED)</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Bekor qilindi</span>;
      default:
        return <span className="badge badge-wood">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        
        {/* Header Profile Summary */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 2.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
          className="glass-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gold-gradient)',
                color: '#fff',
                fontSize: '1.6rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(194, 109, 46, 0.3)'
              }}
            >
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                {user.full_name}
              </h1>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.phone || "Telefon kiritilmagan"}</span>
                <span>•</span>
                <span style={{ color: 'var(--wood-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <Link to="/custom-order" className="btn btn-primary">
            <Sliders size={16} />
            <span>Yangi Maxsus Buyurtma</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid var(--border-subtle)',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveTab('custom'); setSearchParams({ tab: 'custom' }); }}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'custom' ? 'var(--wood-amber)' : 'var(--text-muted)',
              borderBottom: activeTab === 'custom' ? '3px solid var(--wood-amber)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sliders size={17} />
            <span>Maxsus Buyurtmalarim ({customOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('orders'); setSearchParams({ tab: 'orders' }); }}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'orders' ? 'var(--wood-amber)' : 'var(--text-muted)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--wood-amber)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShoppingBag size={17} />
            <span>Do‘kon Buyurtmalari ({standardOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('wishlist'); setSearchParams({ tab: 'wishlist' }); }}
            style={{
              padding: '0.85rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'wishlist' ? 'var(--wood-amber)' : 'var(--text-muted)',
              borderBottom: activeTab === 'wishlist' ? '3px solid var(--wood-amber)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Heart size={17} />
            <span>Sevimlilar ({favorites.length})</span>
          </button>
        </div>

        {/* Tab 1: Custom Orders */}
        {activeTab === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {customOrders.length === 0 ? (
              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '4rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }} className="glass-card">
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sizda hali maxsus chizma yoki o‘lchamdagi buyurtmalar mavjud emas.</p>
                <Link to="/custom-order" className="btn btn-primary">Maxsus Buyurtma Berish</Link>
              </div>
            ) : (
              customOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="glass-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>BUYURTMA RAQAMI</div>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--wood-amber)' }}>{order.order_number}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {getStatusBadge(order.status)}
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Mebel Turi:</span>
                      <strong>{order.furniture_type}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>O‘lchamlari (UxKxB):</span>
                      <strong>{order.length || '-'} x {order.width || '-'} x {order.height || '-'} sm</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Material & Rangi:</span>
                      <strong>{order.material} ({order.color})</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Mas'ul Menedjer:</span>
                      <strong>{order.assigned_manager_name || "Biriktirilmoqda"}</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    <strong>Izoh:</strong> {order.description}
                  </p>

                  {/* PRICE OFFER BANNER IF RECEIVED */}
                  {order.price_offer && (
                    <div
                      style={{
                        backgroundColor: 'rgba(212, 163, 89, 0.12)',
                        border: '1.5px solid rgba(212, 163, 89, 0.35)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-amber)', fontWeight: 800, fontSize: '0.95rem' }}>
                          <DollarSign size={18} />
                          <span>Menedjer Narx Taklifini Yubordi!</span>
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--wood-amber)', marginTop: '0.2rem' }}>
                          {Number(order.price_offer.total_price).toLocaleString()} so‘m
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#78716c' }}>
                          Holati: <strong>{order.price_offer.customer_status === 'ACCEPTED' ? '✅ Qabul qilingan' : order.price_offer.customer_status === 'REJECTED' ? '❌ Rad etilgan' : '⏳ Javob kutilmoqda'}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOfferOrder(order)}
                        className="btn btn-primary btn-sm"
                      >
                        Taklifni Ko‘rish va Qaror Qilish
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Standard Orders */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {standardOrders.length === 0 ? (
              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '4rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }} className="glass-card">
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sizda hali standart xaridlar mavjud emas.</p>
                <Link to="/furniture" className="btn btn-primary">Katalogga O‘tish</Link>
              </div>
            ) : (
              standardOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="glass-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>BUYURTMA RAQAMI</div>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{ord.order_number}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="badge badge-stock">{ord.status}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    {ord.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.product_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80"}
                          alt={item.product_name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '0.92rem' }}>{item.product_name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{item.selected_color} x {item.quantity} dona</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {Number(item.total_price).toLocaleString()} so‘m
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Manzil: <strong>{ord.address}</strong>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                      Jami: {Number(ord.total_amount).toLocaleString()} so‘m
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {favorites.length === 0 ? (
              <div style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-xl)', padding: '4rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }} className="glass-card">
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sevimlilar ro‘yxatiga hech qanday mebel qo‘shilmagan.</p>
                <Link to="/furniture" className="btn btn-primary">Mebellarni Ko‘rish</Link>
              </div>
            ) : (
              <div className="grid-products">
                {favorites.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRICE OFFER REVIEW & APPROVAL MODAL */}
        {selectedOfferOrder && selectedOfferOrder.price_offer && (
          <div className="modal-overlay" onClick={() => setSelectedOfferOrder(null)}>
            <div
              className="modal-content"
              style={{ maxWidth: '560px', padding: '2rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Narx Kalkulyatsiyasi va Taklif
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Buyurtma: <strong>{selectedOfferOrder.order_number}</strong> ({selectedOfferOrder.furniture_type})
              </p>

              {/* Breakdown Table */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Material xarajatlari:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.material_cost || 0).toLocaleString()} so‘m</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Duradgorlar ish haqi (Labor):</span>
                  <strong>{Number(selectedOfferOrder.price_offer.labor_cost || 0).toLocaleString()} so‘m</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Qo‘shimcha fiting va mexanizmlar:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.additional_cost || 0).toLocaleString()} so‘m</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Yetkazib berish va o‘rnatish:</span>
                  <strong>{Number(selectedOfferOrder.price_offer.delivery_cost || 0).toLocaleString()} so‘m</strong>
                </div>
                {selectedOfferOrder.price_offer.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                    <span>Chegirma:</span>
                    <strong>-{Number(selectedOfferOrder.price_offer.discount).toLocaleString()} so‘m</strong>
                  </div>
                )}
                <div
                  style={{
                    borderTop: '1.5px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>Umumiy Yakuniy Narx:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                    {Number(selectedOfferOrder.price_offer.total_price).toLocaleString()} so‘m
                  </span>
                </div>
              </div>

              {selectedOfferOrder.price_offer.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <strong>Menedjer izohi:</strong> {selectedOfferOrder.price_offer.notes}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleOfferResponse(selectedOfferOrder.id, 'ACCEPTED')}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem' }}
                >
                  <CheckCircle2 size={18} />
                  <span>Narxni Qabul Qilish</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfferResponse(selectedOfferOrder.id, 'REJECTED')}
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem', color: '#ef4444' }}
                >
                  <XCircle size={18} />
                  <span>Rad Etish / Qayta Ko‘rish</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shaxsiy Profil Eng Pastidagi Ilovani O'rnatish Bloki */}
        <AppInstallCard />
      </div>
    </div>
  );
};
