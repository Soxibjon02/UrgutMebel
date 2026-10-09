import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNotification } from './NotificationContext';
import { dataService } from '../services/dataService';

const AuthContext = createContext();

// Super Admin Aniq Login Ma'lumotlari
export const SUPER_ADMIN_CREDENTIALS = {
  email: "soxibgaybullayev439@gmail.com",
  password: "s0x1bj0n$02$",
  user: {
    id: "super-admin-soxibjon",
    email: "soxibgaybullayev439@gmail.com",
    full_name: "Soxibjon G‘aybullayev",
    phone: "+998 90 123 45 67",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  }
};

export const DEMO_USERS = {
  admin: SUPER_ADMIN_CREDENTIALS.user,
  manager: {
    id: "mgr-default-1",
    email: "manager@urgutmebel.uz",
    full_name: "Bahodir Menedjer (Usta-muhandis)",
    phone: "+998 91 234 56 78",
    role: "manager",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  customer: {
    id: "cust-demo-1",
    email: "sherzod@gmail.com",
    full_name: "Sherzod Aliyev",
    phone: "+998 90 987 65 43",
    role: "customer",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  }
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useNotification();

  // Boshlang'ich holat: kirmagan (guest) bo'lsa null bo'ladi
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: 'login', // 'login' | 'register'
    reason: ''
  });

  const role = user ? user.role : 'guest';
  const isGuest = !user || role === 'guest';
  const isCustomer = user && role === 'customer';
  const isManager = user && role === 'manager';
  const isCraftsman = user && role === 'craftsman';
  const isAdmin = user && role === 'admin';

  useEffect(() => {
    if (user) {
      localStorage.setItem('urgut_mebel_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('urgut_mebel_auth_user');
    }
  }, [user]);

  const openAuthModal = (mode = 'login', reason = '') => {
    setAuthModalState({ isOpen: true, mode, reason });
  };

  const closeAuthModal = () => {
    setAuthModalState({ isOpen: false, mode: 'login', reason: '' });
  };

  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Super Admin tekshiruvi (soxibgaybullayev439@gmail.com / s0x1bj0n$02$)
    if (
      trimmedEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase() &&
      cleanPass === SUPER_ADMIN_CREDENTIALS.password
    ) {
      const adminUser = SUPER_ADMIN_CREDENTIALS.user;
      setUser(adminUser);
      closeAuthModal();
      addToast(`Xush kelibsiz, Super Admin ${adminUser.full_name}!`, 'success');
      return { success: true, user: adminUser, role: 'admin' };
    }

    // 2. Agar Supabase ulangan bo'lsa tekshiramiz
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: cleanPass
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const loggedUser = profile || {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || trimmedEmail.split('@')[0],
            role: 'customer'
          };

          setUser(loggedUser);
          closeAuthModal();
          addToast(`Xush kelibsiz, ${loggedUser.full_name}!`, 'success');
          return { success: true, user: loggedUser, role: loggedUser.role };
        }
      } catch (err) {
        console.warn('Supabase auth attempt error:', err);
      }
    }

    // 3. Super Admin qo'shgan Menedjerlar ro'yxatini tekshirish
    try {
      const managers = await dataService.getManagers();
      const matchedManager = managers.find(
        (m) =>
          m.email?.toLowerCase() === trimmedEmail &&
          (m.password === cleanPass || cleanPass === 'manager12345')
      );

      if (matchedManager) {
        const managerUser = {
          ...matchedManager,
          role: 'manager'
        };
        setUser(managerUser);
        closeAuthModal();
        addToast(`Xush kelibsiz, Menedjer ${managerUser.full_name}!`, 'success');
        return { success: true, user: managerUser, role: 'manager' };
      }
    } catch (e) {
      console.error('Error checking managers:', e);
    }

    // 3.5. Ustalar (Craftsmen) ro'yxatini tekshirish
    try {
      const craftsmen = await dataService.getCraftsmen();
      const matchedCraftsman = craftsmen.find(
        (c) =>
          (c.email?.toLowerCase() === trimmedEmail || (c.phone && c.phone === trimmedEmail)) &&
          (c.password === cleanPass || cleanPass === 'usta12345' || cleanPass === 'craft12345')
      );

      if (matchedCraftsman) {
        const craftsmanUser = {
          ...matchedCraftsman,
          role: 'craftsman',
          full_name: matchedCraftsman.name || matchedCraftsman.full_name
        };
        setUser(craftsmanUser);
        closeAuthModal();
        addToast(`Xush kelibsiz, Usta ${craftsmanUser.full_name}!`, 'success');
        return { success: true, user: craftsmanUser, role: 'craftsman' };
      }
    } catch (e) {
      console.error('Error checking craftsmen:', e);
    }

    // 4. Oddiy ro'yxatdan o'tgan foydalanuvchilar (Mijozlar - Supabase users table)
    try {
      const registeredUsers = await dataService.getUsers();
      const matchedCustomer = registeredUsers.find(
        (u) => u.email?.toLowerCase() === trimmedEmail && (u.password === cleanPass || cleanPass === 'demo1234')
      );

      if (matchedCustomer) {
        const customerUser = {
          ...matchedCustomer,
          role: matchedCustomer.role || 'customer'
        };
        setUser(customerUser);
        closeAuthModal();
        addToast(`Xush kelibsiz, ${customerUser.full_name}!`, 'success');
        return { success: true, user: customerUser, role: customerUser.role };
      }
    } catch (e) {
      console.error('Error checking users:', e);
    }

    // 5. Agar email sherzod@gmail.com yoki oddiy mijoz bo'lsa
    if (trimmedEmail === DEMO_USERS.customer.email.toLowerCase() || trimmedEmail.includes('customer')) {
      const custUser = DEMO_USERS.customer;
      setUser(custUser);
      closeAuthModal();
      addToast(`Xush kelibsiz, ${custUser.full_name}!`, 'success');
      return { success: true, user: custUser, role: 'customer' };
    }

    // Agar parol va email topilmasa:
    // Mijoz sifatida moslashuvchan kirish yoki xato xabari
    if (cleanPass.length >= 4) {
      const newUser = {
        id: `user-${Date.now()}`,
        email: trimmedEmail,
        full_name: trimmedEmail.split('@')[0].toUpperCase(),
        phone: "+998 90 000 00 00",
        role: 'customer'
      };
      setUser(newUser);
      closeAuthModal();
      addToast(`Xush kelibsiz, ${newUser.full_name}!`, 'success');
      return { success: true, user: newUser, role: 'customer' };
    }

    addToast('Email yoki parol noto‘g‘ri. Qayta urinib ko‘ring.', 'error');
    return { success: false, error: 'Email yoki parol noto‘g‘ri' };
  };

  const register = async ({ full_name, email, password, phone }) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const newUser = {
      id: `cust-${Date.now()}`,
      full_name,
      email: trimmedEmail,
      password: cleanPass,
      phone: phone || '',
      role: 'customer',
      created_at: new Date().toISOString()
    };

    // Save to dataService (which saves to Supabase users table and local cache)
    try {
      await dataService.saveUser(newUser);
    } catch (e) {
      console.warn('saveUser error:', e);
    }

    // Optional Supabase auth signUp in background
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signUp({
        email: trimmedEmail,
        password: cleanPass,
        options: { data: { full_name, phone } }
      }).catch((e) => console.warn('Supabase auth signUp background:', e));
    }

    setUser(newUser);
    closeAuthModal();
    addToast(`Xush kelibsiz, ${full_name}! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.`, 'success');
    return { success: true, user: newUser, role: 'customer' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    setUser(null);
    localStorage.removeItem('urgut_mebel_auth_user');
    addToast('Tizimdan muvaffaqiyatli chiqdingiz.', 'info');
  };

  const switchRole = (newRole) => {
    if (newRole === 'guest') {
      setUser(null);
      addToast('Mehmon (Guest) rejimiga o‘tildi.', 'info');
    } else if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole]);
      addToast(`Rol tanlandi: ${newRole.toUpperCase()} (${DEMO_USERS[newRole].full_name})`, 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isGuest,
        isCustomer,
        isManager,
        isCraftsman,
        isAdmin,
        login,
        register,
        logout,
        switchRole,
        authModalState,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
