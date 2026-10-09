import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';
import { CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight } from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isGuest } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: '',
    delivery_method: 'Kuryer orqali yetkazib berish (bepul)',
    payment_method: 'Naqd to‘lov (qabul qilib olganda)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Savatingiz bo‘sh!', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Historical items snapshot preservation
      const itemsSnapshot = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image,
        selected_color: item.selected_color,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const newOrder = await dataService.createStandardOrder({
        ...formData,
        user_id: user?.id || null,
        items: itemsSnapshot,
        total_amount: totalAmount,
        status: 'processing'
      });

      clearCart();
      setCompletedOrder(newOrder);
      addToast(`Buyurtma qabul qilindi! Raqami: ${newOrder.order_number}`, 'success');
    } catch (err) {
      console.error("Checkout error:", err);
      addToast('Buyurtmani rasmiylashtirishda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ padding: '5rem 0', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)'
            }}
            className="glass-card"
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Xaridingiz Uchun Rahmat!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
              Buyurtmangiz muvaffaqiyatli qabul qilindi. Operatorlarimiz tez orada tasdiqlash uchun telefon qilishadi.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
                BUYURTMA RAQAMI:
              </div>
              <strong style={{ fontSize: '1.5rem', color: 'var(--wood-amber)' }}>
                {completedOrder.order_number}
              </strong>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.4rem', fontWeight: 600 }}>
                To‘lov summasi: {Number(completedOrder.total_amount).toLocaleString()} so‘m
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/account?tab=orders" className="btn btn-primary">
                Buyurtmalarim Bo‘limi
              </Link>
              <Link to="/" className="btn btn-secondary">
                Bosh Sahifaga Qaytish
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem' }}>
          Buyurtmani Rasmiylashtirish
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }} className="checkout-layout">
          
          {/* Form Fields */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="glass-card"
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Yetkazib Berish Ma'lumotlari
            </h2>

            <div className="form-group">
              <label className="form-label">Qabul Qiluvchining To‘liq Ismi *</label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Ismingiz va familiyangiz"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bog‘lanish Telefoni *</label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+998 90 123 45 67"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Yetkazib Berish Manzili *</label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Shahar, tuman, ko‘cha, uy va xonadon raqami"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Yetkazib Berish Usuli</label>
              <select
                name="delivery_method"
                value={formData.delivery_method}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Kuryer orqali yetkazib berish (bepul)">Kuryer orqali manzilingizgacha yetkazib berish (bepul)</option>
                <option value="Urgut Mebel Markazi omboridan o‘zi olib ketish">Urgut Mebel Markazi omboridan o‘zi olib ketish</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">To‘lov Usuli</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Naqd to‘lov (qabul qilib olganda)">Naqd to‘lov (qabul qilib olganda tekshirib to‘lash)</option>
                <option value="Click / Payme (onlayn)">Click / Payme (onlayn o‘tkazma)</option>
                <option value="Bank kartasi orqali (terminal)">Bank kartasi orqali (yetkazib berilganda terminalda)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Qo‘shimcha Izohlar</label>
              <textarea
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Kuryer uchun mo‘ljal, eshik kodi yoki qulay vaqt..."
                className="form-textarea"
              />
            </div>
          </div>

          {/* Right Summary */}
          <div
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Xarid Tarkibi ({cartItems.length} xil)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', gap: '0.5rem' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{item.name}</strong>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{item.selected_color} x {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{Number(item.price * item.quantity).toLocaleString()} so‘m</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>Jami:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                  {Number(totalAmount).toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem' }}
            >
              {loading ? 'Tasdiqlanmoqda...' : 'Buyurtmani Tasdiqlash'}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
