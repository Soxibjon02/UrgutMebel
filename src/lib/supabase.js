import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
 * Uploads a product image file to Supabase Storage (bucket: 'products')
 * Falls back to local Base64 Data URL if Supabase is not configured or fails.
 */
export async function uploadProductImage(file) {
  if (!file) return { error: 'Fayl tanlanmadi' };

  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}_${sanitizedName}`;
      const filePath = `furniture/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return { url: publicData.publicUrl, isSupabase: true };
        }
      }

      // Try fallback bucket 'furniture' if 'products' bucket is missing
      if (error && (error.message?.includes('not found') || error.statusCode === 404)) {
        const altTry = await supabase.storage.from('furniture').upload(filePath, file, { upsert: true });
        if (!altTry.error && altTry.data) {
          const { data: altUrl } = supabase.storage.from('furniture').getPublicUrl(filePath);
          if (altUrl?.publicUrl) return { url: altUrl.publicUrl, isSupabase: true };
        }
      }

      console.warn('Supabase storage upload returned error, using Data URL fallback:', error);
    } catch (e) {
      console.warn('Supabase storage upload exception, using Data URL fallback:', e);
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
