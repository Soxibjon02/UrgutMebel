import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const DEMO_USERS = {
  admin: {
    id: "user-adm-1",
    email: "admin@urgutmebel.uz",
    full_name: "Super Administrator",
    phone: "+998 90 123 45 67",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },
  manager: {
    id: "user-mgr-1",
    email: "manager@urgutmebel.uz",
    full_name: "Bahodir Menedjer (Usta-muhandis)",
    phone: "+998 91 234 56 78",
    role: "manager",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  customer: {
    id: "user-cust-1",
    email: "sherzod@gmail.com",
    full_name: "Sherzod Aliyev",
    phone: "+998 90 987 65 43",
    role: "customer",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  }
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useNotification();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('urgut_mebel_auth_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.customer; // default customer or guest
    } catch {
      return DEMO_USERS.customer;
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
  const isManager = user && (role === 'manager' || role === 'admin');
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        const loggedUser = profile || {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'customer'
        };
        setUser(loggedUser);
        closeAuthModal();
        addToast(`Xush kelibsiz, ${loggedUser.full_name}!`, 'success');
        return { success: true, user: loggedUser };
      } catch (err) {
        addToast(err.message, 'error');
        return { success: false, error: err.message };
      }
    }

    // Local / Demo Mock Login check
    let matched = null;
    if (email.toLowerCase().includes('admin')) matched = DEMO_USERS.admin;
    else if (email.toLowerCase().includes('manager')) matched = DEMO_USERS.manager;
    else matched = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      phone: "+998 90 000 00 00",
      role: 'customer'
    };

    setUser(matched);
    closeAuthModal();
    addToast(`Tizimga muvaffaqiyatli kirdingiz: ${matched.full_name} (${matched.role})`, 'success');
    return { success: true, user: matched };
  };

  const register = async ({ full_name, email, password, phone }) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name, phone } }
        });
        if (error) throw error;
        const newUser = {
          id: data.user.id,
          email,
          full_name,
          phone,
          role: 'customer'
        };
        setUser(newUser);
        closeAuthModal();
        addToast(`Tabriklaymiz, ro‘yxatdan o‘tdingiz!`, 'success');
        return { success: true, user: newUser };
      } catch (err) {
        addToast(err.message, 'error');
        return { success: false, error: err.message };
      }
    }

    const newUser = {
      id: `cust-${Date.now()}`,
      full_name,
      email,
      phone,
      role: 'customer'
    };
    setUser(newUser);
    closeAuthModal();
    addToast(`Xush kelibsiz, ${full_name}! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.`, 'success');
    return { success: true, user: newUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    addToast('Tizimdan muvaffaqiyatli chiqdingiz.', 'info');
  };

  const switchRole = (newRole) => {
    if (newRole === 'guest') {
      setUser(null);
      addToast('Mehmon (Guest) rejimiga o‘tildi. Harakatlar cheklangan.', 'info');
    } else if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole]);
      addToast(`Rol o‘zgartirildi: ${newRole.toUpperCase()} (${DEMO_USERS[newRole].full_name})`, 'success');
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
