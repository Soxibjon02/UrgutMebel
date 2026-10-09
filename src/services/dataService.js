import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialCraftsmen,
  initialBanners,
  initialCustomOrders,
  initialOrders,
  initialComments
} from '../data/mockData';

// Helper to get from local storage or fallback to initial
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`urgut_mebel_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(`urgut_mebel_${key}`, JSON.stringify(value));
    // Trigger custom event so any component listening can react immediately
    window.dispatchEvent(new CustomEvent(`urgut_store_${key}_updated`, { detail: value }));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// ==========================================
// 1. SETTINGS (PLATFORM TITLE & SITE CONFIG)
// ==========================================
export const dataService = {
  // Settings
  async getSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (!error && data) return data;
    }
    return getStored('settings', initialSettings);
  },

  async updateSettings(newSettings) {
    const updated = {
      ...getStored('settings', initialSettings),
      ...newSettings,
      updated_at: new Date().toISOString()
    };
    setStored('settings', updated);

    if (isSupabaseConfigured) {
      await supabase.from('settings').upsert({ id: 1, ...updated });
    }
    return updated;
  },

  // Categories
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && Array.isArray(data)) {
          setStored('categories', data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getCategories error:', e);
      }
    }
    return getStored('categories', initialCategories);
  },

  async saveCategory(category) {
    const categories = getStored('categories', initialCategories);
    const newCat = category.id ? category : {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = category.id
      ? categories.map((c) => (c.id === category.id ? { ...c, ...category } : c))
      : [newCat, ...categories];

    setStored('categories', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').upsert(newCat);
      } catch (e) {
        console.warn('Supabase saveCategory error:', e);
      }
    }
    return updated;
  },

  async deleteCategory(id) {
    const categories = getStored('categories', initialCategories).filter((c) => c.id !== id);
    setStored('categories', categories);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteCategory error:', e);
      }
    }
    return categories;
  },

  // Products
  async getProducts() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && Array.isArray(data)) {
          setStored('products', data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getProducts error:', e);
      }
    }
    return getStored('products', initialProducts);
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id || p.slug === id) || null;
  },

  async saveProduct(product) {
    const products = getStored('products', initialProducts);
    const newProd = product.id ? product : {
      ...product,
      id: `prod-${Date.now()}`,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviews_count: 0,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    const updated = product.id
      ? products.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      : [newProd, ...products];

    setStored('products', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(newProd);
      } catch (e) {
        console.warn('Supabase saveProduct error:', e);
      }
    }
    return updated;
  },

  async deleteProduct(id) {
    const products = getStored('products', initialProducts).filter((p) => p.id !== id);
    setStored('products', products);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteProduct error:', e);
      }
    }
    return products;
  },

  async toggleProductLike(productId, delta = 1) {
    const products = getStored('products', initialProducts);
    const updated = products.map((p) =>
      p.id === productId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) + delta) } : p
    );
    setStored('products', updated);
    return updated.find((p) => p.id === productId);
  },

  // Craftsmen
  async getCraftsmen() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('craftsmen').select('*');
        if (!error && Array.isArray(data)) {
          setStored('craftsmen', data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getCraftsmen error:', e);
      }
    }
    return getStored('craftsmen', initialCraftsmen);
  },

  async getCraftsmanById(id) {
    const craftsmen = await this.getCraftsmen();
    return craftsmen.find((c) => c.id === id) || null;
  },

  async saveCraftsman(craftsman) {
    const craftsmen = getStored('craftsmen', initialCraftsmen);
    const newCraft = craftsman.id ? craftsman : {
      ...craftsman,
      id: `craft-${Date.now()}`,
      rating: 5.0,
      reviews_count: 0,
      services: craftsman.services || [],
      portfolio: craftsman.portfolio || [],
      created_at: new Date().toISOString()
    };
    const updated = craftsman.id
      ? craftsmen.map((c) => (c.id === craftsman.id ? { ...c, ...craftsman } : c))
      : [newCraft, ...craftsmen];

    setStored('craftsmen', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('craftsmen').upsert(newCraft);
      } catch (e) {
        console.warn('Supabase saveCraftsman error:', e);
      }
    }
    return updated;
  },

  async deleteCraftsman(id) {
    const craftsmen = getStored('craftsmen', initialCraftsmen).filter((c) => c.id !== id);
    setStored('craftsmen', craftsmen);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('craftsmen').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteCraftsman error:', e);
      }
    }
    return craftsmen;
  },

  // Custom Orders & Workflow
  async getCustomOrders() {
    return getStored('custom_orders', initialCustomOrders);
  },

  async getCustomOrderById(id) {
    const orders = await this.getCustomOrders();
    return orders.find((o) => o.id === id || o.order_number === id) || null;
  },

  async createCustomOrder(orderData) {
    const orders = getStored('custom_orders', initialCustomOrders);
    const orderNumber = `ORD-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderData,
      id: `cust-ord-${Date.now()}`,
      order_number: orderNumber,
      status: 'NEW',
      created_at: new Date().toISOString(),
      history: [
        {
          date: new Date().toISOString(),
          status: 'NEW',
          note: 'Mijoz tomonidan buyurtma yuborildi'
        }
      ]
    };
    const updated = [newOrder, ...orders];
    setStored('custom_orders', updated);

    if (isSupabaseConfigured) {
      await supabase.from('custom_orders').insert({
        order_number: orderNumber,
        ...orderData
      });
    }
    return newOrder;
  },

  async updateCustomOrderStatus(orderId, newStatus, note = '', changedBy = 'Manager') {
    const orders = getStored('custom_orders', initialCustomOrders);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = o.history || [];
        return {
          ...o,
          status: newStatus,
          history: [
            ...history,
            {
              date: new Date().toISOString(),
              status: newStatus,
              note: note || `Holat o‘zgartirildi: ${newStatus}`,
              changedBy
            }
          ]
        };
      }
      return o;
    });
    setStored('custom_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  async savePriceOffer(orderId, offerData) {
    const orders = getStored('custom_orders', initialCustomOrders);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = o.history || [];
        return {
          ...o,
          status: 'PRICE_SENT',
          price_offer: {
            id: `po-${Date.now()}`,
            ...offerData,
            customer_status: 'PENDING'
          },
          history: [
            ...history,
            {
              date: new Date().toISOString(),
              status: 'PRICE_SENT',
              note: `Menedjer narx hisoblab mijozga taklif yubordi: ${Number(offerData.total_price).toLocaleString()} so‘m`
            }
          ]
        };
      }
      return o;
    });
    setStored('custom_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  async respondPriceOffer(orderId, customerResponse) {
    // customerResponse: 'ACCEPTED' | 'REJECTED'
    const nextStatus = customerResponse === 'ACCEPTED' ? 'CUSTOMER_APPROVED' : 'REVIEWING';
    const orders = getStored('custom_orders', initialCustomOrders);
    const updated = orders.map((o) => {
      if (o.id === orderId && o.price_offer) {
        const history = o.history || [];
        return {
          ...o,
          status: nextStatus,
          price_offer: {
            ...o.price_offer,
            customer_status: customerResponse
          },
          history: [
            ...history,
            {
              date: new Date().toISOString(),
              status: nextStatus,
              note: customerResponse === 'ACCEPTED'
                ? 'Mijoz narx taklifini ma‘qulladi va buyurtma tasdiqlandi'
                : 'Mijoz narx taklifini rad etdi yoki qayta ko‘rib chiqishni so‘radi'
            }
          ]
        };
      }
      return o;
    });
    setStored('custom_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  async updateCustomOrderNotes(orderId, internalNotes) {
    const orders = getStored('custom_orders', initialCustomOrders);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, internal_notes: internalNotes } : o));
    setStored('custom_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  async assignManagerToOrder(orderId, managerId, managerName) {
    const orders = getStored('custom_orders', initialCustomOrders);
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            assigned_manager_id: managerId,
            assigned_manager_name: managerName,
            status: o.status === 'NEW' ? 'REVIEWING' : o.status
          }
        : o
    );
    setStored('custom_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  // Standard E-commerce Orders
  async getStandardOrders() {
    return getStored('standard_orders', initialOrders);
  },

  async createStandardOrder(orderData) {
    const orders = getStored('standard_orders', initialOrders);
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderData,
      id: `ord-std-${Date.now()}`,
      order_number: orderNumber,
      status: 'processing',
      created_at: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    setStored('standard_orders', updated);
    return newOrder;
  },

  async updateStandardOrderStatus(orderId, status) {
    const orders = getStored('standard_orders', initialOrders);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setStored('standard_orders', updated);
    return updated.find((o) => o.id === orderId);
  },

  // Comments and Reviews
  async getComments(productId) {
    const all = getStored('comments', initialComments);
    return productId ? all.filter((c) => c.product_id === productId) : all;
  },

  async addComment(comment) {
    const all = getStored('comments', initialComments);
    const newComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_approved: true,
      is_hidden: false,
      replies: []
    };
    const updated = [newComment, ...all];
    setStored('comments', updated);
    return newComment;
  },

  async replyToComment(commentId, reply) {
    const all = getStored('comments', initialComments);
    const updated = all.map((c) => {
      if (c.id === commentId) {
        const replies = c.replies || [];
        return {
          ...c,
          replies: [
            ...replies,
            {
              id: `rep-${Date.now()}`,
              ...reply,
              created_at: new Date().toISOString()
            }
          ]
        };
      }
      return c;
    });
    setStored('comments', updated);
    return updated;
  },

  async moderateComment(commentId, action) {
    // action: 'approve' | 'hide' | 'delete'
    const all = getStored('comments', initialComments);
    let updated;
    if (action === 'delete') {
      updated = all.filter((c) => c.id !== commentId);
    } else {
      updated = all.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            is_approved: action === 'approve' ? true : c.is_approved,
            is_hidden: action === 'hide' ? !c.is_hidden : c.is_hidden
          };
        }
        return c;
      });
    }
    setStored('comments', updated);
    return updated;
  },

  // Banners
  async getBanners() {
    return getStored('banners', initialBanners);
  },

  async saveBanner(banner) {
    const banners = getStored('banners', initialBanners);
    let updated;
    if (banner.id) {
      updated = banners.map((b) => (b.id === banner.id ? { ...b, ...banner } : b));
    } else {
      const newBan = {
        ...banner,
        id: `ban-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      updated = [...banners, newBan];
    }
    setStored('banners', updated);
    return updated;
  },

  async deleteBanner(id) {
    const banners = getStored('banners', initialBanners).filter((b) => b.id !== id);
    setStored('banners', banners);
    return banners;
  },

  // Managers (Super Admin tomonidan boshqariladi)
  async getManagers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('managers').select('*');
        if (!error && Array.isArray(data)) {
          setStored('managers', data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getManagers error:', e);
      }
    }
    const defaultManagers = [
      {
        id: "mgr-default-1",
        full_name: "Bahodir Menedjer (Usta-muhandis)",
        email: "manager@urgutmebel.uz",
        password: "manager12345",
        phone: "+998 91 234 56 78",
        role: "manager",
        department: "Katalog va Ishlab chiqarish",
        created_at: "2026-01-15T10:00:00.000Z"
      }
    ];
    return getStored('managers', defaultManagers);
  },

  async saveManager(managerData) {
    const managers = await this.getManagers();
    const newMgr = managerData.id ? managerData : {
      ...managerData,
      id: `mgr-${Date.now()}`,
      role: 'manager',
      created_at: new Date().toISOString()
    };
    const updated = managerData.id
      ? managers.map((m) => (m.id === managerData.id ? { ...m, ...managerData } : m))
      : [newMgr, ...managers];

    setStored('managers', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('managers').upsert(newMgr);
      } catch (e) {
        console.warn('Supabase saveManager error:', e);
      }
    }
    return updated;
  },

  async deleteManager(id) {
    const managers = await this.getManagers();
    const updated = managers.filter((m) => m.id !== id);
    setStored('managers', updated);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('managers').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteManager error:', e);
      }
    }
    return updated;
  },

  // ==========================================
  // CRAFTSMAN WORKS (USTANING ISHLARI / PORTFOLIO)
  // ==========================================
  async getCraftsmanWorks(craftsmanId) {
    const allWorks = getStored('craftsman_works', []);
    if (craftsmanId) {
      return allWorks.filter((w) => w.craftsman_id === craftsmanId);
    }
    return allWorks;
  },

  async saveCraftsmanWork(workData) {
    const allWorks = getStored('craftsman_works', []);
    let updated;
    if (workData.id) {
      updated = allWorks.map((w) => (w.id === workData.id ? { ...w, ...workData } : w));
    } else {
      const newWork = {
        ...workData,
        id: `work-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      updated = [newWork, ...allWorks];
    }
    setStored('craftsman_works', updated);
    return updated;
  },

  async deleteCraftsmanWork(id) {
    const allWorks = getStored('craftsman_works', []);
    const updated = allWorks.filter((w) => w.id !== id);
    setStored('craftsman_works', updated);
    return updated;
  },

  // ==========================================
  // CRAFTSMAN FINANCES (USTAXONA HISOB-KITOB DAFTARI)
  // ==========================================
  async getCraftsmanFinances(craftsmanId) {
    const allFinances = getStored('craftsman_finances', [
      {
        id: "fin-demo-1",
        craftsman_id: craftsmanId || "craft-1",
        project_name: "Yusupovlar xonadoni uchun Oshxona mebeli",
        customer_name: "Farrux Yusupov",
        total_amount: 14500000,
        advance_payment: 8000000,
        materials_cost: 6200000,
        labor_cost: 1500000,
        transport_cost: 400000,
        other_cost: 200000,
        status: "JARAYONDA",
        notes: "Akril eshiklar va Blum furnitura",
        created_at: "2026-03-20T10:00:00.000Z"
      },
      {
        id: "fin-demo-2",
        craftsman_id: craftsmanId || "craft-1",
        project_name: "Klassik Eman Yotoqxona Shkafi (4 eshikli)",
        customer_name: "Dilshod Akramov",
        total_amount: 9800000,
        advance_payment: 9800000,
        materials_cost: 4100000,
        labor_cost: 1200000,
        transport_cost: 300000,
        other_cost: 150000,
        status: "TUGATILGAN",
        notes: "Mijoz to‘liq hisob-kitob qildi, topshirildi",
        created_at: "2026-03-12T14:30:00.000Z"
      }
    ]);
    if (craftsmanId) {
      return allFinances.filter((f) => f.craftsman_id === craftsmanId);
    }
    return allFinances;
  },

  async saveCraftsmanFinance(record) {
    const all = getStored('craftsman_finances', []);
    let updated;
    if (record.id) {
      updated = all.map((f) => (f.id === record.id ? { ...f, ...record } : f));
    } else {
      const newRec = {
        ...record,
        id: `fin-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      updated = [newRec, ...all];
    }
    setStored('craftsman_finances', updated);
    return updated;
  },

  async deleteCraftsmanFinance(id) {
    const all = getStored('craftsman_finances', []);
    const updated = all.filter((f) => f.id !== id);
    setStored('craftsman_finances', updated);
    return updated;
  },

  // Algoritmik moliya hisoblagich
  calculateFinancialStats(records = []) {
    let totalRevenue = 0;
    let totalReceived = 0;
    let totalExpenses = 0;
    let totalMaterials = 0;
    let totalRemainingDebt = 0;

    records.forEach((r) => {
      const total = Number(r.total_amount) || 0;
      const advance = Number(r.advance_payment) || 0;
      const mat = Number(r.materials_cost) || 0;
      const labor = Number(r.labor_cost) || 0;
      const transport = Number(r.transport_cost) || 0;
      const other = Number(r.other_cost) || 0;

      const exp = mat + labor + transport + other;
      totalRevenue += total;
      totalReceived += advance;
      totalExpenses += exp;
      totalMaterials += mat;
      totalRemainingDebt += Math.max(0, total - advance);
    });

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalReceived,
      totalExpenses,
      totalMaterials,
      totalRemainingDebt,
      netProfit,
      profitMargin
    };
  },

  // ==========================================
  // HEALTH CHECK FOR SUPABASE TABLES
  // ==========================================
  async checkSupabaseHealth() {
    if (!isSupabaseConfigured || !supabase) {
      return { configured: false, connected: false, tablesFound: false, error: "Supabase kalitlari mavjud emas" };
    }
    try {
      const { data, error } = await supabase.from('craftsmen').select('id').limit(1);
      if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('not find the table'))) {
        return { configured: true, connected: true, tablesFound: false, error: "Jadvallar Supabase-da hali yaratilmagan (PGRST205: 'craftsmen' jadvali topilmadi)" };
      }
      return { configured: true, connected: true, tablesFound: true, error: null };
    } catch (e) {
      return { configured: true, connected: false, tablesFound: false, error: e.message };
    }
  },

  // ==========================================
  // SYNC ALL DATA TO LIVE SUPABASE
  // ==========================================
  async syncAllDataToSupabase() {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase kalitlari .env da ulanmagan" };
    }

    try {
      // 1. Settings sync
      const settings = await this.getSettings();
      await supabase.from('settings').upsert({ id: '1', ...settings });

      // 2. Categories sync
      const categories = await this.getCategories();
      if (categories && categories.length) {
        for (const cat of categories) {
          const payload = { ...cat };
          if (!payload.slug) payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase.from('categories').upsert(payload);
        }
      }

      // 3. Products sync
      const products = await this.getProducts();
      if (products && products.length) {
        for (const prod of products) {
          const payload = {
            id: prod.id,
            name: prod.name,
            slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            price: Number(prod.price) || 0,
            discount_price: prod.discount_price ? Number(prod.discount_price) : null,
            material: prod.material,
            dimensions: prod.dimensions,
            stock: prod.stock || 10,
            description: prod.description,
            is_published: prod.is_published !== false,
            images: prod.images || [],
            image_url: prod.images?.[0] || prod.image_url || ''
          };
          await supabase.from('products').upsert(payload);
        }
      }

      // 4. Craftsmen sync (Super admin o'chirish / qo'shishlari bilan birga!)
      const craftsmen = await this.getCraftsmen();
      if (craftsmen && craftsmen.length) {
        for (const craft of craftsmen) {
          await supabase.from('craftsmen').upsert(craft);
        }
      }

      // 5. Managers sync
      const managers = await this.getManagers();
      if (managers && managers.length) {
        for (const mgr of managers) {
          await supabase.from('managers').upsert(mgr);
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Supabase sync error:", err);
      return { success: false, error: err.message };
    }
  }
};
