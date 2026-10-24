import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, ShieldAlert, User } from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isGuest, openAuthModal } = useAuth();
  const { addToast } = useNotification();
  const { t, language } = useLanguage();
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

    if (isGuest || !user) {
      openAuthModal('login', 'Buyurtmani rasmiylashtirish faqatgina oddiy mijozlar uchun! Tizimga kiring yoki ro‘yxatdan o‘ting.');
      return;
    }

    if (user.role !== 'customer') {
      const roleTitle = user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Menedjer' : 'Usta';
      addToast(`Buyurtma berish faqatgina oddiy mijozlar uchun ruxsat etilgan! Xodimlar (${roleTitle}) hisobidan buyurtma berish taqiqlangan.`, 'error');
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
        user_id: user.id,
        user_role: user.role,
        customer_name: formData.full_name || user.full_name || 'Mijoz',
        customer_phone: formData.phone || user.phone || '',
        customer_email: user.email || formData.email || '',
        items: itemsSnapshot,
        total_amount: totalAmount,
        status: 'PENDING'
      });

      clearCart();
      setCompletedOrder(newOrder);
      addToast(`Buyurtma qabul qilindi! Raqami: ${newOrder.order_number}`, 'success');
    } catch (err) {
      console.error("Checkout error:", err);
      addToast(err.message || 'Buyurtmani rasmiylashtirishda xatolik yuz berdi', 'error');
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
              {t('checkout.order_success', 'Xaridingiz Uchun Rahmat!')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
              {language === 'ru' ? 'Ваш заказ успешно принят. Наш оператор свяжется с вами в ближайшее время.' : language === 'en' ? 'Your order has been received. Our operator will call you shortly.' : 'Buyurtmangiz muvaffaqiyatli qabul qilindi. Operatorlarimiz tez orada tasdiqlash uchun telefon qilishadi.'}
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
                {t('checkout.order_number', 'BUYURTMA RAQAMI:')}
              </div>
              <strong style={{ fontSize: '1.5rem', color: 'var(--wood-amber)' }}>
                {completedOrder.order_number}
              </strong>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.4rem', fontWeight: 600 }}>
                {t('cart.total_amount', 'To‘lov summasi:')} {Number(completedOrder.total_amount).toLocaleString()} {t('catalog.price_currency', 'so‘m')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/account?tab=orders" className="btn btn-primary">
                {t('nav.my_orders', 'Buyurtmalarim Bo‘limi')}
              </Link>
              <Link to="/" className="btn btn-secondary">
                {t('nav.home', 'Bosh Sahifaga Qaytish')}
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
          {t('checkout.title', 'Buyurtmani Rasmiylashtirish')}
        </h1>

        {/* Warning banner for staff or guests */}
        {user && user.role !== 'customer' && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1.5px solid #f87171',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1.75rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldAlert size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.25rem' }}>
                {language === 'ru' ? 'Сотрудникам запрещено оформлять заказ!' : language === 'en' ? 'Employee checkout is prohibited!' : 'Xodimlar hisobidan buyurtma berish taqiqlangan!'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>
                {language === 'ru'
                  ? `Вы вошли как ${user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Менеджер' : 'Мастер'}. Пожалуйста, войдите как обычный клиент.`
                  : language === 'en'
                  ? `You are logged in as ${user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Manager' : 'Craftsman'}. Please sign in as a regular customer.`
                  : `Siz hozirda ${user.role === 'admin' ? 'Super Admin' : user.role === 'manager' ? 'Menedjer' : 'Usta'} hisobidasiz (${user.full_name || user.email}). Chalkashliklarning oldini olish uchun faqatgina oddiy mijoz buyurtma berishi mumkin.`}
              </p>
            </div>
          </div>
        )}

        {isGuest && (
          <div
            style={{
              backgroundColor: 'rgba(194, 109, 46, 0.08)',
              border: '1px solid rgba(194, 109, 46, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={20} color="var(--wood-amber)" />
              <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                {language === 'ru' ? 'Для оформления заказа войдите как клиент.' : language === 'en' ? 'Please log in as a customer to checkout.' : 'Buyurtmani rasmiylashtirish uchun oddiy mijoz sifatida tizimga kiring.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login', language === 'ru' ? 'Войдите в аккаунт клиента' : language === 'en' ? 'Sign in to customer account' : 'Buyurtma berish uchun mijoz hisobingizga kiring')}
              className="btn btn-secondary btn-sm"
            >
              {language === 'ru' ? 'Войти' : language === 'en' ? 'Sign In' : 'Mijoz hisobiga kirish'}
            </button>
          </div>
        )}

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
              {t('checkout.delivery_address', 'Yetkazib Berish Ma\'lumotlari')}
            </h2>

            <div className="form-group">
              <label className="form-label">{t('checkout.full_name', 'Qabul Qiluvchining To‘liq Ismi *')}</label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder={t('checkout.full_name', 'Ismingiz va familiyangiz')}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('checkout.phone', 'Bog‘lanish Telefoni *')}</label>
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
              <label className="form-label">{language === 'ru' ? 'Адрес доставки *' : language === 'en' ? 'Delivery Address *' : 'Yetkazib Berish Manzili *'}</label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={language === 'ru' ? 'Город, район, улица, дом и кв.' : language === 'en' ? 'City, street, house & apt number' : 'Shahar, tuman, ko‘cha, uy va xonadon raqami'}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'ru' ? 'Способ доставки' : language === 'en' ? 'Delivery Method' : 'Yetkazib Berish Usuli'}</label>
              <select
                name="delivery_method"
                value={formData.delivery_method}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Kuryer orqali yetkazib berish (bepul)">{language === 'ru' ? 'Курьерская доставка до двери (бесплатно)' : language === 'en' ? 'Free Courier Delivery' : 'Kuryer orqali manzilingizgacha yetkazib berish (bepul)'}</option>
                <option value="Urgut Mebel Markazi omboridan o‘zi olib ketish">{language === 'ru' ? 'Самовывоз со склада Urgut Mebel' : language === 'en' ? 'Self-pickup from Urgut Mebel Warehouse' : 'Urgut Mebel Markazi omboridan o‘zi olib ketish'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('checkout.payment_method', 'To‘lov Usuli')}</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Naqd to‘lov (qabul qilib olganda)">{t('checkout.pay_cash', 'Naqd to‘lov (qabul qilib olganda tekshirib to‘lash)')}</option>
                <option value="Click / Payme (onlayn)">{t('checkout.pay_click', 'Click / Payme (onlayn o‘tkazma)')}</option>
                <option value="Bank kartasi orqali (terminal)">{t('checkout.pay_bank', 'Bank kartasi orqali (yetkazib berilganda terminalda)')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('checkout.notes', 'Qo‘shimcha Izohlar')}</label>
              <textarea
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t('checkout.notes', 'Kuryer uchun mo‘ljal, eshik kodi yoki qulay vaqt...')}
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
              {t('cart.order_summary', 'Xarid Tarkibi')} ({cartItems.length} {language === 'ru' ? 'вид.' : language === 'en' ? 'items' : 'xil'})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', gap: '0.5rem' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{item.name}</strong>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{item.selected_color} x {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{Number(item.price * item.quantity).toLocaleString()} {t('catalog.price_currency', 'so‘m')}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{t('cart.total_amount', 'Jami:')}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                  {Number(totalAmount).toLocaleString()} {t('catalog.price_currency', 'so‘m')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (user && user.role !== 'customer')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                opacity: (user && user.role !== 'customer') ? 0.6 : 1,
                cursor: (user && user.role !== 'customer') ? 'not-allowed' : 'pointer'
              }}
            >
              {user && user.role !== 'customer'
                ? (language === 'ru' ? 'Сотрудникам заказ запрещен' : language === 'en' ? 'Checkout restricted for staff' : 'Xodimlar hisobidan buyurtma berilmaydi')
                : loading
                ? (language === 'ru' ? 'Подтверждение...' : language === 'en' ? 'Confirming...' : 'Tasdiqlanmoqda...')
                : t('checkout.submit_order', 'Buyurtmani Tasdiqlash')}
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
