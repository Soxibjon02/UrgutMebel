/**
 * Status Dictionary & Translation Helper
 * Supports Uzbek & English dual bilingual statuses across Urgut Mebel Markazi
 */

export const STATUS_DEFINITIONS = {
  NEW: {
    code: 'NEW',
    labelUz: 'Yangi',
    labelEn: 'New',
    bilingual: 'Yangi • New',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.35)',
    icon: 'Sparkles'
  },
  PENDING: {
    code: 'PENDING',
    labelUz: 'Kutilmoqda',
    labelEn: 'Pending',
    bilingual: 'Kutilmoqda • Pending',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.35)',
    icon: 'Clock'
  },
  REVIEWING: {
    code: 'REVIEWING',
    labelUz: 'Ko‘rib chiqilmoqda',
    labelEn: 'In Review',
    bilingual: 'Ko‘rib chiqilmoqda • In Review',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.15)',
    border: 'rgba(2, 132, 199, 0.35)',
    icon: 'Search'
  },
  IN_REVIEW: {
    code: 'IN_REVIEW',
    labelUz: 'Ko‘rib chiqilmoqda',
    labelEn: 'In Review',
    bilingual: 'Ko‘rib chiqilmoqda • In Review',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.15)',
    border: 'rgba(2, 132, 199, 0.35)',
    icon: 'Search'
  },
  CALCULATING: {
    code: 'CALCULATING',
    labelUz: 'Narx hisoblanmoqda',
    labelEn: 'Calculating Price',
    bilingual: 'Narx hisoblanmoqda • Calculating',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.15)',
    border: 'rgba(217, 119, 6, 0.35)',
    icon: 'Calculator'
  },
  PRICE_SENT: {
    code: 'PRICE_SENT',
    labelUz: 'Narx taklifi tayyor',
    labelEn: 'Price Proposal Ready',
    bilingual: 'Narx tayyor • Price Ready',
    color: '#fa6d58',
    bg: 'rgba(250, 109, 88, 0.18)',
    border: 'rgba(250, 109, 88, 0.45)',
    icon: 'Tag'
  },
  CUSTOMER_APPROVED: {
    code: 'CUSTOMER_APPROVED',
    labelUz: 'Mijoz tasdiqladi',
    labelEn: 'Customer Approved',
    bilingual: 'Tasdiqlandi • Approved',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: 'CheckCircle'
  },
  CONFIRMED: {
    code: 'CONFIRMED',
    labelUz: 'Qabul qilindi',
    labelEn: 'Confirmed',
    bilingual: 'Qabul qilindi • Confirmed',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: 'Check'
  },
  ACCEPTED: {
    code: 'ACCEPTED',
    labelUz: 'Qabul qilindi',
    labelEn: 'Accepted',
    bilingual: 'Qabul qilindi • Accepted',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: 'Check'
  },
  IN_PRODUCTION: {
    code: 'IN_PRODUCTION',
    labelUz: 'Ish jarayonida',
    labelEn: 'In Production',
    bilingual: 'Ish jarayonida • In Production',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.35)',
    icon: 'Hammer'
  },
  PROCESSING: {
    code: 'PROCESSING',
    labelUz: 'Ishlanmoqda',
    labelEn: 'Processing',
    bilingual: 'Ishlanmoqda • Processing',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.35)',
    icon: 'Hammer'
  },
  READY: {
    code: 'READY',
    labelUz: 'Tayyor bo‘ldi',
    labelEn: 'Ready',
    bilingual: 'Tayyor • Ready',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.15)',
    border: 'rgba(5, 150, 105, 0.35)',
    icon: 'PackageCheck'
  },
  DELIVERING: {
    code: 'DELIVERING',
    labelUz: 'Yetkazilmoqda (Yo‘lda)',
    labelEn: 'Delivering / In Transit',
    bilingual: 'Yetkazilmoqda • Delivering',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.35)',
    icon: 'Truck'
  },
  SHIPPED: {
    code: 'SHIPPED',
    labelUz: 'Yuborildi (Yo‘lda)',
    labelEn: 'Shipped',
    bilingual: 'Yuborildi • Shipped',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.35)',
    icon: 'Truck'
  },
  COMPLETED: {
    code: 'COMPLETED',
    labelUz: 'Topshirildi (Yakunlandi)',
    labelEn: 'Delivered (Completed)',
    bilingual: 'Bajarildi • Completed',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.2)',
    border: 'rgba(16, 185, 129, 0.45)',
    icon: 'CheckCircle2'
  },
  DELIVERED: {
    code: 'DELIVERED',
    labelUz: 'Yetkazib topshirildi',
    labelEn: 'Delivered',
    bilingual: 'Yetkazildi • Delivered',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.2)',
    border: 'rgba(16, 185, 129, 0.45)',
    icon: 'CheckCircle2'
  },
  APPROVED: {
    code: 'APPROVED',
    labelUz: 'Ma’qullandi',
    labelEn: 'Approved',
    bilingual: 'Ma’qullandi • Approved',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: 'Check'
  },
  REJECTED: {
    code: 'REJECTED',
    labelUz: 'Rad etildi',
    labelEn: 'Rejected',
    bilingual: 'Rad etildi • Rejected',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)',
    icon: 'XCircle'
  },
  CANCELLED: {
    code: 'CANCELLED',
    labelUz: 'Bekor qilindi',
    labelEn: 'Cancelled',
    bilingual: 'Bekor qilindi • Cancelled',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)',
    icon: 'XCircle'
  }
};

