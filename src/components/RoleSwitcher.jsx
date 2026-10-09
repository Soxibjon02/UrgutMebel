import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Briefcase, Eye } from 'lucide-react';

export const RoleSwitcher = () => {
  const { role, switchRole } = useAuth();

  return (
    <div className="role-floating-switch" title="Rolni almashtirish orqali tizimni sinab ko‘ring">
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', paddingLeft: '0.4rem', color: '#a8a29e', fontSize: '0.72rem' }}>
        <Eye size={13} /> Rol:
      </span>

      <button
        type="button"
        onClick={() => switchRole('guest')}
        className={`role-pill-btn ${role === 'guest' ? 'active' : ''}`}
        title="Mehmon rejimi (Faqat ko‘rish, cheklangan harakatlar)"
      >
        Mehmon
      </button>

      <button
        type="button"
        onClick={() => switchRole('customer')}
        className={`role-pill-btn ${role === 'customer' ? 'active' : ''}`}
        title="Mijoz (Buyurtmalar, layklar, sharhlar)"
      >
        <User size={12} style={{ marginRight: '2px', verticalAlign: 'middle' }} /> Mijoz
      </button>

      <button
        type="button"
        onClick={() => switchRole('manager')}
        className={`role-pill-btn ${role === 'manager' ? 'active' : ''}`}
        title="Menedjer (/manager paneli, narx hisoblagich, ishlab chiqarish)"
      >
        <Briefcase size={12} style={{ marginRight: '2px', verticalAlign: 'middle' }} /> Menedjer
      </button>

      <button
        type="button"
        onClick={() => switchRole('admin')}
        className={`role-pill-btn ${role === 'admin' ? 'active' : ''}`}
        title="Admin (/admin paneli, to‘liq boshqaruv, sayt nomini o‘zgartirish)"
      >
        <Shield size={12} style={{ marginRight: '2px', verticalAlign: 'middle' }} /> Admin
      </button>
    </div>
  );
};
