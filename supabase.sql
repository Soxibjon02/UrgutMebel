-- ====================================================================
-- URGUT MEBEL MARKAZI - SUPABASE DATABASE SCHEMA & MIGRATION
-- Production-Ready PostgreSQL Schema with RLS, Storage & RBAC
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE custom_order_status AS ENUM (
    'NEW',
    'REVIEWING',
    'CALCULATING',
    'PRICE_SENT',
    'CUSTOMER_APPROVED',
    'IN_PRODUCTION',
    'READY',
    'DELIVERING',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE file_category AS ENUM ('reference', 'technical', 'room');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. GLOBAL PLATFORM SETTINGS (Web Loyiha nomi va tizim sozlamalari)
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL DEFAULT 'Urgut Mebel Markazi',
  site_tagline TEXT DEFAULT 'Sifatli va qulay mebellar uyingiz uchun',
  phone TEXT DEFAULT '+998 90 123 45 67',
  email TEXT DEFAULT 'info@urgutmebel.uz',
  address TEXT DEFAULT 'Samarqand viloyati, Urgut tumani, Mebelchilar ko‘chasi, 12-uy',
  telegram TEXT DEFAULT '@urgutmebel_admin',
  instagram TEXT DEFAULT '@urgutmebel_official',
  currency TEXT DEFAULT 'so‘m',
  delivery_info TEXT DEFAULT 'O‘zbekiston bo‘ylab tez va bepul yetkazib berish xizmati mavjud',
  hero_badge TEXT DEFAULT 'Yangi To‘plam 2026',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- 4. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL CHECK (price >= 0),
  discount_price NUMERIC CHECK (discount_price >= 0),
  stock INT NOT NULL DEFAULT 10 CHECK (stock >= 0),
  material TEXT,
  dimensions TEXT,
  colors TEXT[] DEFAULT '{}',
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT TRUE,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCT LIKES & FAVORITES
CREATE TABLE IF NOT EXISTS public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_product_user_like UNIQUE (product_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_product_user_favorite UNIQUE (product_id, user_id)
);

-- 9. COMMENTS & REPLIES
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comment_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REVIEWS (Verified Product Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  order_id UUID,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDERS & ORDER ITEMS (Historical Snapshot Protected)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_method TEXT NOT NULL DEFAULT 'standart',
  payment_method TEXT NOT NULL DEFAULT 'cash',
  notes TEXT,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CUSTOM FURNITURE ORDERS & WORKFLOW
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  furniture_type TEXT NOT NULL,
  room_type TEXT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  length NUMERIC CHECK (length > 0),
  width NUMERIC CHECK (width > 0),
  height NUMERIC CHECK (height > 0),
  material TEXT,
  color TEXT,
  finish TEXT,
  description TEXT,
  special_requirements TEXT,
  estimated_budget NUMERIC,
  assigned_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status custom_order_status NOT NULL DEFAULT 'NEW',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_order_id UUID NOT NULL REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_category file_category NOT NULL DEFAULT 'reference',
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PRICE OFFERS FOR CUSTOM ORDERS
CREATE TABLE IF NOT EXISTS public.price_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_order_id UUID NOT NULL REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  material_cost NUMERIC NOT NULL DEFAULT 0,
  labor_cost NUMERIC NOT NULL DEFAULT 0,
  additional_cost NUMERIC NOT NULL DEFAULT 0,
  delivery_cost NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  customer_status offer_status NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ORDER STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_order_id UUID REFERENCES public.custom_orders(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CRAFTSMEN DIRECTORY
CREATE TABLE IF NOT EXISTS public.craftsmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo_url TEXT,
  experience_years INT NOT NULL DEFAULT 5,
  location TEXT DEFAULT 'Urgut, Samarqand',
  specializations TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.9,
  reviews_count INT NOT NULL DEFAULT 0,
  phone TEXT,
  telegram TEXT,
  bio TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.craftsman_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  price_estimate TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.craftsman_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.craftsman_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.craftsman_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_date DATE,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. MARKETING BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  link TEXT DEFAULT '/furniture',
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'Batafsil ko‘rish',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. SYSTEM & USER NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'order',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsman_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsman_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsman_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsman_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'manager' OR role = 'admin') AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Settings Policies (Public can read, only admin can update)
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);
CREATE POLICY "Admin can update settings" ON public.settings
  FOR UPDATE USING (public.is_admin());

-- Profiles Policies
CREATE POLICY "Public profiles are visible to authenticated" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Products & Categories Policies
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin full categories" ON public.categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (is_published = TRUE OR public.is_admin() OR public.is_manager());
CREATE POLICY "Admin full products" ON public.products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);
CREATE POLICY "Admin full product images" ON public.product_images
  FOR ALL USING (public.is_admin());

