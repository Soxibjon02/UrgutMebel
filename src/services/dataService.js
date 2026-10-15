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
export const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`urgut_mebel_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStored = (key, value, broadcast = false) => {
  try {
    localStorage.setItem(`urgut_mebel_${key}`, JSON.stringify(value));
    // ONLY broadcast custom event on explicit mutations, NEVER on read/get caching!
    if (broadcast) {
      window.dispatchEvent(new CustomEvent(`urgut_store_${key}_updated`, { detail: value }));
    }
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Whitelist only columns existing in Supabase public.settings table
const sanitizeSettingsPayload = (settingsObj = {}) => {
  const VALID_SETTINGS_COLS = [
    'id', 'site_name', 'site_tagline', 'phone', 'email', 'address',
    'telegram', 'instagram', 'currency', 'hero_badge', 'hero_banner_image',
    'announcement', 'working_hours', 'footer_about', 'copyright_text',
    'feature1_title', 'feature1_desc', 'feature2_title', 'feature2_desc',
    'feature3_title', 'feature3_desc', 'updated_at'
  ];
  const payload = { id: '1', updated_at: new Date().toISOString() };
  for (const col of VALID_SETTINGS_COLS) {
    if (settingsObj[col] !== undefined) {
      payload[col] = settingsObj[col];
    }
  }
  return payload;
};

export const dataService = {
  // Settings
  async getSettings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (!error && data) {
          const current = getStored('settings', initialSettings);
          const merged = { ...current, ...data };
          setStored('settings', merged, false);
          return merged;
        }
        // If settings table is empty, seed it with current settings
        const current = getStored('settings', initialSettings);
        const payload = sanitizeSettingsPayload(current);
        await supabase.from('settings').upsert(payload);
        return current;
      } catch (e) {
        console.warn('Supabase getSettings error:', e);
      }
    }
    return getStored('settings', initialSettings);
  },

  async updateSettings(newSettings) {
    const updated = {
      ...getStored('settings', initialSettings),
      ...newSettings,
      updated_at: new Date().toISOString()
    };
    setStored('settings', updated, true);

    if (isSupabaseConfigured && supabase) {
      const payload = sanitizeSettingsPayload(updated);
      try {
        const { error } = await supabase.from('settings').upsert(payload);
        if (error) {
          console.error('Supabase updateSettings error:', error);
        }
      } catch (e) {
        console.error('Supabase updateSettings exception:', e);
      }
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
          setStored('categories', data, false);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getCategories error:', e);
      }
    }
    return getStored('categories', initialCategories);
  },

  async saveCategory(category) {
    const current = getStored('categories', initialCategories);
    const slug = category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
    const newCat = category.id ? { ...category, slug } : {
      ...category,
      id: `cat-${Date.now()}`,
      slug,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').upsert({
          id: newCat.id,
          name: newCat.name,
          slug: newCat.slug,
          description: newCat.description || '',
          image_url: newCat.image_url || '',
          display_order: Number(newCat.display_order) || 0,
          is_active: newCat.is_active !== false
        });
        if (error) console.error('Supabase saveCategory error:', error);
      } catch (e) {
        console.warn('Supabase saveCategory background error:', e);
      }
    }

    const updated = category.id
      ? current.map((c) => (c.id === category.id ? { ...c, ...newCat } : c))
      : [newCat, ...current];

    setStored('categories', updated, true);
    return updated;
  },

  async deleteCategory(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) console.error('Supabase deleteCategory error:', error);
      } catch (e) {
        console.warn('Supabase deleteCategory background error:', e);
      }
    }
    const current = getStored('categories', initialCategories);
    const categories = current.filter((c) => c.id !== id);
    setStored('categories', categories, true);
    return categories;
  },

  // Products
  async getProducts() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && Array.isArray(data)) {
          setStored('products', data, false);
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
    const current = getStored('products', initialProducts);
    const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `mebel-${Date.now()}`;
    const finalImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.image_url ? [product.image_url] : []);
    const primaryImg = product.image_url || finalImages[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

    const newProd = product.id ? {
      ...product,
      slug,
      images: finalImages.length > 0 ? finalImages : [primaryImg],
      image_url: primaryImg,
      updated_at: new Date().toISOString()
    } : {
      ...product,
      id: `prod-${Date.now()}`,
      slug,
      rating: 5.0,
      reviews_count: 0,
      likes_count: 0,
      images: finalImages.length > 0 ? finalImages : [primaryImg],
      image_url: primaryImg,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const prodPayload = {
          id: newProd.id,
          name: newProd.name,
          slug: newProd.slug,
          price: Number(newProd.price) || 0,
          discount_price: newProd.discount_price ? Number(newProd.discount_price) : null,
          stock: Number(newProd.stock) || 0,
          category_id: newProd.category_id || null,
          material: newProd.material || '',
          dimensions: newProd.dimensions || '',
          description: newProd.description || '',
          images: newProd.images,
          image_url: newProd.image_url,
          is_published: newProd.is_published !== false,
          is_featured: Boolean(newProd.is_featured),
          is_new: Boolean(newProd.is_new),
          is_popular: Boolean(newProd.is_popular),
          rating: Number(newProd.rating) || 5,
          reviews_count: Number(newProd.reviews_count) || 0,
          likes_count: Number(newProd.likes_count) || 0,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('products').upsert(prodPayload);
        if (error) {
          console.error('Supabase saveProduct error:', error);
        }
      } catch (e) {
        console.warn('Supabase saveProduct background error:', e);
      }
    }

    const updated = product.id
      ? current.map((p) => (p.id === product.id ? { ...p, ...newProd } : p))
      : [newProd, ...current];

    setStored('products', updated, true);
    return updated;
  },

  async deleteProduct(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Supabase deleteProduct error:', error);
      } catch (e) {
        console.warn('Supabase deleteProduct background error:', e);
      }
    }
    const current = getStored('products', initialProducts);
    const products = current.filter((p) => p.id !== id);
    setStored('products', products, true);
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
          const normalized = data.map((c) => {
            let services = Array.isArray(c.services) ? c.services : [];
            let portfolio = Array.isArray(c.portfolio) ? c.portfolio : [];
            const sched = services.find((s) => s.type === 'schedule') || null;
            return {
              ...c,
              services: services.filter((s) => s.type !== 'schedule'),
              schedule: sched || {
                status: 'available',
                working_hours: '08:30 - 18:30',
                days: 'Dushanba - Shanba',
                busy_notes: ''
              },
              portfolio
            };
          });
          setStored('craftsmen', normalized, false);
          return normalized;
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
    const current = getStored('craftsmen', initialCraftsmen);
    const newCraft = craftsman.id ? craftsman : {
      ...craftsman,
      id: `craft-${Date.now()}`,
      rating: 5.0,
      reviews_count: 0,
      created_at: new Date().toISOString()
    };

    const schedObj = newCraft.schedule || {
      type: 'schedule',
      status: newCraft.status || 'available',
      working_hours: newCraft.working_hours || '08:30 - 18:30',
      days: newCraft.days || 'Dushanba - Shanba',
      busy_notes: newCraft.busy_notes || ''
    };
    const realServices = (Array.isArray(newCraft.services) ? newCraft.services : []).filter((s) => s.type !== 'schedule');
    const combinedServices = [{ ...schedObj, type: 'schedule' }, ...realServices];

    if (isSupabaseConfigured && supabase) {
      try {
        const craftPayload = {
          id: newCraft.id,
          name: newCraft.name,
          email: newCraft.email,
          password: newCraft.password || 'usta12345',
          experience_years: Number(newCraft.experience_years) || 1,
          location: newCraft.location || 'Urgut tumani',
          phone: newCraft.phone || '',
          telegram: newCraft.telegram || '',
          bio: newCraft.bio || '',
          photo_url: newCraft.photo_url || '',
          specializations: Array.isArray(newCraft.specializations) ? newCraft.specializations : [],
          services: combinedServices,
          portfolio: Array.isArray(newCraft.portfolio) ? newCraft.portfolio : [],
          is_active: newCraft.is_active !== false,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('craftsmen').upsert(craftPayload);
        if (error) console.error('Supabase saveCraftsman error:', error);
      } catch (e) {
        console.warn('Supabase saveCraftsman background error:', e);
      }
    }

    const savedCraftsman = {
      ...newCraft,
      schedule: schedObj,
      services: realServices,
      portfolio: Array.isArray(newCraft.portfolio) ? newCraft.portfolio : []
    };

    const updated = craftsman.id
      ? current.map((c) => (c.id === craftsman.id ? { ...c, ...savedCraftsman } : c))
      : [savedCraftsman, ...current];

    setStored('craftsmen', updated, true);
    return updated;
  },

  async deleteCraftsman(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('craftsmen').delete().eq('id', id);
        if (error) console.error('Supabase deleteCraftsman error:', error);
      } catch (e) {
        console.warn('Supabase deleteCraftsman background error:', e);
      }
    }
    const current = getStored('craftsmen', initialCraftsmen);
    const craftsmen = current.filter((c) => c.id !== id);
    setStored('craftsmen', craftsmen, true);
    return craftsmen;
  },

  // Custom Orders & Workflow
  async getCustomOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('custom_orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setStored('custom_orders', data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getCustomOrders error:', e);
      }
    }
    return getStored('custom_orders', []);
  },

  async getCustomOrderById(id) {
    const orders = await this.getCustomOrders();
    return orders.find((o) => o.id === id || o.order_number === id) || null;
  },

  async createCustomOrder(orderData) {
    // FAQATGINA ODDIY MIJOZ (CUSTOMER) BUYURTMA BERA OLADI!
    // Super admin, manager va usta chalkashliklarning oldini olish uchun buyurtma bera olmaydi.
    if (orderData.user_role && orderData.user_role !== 'customer') {
      throw new Error(`Xodimlar (${orderData.user_role}) hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.`);
    }
    if (orderData.user_id) {
      if (orderData.user_id === 'super-admin-soxibjon' || String(orderData.user_id).startsWith('mgr-') || String(orderData.user_id).startsWith('craft-')) {
        throw new Error("Chalkashliklarning oldini olish uchun xodimlar hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.");
      }
      const allUsers = getStored('urgut_mebel_registered_users', []);
      const matched = allUsers.find(u => u.id === orderData.user_id);
      if (matched && matched.role && matched.role !== 'customer') {
        throw new Error(`Xodim (${matched.role}) hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.`);
      }
    }

    const orders = await this.getCustomOrders();
    const orderNumber = `ORD-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderData,
      id: `cust-ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.customer_name || orderData.full_name || 'Mijoz',
      customer_phone: orderData.customer_phone || orderData.phone || '',
      customer_email: orderData.customer_email || orderData.email || '',
      category: orderData.furniture_type || orderData.category || 'Maxsus Mebel',
      title: orderData.title || orderData.furniture_type || 'Maxsus Buyurtma',
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
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('custom_orders').insert({
          id: newOrder.id,
          order_number: newOrder.order_number,
          user_id: newOrder.user_id || null,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          customer_email: newOrder.customer_email,
          category: newOrder.category,
          title: newOrder.title,
          room_type: newOrder.room_type || '',
          dimensions: newOrder.dimensions || (newOrder.length ? `${newOrder.length}x${newOrder.width}x${newOrder.height} sm` : ''),
          wood_type: newOrder.material || newOrder.wood_type || '',
          color_finish: newOrder.color || newOrder.color_finish || '',
          notes: newOrder.description || newOrder.special_requirements || newOrder.notes || '',
          estimated_budget: newOrder.estimated_budget ? String(newOrder.estimated_budget) : '',
          status: 'NEW',
          assigned_craftsman: newOrder.assigned_craftsman || newOrder.assigned_craftsman_id || null,
          files: newOrder.files || [],
          history: newOrder.history || []
        });
        if (error) console.error('Supabase createCustomOrder error:', error);
      } catch (e) {
        console.warn('Supabase createCustomOrder error:', e);
      }
    }
    return newOrder;
  },

  async updateCustomOrderStatus(orderId, newStatus, note = '', changedBy = 'Manager') {
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = o.history || [];
        target = {
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
          ],
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          status: target.status,
          history: target.history,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updateCustomOrderStatus error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  async savePriceOffer(orderId, offerData) {
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const history = o.history || [];
        target = {
          ...o,
          status: 'PRICE_SENT',
          price_offer: Number(offerData.total_price) || 0,
          offer_notes: offerData.notes || offerData.offer_notes || '',
          production_deadline: offerData.deadline || offerData.production_deadline || '',
          history: [
            ...history,
            {
              date: new Date().toISOString(),
              status: 'PRICE_SENT',
              note: `Menedjer narx hisoblab mijozga taklif yubordi: ${Number(offerData.total_price).toLocaleString()} so‘m`
            }
          ],
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          status: target.status,
          price_offer: target.price_offer,
          offer_notes: target.offer_notes,
          production_deadline: target.production_deadline,
          history: target.history,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase savePriceOffer error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  async respondPriceOffer(orderId, customerResponse) {
    // customerResponse: 'ACCEPTED' | 'REJECTED'
    const nextStatus = customerResponse === 'ACCEPTED' ? 'CUSTOMER_APPROVED' : 'REVIEWING';
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId && o.price_offer) {
        const history = o.history || [];
        target = {
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
          ],
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          status: target.status,
          history: target.history,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase respondPriceOffer error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  async updateCustomOrderNotes(orderId, internalNotes) {
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        target = { ...o, internal_notes: internalNotes, updated_at: new Date().toISOString() };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          notes: target.internal_notes || target.notes,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updateCustomOrderNotes error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  async assignManagerToOrder(orderId, managerId, managerName) {
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        target = {
          ...o,
          assigned_manager: managerName,
          assigned_manager_id: managerId,
          assigned_manager_name: managerName,
          status: o.status === 'NEW' ? 'REVIEWING' : o.status,
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          assigned_manager: target.assigned_manager,
          status: target.status,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase assignManagerToOrder error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  async assignCraftsmanToOrder(orderId, craftsmanId, craftsmanName) {
    const orders = getStored('custom_orders', initialCustomOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        target = {
          ...o,
          assigned_craftsman: craftsmanName,
          assigned_craftsman_id: craftsmanId,
          assigned_craftsman_name: craftsmanName,
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return o;
    });
    setStored('custom_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        await supabase.from('custom_orders').update({
          assigned_craftsman: target.assigned_craftsman,
          updated_at: target.updated_at
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase assignCraftsmanToOrder error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
  },

  // Standard E-commerce Orders
  async getStandardOrders() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setStored('standard_orders', data, false);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getStandardOrders error:', e);
      }
    }
    return getStored('standard_orders', []);
  },

  async createStandardOrder(orderData) {
    // FAQATGINA ODDIY MIJOZ (CUSTOMER) BUYURTMA BERA OLADI!
    // Super admin, manager va usta chalkashliklarning oldini olish uchun buyurtma bera olmaydi.
    if (orderData.user_role && orderData.user_role !== 'customer') {
      throw new Error(`Xodimlar (${orderData.user_role}) hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.`);
    }
    if (orderData.user_id) {
      if (orderData.user_id === 'super-admin-soxibjon' || String(orderData.user_id).startsWith('mgr-') || String(orderData.user_id).startsWith('craft-')) {
        throw new Error("Chalkashliklarning oldini olish uchun xodimlar hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.");
      }
      const allUsers = getStored('urgut_mebel_registered_users', []);
      const matched = allUsers.find(u => u.id === orderData.user_id);
      if (matched && matched.role && matched.role !== 'customer') {
        throw new Error(`Xodim (${matched.role}) hisobidan buyurtma berish taqiqlangan! Faqatgina oddiy mijoz buyurtma bera oladi.`);
      }
    }

    const orders = await this.getStandardOrders();
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderData,
      id: `ord-std-${Date.now()}`,
      order_number: orderNumber,
      customer_name: orderData.full_name || orderData.customer_name || 'Mijoz',
      customer_phone: orderData.phone || orderData.customer_phone || '',
      shipping_address: orderData.address || orderData.shipping_address || '',
      notes: orderData.notes || '',
      payment_method: orderData.payment_method || 'cash_on_delivery',
      total_amount: Number(orderData.total_amount) || 0,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    setStored('standard_orders', updated, true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.order_number,
          user_id: newOrder.user_id || null,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address,
          notes: newOrder.notes,
          payment_method: newOrder.payment_method,
          total_amount: newOrder.total_amount,
          status: newOrder.status,
          items: newOrder.items || []
        });
        if (error) console.error('Supabase createStandardOrder error:', error);
      } catch (e) {
        console.warn('Supabase createStandardOrder error:', e);
      }
    }
    return newOrder;
  },

  async updateStandardOrderStatus(orderId, status) {
    const orders = getStored('standard_orders', initialOrders);
    let target = null;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        target = { ...o, status };
        return target;
      }
      return o;
    });
    setStored('standard_orders', updated, true);

    if (isSupabaseConfigured && supabase && target) {
      try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (error) console.error('Supabase updateStandardOrderStatus error:', error);
      } catch (e) {
        console.warn('Supabase updateStandardOrderStatus error:', e);
      }
    }
    return target || updated.find((o) => o.id === orderId);
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
    setStored('banners', updated, true);
    return updated;
  },

  async deleteBanner(id) {
    const banners = getStored('banners', initialBanners).filter((b) => b.id !== id);
    setStored('banners', banners, true);
    return banners;
  },

  // Managers (Super Admin tomonidan boshqariladi)
  async getManagers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('managers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setStored('managers', data, false);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getManagers error:', e);
      }
    }
    return getStored('managers', []);
  },

  async saveManager(managerData) {
    const newMgr = {
      id: managerData.id || `mgr-${Date.now()}`,
      full_name: managerData.full_name,
      email: managerData.email,
      password: managerData.password,
      phone: managerData.phone || '',
      department: managerData.department || 'Katalog va Buyurtmalar',
      created_at: managerData.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('managers').upsert({
          id: newMgr.id,
          full_name: newMgr.full_name,
          email: newMgr.email,
          password: newMgr.password,
          phone: newMgr.phone,
          department: newMgr.department
        });
        if (error) console.error('Supabase saveManager error:', error);
      } catch (e) {
        console.warn('Supabase saveManager background error:', e);
      }
    }

    const managers = getStored('managers', []);
    const updated = managerData.id
      ? managers.map((m) => (m.id === managerData.id ? { ...m, ...newMgr } : m))
      : [newMgr, ...managers];

    setStored('managers', updated, true);
    return updated;
  },

  async deleteManager(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('managers').delete().eq('id', id);
        if (error) console.error('Supabase deleteManager error:', error);
      } catch (e) {
        console.warn('Supabase deleteManager background error:', e);
      }
    }
    const managers = getStored('managers', []);
    const updated = managers.filter((m) => m.id !== id);
    setStored('managers', updated, true);
    return updated;
  },

  // ==========================================
  // USERS / FOYDALANUVCHILAR VA MIJOZLAR
  // ==========================================
  async getUsers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setStored('urgut_mebel_registered_users', data, false);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getUsers error:', e);
      }
    }
    return getStored('urgut_mebel_registered_users', []);
  },

  async saveUser(userData) {
    const newUser = {
      id: userData.id || `user-${Date.now()}`,
      email: (userData.email || '').toLowerCase().trim(),
      password: userData.password || '',
      full_name: userData.full_name || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      avatar_url: userData.avatar_url || '',
      address: userData.address || '',
      telegram: userData.telegram || '',
      notes: userData.notes || '',
      favorites: userData.favorites || [],
      cart: userData.cart || [],
      is_active: userData.is_active !== false,
      created_at: userData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('users').upsert(newUser);
        if (error) console.error('Supabase saveUser error:', error);
      } catch (e) {
        console.warn('Supabase saveUser background error:', e);
      }
    }

    const users = getStored('urgut_mebel_registered_users', []);
    const exists = users.some((u) => u.id === newUser.id || u.email === newUser.email);
    const updated = exists
      ? users.map((u) => (u.id === newUser.id || u.email === newUser.email ? { ...u, ...newUser } : u))
      : [newUser, ...users];

    setStored('urgut_mebel_registered_users', updated, true);
    return newUser;
  },

  async deleteUser(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) console.error('Supabase deleteUser error:', error);
      } catch (e) {
        console.warn('Supabase deleteUser background error:', e);
      }
    }
    const users = getStored('urgut_mebel_registered_users', []);
    const updated = users.filter((u) => u.id !== id);
    setStored('urgut_mebel_registered_users', updated, true);
    return updated;
  },

  // Craftsman Schedule & Availability Management
  async updateCraftsmanSchedule(craftsmanId, scheduleData) {
    const craftsmen = await this.getCraftsmen();
    const target = craftsmen.find((c) => c.id === craftsmanId);
    if (!target) return null;

    const updatedCraftsman = {
      ...target,
      schedule: {
        ...(target.schedule || {}),
        ...scheduleData
      }
    };
    await this.saveCraftsman(updatedCraftsman);
    return updatedCraftsman;
  },

  // Craftsman Portfolio Management
  async saveCraftsmanPortfolioItem(craftsmanId, portfolioItem) {
    const craftsmen = await this.getCraftsmen();
    const target = craftsmen.find((c) => c.id === craftsmanId);
    if (!target) return null;

    const currentPortfolio = Array.isArray(target.portfolio) ? target.portfolio : [];
    const itemWithId = {
      ...portfolioItem,
      id: portfolioItem.id || `port-${Date.now()}`,
      created_at: portfolioItem.created_at || new Date().toISOString()
    };

    const exists = currentPortfolio.some((p) => p.id === itemWithId.id);
    const newPortfolio = exists
      ? currentPortfolio.map((p) => (p.id === itemWithId.id ? { ...p, ...itemWithId } : p))
      : [itemWithId, ...currentPortfolio];

    const updatedCraftsman = {
      ...target,
      portfolio: newPortfolio
    };

    await this.saveCraftsman(updatedCraftsman);
    return updatedCraftsman;
  },

  async deleteCraftsmanPortfolioItem(craftsmanId, portfolioItemId) {
    const craftsmen = await this.getCraftsmen();
    const target = craftsmen.find((c) => c.id === craftsmanId);
    if (!target) return null;

    const currentPortfolio = Array.isArray(target.portfolio) ? target.portfolio : [];
    const newPortfolio = currentPortfolio.filter((p) => p.id !== portfolioItemId);

    const updatedCraftsman = {
      ...target,
      portfolio: newPortfolio
    };

    await this.saveCraftsman(updatedCraftsman);
    return updatedCraftsman;
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

      // 6. Users sync (Ro'yxatdan o'tgan foydalanuvchilar va mijozlar)
      const users = await this.getUsers();
      if (users && users.length) {
        for (const u of users) {
          await supabase.from('users').upsert(u);
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Supabase sync error:", err);
      return { success: false, error: err.message };
    }
  }
};
