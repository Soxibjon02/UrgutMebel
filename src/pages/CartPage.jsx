import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { isGuest, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (isGuest) {
      openAuthModal('login', 'Buyurtmani rasmiylashtirish uchun hisobingizga kiring!');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '6rem 0', minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--wood-amber)'
            }}
          >
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Savatingiz Bo‘sh
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Siz hali hech qanday mebel tanlamadingiz. Bizning katalogimizda xonadoningiz uchun mos mahsulotlarni kashf eting!
          </p>
          <Link to="/furniture" className="btn btn-primary btn-lg">
            Mebellarni Ko‘rish <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Xarid Savati</h1>
          <button
            type="button"
            onClick={clearCart}
            style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}
          >
            Savatni tozalash
          </button>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }} className="cart-layout">
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cartItems.map((item, idx) => (
              <div
                key={`${item.product_id}-${item.selected_color}-${idx}`}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="cart-item-card glass-card"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <Link to={`/furniture/${item.product_id}`} style={{ color: 'inherit' }}>
                      {item.name}
                    </Link>
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Rang: <strong>{item.selected_color}</strong>
                  </div>

                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                    {Number(item.price).toLocaleString()} so‘m
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.selected_color, item.quantity - 1)}
                    style={{ width: '34px', height: '36px', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.selected_color, item.quantity + 1)}
                    style={{ width: '34px', height: '36px', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product_id, item.selected_color)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}
                  title="Olib tashlash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Buyurtma Xulosasi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Mahsulotlar summasi:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{Number(totalAmount).toLocaleString()} so‘m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Yetkazib berish:</span>
                <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>Bepul (Aksiya)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>O‘rnatish xizmati:</span>
                <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>Bepul</span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}
            >
              <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Jami to‘lov:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wood-amber)' }}>
                {Number(totalAmount).toLocaleString()} so‘m
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem' }}
            >
              <span>Rasmiylashtirish</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={15} color="var(--wood-amber)" />
                <span>Samarqand, Toshkent va butun respublika bo‘ylab</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} color="var(--wood-amber)" />
                <span>100% xavfsiz to‘lov va rasmiy shartnoma</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