-- Likes & Favorites Policies
CREATE POLICY "Users can see own likes" ON public.product_likes
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create own likes" ON public.product_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.product_likes
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Comments & Reviews Policies
CREATE POLICY "Anyone can view approved comments" ON public.comments
  FOR SELECT USING (is_approved = TRUE AND is_hidden = FALSE OR public.is_admin());
CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit own comment" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can delete own comment" ON public.comments
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can view verified reviews" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Users can create review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can moderate reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR public.is_manager());
CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admin and managers can update orders" ON public.orders
  FOR UPDATE USING (public.is_manager());

CREATE POLICY "Order items viewable with order" ON public.order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR public.is_manager())
  ));
CREATE POLICY "Order items can be inserted" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Custom Orders Policies
CREATE POLICY "Customers view own custom orders" ON public.custom_orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR assigned_manager_id = auth.uid() 
    OR public.is_admin()
  );
CREATE POLICY "Customers can create custom orders" ON public.custom_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Managers and Admin can update custom orders" ON public.custom_orders
  FOR UPDATE USING (assigned_manager_id = auth.uid() OR public.is_admin());

CREATE POLICY "Custom order files viewable" ON public.custom_order_files
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.custom_orders co
    WHERE co.id = custom_order_files.custom_order_id AND (co.user_id = auth.uid() OR co.assigned_manager_id = auth.uid() OR public.is_admin())
  ));
CREATE POLICY "Custom order files insertable" ON public.custom_order_files
  FOR INSERT WITH CHECK (true);

-- Price Offers Policies
CREATE POLICY "View price offers" ON public.price_offers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.custom_orders co
    WHERE co.id = price_offers.custom_order_id AND (co.user_id = auth.uid() OR co.assigned_manager_id = auth.uid() OR public.is_admin())
  ));
CREATE POLICY "Manager can create price offers" ON public.price_offers
  FOR INSERT WITH CHECK (public.is_manager());
CREATE POLICY "Customer can update status of price offer" ON public.price_offers
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.custom_orders co
    WHERE co.id = price_offers.custom_order_id AND (co.user_id = auth.uid() OR public.is_manager())
  ));

-- Craftsmen Policies
CREATE POLICY "Anyone can view active craftsmen" ON public.craftsmen
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin full craftsmen" ON public.craftsmen
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public craftsmen services" ON public.craftsman_services
  FOR SELECT USING (true);
CREATE POLICY "Admin manage craftsman services" ON public.craftsman_services
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public craftsmen portfolio" ON public.craftsman_portfolio
  FOR SELECT USING (true);
CREATE POLICY "Admin manage craftsman portfolio" ON public.craftsman_portfolio
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public craftsmen requests" ON public.craftsman_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage craftsman requests" ON public.craftsman_requests
  FOR ALL USING (public.is_admin());

-- Banners & Notifications
CREATE POLICY "Public banners" ON public.banners
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage banners" ON public.banners
  FOR ALL USING (public.is_admin());

CREATE POLICY "User notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User update notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

INSERT INTO public.settings (id, site_name, site_tagline, phone, email, address, telegram, instagram, currency)
VALUES (
  1,
  'Urgut Mebel Markazi',
  'Zamonaviy, mustahkam va buyurtma asosidagi mebellar markazi',
  '+998 90 123 45 67',
  'info@urgutmebel.uz',
  'Samarqand viloyati, Urgut shahri, Navoiy shoh ko‘chasi, 45-bino',
  '@urgutmebel_admin',
  '@urgutmebel_uz',
  'so‘m'
) ON CONFLICT (id) DO NOTHING;

-- End of schema
