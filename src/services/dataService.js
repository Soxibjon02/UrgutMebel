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
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data?.length) return data;
    }
    return getStored('categories', initialCategories);
  },

  async saveCategory(category) {
    const categories = getStored('categories', initialCategories);
    let updated;
    if (category.id) {
      updated = categories.map((c) => (c.id === category.id ? { ...c, ...category } : c));
    } else {
      const newCat = {
        ...category,
        id: `cat-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      updated = [newCat, ...categories];
    }
    setStored('categories', updated);
    if (isSupabaseConfigured) {
      await supabase.from('categories').upsert(category);
    }
    return updated;
  },

  async deleteCategory(id) {
    const categories = getStored('categories', initialCategories).filter((c) => c.id !== id);
    setStored('categories', categories);
    if (isSupabaseConfigured) {
      await supabase.from('categories').delete().eq('id', id);
    }
    return categories;
  },

  // Products
  async getProducts() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data?.length) return data;
    }
    return getStored('products', initialProducts);
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id || p.slug === id) || null;
  },

  async saveProduct(product) {
    const products = getStored('products', initialProducts);
    let updated;
    if (product.id) {
      updated = products.map((p) => (p.id === product.id ? { ...p, ...product } : p));
    } else {
      const newProd = {
        ...product,
        id: `prod-${Date.now()}`,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviews_count: 0,
        likes_count: 0,
        created_at: new Date().toISOString()
      };
      updated = [newProd, ...products];
    }
    setStored('products', updated);
    if (isSupabaseConfigured) {
      await supabase.from('products').upsert(product);
    }
    return updated;
  },

  async deleteProduct(id) {
    const products = getStored('products', initialProducts).filter((p) => p.id !== id);
    setStored('products', products);
    if (isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', id);
    }
    return products;
  },

  async toggleProductLike(productId, delta) {
    const products = getStored('products', initialProducts);
    const updated = products.map((p) =>
      p.id === productId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) + delta) } : p
    );
    setStored('products', updated);
    return updated.find((p) => p.id === productId);
  },

  // Craftsmen
  async getCraftsmen() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('craftsmen').select('*');
      if (!error && data?.length) return data;
    }
    return getStored('craftsmen', initialCraftsmen);
  },

  async getCraftsmanById(id) {
    const craftsmen = await this.getCraftsmen();
    return craftsmen.find((c) => c.id === id) || null;
  },

  async saveCraftsman(craftsman) {
    const craftsmen = getStored('craftsmen', initialCraftsmen);
    let updated;
    if (craftsman.id) {
      updated = craftsmen.map((c) => (c.id === craftsman.id ? { ...c, ...craftsman } : c));
    } else {
      const newCraft = {
        ...craftsman,
        id: `craft-${Date.now()}`,
        rating: 5.0,
        reviews_count: 0,
        services: craftsman.services || [],
        portfolio: craftsman.portfolio || [],
        created_at: new Date().toISOString()
      };
      updated = [newCraft, ...craftsmen];
    }
    setStored('craftsmen', updated);
    if (isSupabaseConfigured) {
      await supabase.from('craftsmen').upsert(craftsman);
    }
    return updated;
  },

  async deleteCraftsman(id) {
    const craftsmen = getStored('craftsmen', initialCraftsmen).filter((c) => c.id !== id);
    setStored('craftsmen', craftsmen);
    if (isSupabaseConfigured) {
      await supabase.from('craftsmen').delete().eq('id', id);
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
  }
};
