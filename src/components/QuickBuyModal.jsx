import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, ShieldCheck, Truck, Star, Phone, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../services/dataService';

export const QuickBuyModal = ({ product, isOpen, onClose }) => {
  const { t, getLocalized } = useLanguage();
  const { addToast } = useNotification();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  if (!isOpen || !product) return null;

  const currentPrice = product.discount_price || product.price;
  const totalPrice = currentPrice * quantity;
  const currency = t('catalog.price_currency', 'so‘m');
  const localizedTitle = getLocalized(product, 'name') || product.name;
  const primaryImg = product.images?.[0] || product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      addToast(t('quick_buy.fill_all', 'Iltimos, barcha majburiy maydonlarni to‘ldiring!'), 'warning');
      return;
    }

    setLoading(true);
    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: `ord-${Date.now()}`,
        order_number: orderNumber,
        customer_name: fullName,
        customer_phone: phone,
        shipping_address: address,
        payment_method: paymentMethod,
        total_amount: totalPrice,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        items: [
          {
            product_id: product.id,
            name: product.name,
            store_id: product.store_id || null,
            store_name: product.store_name || "Urgut Mebel Markazi",
            price: currentPrice,
            quantity: quantity,
            color: selectedColor || null,
            image: primaryImg
          }
        ]
      };

      await dataService.saveStandardOrder(newOrder);
      setCreatedOrderNumber(orderNumber);
      setOrderSuccess(true);
      addToast(t('quick_buy.order_success', 'Buyurtmangiz muvaffaqiyatli qabul qilindi! Menedjer tez orada bog‘lanadi.'), 'success');
    } catch (err) {
      console.error('Quick order error:', err);
      addToast(t('quick_buy.order_error', 'Buyurtma berishda xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setOrderSuccess(false);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '560px',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          type="button"
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {orderSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {t('quick_buy.thank_you', 'Buyurtmangiz Qabul Qilindi!')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {t('quick_buy.success_desc', 'Buyurtma raqamingiz')}: <strong style={{ color: 'var(--primary)' }}>{createdOrderNumber}</strong>.<br />
              {product.store_name ? `${product.store_name} menedjeri` : 'Menedjer'} tez orada siz bilan bog‘lanib yetkazib berish vaqtini kelishadi.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleModalClose}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                {t('quick_buy.got_it', 'Tushundim')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(250, 109, 88, 0.12)',
                  color: 'var(--primary)'
                }}
              >
                <ShoppingBag size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  {t('quick_buy.modal_title', 'Tezkor Xarid Qilish')}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  1 daqiqada rasmiylashtiring, to‘lovni qabul qilib olganda to‘lang
                </span>
              </div>
            </div>

            {/* Product Summary Card */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={primaryImg}
                alt={product.name}
                style={{
                  width: '85px',
                  height: '85px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                {product.store_name && (
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      marginBottom: '0.2rem'
                    }}
                  >
                    🏪 {product.store_name}
                  </span>
                )}
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    margin: '0 0 0.35rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {localizedTitle}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {Number(currentPrice).toLocaleString()} {currency}
                  </span>
                  {product.discount_price && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                      {Number(product.price).toLocaleString()} {currency}
                    </span>
                  )}
                  {product.rating && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {product.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity and Color options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  {t('quick_buy.quantity', 'Soni')}:
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-card)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-main)'
                    }}
                  >
                    -
                  </button>
                  <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-main)'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    {t('quick_buy.color', 'Rangi')}:
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="form-select"
                    style={{ height: '40px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    {product.colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quick Order Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  {t('quick_buy.name', 'Ism va Familiyangiz')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rustamov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  {t('quick_buy.phone', 'Telefon Raqamingiz')} *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', padding: '0.65rem 0.85rem 0.65rem 2.4rem', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  {t('quick_buy.address', 'Yetkazib berish manzili')} *
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Shahar, tuman, ko‘cha va uy raqami"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.65rem 0.85rem 0.65rem 2.4rem', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                  {t('quick_buy.payment_method', 'To‘lov Usuli')}:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: paymentMethod === 'cash' ? 'rgba(250, 109, 88, 0.12)' : 'var(--bg-secondary)',
                      color: paymentMethod === 'cash' ? 'var(--primary)' : 'var(--text-muted)',
                      border: paymentMethod === 'cash' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    💵 Qabulda naqd
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('click')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: paymentMethod === 'click' ? 'rgba(250, 109, 88, 0.12)' : 'var(--bg-secondary)',
                      color: paymentMethod === 'click' ? 'var(--primary)' : 'var(--text-muted)',
                      border: paymentMethod === 'click' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    🔵 Click
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payme')}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: paymentMethod === 'payme' ? 'rgba(250, 109, 88, 0.12)' : 'var(--bg-secondary)',
                      color: paymentMethod === 'payme' ? 'var(--primary)' : 'var(--text-muted)',
                      border: paymentMethod === 'payme' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    🟢 Payme
                  </button>
                </div>
              </div>

              {/* Total & Submit */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('quick_buy.total_payable', 'Jami to‘lanadigan summa')}:
                  </span>
                  <strong style={{ fontSize: '1.35rem', color: 'var(--primary)', fontWeight: 800 }}>
                    {Number(totalPrice).toLocaleString()} {currency}
                  </strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: 600 }}>
                  <Truck size={15} /> {t('quick_buy.free_delivery', 'Bepul yetkazib berish')}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                {loading ? t('quick_buy.ordering', 'Rasmiylashtirilmoqda...') : t('quick_buy.confirm_button', 'Buyurtmani Tasdiqlash')}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
