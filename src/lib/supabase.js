import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hlnzxwcupwaaxrutvnvb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsbnp4d2N1cHdhYXhydXR2bnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjI5NDMsImV4cCI6MjEwNzAzODk0M30.wb7W9sZ4_oJyip6tdonojlSjgJ-MXmtf05RiMgntjTI';

// Check if valid credentials are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ Supabase credentials not found or placeholder in .env. Running in resilient local storage / offline mock mode. All changes persist locally and can be synchronized with Supabase anytime.'
  );
}

/**
 * Uploads an image file to Supabase Storage.
 * Attempts upload across common buckets ('products', 'furniture', 'images', 'public', 'uploads', 'media').
 * Falls back to local Base64 Data URL if Supabase is not configured or bucket is not ready.
 */
export async function uploadImageToSupabase(file, folder = 'furniture') {
  if (!file) return { error: 'Fayl tanlanmadi' };

  if (isSupabaseConfigured && supabase) {
    try {
      const sanitizedName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'image.jpg';
      const fileName = `${Date.now()}_${sanitizedName}`;
      const filePath = `${folder}/${fileName}`;

      const bucketsToTry = ['products', 'furniture', 'images', 'public', 'uploads', 'media'];

      for (const bucket of bucketsToTry) {
        try {
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (!error && data) {
            const { data: publicData } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);

            if (publicData?.publicUrl) {
              return { url: publicData.publicUrl, isSupabase: true, bucket };
            }
          }
        } catch (innerErr) {
          // Attempt next bucket
        }
      }
    } catch (e) {
      console.warn('Supabase storage upload exception, falling back to Data URL:', e);
    }
  }

  // Resilient fallback: Base64 data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result, isSupabase: false });
    reader.onerror = () => resolve({ error: 'Faylni o‘qishda xatolik yuz berdi' });
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a product image file (wrapper around uploadImageToSupabase)
 */
export async function uploadProductImage(file) {
  return uploadImageToSupabase(file, 'products');
}