/**
 * Returns metadata and labels for any status
 * @param {string} status 
 * @param {'bilingual'|'uz'|'en'} format 
 */
export function getStatusMeta(status = 'NEW', format = 'bilingual') {
  const normalized = (status || 'NEW').toUpperCase().trim();
  const def = STATUS_DEFINITIONS[normalized] || {
    code: normalized,
    labelUz: normalized,
    labelEn: normalized,
    bilingual: `${normalized}`,
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.15)',
    border: 'rgba(107, 114, 128, 0.3)',
    icon: 'Circle'
  };

  let displayLabel = def.bilingual;
  if (format === 'uz') displayLabel = def.labelUz;
  if (format === 'en') displayLabel = def.labelEn;

  return {
    ...def,
    displayLabel
  };
}

/**
 * Standard selectable status options for Custom Orders dropdowns
 */
export const CUSTOM_ORDER_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Yangi (New)' },
  { value: 'REVIEWING', label: 'Ko‘rib chiqilmoqda (In Review)' },
  { value: 'CALCULATING', label: 'Narx hisoblanmoqda (Calculating Price)' },
  { value: 'PRICE_SENT', label: 'Narx taklifi tayyor (Price Sent)' },
  { value: 'CUSTOMER_APPROVED', label: 'Tasdiqlangan (Customer Approved)' },
  { value: 'IN_PRODUCTION', label: 'Ishlab chiqarishda (In Production)' },
  { value: 'READY', label: 'Tayyor bo‘ldi (Ready)' },
  { value: 'DELIVERING', label: 'Yetkazilmoqda (Shipping)' },
  { value: 'COMPLETED', label: 'Topshirildi (Completed)' },
  { value: 'CANCELLED', label: 'Bekor qilindi (Cancelled)' }
];

/**
 * Standard selectable status options for E-Commerce Standard Orders dropdowns
 */
export const STANDARD_ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Kutilmoqda (Pending)' },
  { value: 'CONFIRMED', label: 'Qabul qilindi (Confirmed)' },
  { value: 'IN_PRODUCTION', label: 'Tayyorlanmoqda (In Production)' },
  { value: 'READY', label: 'Tayyor (Ready)' },
  { value: 'SHIPPED', label: 'Yetkazilmoqda (Shipped)' },
  { value: 'DELIVERED', label: 'Topshirildi (Delivered)' },
  { value: 'CANCELLED', label: 'Bekor qilindi (Cancelled)' }
];
