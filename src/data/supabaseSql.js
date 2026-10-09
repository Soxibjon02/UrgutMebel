export const SUPABASE_SQL_SCRIPT = `-- ====================================================================
-- URGUT MEBEL MARKAZI - SUPABASE DATABASE SCHEMA & MIGRATION
-- Production-Ready PostgreSQL Schema with RLS, Public Access & Storage
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. GLOBAL PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  site_name TEXT NOT NULL DEFAULT 'Urgut Mebel Markazi',
  site_tagline TEXT DEFAULT 'Sifatli va qulay mebellar uyingiz uchun',
  phone TEXT DEFAULT '+998 90 456 78 90',
  email TEXT DEFAULT 'info@urgutmebel.uz',
  address TEXT DEFAULT 'Samarqand viloyati, Urgut tumani, Hunarmandlar shaharchasi, 24-bino',
  telegram TEXT DEFAULT '@urgutmebel_uz',
  instagram TEXT DEFAULT '@urgutmebel_official',
  currency TEXT DEFAULT 'so‘m',
  hero_badge TEXT DEFAULT 'Yangi 2026 To‘plami',
  hero_banner_image TEXT DEFAULT 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
  announcement TEXT DEFAULT 'Bahorgi aksiya: barcha yotoqxona to‘plamlariga 15% gacha chegirma!',
  working_hours TEXT DEFAULT 'Har kuni 08:30 dan 20:00 gacha (Dam olish kunlarisiz)',
  footer_about TEXT DEFAULT 'Urgutning asriy duradgorlik san''ati va zamonaviy uslub uyg''unligi.',
  copyright_text TEXT DEFAULT '© 2026 Urgut Mebel Markazi. Barcha huquqlar himoyalangan.',
  feature1_title TEXT DEFAULT 'Tezkor Yetkazib Berish',
  feature1_desc TEXT DEFAULT 'Butun O‘zbekiston bo‘ylab professional yetkazish va o‘rnatish',
  feature2_title TEXT DEFAULT 'Rasmiy Kafolat',
  feature2_desc TEXT DEFAULT 'Har bir mebel uchun 3 yildan 5 yilgacha sifat kafolati',
  feature3_title TEXT DEFAULT 'Urgut Duradgorlari',
  feature3_desc TEXT DEFAULT 'Asriy hunarmandchilik va zamonaviy texnologiya uyg‘unligi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS (MEBELLAR)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  stock INT NOT NULL DEFAULT 10,
  material TEXT,
  dimensions TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT TRUE,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  tags JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DURADGOR USTALAR (CRAFTSMEN)
CREATE TABLE IF NOT EXISTS public.craftsmen (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  password TEXT DEFAULT 'usta12345',
  photo_url TEXT,
  experience_years INT NOT NULL DEFAULT 5,
  location TEXT DEFAULT 'Urgut tumani',
  specializations JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  phone TEXT,
  telegram TEXT,
  bio TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  portfolio JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MENEDJERLAR (MANAGERS)
CREATE TABLE IF NOT EXISTS public.managers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  department TEXT DEFAULT 'Katalog va Buyurtmalar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. MAXSUS BUYURTMALAR (CUSTOM ORDERS)
CREATE TABLE IF NOT EXISTS public.custom_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  category TEXT,
  title TEXT,
  room_type TEXT,
  dimensions TEXT,
  wood_type TEXT,
  fabric_type TEXT,
  color_finish TEXT,
  urgency TEXT,
  address TEXT,
  notes TEXT,
  estimated_budget TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  assigned_manager TEXT,
  assigned_craftsman TEXT,
  price_offer NUMERIC,
  offer_notes TEXT,
  production_deadline TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DO'KON BUYURTMALARI (STANDARD ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  payment_method TEXT DEFAULT 'cash_on_delivery',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SHARHLAR (COMMENTS / REVIEWS)
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  author_name TEXT NOT NULL,
  avatar TEXT,
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  date TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BOSH SAHIFA BANNERLARI
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  link TEXT,
  image_url TEXT,
  button_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - PERMISSIVE FOR APPLICATION
-- ====================================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public settings access" ON public.settings;
  DROP POLICY IF EXISTS "Public categories access" ON public.categories;
  DROP POLICY IF EXISTS "Public products access" ON public.products;
  DROP POLICY IF EXISTS "Public craftsmen access" ON public.craftsmen;
  DROP POLICY IF EXISTS "Public managers access" ON public.managers;
  DROP POLICY IF EXISTS "Public custom_orders access" ON public.custom_orders;
  DROP POLICY IF EXISTS "Public orders access" ON public.orders;
  DROP POLICY IF EXISTS "Public comments access" ON public.comments;
  DROP POLICY IF EXISTS "Public banners access" ON public.banners;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Create open application policies
CREATE POLICY "Public settings access" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public categories access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public products access" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public craftsmen access" ON public.craftsmen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public managers access" ON public.managers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public custom_orders access" ON public.custom_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public orders access" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public comments access" ON public.comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public banners access" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- Grant privileges to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ====================================================================
-- STORAGE BUCKETS SETUP (FURNITURE & PRODUCTS)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true), ('furniture', 'furniture', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public storage select" ON storage.objects;
  DROP POLICY IF EXISTS "Public storage insert" ON storage.objects;
  DROP POLICY IF EXISTS "Public storage update" ON storage.objects;
  DROP POLICY IF EXISTS "Public storage delete" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE POLICY "Public storage select" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public storage insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public storage update" ON storage.objects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public storage delete" ON storage.objects FOR DELETE USING (true);
`;
