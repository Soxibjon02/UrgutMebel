import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, Trash2, Check, Copy, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImageToSupabase } from '../lib/supabase';
import { useNotification } from '../context/NotificationContext';

/**
 * Universal Image Upload Component:
 * Allows user to either paste/type an image URL OR upload an image file from device to Supabase Storage.
 * When uploaded to Supabase, the Supabase public URL is automatically placed into the URL field.
 */
export default function ImageUploadField({
  label = 'Rasm (URL yoki Fayldan)',
  value = '',
  onChange,
  name = 'image_url',
  folder = 'furniture',
  placeholder = 'https://images.unsplash.com/... yoki fayl tanlang',
  helperText = 'Havola (URL) kiriting yoki kompyuterdan fayl yuklang (Supabase-ga saqlanadi).',
  required = false
}) {
  const [url, setUrl] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useNotification();

  useEffect(() => {
    setUrl(value || '');
  }, [value]);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (onChange) onChange(newUrl);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Iltimos, faqat rasm fayllarini tanlang (JPG, PNG, WEBP)', 'error');
      return;
    }

    setIsUploading(true);
    addToast('Rasm Supabase-ga yuklanmoqda...', 'info');

    try {
      const res = await uploadImageToSupabase(file, folder);

      if (res.url) {
        setUrl(res.url);
        if (onChange) onChange(res.url);

        if (res.isSupabase) {
          addToast('Rasm Supabase Storage ga muvaffaqiyatli yuklandi va URL saqlandi!', 'success');
        } else {
          addToast('Rasm muvaffaqiyatli yuklandi!', 'success');
        }
      } else {
        addToast(res.error || 'Rasmni yuklashda xatolik yuz berdi', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      addToast('Rasmni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setUrl('');
    if (onChange) onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Rasm havolasi nusxalandi!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const isSupabaseUrl = url && (url.includes('supabase.co') || url.includes('/storage/v1/object/public/'));

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={15} color="var(--wood-amber)" />
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
          </span>
          {isSupabaseUrl && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={12} /> Supabase Storage URL
            </span>
          )}
        </label>
      )}

      {/* Input row: URL text box + Upload button */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="url"
            name={name}
            value={url}
            onChange={handleUrlChange}
            placeholder={placeholder}
            required={required}
            className="form-input"
            style={{ paddingRight: '2rem' }}
          />
          {url && (
            <button
              type="button"
              onClick={handleClear}
              title="Havolani tozalash"
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* File upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="btn btn-secondary"
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.6rem 0.95rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <Upload size={16} color="var(--wood-amber)" />
              <span>Fayldan yuklash</span>
            </>
          )}
        </button>
      </div>

      {helperText && (
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
          {helperText}
        </p>
      )}

      {/* Live Preview Box */}
      {url && (
        <div
          style={{
            marginTop: '0.65rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <img
              src={url}
              alt="Oldindan ko‘rish"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: isSupabaseUrl ? 'rgba(16, 185, 129, 0.15)' : 'rgba(212, 163, 89, 0.15)',
                  color: isSupabaseUrl ? '#10b981' : 'var(--gold-accent)',
                  border: `1px solid ${isSupabaseUrl ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 163, 89, 0.3)'}`
                }}
              >
                {isSupabaseUrl ? '☁️ Supabase Cloud' : url.startsWith('data:') ? '💾 Data URL' : '🔗 Web Havola'}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                fontFamily: 'monospace'
              }}
              title={url}
            >
              {url}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
              title="URL nusxalash"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: '#ef4444' }}
              title="O‘chirish"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
